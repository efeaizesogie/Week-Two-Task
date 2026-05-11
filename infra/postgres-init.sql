-- Enable pgvector on the local dev database.
-- Neon: toggle via the Extensions UI in production.
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
