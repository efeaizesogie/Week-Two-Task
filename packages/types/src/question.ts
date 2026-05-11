import { z } from 'zod';

export const QuestionStatusSchema = z.enum([
  'UNANSWERED',
  'DRAFTED',
  'EDITED',
  'APPROVED',
  'SKIPPED',
]);
export type QuestionStatus = z.infer<typeof QuestionStatusSchema>;

export const AnswerCitationSchema = z.object({
  documentId: z.string().cuid(),
  chunkId: z.string().cuid(),
  page: z.number().int().nullable().optional(),
  snippet: z.string().max(500),
});
export type AnswerCitation = z.infer<typeof AnswerCitationSchema>;

export const UpdateQuestionSchema = z.object({
  text: z.string().min(1).optional(),
  status: QuestionStatusSchema.optional(),
  assigneeUserId: z.string().cuid().nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
});
export type UpdateQuestionInput = z.infer<typeof UpdateQuestionSchema>;

export const DraftAnswerSchema = z.object({
  /** If true, append candidates to existing answer rather than replace. */
  appendMode: z.boolean().default(false),
  /** Optional user instructions (tone, length, framing). */
  instructions: z.string().max(1000).optional(),
});
export type DraftAnswerInput = z.infer<typeof DraftAnswerSchema>;

export const EditAnswerSchema = z.object({
  content: z.string().min(1),
});
export type EditAnswerInput = z.infer<typeof EditAnswerSchema>;

export const CreateCommentSchema = z.object({
  body: z.string().min(1).max(5000),
});
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
