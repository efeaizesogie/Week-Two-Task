# Infra

Local Postgres (with `pgvector` + `pg_trgm`) and Redis for development.

## Start

```bash
docker compose -f infra/docker-compose.yml up -d
```

Then from repo root:

```bash
pnpm db:migrate   # applies Prisma migrations
pnpm --filter @rfpilot/db seed
```

## Stop / wipe

```bash
docker compose -f infra/docker-compose.yml down      # stop
docker compose -f infra/docker-compose.yml down -v   # wipe volumes too
```

## Production hosting

- DB: [Neon](https://neon.tech) (branching per PR, pgvector in Extensions UI).
- Redis: [Upstash](https://upstash.com) (REST + TCP).
- Web: Vercel (auto-preview per PR).
- API + workers: Fly.io (`apps/api/fly.toml`).
- Uploads: AWS S3.

See [`../docs/architecture.md`](../docs/architecture.md) and
[`../docs/deployment.md`](../docs/deployment.md).
