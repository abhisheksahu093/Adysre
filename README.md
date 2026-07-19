# ADYSRE

Enterprise, AI-first **Business Operating System** — a multi-tenant modular
platform (auth, RBAC/ABAC, organizations, users, settings, notifications, files,
audit, AI) built as a pnpm + Turborepo monorepo.

> The full architecture is defined in [`/documents`](./documents) and the working
> rules in [`CLAUDE.md`](./CLAUDE.md). **Read those before contributing.**

## Requirements

- **Node 20+** (`nvm use` reads `.nvmrc`)
- **pnpm 9+** (`corepack enable`)
- **Docker + Docker Compose** (Postgres + Redis)

## Quick start

```bash
corepack enable                 # provides pnpm
cp .env.example .env            # fill in secrets
docker compose up -d            # start postgres + redis
pnpm install
pnpm db:migrate                 # apply Prisma migrations
pnpm db:seed                    # seed roles/permissions/demo org
pnpm dev                        # web:3000  api:4000  worker
```

## Workspace

| Path              | Package            | Purpose                              |
| ----------------- | ------------------ | ------------------------------------ |
| `apps/web`        | `@adysre/web`      | Next.js 16 dashboard                 |
| `apps/api`        | `@adysre/api`      | NestJS modular monolith (`/api/v1`)  |
| `apps/worker`     | `@adysre/worker`   | BullMQ background jobs               |
| `packages/ui`     | `@adysre/ui`       | shadcn/ui component library          |
| `packages/database` | `@adysre/database` | Prisma schema + client             |
| `packages/sdk`    | `@adysre/sdk`      | Typed API client                     |
| `packages/config` | `@adysre/config`   | Shared eslint/tsconfig/tailwind      |
| `packages/theme`  | `@adysre/theme`    | Design tokens                        |
| `packages/validators` | `@adysre/validators` | Zod schemas                     |
| `packages/types`  | `@adysre/types`    | Shared types & API contracts         |
| `packages/logger` | `@adysre/logger`   | Structured logging                   |

## Scripts

`pnpm dev · build · lint · typecheck · test · format`
`pnpm db:migrate · db:generate · db:seed · db:studio`

## License

Proprietary — © ADYSRE.
