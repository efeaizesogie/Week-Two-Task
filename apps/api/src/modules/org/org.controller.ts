import { Controller, Get, Param } from '@nestjs/common';

import { Ctx } from '../../common/context/ctx.decorator';
import type { RequestContext } from '../../common/context/request-context';
import { OrgService } from './org.service';

@Controller('orgs')
export class OrgController {
  constructor(private readonly orgs: OrgService) {}

  @Get('current')
  current(@Ctx() ctx: RequestContext) {
    return this.orgs.findById(ctx.orgId);
  }

  @Get(':id/members')
  listMembers(@Param('id') id: string, @Ctx() ctx: RequestContext) {
    return this.orgs.listMembers(ctx.orgId, id);
  }
}
