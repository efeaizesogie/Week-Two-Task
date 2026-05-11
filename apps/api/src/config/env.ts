import { z } from 'zod';

/**
 * Environment is validated at boot. Any missing/invalid variable causes the
 * process to exit before serving traffic — fail loudly, fail fast.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  APP_URL: z.string().url(),
  API_URL: z.string().url(),

  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  REDIS_URL: z.string().url(),

  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),
  CLERK_JWT_ISSUER: z.string().url(),

  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_STARTER: z.string().min(1),
  STRIPE_PRICE_TEAM: z.string().min(1),

  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL_CHAT: z.string().default('gpt-4o-mini'),
  OPENAI_MODEL_EMBED: z.string().default('text-embedding-3-small'),

  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_BUCKET_REGION: z.string().min(1),

  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),
  SENTRY_DSN: z.string().url().optional(),

  ENABLE_SIGNUPS: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cached: AppEnv | null = null;

export function loadEnv(): AppEnv {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('[api] invalid environment:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  cached = parsed.data;
  return cached;
}
