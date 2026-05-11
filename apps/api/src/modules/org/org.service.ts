import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrgService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId, deletedAt: null },
      include: { subscription: true },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async listMembers(ctxOrgId: string, requestedOrgId: string) {
    if (ctxOrgId !== requestedOrgId) throw new ForbiddenException('Cross-org access denied');
    return this.prisma.membership.findMany({
      where: { orgId: ctxOrgId },
      include: {
        user: {
          select: { id: true, email: true, name: true, imageUrl: true },
        },
      },
    });
  }
}
