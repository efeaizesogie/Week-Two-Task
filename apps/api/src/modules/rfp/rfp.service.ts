import { Injectable, NotFoundException } from '@nestjs/common';
import { RfpStatus } from '@rfpilot/db';
import type { CreateRfpInput, UpdateRfpInput } from '@rfpilot/types';

import { PrismaService } from '../prisma/prisma.service';
import { QUEUE_NAMES } from '../queue/queue.module';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class RfpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
  ) {}

  create(orgId: string, input: CreateRfpInput): Promise<any> {
    return this.prisma.rfp.create({
      data: {
        orgId,
        documentId: input.documentId,
        title: input.title,
        customer: input.customer,
        dueDate: input.dueDate,
        status: RfpStatus.DRAFT,
      },
    });
  }

  list(orgId: string): Promise<any> {
    return this.prisma.rfp.findMany({
      where: { orgId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { questions: true } } },
    });
  }

  async findById(orgId: string, id: string): Promise<any> {
    const rfp = await this.prisma.rfp.findFirst({
      where: { id, orgId, deletedAt: null },
      include: { document: true, _count: { select: { questions: true } } },
    });
    if (!rfp) throw new NotFoundException('RFP not found');
    return rfp;
  }

  update(orgId: string, id: string, input: UpdateRfpInput): Promise<any> {
    return this.prisma.rfp.update({
      where: { id, orgId },
      data: input,
    });
  }

  async extractQuestions(orgId: string, id: string) {
    const rfp = await this.findById(orgId, id);
    await this.queue.enqueue(
      QUEUE_NAMES.EXTRACT_QUESTIONS,
      { rfpId: rfp.id, orgId },
      { jobId: `extract-${rfp.id}` },
    );
    return { enqueued: true };
  }
}
