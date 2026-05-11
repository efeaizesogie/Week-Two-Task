import { Global, Module } from '@nestjs/common';

import { QueueService } from './queue.service';

export const QUEUE_NAMES = {
  INGEST: 'ingest',
  EXTRACT_QUESTIONS: 'extract-questions',
  DRAFT_ANSWER: 'draft-answer',
  EXPORT: 'export',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

@Global()
@Module({
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
