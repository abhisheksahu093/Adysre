# syntax=docker/dockerfile:1
#
# @adysre/api — NestJS modular monolith.
# Build from the REPO ROOT:
#   docker build -f apps/api/Dockerfile -t adysre-api .
#
# Same prune strategy as the web image. This image doubles as the migration
# runner (see docker-compose.prod.yml): it carries the Prisma schema, migrations
# and CLI, so `pnpm --filter @adysre/database db:deploy` runs from it.

FROM node:20-alpine AS base
RUN corepack enable && apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.1.3 prune @adysre/api --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
# `turbo run build` runs @adysre/database#build (prisma generate) before the
# Nest build, so the generated client is present in node_modules.
RUN pnpm turbo run build --filter=@adysre/api

FROM base AS runner
ENV NODE_ENV=production
# The pruned workspace (api + its internal deps + node_modules, incl. the Prisma
# client and CLI) is small enough to ship as-is and keeps the migrate command
# working from the same image.
COPY --from=builder /app ./
USER node
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
