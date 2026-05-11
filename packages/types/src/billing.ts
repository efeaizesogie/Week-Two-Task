import { z } from 'zod';

export const PlanTierSchema = z.enum(['FREE', 'STARTER', 'TEAM', 'ENTERPRISE']);
export type PlanTier = z.infer<typeof PlanTierSchema>;

export const CheckoutSchema = z.object({
  tier: z.enum(['STARTER', 'TEAM']),
  seats: z.number().int().min(1).max(500).default(1),
});
export type CheckoutInput = z.infer<typeof CheckoutSchema>;
