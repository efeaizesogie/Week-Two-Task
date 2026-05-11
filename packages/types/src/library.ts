import { z } from 'zod';

export const CreateLibraryAnswerSchema = z.object({
  question: z.string().min(1).max(2000),
  answer: z.string().min(1),
  tags: z.array(z.string().max(40)).max(20).default([]),
  ownerUserId: z.string().cuid().optional(),
});
export type CreateLibraryAnswerInput = z.infer<typeof CreateLibraryAnswerSchema>;

export const UpdateLibraryAnswerSchema = CreateLibraryAnswerSchema.partial().extend({
  isStale: z.boolean().optional(),
});
export type UpdateLibraryAnswerInput = z.infer<typeof UpdateLibraryAnswerSchema>;

export const SearchLibrarySchema = z.object({
  q: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(20).default(5),
});
export type SearchLibraryInput = z.infer<typeof SearchLibrarySchema>;
