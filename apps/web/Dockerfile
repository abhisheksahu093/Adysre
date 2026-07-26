# syntax=docker/dockerfile:1
#
# @adysre/web — Next.js 16 standalone image.
# Build from the REPO ROOT (the build context is the whole monorepo):
#   docker build -f apps/web/Dockerfile -t adysre-web .
#
# Strategy: `turbo prune` reduces the monorepo to just this app and the
# workspace packages it imports, so the dependency-install layer only rebuilds
# when those change; `output: 'standalone'` (next.config.mjs) then produces a
# self-contained server the final stage ships without dev dependencies.

# ── Base: Node 20 + pnpm (corepack). Prisma engines need musl compat + openssl
#    because @adysre/database is a transitive dependency of the web build. ─────
FROM node:20-alpine AS base
RUN corepack enable && apk add --no-cache libc6-compat openssl
WORKDIR /app

# ── Prune the monorepo down to @adysre/web's subgraph ───────────────────────
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.1.3 prune @adysre/web --docker

# ── Install (cached on dependency changes) then build ───────────────────────
FROM base AS builder
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
# The public API base URL is inlined into the client bundle at build time, so it
# must be a build arg (a runtime env var would not reach already-built JS).
ARG NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
# `turbo run build` runs the workspace deps' build first (^build): Prisma
# generate and the UI codegen, then `next build`.
RUN pnpm turbo run build --filter=@adysre/web

# ── Runner: the standalone server only ──────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# The standalone output mirrors the monorepo layout under .next/standalone, so
# the entrypoint is apps/web/server.js. Static assets and public/ are not traced
# into it and are copied alongside.
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
USER node
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
