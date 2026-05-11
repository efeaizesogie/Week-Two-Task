# Deployment

## Environments

| Env | Branch | Web (Vercel) | API (Fly.io) | DB (Neon) |
|---|---|---|---|---|
| Preview | PR | auto-preview per PR | staging app | PR-scoped branch |
| Staging | `main` | `staging.rfpilot.com` | `rfpilot-api-staging` | `main` branch |
| Production | tagged releases | `app.rfpilot.com` | `rfpilot-api` | `main` branch |

## Secrets

All runtime secrets live outside the repo. In CI we use dummies.

- **Vercel:** project Environment Variables; separate sets for Preview and Production.
- **Fly.io:** `fly secrets set KEY=value` per app.
- **Local dev:** `.env` copied from `.env.example`.

Rotate Clerk / Stripe / OpenAI keys quarterly.

## Database migrations

Migrations run on deploy:

```bash
pnpm --filter @rfpilot/db migrate:deploy
```

Fly.io release phase (`flyctl deploy`) should invoke this before starting
new machines. Drift detection will fail the deploy if the live schema
diverges from `prisma/schema.prisma`.

## Neon branching

On PR open, a GitHub Action creates a Neon branch named `preview/<pr-number>`
and sets `DATABASE_URL` on the Vercel preview. On PR close, the branch is
deleted. Setup: see `.github/workflows/neon-branch.yml` (to be added).

## Rollback

- **Web:** `vercel rollback` to the last known-good deployment.
- **API:** `fly releases list` → `fly releases rollback <id>`.
- **DB:** forward-only. If a migration goes bad, ship a corrective migration.
  Do **not** `prisma migrate reset` in production.

## Observability

- Logs: Pino → stdout → Fly logs + Vercel logs → Logtail (post-MVP).
- APM: Sentry DSN in `SENTRY_DSN` once added to both apps.
- Uptime: Better Uptime pings `/health` every 60s from 3 regions.

## Fly.io processes

The API image starts two processes:
- `api` — serves HTTP at port 4000.
- `worker` — runs BullMQ consumers (ingest, extract-questions, draft-answer, export).

Both use the same Docker image, different entry commands. See `apps/api/fly.toml`.
