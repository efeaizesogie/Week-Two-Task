# Prisma migrations

Migrations are generated with `pnpm db:migrate --name <name>`.

## pgvector

The initial migration must install the `vector` extension **before** the
`DocumentChunk` and `LibraryAnswer` tables that use `vector(1536)` columns.

Run this in production once:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Neon exposes this via the Extensions UI; we also enable it in
`docker-compose.yml` via the `pgvector/pgvector:pg16` image for local dev.

Also create IVFFLAT indexes for cosine similarity search once tables have data:

```sql
CREATE INDEX IF NOT EXISTS document_chunk_embedding_ivfflat
  ON "DocumentChunk" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS library_answer_embedding_ivfflat
  ON "LibraryAnswer" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```
