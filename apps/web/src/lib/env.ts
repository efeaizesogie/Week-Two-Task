import { z } from 'zod';

/** Public envs (exposed to the browser). */
const PublicSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

/** Server-only envs. */
const ServerSchema = z.object({
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  API_URL: z.string().url().default('http://localhost:4000'),
});

export const publicEnv = PublicSchema.parse({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
});

export const serverEnv = ServerSchema.parse({
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  API_URL: process.env.API_URL,
});
