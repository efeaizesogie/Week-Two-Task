import { randomUUID } from 'node:crypto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentStatus, DocumentType } from '@rfpilot/db';
import type { PresignUploadInput, PresignUploadResponse } from '@rfpilot/types';

import { PrismaService } from '../prisma/prisma.service';
import { QUEUE_NAMES } from '../queue/queue.module';
import { QueueService } from '../queue/queue.service';
import { S3Service } from './s3.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly queue: QueueService,
  ) {}

  async presignUpload(orgId: string, input: PresignUploadInput): Promise<PresignUploadResponse> {
    const docId = randomUUID().replace(/-/g, '').slice(0, 24);
    const s3Key = `orgs/${orgId}/docs/${docId}/${sanitise(input.fileName)}`;

    const doc = await this.prisma.document.create({
      data: {
        orgId,
        type: input.type as DocumentType,
        status: DocumentStatus.UPLOADING,
        name: input.fileName,
        s3Key,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
      },
    });

    const uploadUrl = await this.s3.presignPut(s3Key, input.mimeType);
    return {
      documentId: doc.id,
      uploadUrl,
      s3Key,
      headers: { 'Content-Type': input.mimeType },
      expiresInSeconds: 300,
    };
  }

  async markUploaded(orgId: string, id: string) {
    const doc = await this.prisma.document.update({
      where: { id, orgId },
      data: { status: DocumentStatus.PARSING },
    });
    await this.queue.enqueue(QUEUE_NAMES.INGEST, { documentId: doc.id, orgId }, { jobId: doc.id });
    return doc;
  }

  list(orgId: string, type?: 'RFP' | 'KNOWLEDGE_BASE') {
    return this.prisma.document.findMany({
      where: {
        orgId,
        deletedAt: null,
        ...(type ? { type: type as DocumentType } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findById(orgId: string, id: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id, orgId, deletedAt: null },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async softDelete(orgId: string, id: string) {
    return this.prisma.document.update({
      where: { id, orgId },
      data: { deletedAt: new Date() },
    });
  }
}

function sanitise(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}
