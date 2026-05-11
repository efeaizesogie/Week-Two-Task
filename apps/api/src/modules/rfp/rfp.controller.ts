import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  CreateRfpSchema,
  UpdateRfpSchema,
  type CreateRfpInput,
  type UpdateRfpInput,
} from '@rfpilot/types';

import { Ctx } from '../../common/context/ctx.decorator';
import type { RequestContext } from '../../common/context/request-context';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { RfpService } from './rfp.service';

@Controller('rfps')
export class RfpController {
  constructor(private readonly rfps: RfpService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateRfpSchema)) body: CreateRfpInput,
    @Ctx() ctx: RequestContext,
  ) {
    return this.rfps.create(ctx.orgId, body);
  }

  @Get()
  list(@Ctx() ctx: RequestContext) {
    return this.rfps.list(ctx.orgId);
  }

  @Get(':id')
  get(@Param('id') id: string, @Ctx() ctx: RequestContext) {
    return this.rfps.findById(ctx.orgId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateRfpSchema)) body: UpdateRfpInput,
    @Ctx() ctx: RequestContext,
  ) {
    return this.rfps.update(ctx.orgId, id, body);
  }

  /** Kicks off AI question extraction as a background job. */
  @Post(':id/extract-questions')
  extract(@Param('id') id: string, @Ctx() ctx: RequestContext) {
    return this.rfps.extractQuestions(ctx.orgId, id);
  }
}
