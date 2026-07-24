# syntax=docker/dockerfile:1
#
# @adysre/worker — BullMQ background jobs.
# Build from the REPO ROOT:
#   docker build -f apps/worker/Dockerfile -t adysre-worker .
#
# Same prune strategy as the other images. No exposed port - it consumes the
# Redis queue rather than serving HTTP.

FROM node:20-alpine AS base
RUN corepack enable && apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.1.3 prune @adysre/worker --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@adysre/worker

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app ./
USER node
CMD ["node", "apps/worker/dist/main.js"]
