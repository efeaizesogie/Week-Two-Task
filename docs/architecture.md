# RFPilot — Architecture

## Overview

RFPilot is a multi-tenant SaaS built as a Turborepo monorepo. Frontend (Next.js 14) runs on Vercel. Backend (NestJS) plus BullMQ workers run on Fly.io. Data lives in Neon Postgres (with `pgvector`), Upstash Redis, and AWS S3.

## Components

- **apps/web** — Next.js 14 App Router. Marketing site, dashboard, Server Actions. Clerk middleware gates authenticated routes.
- **apps/api** — NestJS REST API at `/v1`. Webhooks (Clerk, Stripe). Hosts BullMQ workers in the same image.
- **packages/db** — Prisma schema, migrations, generated client.
- **packages/types** — Zod schemas shared between web and api.
- **packages/ai** — OpenAI client, prompt registry, RAG utilities, caching.
- **packages/ui** — Shared React primitives (shadcn).

## Multi-tenancy

Every user-data row carries `orgId`. A single NestJS interceptor (`OrgScopeInterceptor`) attaches `orgId` to every Prisma query from request context. There is no mechanism in app code to query across orgs — this is enforced at the data-access layer, not sprinkled in services.

## Auth

Clerk issues JWTs. The API validates tokens via a `ClerkAuthGuard` that pulls the verified claims, loads the `User` and `Membership`, and populates `RequestContext` (user, org, role).

RBAC roles: `OWNER | ADMIN | EDITOR | VIEWER`. Enforced by `@Roles()` decorator + `RolesGuard`.

## Background jobs (BullMQ)

Queues:
- `ingest` — parse uploaded document, chunk, embed, persist.
- `extract-questions` — extract questions from an uploaded RFP.
- `draft-answer` — RAG draft for a single question.
- `export` — render DOCX / PDF.

Workers run as separate Fly.io processes from the web API; both share the NestJS codebase but start different modules.

## Caching strategy

- **Answer library search** — Redis SET, 60s TTL, keyed by `orgId:query`.
- **LLM responses** — Redis SET, 7d TTL, keyed by `hash(model + prompt + retrieved-chunk-ids)`. Saves ~40% token spend on repeated questions.
- **Next.js** — RSC + `revalidateTag` for dashboard queries.

## Security

- Env is validated with Zod at process boot. Missing/malformed → process exits before serving traffic.
- S3 uses client-side presigned uploads; the server never handles file bytes.
- Stripe / Clerk webhooks are signature-verified.
- Rate limiting (per-IP + per-org) via Redis token bucket (`@nestjs/throttler` backed by Redis).
- Audit log written by a global `AuditInterceptor` on every mutation.
- Secrets managed via Doppler in production.

## Scaling

- API: Fly.io 2 regions day-1 (iad, lhr). Horizontal scale on CPU > 70%.
- Workers: autoscale on queue depth.
- DB: Neon autoscale; read replicas once read-heavy analytics ships.
- Preview DBs: Neon branches created per PR by the CI workflow.

## API versioning

URL-prefixed `/v1`. Nest `VersioningType.URI`. Additive changes within `/v1`. Breaking changes ship under `/v2` in parallel; `/v1` deprecation window of 6 months.

## Deploy

- `apps/web` → Vercel (previews per PR).
- `apps/api` + workers → Fly.io (`fly.toml` in `apps/api`).
- DB migrations: `prisma migrate deploy` runs on deploy; drift detection fails the deploy.
- CI (`.github/workflows/ci.yml`): install → lint → typecheck → test → build. Required for merge to `main`.
