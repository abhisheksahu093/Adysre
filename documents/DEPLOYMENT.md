# Deployment (Docker + CI)

How ADYSRE is built into images, run as a stack, and gated by CI. See the
[Constitution](../CLAUDE.md) for the stack contract this implements.

## Layout

| Concern | File |
| --- | --- |
| Hosted web deploy | `vercel.json` |
| Data services (dev + prod) | `docker-compose.yml` (postgres, redis) |
| Application stack (prod) | `docker-compose.prod.yml` (migrate, api, worker, web) |
| Images | `apps/{web,api,worker}/Dockerfile` |
| Build-context excludes | `.dockerignore` |
| CI | `.github/workflows/ci.yml` |

## Vercel (apps/web)

`apps/web` deploys to Vercel from `main`. The Docker images above are the
self-hosted path and stay as they are; this is the hosted one.

`vercel.json` sets exactly one thing, and can explain none of it - Vercel
validates the file against a schema with `additionalProperties: false`, so a
`"//"` comment key fails the build outright rather than being ignored. Hence
this section.

```json
{ "installCommand": "pnpm install --frozen-lockfile --prod=false" }
```

**Why `--prod=false`.** Vercel sets `NODE_ENV=production` for the install, so
pnpm honours it and skips devDependencies - which is where `typescript` and
`prisma` live, because that is where build tools belong. Without the flag the
build dies within seconds on `tsc: command not found` and `prisma: command not
found`, before compiling a single file. The flag changes only what exists on the
build machine; Next still decides what ships.

Moving `typescript` and `prisma` into `dependencies` would fix the build too,
and make every consumer of the eleven published `@adysre/rules-*` packages
download a compiler they will never run.

**Why nothing else is set.** Vercel's own detection finds the Next.js app and
scopes turbo to `@adysre/web` and its dependencies - the build log says
`Packages in scope: @adysre/web`. Overriding a working `buildCommand` or
`outputDirectory` is how a targeted fix becomes a second outage.

**Environment variables.** Turbo runs tasks in a filtered environment: a
variable set in the Vercel dashboard and absent from `turbo.json` is withheld
from the build, and Vercel warns by name when that happens. `globalEnv` lists
`DATABASE_URL` and `DIRECT_URL` for that reason - see
[`RULES_ENGINE.md`](./RULES_ENGINE.md) and the datasource block in
`packages/database/prisma/schema.prisma` for why there are two.

Set both in the dashboard, never in the repository:

| Variable | Connection | Used by |
| --- | --- | --- |
| `DATABASE_URL` | pooled | the running application |
| `DIRECT_URL` | direct | `prisma migrate` and introspection |

A serverless deployment scales to many short-lived instances, and each one
opening its own Postgres connection exhausts the server's limit - which appears
as "too many connections" under load, on the platform, and never locally.
Migrations need the direct connection because advisory locks and DDL do not
survive a pooler handing them a different backend mid-statement.

## Image strategy

Every image builds **from the repo root** (the whole monorepo is the context)
and follows one pattern:

1. **Prune** — `turbo prune <scope> --docker` reduces the monorepo to just that
   app and the workspace packages it imports. The install layer then caches on
   dependency changes only.
2. **Install + build** — `pnpm install --frozen-lockfile` against the pruned
   lockfile, then `pnpm turbo run build --filter=<scope>`. Turbo's `^build`
   runs workspace deps first, so **Prisma generate** (`@adysre/database#build`)
   and the UI codegen happen before the app build.
3. **Runner** — a slim final stage. The web image ships Next's
   `output: 'standalone'` server; api/worker ship the pruned workspace.

The standalone output is opt-in: `apps/web/Dockerfile` sets `NEXT_OUTPUT=standalone`
(declared in `turbo.json` so the task sees it and it lands in the cache key), and
`next.config.mjs` enables `output` only when it is set. A plain `pnpm build` on a
laptop or on Vercel skips it, because that copy is several GB and only this image
reads it.

Base image is `node:24-alpine`; `libc6-compat` + `openssl` are installed because
the Prisma engine needs them on musl.

## Local development

Run only the data services and use the dev servers on the host:

```bash
docker compose up -d          # postgres + redis
pnpm install && pnpm dev      # web :3000, api :4000, worker
```

## Production stack

```bash
cp .env.example .env          # fill in JWT_*, OAuth, ANTHROPIC_API_KEY, …
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Startup order is enforced by `depends_on`: postgres/redis become healthy → the
one-shot **migrate** service runs `prisma migrate deploy` → api and worker start
→ web starts. Inside the compose network the data hosts are `postgres` and
`redis` (set in `docker-compose.prod.yml`), not the localhost values in `.env`.

- **Web** → http://localhost:3000  ·  **API** → http://localhost:4000/api/v1

### The `NEXT_PUBLIC_API_URL` gotcha

`NEXT_PUBLIC_*` values are inlined into the browser bundle **at build time**, so
the web image takes `NEXT_PUBLIC_API_URL` as a build arg (default
`http://localhost:4000/api/v1`). The browser — not the container — calls it, so
the default works for a single host with the API port published. For a real
domain, rebuild:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1 \
  docker compose -f docker-compose.yml -f docker-compose.prod.yml build web
```

### Migrations

The migrate service reuses the **api image** (it carries the Prisma schema,
migrations and CLI) and runs `pnpm --filter @adysre/database db:deploy`. To run
migrations manually against a running stack:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm migrate
```

## CI

`.github/workflows/ci.yml` runs on every push to `main` and every PR:

- **verify** — `pnpm lint`, `typecheck`, `test`, `build` (the Definition of
  Done), with pnpm + Turbo caches.
- **docker** — builds the `web`, `api` and `worker` images (matrix, no push) so
  a broken Dockerfile fails the PR rather than the deploy.
