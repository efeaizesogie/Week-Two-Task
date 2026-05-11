import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis, { type Redis } from 'ioredis';

import { QUEUE_NAMES, type QueueName } from './queue.module';

/**
 * Thin facade over BullMQ. Workers live in modules/*  `<feature>.processor.ts`
 * files; this service is how HTTP handlers enqueue jobs.
 *
 * We keep a single Redis connection and reuse it across queues so we don't
 * exceed Upstash's free-tier connection caps.
 */
@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private readonly connection: Redis;
  private readonly queues = new Map<QueueName, Queue>();

  constructor() {
    this.connection = new IORedis(process.env.REDIS_URL ?? '', {
      maxRetriesPerRequest: null,
    });
    for (const name of Object.values(QUEUE_NAMES)) {
      this.queues.set(name, new Queue(name, { connection: this.connection }));
    }
  }

  async enqueue<T>(name: QueueName, data: T, opts?: { jobId?: string; delay?: number }): Promise<void> {
    const queue = this.queues.get(name);
    if (!queue) throw new Error(`Unknown queue: ${name}`);
    await queue.add(name, data, {
      jobId: opts?.jobId,
      delay: opts?.delay,
      removeOnComplete: { age: 24 * 60 * 60, count: 1000 },
      removeOnFail: { age: 7 * 24 * 60 * 60 },
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
    this.logger.debug({ queue: name, data }, 'enqueued');
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all([...this.queues.values()].map((q) => q.close()));
    await this.connection.quit();
  }
}
