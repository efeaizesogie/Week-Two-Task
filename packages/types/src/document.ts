import { z } from 'zod';

export const DocumentTypeSchema = z.enum(['RFP', 'KNOWLEDGE_BASE']);
export type DocumentType = z.infer<typeof DocumentTypeSchema>;

/** Content types we accept for upload. */
export const AllowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
  'application/msword',                                                        // .doc (legacy)
] as const;

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

export const PresignUploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.enum(AllowedMimeTypes),
  sizeBytes: z.number().int().positive().max(MAX_UPLOAD_BYTES),
  type: DocumentTypeSchema,
});
export type PresignUploadInput = z.infer<typeof PresignUploadSchema>;

export const PresignUploadResponseSchema = z.object({
  documentId: z.string().cuid(),
  uploadUrl: z.string().url(),
  s3Key: z.string(),
  headers: z.record(z.string()),
  expiresInSeconds: z.number().int().positive(),
});
export type PresignUploadResponse = z.infer<typeof PresignUploadResponseSchema>;
