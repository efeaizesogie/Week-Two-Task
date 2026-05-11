import { Body, Controller, Post } from '@nestjs/common';
import { CheckoutSchema, type CheckoutInput } from '@rfpilot/types';

import { Ctx } from '../../common/context/ctx.decorator';
import type { RequestContext } from '../../common/context/request-context';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Post('checkout')
  @Roles('OWNER', 'ADMIN')
  checkout(
    @Body(new ZodValidationPipe(CheckoutSchema)) body: CheckoutInput,
    @Ctx() ctx: RequestContext,
  ) {
    return this.billing.createCheckoutSession(ctx.orgId, ctx.email, body);
  }

  @Post('portal')
  @Roles('OWNER', 'ADMIN')
  portal(@Ctx() ctx: RequestContext) {
    return this.billing.createPortalSession(ctx.orgId);
  }
}
