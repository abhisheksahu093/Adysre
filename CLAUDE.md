# ADYSRE — Project Constitution

ADYSRE is an **enterprise, AI-first Business Operating System**. This file is the
constitution Claude Code (and every contributor) must read before implementing
anything. The authoritative source specs live in [`/documents`](./documents).

> **Rule 0 — Read before you build.** Before implementing a feature, read the
> relevant spec in `/documents` and the package it touches. Never duplicate what
> a shared package already provides.

---

## 1. What we are building

A multi-tenant, modular platform that hosts business modules (CRM, etc.) on a
shared core: auth, RBAC/ABAC, organizations, users, settings, notifications,
files, audit, and AI. See [`documents/BOOTSTRAP_PROJECT.md`](./documents/BOOTSTRAP_PROJECT.md).

**Module specs:** [Design Playground](./documents/DESIGN_PLAYGROUND_PRD.md) —
the visual design editor at `/design-playground` (Phase 1: shell only).

**Published library:** [`documents/NPM_LIBRARY.md`](./documents/NPM_LIBRARY.md) —
`adysre` on npm (blocks, icons, gradients, patterns, textures, palettes).
`packages/ui` is the source of truth; `apps/web` imports from it. Read that spec
before editing anything under `packages/ui` or adding an asset family.

## 2. Stack (do not deviate without updating the docs)

- **Monorepo:** pnpm + Turborepo
- **Web:** Next.js 16 (App Router only) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui, token-based colors only
- **Client state/data:** TanStack Query, Zustand, React Hook Form + Zod
- **API:** NestJS (modular monolith) + Prisma
- **Data:** PostgreSQL + Redis + BullMQ
- **Infra:** Docker + Docker Compose
- **Runtime:** Node 20+ (see `.nvmrc`)

## 3. Repository layout

```
apps/
  web      Next.js 16 dashboard
  api      NestJS modular monolith (REST /api/v1)
  worker   BullMQ background jobs
packages/
  ui         shadcn/ui component library (adysre)
  database   Prisma schema + client (@adysre/database)
  sdk        Typed API client for web/worker (@adysre/sdk)
  config     Shared eslint/tsconfig/tailwind/prettier (@adysre/config)
  theme      Design tokens (@adysre/theme)
  validators Zod + shared validation (@adysre/validators)
  types      Shared TS types & API contracts (@adysre/types)
  logger     Structured logging (@adysre/logger)
```

## 4. The Ten Rules (from `documents/CLAUDE_RULES.md`)

1. Follow this Constitution.
2. Respect module boundaries.
3. Never duplicate components.
4. Use shared packages.
5. Build reusable abstractions.
6. Never hardcode colors, roles, or permissions.
7. Prefer composition.
8. Add tests.
9. Update documentation.
10. Ask for clarification if architecture is ambiguous.

## 5. Definition of Done

A change is done only when it **builds, is typed, is tested, is documented, is
accessible (WCAG AA), is responsive, and is secure.**

## 6. Coding standards ([`CODING_STANDARDS.md`](./documents/CODING_STANDARDS.md))

- TypeScript **strict**, **no `any`**.
- Components `PascalCase`, variables `camelCase`, files `kebab-case`.
- One responsibility per file; no duplicated logic.
- Validate with Zod (web) / class-validator + Zod (api).
- Server Components first.
- Branches: `feature/*`, `fix/*`, `release/*`.

## 7. Backend rules ([`BACKEND_ARCHITECTURE.md`](./documents/BACKEND_ARCHITECTURE.md))

- Layers: **Controller → Service → Repository → Database**.
- Thin controllers; business logic in services; **only repositories touch Prisma**.
- **RBAC on every endpoint.** Structured logging everywhere.
- Never expose Prisma/DB entities directly — map to DTOs.

## 8. Database rules ([`DATABASE_ARCHITECTURE.md`](./documents/DATABASE_ARCHITECTURE.md))

- PostgreSQL + Prisma is the single source of truth. **Never bypass Prisma.**
- Shared-schema multi-tenancy via `tenant_id`. **UUIDv7** primary keys.
- Every table carries base columns: `id, tenant_id, created_at, updated_at,
  created_by, updated_by, deleted_at` (soft delete).
- `snake_case` in DB, `camelCase` in TS. Index FKs; composite index
  `tenant_id + lookup`. Migrations only — every migration reviewed.

## 9. API standards ([`API_STANDARDS.md`](./documents/API_STANDARDS.md))

- Base URL `/api/v1`. **Never break v1.**
- Success: `{ success, message, data, meta }`.
- Error: `{ success:false, code, message }`.
- Pagination `page,pageSize,total`; filter `?filter[field]=value`; sort
  `?sort=createdAt:desc`.

## 10. Auth & RBAC ([`AUTHENTICATION_RBAC.md`](./documents/AUTHENTICATION_RBAC.md))

- JWT access + rotating refresh in **HTTP-only cookies**. OAuth-ready
  (Google/Microsoft/GitHub); passkeys on roadmap.
- RBAC + ABAC. Roles: Owner, Admin, Manager, Member, Custom.
- Permission format `module:resource:action` (e.g. `crm:lead:read`).
- Guards: `AuthGuard → TenantGuard → PermissionGuard`.
- **Check tenant before permissions. Deny by default. Audit privileged actions.**

## 11. UI/design system ([`UI_DESIGN_SYSTEM.md`](./documents/UI_DESIGN_SYSTEM.md))

- Premium, minimal, enterprise (Linear/Stripe/Notion/Vercel).
- **Token-based colors only — no hardcoded hex, no inline styles.** Tokens live
  in `@adysre/theme`. Inter Variable, fluid typography, dark mode first, WCAG AA.

## 12. Commands

```bash
pnpm install     # install workspace
pnpm dev         # run all apps (turbo)
pnpm build       # build all
pnpm lint        # eslint
pnpm typecheck   # tsc --noEmit across workspace
pnpm test        # unit tests
pnpm db:migrate  # prisma migrate dev
pnpm db:generate # prisma generate
```

## 13. Deliverable

The repo runs with `pnpm install && pnpm dev`. Keep it that way.
