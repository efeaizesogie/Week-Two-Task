import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PresignUploadSchema, type PresignUploadInput } from '@rfpilot/types';

import { Ctx } from '../../common/context/ctx.decorator';
import type { RequestContext } from '../../common/context/request-context';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { DocumentService } from './document.service';

@Controller('documents')
export class DocumentController {
  constructor(private readonly docs: DocumentService) {}

  /** Step 1 of upload: presign an S3 URL; the browser PUTs the bytes directly. */
  @Post('presign')
  presign(
    @Body(new ZodValidationPipe(PresignUploadSchema)) body: PresignUploadInput,
    @Ctx() ctx: RequestContext,
  ) {
    return this.docs.presignUpload(ctx.orgId, body);
  }

  /** Step 2: client tells us the upload completed, we enqueue ingest. */
  @Post(':id/complete')
  complete(@Param('id') id: string, @Ctx() ctx: RequestContext) {
    return this.docs.markUploaded(ctx.orgId, id);
  }

  @Get()
  list(@Query('type') type: 'RFP' | 'KNOWLEDGE_BASE' | undefined, @Ctx() ctx: RequestContext) {
    return this.docs.list(ctx.orgId, type);
  }

  @Get(':id')
  get(@Param('id') id: string, @Ctx() ctx: RequestContext) {
    return this.docs.findById(ctx.orgId, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Ctx() ctx: RequestContext) {
    return this.docs.softDelete(ctx.orgId, id);
  }
}
