import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionStatus } from '@rfpilot/db';
import type {
  CreateCommentInput,
  DraftAnswerInput,
  EditAnswerInput,
  UpdateQuestionInput,
} from '@rfpilot/types';

import { PrismaService } from '../prisma/prisma.service';
import { QUEUE_NAMES } from '../queue/queue.module';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class QuestionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
  ) {}

  listByRfp(orgId: string, rfpId: string) {
    return this.prisma.question.findMany({
      where: { orgId, rfpId },
      orderBy: { ordinal: 'asc' },
      include: { answer: true, _count: { select: { comments: true } } },
    });
  }

  async findById(orgId: string, id: string) {
    const q = await this.prisma.question.findFirst({
      where: { id, orgId },
      include: { answer: true, comments: { include: { user: true } } },
    });
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  update(orgId: string, id: string, input: UpdateQuestionInput) {
    return this.prisma.question.update({ where: { id, orgId }, data: input });
  }

  async enqueueDraft(orgId: string, id: string, input: DraftAnswerInput) {
    await this.findById(orgId, id); // 404 guard + tenancy
    await this.queue.enqueue(
      QUEUE_NAMES.DRAFT_ANSWER,
      { questionId: id, orgId, appendMode: input.appendMode, instructions: input.instructions },
      { jobId: `draft-${id}` },
    );
    await this.prisma.question.update({
      where: { id, orgId },
      data: { status: QuestionStatus.DRAFTED },
    });
    return { enqueued: true };
  }

  async editAnswer(orgId: string, questionId: string, input: EditAnswerInput) {
    return this.prisma.answer.upsert({
      where: { questionId },
      create: {
        orgId,
        questionId,
        content: input.content,
        source: 'MANUAL',
      },
      update: { content: input.content, source: 'MANUAL' },
    });
  }

  approve(orgId: string, id: string) {
    return this.prisma.question.update({
      where: { id, orgId },
      data: { status: QuestionStatus.APPROVED },
    });
  }

  addComment(orgId: string, userId: string, questionId: string, input: CreateCommentInput) {
    return this.prisma.comment.create({
      data: { orgId, userId, questionId, body: input.body },
    });
  }
}
