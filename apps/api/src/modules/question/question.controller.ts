import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  CreateCommentSchema,
  DraftAnswerSchema,
  EditAnswerSchema,
  UpdateQuestionSchema,
  type CreateCommentInput,
  type DraftAnswerInput,
  type EditAnswerInput,
  type UpdateQuestionInput,
} from '@rfpilot/types';

import { Ctx } from '../../common/context/ctx.decorator';
import type { RequestContext } from '../../common/context/request-context';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questions: QuestionService) {}

  @Get()
  list(@Query('rfpId') rfpId: string, @Ctx() ctx: RequestContext) {
    return this.questions.listByRfp(ctx.orgId, rfpId);
  }

  @Get(':id')
  get(@Param('id') id: string, @Ctx() ctx: RequestContext) {
    return this.questions.findById(ctx.orgId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateQuestionSchema)) body: UpdateQuestionInput,
    @Ctx() ctx: RequestContext,
  ) {
    return this.questions.update(ctx.orgId, id, body);
  }

  /** Enqueue an AI draft for this question. */
  @Post(':id/draft')
  draft(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(DraftAnswerSchema)) body: DraftAnswerInput,
    @Ctx() ctx: RequestContext,
  ) {
    return this.questions.enqueueDraft(ctx.orgId, id, body);
  }

  @Patch(':id/answer')
  editAnswer(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(EditAnswerSchema)) body: EditAnswerInput,
    @Ctx() ctx: RequestContext,
  ) {
    return this.questions.editAnswer(ctx.orgId, id, body);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Ctx() ctx: RequestContext) {
    return this.questions.approve(ctx.orgId, id);
  }

  @Post(':id/comments')
  comment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateCommentSchema)) body: CreateCommentInput,
    @Ctx() ctx: RequestContext,
  ) {
    return this.questions.addComment(ctx.orgId, ctx.userId, id, body);
  }
}
