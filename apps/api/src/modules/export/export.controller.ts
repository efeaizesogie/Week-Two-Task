import { Controller, Get, Param, Query } from '@nestjs/common';
import { ExportFormatSchema } from '@rfpilot/types';

import { Ctx } from '../../common/context/ctx.decorator';
import type { RequestContext } from '../../common/context/request-context';
import { ExportService } from './export.service';

@Controller('rfps')
export class ExportController {
  constructor(private readonly exporter: ExportService) {}

  @Get(':id/export')
  export(
    @Param('id') id: string,
    @Query('format') format: string,
    @Ctx() ctx: RequestContext,
  ) {
    const fmt = ExportFormatSchema.parse(format);
    return this.exporter.enqueue(ctx.orgId, id, fmt);
  }
}
