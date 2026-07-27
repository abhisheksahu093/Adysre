# Local Development

> Getting the platform running on your machine, and what to do when it will not.

---

## 1. Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node | 20+ (see `.nvmrc`) | `node -v` |
| pnpm | 9+ | `pnpm -v` |
| PostgreSQL | 14+ (16 recommended) | `pg_isready` |

**pnpm comes from corepack.** If you get `pnpm: command not found`:

```bash
corepack enable pnpm
```

Turborepo needs the real corepack shim on `PATH`. A pnpm installed some other
way can leave `turbo` unable to resolve workspace binaries.

Redis and Docker are **not required**. `docker-compose.yml` exists for a
containerised setup, and BullMQ jobs in `apps/worker` need Redis, but nothing in
the auth or web path does. Skip both unless you are working on the worker.

---

## 2. Database

This machine already runs PostgreSQL 16 via Homebrew, owning port 5432 as the
`unlink` role.

```bash
brew services start postgresql@16     # if pg_isready fails
pg_isready                            # expect "accepting connections"
```

Create the database if it does not exist:

```bash
createdb adysre
psql -d adysre -c "SELECT current_database(), version();"
```

If you prefer the `adysre:adysre` credentials in `.env.example`:

```bash
psql -d postgres -c "CREATE ROLE adysre LOGIN PASSWORD 'adysre' CREATEDB;"
psql -d postgres -c "ALTER DATABASE adysre OWNER TO adysre;"
```

Otherwise point the URLs at your own role:

```bash
DATABASE_URL="postgresql://unlink@localhost:5432/adysre?schema=public"
DIRECT_URL="postgresql://unlink@localhost:5432/adysre?schema=public"
```

Locally there is no pooler, so both URLs are identical. That is expected.

**Set them in `apps/web/.env.local` AND `packages/database/.env`.** The root
`.env` reaches the web app only through the gap-filling shim in
`next.config.mjs`, so a value present in `.env.local` wins and a value present
only in the root is still applied. See the precedence box in
`docs/ENVIRONMENT_SETUP.md`.

**Restart the dev server after any env change**, and verify it actually
restarted: the Prisma client is cached on `globalThis` and survives hot reload,
so it keeps the connection string it was built with.

```bash
ps -eo pid,etime,command | grep next-server | grep -v grep   # uptime in seconds?
```

---

## 3. First run

```bash
pnpm install

cp .env.example .env
cp .env.example packages/database/.env
echo "JWT_ACCESS_SECRET=$(openssl rand -base64 48)"  >> .env
echo "JWT_REFRESH_SECRET=$(openssl rand -base64 48)" >> .env
# then edit both files so the database URLs agree

pnpm db:generate     # Prisma client into node_modules
pnpm db:migrate      # apply migrations
pnpm db:seed         # demo tenant, Owner user, roles, permissions
pnpm dev
```

`pnpm dev` runs every app through Turborepo. Web is at
`http://localhost:3000`, and the NestJS API, if you start it, at `4000`.

**To run only the web app**, which is all you need for auth work:

```bash
pnpm --filter @adysre/web dev
```

The seed is what makes the dev auth fallbacks work. Without it, API Studio
answers 503 with "the tenant has no users", which is the correct complaint and
not a bug.

---

## 4. The dev auth fallbacks, and why they exist

Before Phase 4 lands, two modules have a development-only session fallback so
they are usable without a running API.

| Module | Cookie | Values |
|---|---|---|
| API Studio | `adysre_api_studio_dev` | `Owner`, `Admin`, `Manager`, `Member`, `Custom`, or `anonymous` |
| Website Intelligence | `adysre_intel_dev` | same |

```js
// in the browser console at localhost:3000
document.cookie = 'adysre_api_studio_dev=Owner; path=/';
document.cookie = 'adysre_api_studio_dev=anonymous; path=/';   // test the denied path
```

The fallback resolves the **real** seeded tenant and Owner user ids rather than
synthetic strings, because these tables have `uuid` foreign keys on
`created_by`. A fake id like `demo-user-1` reads fine and fails on every insert,
which is a bug this code has already had once.

**These are inert when `NODE_ENV=production`.** No environment variable can turn
them on there. To rehearse production behaviour locally:

```bash
API_STUDIO_STRICT_AUTH=true pnpm --filter @adysre/web dev
```

Once Phase 4 ships, real sign-in replaces these and the fallbacks are deleted.

---

## 5. Everyday commands

```bash
pnpm dev                  # all apps
pnpm build                # all apps
pnpm typecheck            # tsc --noEmit, workspace-wide
pnpm lint
pnpm test
pnpm format

pnpm db:studio            # Prisma Studio, browse and edit rows
pnpm db:migrate           # create + apply a migration from schema changes
pnpm db:generate          # regenerate the client after editing the schema
pnpm db:seed

pnpm --filter @adysre/web <script>          # scope to one package
pnpm --filter @adysre/web gen:section-demos # regenerate section demo sources
```

Turborepo caches by input hash, so a second `pnpm build` with no changes is
nearly instant. If you suspect a stale cache:

```bash
pnpm build --force
```

---

## 6. Verifying auth locally

After Phase 4. Cookies are HTTP-only, so use a cookie jar rather than the
browser console.

```bash
BASE=http://localhost:3000
JAR=/tmp/adysre.cookies

curl -s -c $JAR -X POST $BASE/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"dev@local.test","password":"LocalDev1234","name":"Dev",
       "organizationName":"Local","organizationSlug":"local"}' | jq

curl -s -b $JAR $BASE/api/auth/me | jq          # expect your user

curl -s -b $JAR $BASE/api/api-studio/workspaces | jq   # expect 200, not 401

curl -s -b $JAR -c $JAR -X POST $BASE/api/auth/refresh | jq
grep refresh_token $JAR                          # the value should have changed
```

The refresh check is the one worth doing by hand. If the token in the jar is
unchanged, rotation is not working, and rotation is what limits the damage of a
stolen refresh token.

Full matrix in `docs/API_TESTING_GUIDE.md`.

---

## 7. Troubleshooting

| Symptom | Fix |
|---|---|
| `pnpm: command not found` | `corepack enable pnpm` |
| `Can't reach database server at localhost:5432` | `brew services start postgresql@16` |
| `database "adysre" does not exist` | `createdb adysre` |
| `password authentication failed for user "adysre"` | Role not created. Use `unlink` in the URLs, or create the role (section 2). |
| Migration succeeds, app does not see the tables | The env files point at different databases. See `ENVIRONMENT_SETUP.md`. |
| CLI reaches the database, the app returns 503 | Secrets or URLs are in the root `.env` rather than `apps/web/.env.local` |
| Env edited but behaviour unchanged | Restart the server; the Prisma client is cached across hot reload |
| `Another next dev server is already running` | One is running for this directory. Use it, or stop that one first. |
| `@prisma/client did not initialize yet` | `pnpm db:generate` |
| `Cannot read properties of undefined (reading 'findMany')` on a new model | `pnpm db:generate`, then **restart the dev server**. A running process keeps the client it loaded, so a newly generated model is missing until it restarts. |
| API Studio 503 "tenant has no users" | `pnpm db:seed` |
| API Studio 401 in dev | `API_STUDIO_STRICT_AUTH` is `true`, or the dev cookie is `anonymous` |
| Types resolve in the editor but `pnpm typecheck` fails | Stale build info. `rm -rf packages/*/tsconfig.tsbuildinfo` then retry. |
| Port 3000 in use | `pnpm --filter @adysre/web dev -- -p 3001` |

**Never kill a dev server you did not start.** Another one may be serving the
browser session you are testing against.

---

## 8. Where things are

```
apps/web/src/
├── app/[locale]/(auth)/       login, register, forgot-password, reset-password
├── app/[locale]/(app)/        the authenticated dashboard
├── app/api/auth/*             the auth endpoints            (Phase 4)
├── app/api/api-studio/*       already guarded, waiting on a real cookie
├── lib/auth/                  hashing, tokens, cookies, guards
├── lib/api/response.ts        the response envelope helpers
└── middleware.ts              protected-route redirects     (Phase 5)

packages/
├── database/prisma/schema.prisma   the schema, and the seed
├── validators/src/auth.ts          Zod schemas shared by web and api
└── types/src/rbac.ts               AuthContext, Permission, SYSTEM_ROLES
```

Read the relevant `documents/*.md` spec before changing any of it. That is
Rule 0.
