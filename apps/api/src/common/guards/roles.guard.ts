import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '@rfpilot/db';

import type { RequestContext } from '../context/request-context';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<{ ctx?: RequestContext }>();
    if (!req.ctx) throw new ForbiddenException('No context');
    if (!required.includes(req.ctx.role)) {
      throw new ForbiddenException(
        `Requires one of: ${required.join(', ')}; you are ${req.ctx.role}`,
      );
    }
    return true;
  }
}
