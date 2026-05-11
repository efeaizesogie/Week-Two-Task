# syntax=docker/dockerfile:1.7

# Multi-stage build for the NestJS API.
#   - stage 1 "deps": installs workspace deps with pnpm.
#   - stage 2 "build": builds @rfpilot/db, @rfpilot/ai, @rfpilot/types, then @rfpilot/api.
#   - stage 3 "runner": slim production image.

FROM node:20.11-slim AS deps
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/ai/package.json ./packages/ai/
COPY packages/types/package.json ./packages/types/
COPY packages/config-ts/package.json ./packages/config-ts/
COPY packages/config-eslint/package.json ./packages/config-eslint/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM deps AS build
WORKDIR /repo
COPY . .
RUN pnpm --filter @rfpilot/db generate
RUN pnpm --filter @rfpilot/api... build
RUN pnpm --filter @rfpilot/api deploy --prod /out

FROM node:20.11-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /out /app
# Prisma engines
COPY --from=build /repo/node_modules/.prisma/client /app/node_modules/.prisma/client
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
