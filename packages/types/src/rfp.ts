import { z } from 'zod';

export const RfpStatusSchema = z.enum([
  'DRAFT',
  'IN_PROGRESS',
  'REVIEW',
  'SUBMITTED',
  'WON',
  'LOST',
  'ARCHIVED',
]);
export type RfpStatus = z.infer<typeof RfpStatusSchema>;

export const CreateRfpSchema = z.object({
  documentId: z.string().cuid(),
  title: z.string().min(1).max(200),
  customer: z.string().max(200).optional(),
  dueDate: z.coerce.date().optional(),
});
export type CreateRfpInput = z.infer<typeof CreateRfpSchema>;

export const UpdateRfpSchema = CreateRfpSchema.partial().extend({
  status: RfpStatusSchema.optional(),
});
export type UpdateRfpInput = z.infer<typeof UpdateRfpSchema>;

export const ExportFormatSchema = z.enum(['docx', 'pdf']);
export type ExportFormat = z.infer<typeof ExportFormatSchema>;
