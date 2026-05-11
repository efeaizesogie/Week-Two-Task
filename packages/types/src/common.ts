import { z } from 'zod';

export const IdSchema = z.string().cuid();
export type Id = z.infer<typeof IdSchema>;

export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const RoleSchema = z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']);
export type Role = z.infer<typeof RoleSchema>;
