# Deployment (Docker + CI)

How ADYSRE is built into images, run as a stack, and gated by CI. See the
[Constitution](../CLAUDE.md) for the stack contract this implements.

## Layout

| Concern | File |
| --- | --- |
| Data services (dev + prod) | `docker-compose.yml` (postgres, redis) |
| Application stack (prod) | `docker-compose.prod.yml` (migrate, api, worker, web) |
| Images | `apps/{web,api,worker}/Dockerfile` |
| Build-context excludes | `.dockerignore` |
| CI | `.github/workflows/ci.yml` |

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

Base image is `node:20-alpine`; `libc6-compat` + `openssl` are installed because
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
