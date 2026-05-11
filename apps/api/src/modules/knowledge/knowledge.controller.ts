import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  CreateLibraryAnswerSchema,
  SearchLibrarySchema,
  UpdateLibraryAnswerSchema,
  type CreateLibraryAnswerInput,
  type UpdateLibraryAnswerInput,
} from '@rfpilot/types';

import { Ctx } from '../../common/context/ctx.decorator';
import type { RequestContext } from '../../common/context/request-context';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { KnowledgeService } from './knowledge.service';

@Controller('library')
export class KnowledgeController {
  constructor(private readonly kb: KnowledgeService) {}

  @Get()
  list(@Ctx() ctx: RequestContext) {
    return this.kb.list(ctx.orgId);
  }

  @Get('search')
  search(@Query('q') q: string, @Ctx() ctx: RequestContext) {
    const parsed = SearchLibrarySchema.parse({ q, limit: 10 });
    return this.kb.search(ctx.orgId, parsed.q, parsed.limit);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateLibraryAnswerSchema)) body: CreateLibraryAnswerInput,
    @Ctx() ctx: RequestContext,
  ) {
    return this.kb.create(ctx.orgId, ctx.userId, body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateLibraryAnswerSchema)) body: UpdateLibraryAnswerInput,
    @Ctx() ctx: RequestContext,
  ) {
    return this.kb.update(ctx.orgId, ctx.userId, id, body);
  }

  @Get(':id/versions')
  versions(@Param('id') id: string, @Ctx() ctx: RequestContext) {
    return this.kb.versions(ctx.orgId, id);
  }
}
