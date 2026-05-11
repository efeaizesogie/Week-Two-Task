# RFPilot

**The AI copilot for RFPs and security questionnaires.** Upload an RFP, get AI-drafted answers cited from your own past proposals, collaborate with your team, export to DOCX/PDF.

> This repository is the product implementation. Product strategy, PRD, and architecture live under [`docs/`](./docs).

---

## Monorepo layout

```
apps/
  web/        Next.js 14 — marketing + dashboard
  api/        NestJS — REST API + webhooks + background workers
packages/
  db/             Prisma schema + typed client (shared)
  types/          Zod schemas shared between web and api
  ai/             OpenAI wrappers, prompt registry, RAG helpers
  ui/             Shared shadcn primitives
  config-ts/      Shared TypeScript configs
  config-eslint/  Shared ESLint preset
infra/          docker-compose for local Postgres (pgvector) + Redis
docs/           PRD + architecture
.github/        CI workflows
```

## Prerequisites

- **Node.js** 20.11+
- **pnpm** 9+
- **Docker** (for local Postgres + Redis)

## Quickstart

```bash
# 1. Install
pnpm install

# 2. Bring up infra (Postgres + pgvector + Redis)
docker compose -f infra/docker-compose.yml up -d

# 3. Configure env
cp .env.example .env
# fill in Clerk / Stripe / OpenAI / AWS keys

# 4. Prisma
pnpm db:generate
pnpm db:migrate

# 5. Run everything
pnpm dev
# web  → http://localhost:3000
# api  → http://localhost:4000
```

## Common scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run all apps in parallel |
| `pnpm build` | Production build across workspaces |
| `pnpm lint` | ESLint across workspaces |
| `pnpm typecheck` | Type-check everything |
| `pnpm test` | Run all test suites |
| `pnpm db:migrate` | Apply Prisma migrations |
| `pnpm db:studio` | Open Prisma Studio |

## Stack

- **Frontend** — Next.js 14 (App Router) · React Server Components · Tailwind · shadcn/ui · Framer Motion
- **Backend** — NestJS · Prisma · BullMQ · Zod
- **Data** — Neon Postgres · pgvector · Upstash Redis · AWS S3
- **Auth / Billing** — Clerk · Stripe
- **AI** — OpenAI (chat + embeddings), retrieval-augmented generation
- **Deploy** — Vercel (web) · Fly.io (api + workers) · Neon (db)

## Architecture

See [`docs/architecture.md`](./docs/architecture.md).

## Contributing

- Branch from `main`: `feat/<short-name>` or `fix/<short-name>`.
- Conventional Commits: `feat: …`, `fix: …`, `chore: …`.
- All PRs must pass `lint`, `typecheck`, `test`, `build` in CI.

## License

Proprietary © RFPilot. All rights reserved.
