import { Controller, Get } from '@nestjs/common';

import { Ctx } from '../../common/context/ctx.decorator';
import type { RequestContext } from '../../common/context/request-context';

@Controller('me')
export class AuthController {
  /** Return the current user + org context. */
  @Get()
  me(@Ctx() ctx: RequestContext) {
    return {
      userId: ctx.userId,
      orgId: ctx.orgId,
      role: ctx.role,
      email: ctx.email,
    };
  }
}
