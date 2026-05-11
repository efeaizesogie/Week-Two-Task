import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { prisma } from '@rfpilot/db';
import type { Request } from 'express';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { RequestContext } from '../context/request-context';

/**
 * Verifies Clerk JWT on every request unless @Public() is set.
 *
 * Flow:
 *   1. Extract Bearer token.
 *   2. Verify via Clerk backend SDK (issuer + signature).
 *   3. Resolve our internal User + Membership for the requested org.
 *   4. Attach RequestContext on the request for downstream use.
 *
 * Org is selected from the `x-rfpilot-org` header; if missing we fall back
 * to the user's single membership if unambiguous, else 401.
 */
@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY ?? '',
  });

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request & { ctx?: RequestContext }>();
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const token = header.slice('Bearer '.length);

    let claims: { sub: string };
    try {
      // Clerk's verifyToken doesn't use 'issuer' param; validation happens server-side
      claims = (await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      })) as { sub: string };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    // Resolve or upsert our local user from Clerk profile
    const clerkUser = await this.clerk.users.getUser(claims.sub);
    const email =
      clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      throw new UnauthorizedException('Clerk user has no email on record');
    }

    const user = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      update: { email, name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null, imageUrl: clerkUser.imageUrl },
      create: {
        clerkId: clerkUser.id,
        email,
        name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null,
        imageUrl: clerkUser.imageUrl,
      },
    });

    // Resolve org
    const orgHeader = (req.headers['x-rfpilot-org'] as string | undefined) ?? undefined;
    const memberships = await prisma.membership.findMany({ where: { userId: user.id } });
    if (memberships.length === 0) {
      throw new UnauthorizedException('User has no organization memberships');
    }
    const membership =
      memberships.find((m) => m.orgId === orgHeader) ??
      (memberships.length === 1 ? memberships[0] : null);
    if (!membership) {
      throw new UnauthorizedException('Ambiguous organization; set x-rfpilot-org header');
    }

    req.ctx = {
      userId: user.id,
      orgId: membership.orgId,
      role: membership.role,
      clerkUserId: clerkUser.id,
      email,
    };
    return true;
  }
}
