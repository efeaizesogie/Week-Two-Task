import { Injectable } from '@nestjs/common';
import type { ExportFormat } from '@rfpilot/types';

import { QUEUE_NAMES } from '../queue/queue.module';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class ExportService {
  constructor(private readonly queue: QueueService) {}

  async enqueue(orgId: string, rfpId: string, format: ExportFormat) {
    const jobId = `export-${rfpId}-${format}-${Date.now()}`;
    await this.queue.enqueue(
      QUEUE_NAMES.EXPORT,
      { rfpId, orgId, format },
      { jobId },
    );
    // TODO: return a tracked download URL once export completes. For now the
    // client polls GET /v1/rfps/:id to see the latest export artifact.
    return { jobId, status: 'enqueued' };
  }
}
