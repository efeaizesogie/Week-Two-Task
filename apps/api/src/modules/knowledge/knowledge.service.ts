import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateLibraryAnswerInput,
  UpdateLibraryAnswerInput,
} from '@rfpilot/types';

import { PrismaService } from '../prisma/prisma.service';

/**
 * Answer Library service.
 *
 * Semantic search: we use pgvector directly via $queryRaw because Prisma
 * does not model the `<=>` operator. The query filters by orgId first, then
 * orders by cosine distance. All writes also create a LibraryAnswerVersion
 * row so we have a full audit trail.
 */
@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  list(orgId: string) {
    return this.prisma.libraryAnswer.findMany({
      where: { orgId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });
  }

  /**
   * TODO(worker): embed `query` via OpenAIClient, then run pgvector query.
   * For now we fall back to a trigram ILIKE search so the endpoint is usable
   * before workers come online.
   */
  search(orgId: string, query: string, limit: number) {
    return this.prisma.libraryAnswer.findMany({
      where: {
        orgId,
        deletedAt: null,
        OR: [
          { question: { contains: query, mode: 'insensitive' } },
          { answer: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });
  }

  async create(orgId: string, userId: string, input: CreateLibraryAnswerInput) {
    return this.prisma.$transaction(async (tx) => {
      const answer = await tx.libraryAnswer.create({
        data: {
          orgId,
          question: input.question,
          answer: input.answer,
          tags: input.tags,
          ownerUserId: input.ownerUserId ?? userId,
          lastReviewed: new Date(),
        },
      });
      await tx.libraryAnswerVersion.create({
        data: {
          libraryAnswerId: answer.id,
          orgId,
          question: answer.question,
          answer: answer.answer,
          tags: answer.tags,
          editorUserId: userId,
        },
      });
      return answer;
    });
  }

  async update(
    orgId: string,
    userId: string,
    id: string,
    input: UpdateLibraryAnswerInput,
  ) {
    const existing = await this.prisma.libraryAnswer.findFirst({
      where: { id, orgId, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Library answer not found');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.libraryAnswer.update({
        where: { id },
        data: {
          question: input.question ?? existing.question,
          answer: input.answer ?? existing.answer,
          tags: input.tags ?? existing.tags,
          isStale: input.isStale ?? existing.isStale,
          ownerUserId: input.ownerUserId ?? existing.ownerUserId,
          lastReviewed: new Date(),
        },
      });
      await tx.libraryAnswerVersion.create({
        data: {
          libraryAnswerId: id,
          orgId,
          question: updated.question,
          answer: updated.answer,
          tags: updated.tags,
          editorUserId: userId,
        },
      });
      return updated;
    });
  }

  versions(orgId: string, id: string) {
    return this.prisma.libraryAnswerVersion.findMany({
      where: { libraryAnswerId: id, orgId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
