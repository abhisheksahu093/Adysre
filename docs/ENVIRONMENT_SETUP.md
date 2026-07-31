# Environment Setup

> Every variable the platform reads, what breaks without it, and how to generate
> the ones that must be secret.

---

## 1. Where variables live

| File | Committed | Read by | Purpose |
|---|---|---|---|
| `.env.example` | yes | nobody | The documented template. Update it whenever you add a variable. |
| `apps/web/.env.local` | **no** | **the Next.js app** | **Everything the web app reads at runtime.** |
| `packages/database/.env` | **no** | Prisma CLI | `db:migrate`, `db:seed`, `db:studio`. |
| `.env` | **no** | `apps/api`, scripts | The NestJS app and one-off Node scripts. |
| Vercel project settings | n/a | production | Production and preview. |

> ### ⚠️ Precedence, and why an env change can appear to do nothing
>
> Next.js only reads env files from the app's own directory, so `apps/web`
> reads `apps/web/.env.local` and not the monorepo root `.env`. This repo works
> around that with `loadRootEnv()` in `apps/web/next.config.mjs`, which copies
> the root `.env` into `process.env` **filling only keys nothing has already
> set**. So the effective order is:
>
> ```
> real process env  >  apps/web/.env.local  >  root .env (via the shim)
> ```
>
> Two consequences that cost real debugging time:
>
> **1. The shim runs once, when the process starts.** Editing either file while
> a dev server is running does not reach the running process. Worse, the Prisma
> client is cached on `globalThis` (deliberately, so hot reload does not exhaust
> the connection pool), so it keeps the connection string it was built with even
> after env reloads. A repointed database therefore produces this, while the
> Prisma CLI works perfectly against the new one:
>
> ```
> PrismaClientInitializationError: Authentication failed against database
> server at `localhost`, the provided credentials for `unlink` are not valid.
> ```
>
> **Restart the server after any env change.** Not a reload, a restart, and
> check `ps -eo pid,etime,command | grep next-server` shows seconds of uptime:
> stopping a dev server sometimes leaves the `next-server` child alive.
>
> **2. A stale root `.env` silently wins where `.env.local` is missing a key.**
> Because the shim only fills gaps, a variable present in both is taken from
> `.env.local`, but one present *only* in the root `.env` is still applied. Put
> everything the web app needs in `apps/web/.env.local`, including
> `DATABASE_URL` and `DIRECT_URL`, so the values are explicit rather than
> inherited.

**The duplicated database file is a real trip hazard.** The Prisma CLI resolves
`.env` relative to the schema, so `packages/database/.env` must carry
`DATABASE_URL` and `DIRECT_URL` even though the root `.env` already has them.
If `pnpm db:migrate` reports a different database than your app is using, this
is why.

> ### ⚠️ This repo is currently in exactly that state
>
> As of this writing the two files disagree:
>
> | File | Points at |
> |---|---|
> | `.env` | `localhost:5432/adysre` (Supabase lines commented out) |
> | `packages/database/.env` | Supabase `aws-1-ap-south-1`, project `opbqfrifcenkqkqkdjdm` |
>
> So `pnpm dev` reads your **local** database while `pnpm db:migrate` and
> `pnpm db:seed` write to **Supabase**. A migration appears to succeed and the
> running app never sees the new tables, which reads as "Prisma is broken" and
> is not.
>
> Pick one per environment and keep both files in agreement:
>
> - **Develop against local Postgres** (recommended, and faster): comment the
>   Supabase lines out of `packages/database/.env` and uncomment the local ones,
>   so both files say `localhost:5432`.
> - **Develop against Supabase:** uncomment the Supabase lines in `.env` and
>   comment out the local ones.
>
> Either way, run `pnpm --filter @adysre/database exec prisma migrate status`
> afterwards and confirm it names the database you expect.

---

## 2. Required variables

### Application

| Variable | Example | Notes |
|---|---|---|
| `NODE_ENV` | `development` | Set to `production` by Vercel. Controls the `secure` cookie flag and disables all dev auth fallbacks. |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Origin used to build reset and verification links, to verify request origins, and to build every canonical, hreflang, Open Graph URL and sitemap entry. Must be the real public URL in production, **`www` included** — a canonical that redirects is worse than none. See [SEO.md](./SEO.md). |

`NEXT_PUBLIC_*` is inlined into the client bundle at build time. **Never put a
secret behind that prefix.** It is not a config prefix, it is a publication
instruction.

### Database

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Pooled. Runtime. Every query the app makes. |
| `DIRECT_URL` | Direct. `prisma migrate` and `prisma db push` only. |

Two URLs, and both are required, for a reason that only shows up under load.

`DATABASE_URL` goes through a pooler because serverless scales to many
short-lived instances, each of which would otherwise open its own connection and
exhaust the server limit. That failure appears as `too many connections` in
production and never locally.

`DIRECT_URL` bypasses the pooler because migrations take advisory locks and run
DDL, and a transaction-mode pooler can hand consecutive statements to different
backends, which breaks both. A migration through a pooler either hangs on the
lock or half-applies.

**Supabase values** (Settings, Database, Connection string):

```bash
# Pooled, port 6543, transaction mode
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct, port 5432
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"
```

`?pgbouncer=true` tells Prisma to disable prepared statements, which
transaction-mode pooling cannot support. Omit it and you get sporadic
`prepared statement "s0" already exists` errors under concurrency, which are
maddening to diagnose because they depend on which backend you land on.

`connection_limit=1` is correct for serverless: one connection per function
instance, released when the instance freezes. Raising it multiplies pooler
connections by instance count.

If the password contains `@ : / ?` or `#`, URL-encode it. An unencoded `@`
splits the URL at the wrong place and produces a confusing host error.

### Authentication

| Variable | Default | Notes |
|---|---|---|
| `JWT_ACCESS_SECRET` | none | **Required.** Signs access tokens. Verified by `apps/web` and `apps/api`, so both need the same value. |
| `JWT_REFRESH_SECRET` | none | **Required.** Must differ from the access secret. |
| `JWT_ACCESS_TTL` | `900` | Seconds. 15 minutes. |
| `JWT_REFRESH_TTL` | `1209600` | Seconds. 14 days. |
| `COOKIE_DOMAIN` | empty | **Leave empty** for the web app. Host-only cookies are the safer default. See `SECURITY_GUIDELINES.md` section 4. |
| `BCRYPT_COST` | `12` | Lower to `10` only for faster local test runs. Never in production. |

Generate secrets with real entropy, one per environment:

```bash
openssl rand -base64 48
```

Never reuse a staging secret in production: a staging token would then
authenticate in production. `change-me-access-secret` from `.env.example` is
rejected at startup by design.

**Rotating `JWT_ACCESS_SECRET` invalidates every access token immediately.**
Users stay signed in because refresh tokens are opaque and database-backed, so
clients recover on their next refresh. Rotating `JWT_REFRESH_SECRET` is
harmless: refresh tokens are random bytes and are not signed with it.

### OAuth (optional)

`GOOGLE_CLIENT_ID` / `_SECRET`, `MICROSOFT_*`, `GITHUB_*`. Leaving a pair blank
disables that provider and its button auto-disables. Setup steps are in
[`documents/OAUTH_SETUP.md`](../documents/OAUTH_SETUP.md).

### Development escape hatches

| Variable | Effect |
|---|---|
| `API_STUDIO_STRICT_AUTH` | `true` disables the dev session fallback, so local behaves like production. |
| `WEBSITE_INTEL_STRICT_AUTH` | Same, for Website Intelligence. **Set this to `true` once real sign-in ships.** |

Both are ignored when `NODE_ENV=production`. The fallbacks cannot be enabled in
production even by setting a variable, which is the point.

---

## 3. Local setup

```bash
cp .env.example .env                        # apps/api and scripts
cp .env.example packages/database/.env      # Prisma CLI

# The web app. This is the file that actually matters for auth.
cat >> apps/web/.env.local <<EOF
JWT_ACCESS_SECRET=$(openssl rand -base64 48)
JWT_REFRESH_SECRET=$(openssl rand -base64 48)
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=<same as packages/database/.env>
DIRECT_URL=<same as packages/database/.env>
EOF
```

Real secrets even locally: it keeps development and production behaviour
identical, and the placeholders are rejected at runtime by design.

Point both database URLs at your local Postgres (see
`docs/LOCAL_DEVELOPMENT.md`), then:

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

---

## 4. Verifying configuration

```bash
# Does Prisma reach the database it thinks it does?
pnpm --filter @adysre/database exec prisma migrate status

# Are the secrets real, distinct, and long enough?
node -e '
  const a = process.env.JWT_ACCESS_SECRET, r = process.env.JWT_REFRESH_SECRET;
  const bad = [];
  if (!a || a.length < 32) bad.push("JWT_ACCESS_SECRET missing or under 32 chars");
  if (!r || r.length < 32) bad.push("JWT_REFRESH_SECRET missing or under 32 chars");
  if (a && r && a === r)   bad.push("access and refresh secrets are identical");
  if (a?.startsWith("change-me")) bad.push("JWT_ACCESS_SECRET is still the placeholder");
  console.log(bad.length ? "FAIL\n" + bad.join("\n") : "OK");
' 
```

Phase 4 replaces that snippet with `lib/env.ts`, a Zod schema parsed once at
module load so a misconfigured deployment fails fast and loudly instead of
serving broken auth.

---

## 5. Symptom to cause

| Symptom | Cause |
|---|---|
| `too many connections` in production only | `DATABASE_URL` is the direct URL, not the pooled one |
| `prepared statement "s0" already exists` | `?pgbouncer=true` missing from `DATABASE_URL` |
| Migration hangs, then times out | `DIRECT_URL` points at the pooler (port 6543 instead of 5432) |
| Login works, next request is 401 | `JWT_ACCESS_SECRET` differs between the process that signed and the one that verified |
| Cookie never set in production | `NEXT_PUBLIC_APP_URL` is http, or the site is not on https, so `secure: true` drops it |
| Cookie set but never sent back | `COOKIE_DOMAIN` set to a domain that does not match the site |
| `pnpm db:migrate` targets the wrong database | `packages/database/.env` is stale or missing |
| Auth works locally, 401 on Vercel | Env vars set for Preview but not Production, or set after the last build |
| CLI reaches the database, the app does not | The secret or URL is in the root `.env` instead of `apps/web/.env.local` |
| Edited an env file, nothing changed | The dev server caches the Prisma client on `globalThis`; restart the process |
| `credentials for <user> are not valid` at `localhost` | A running server is holding a connection string from before the URL changed |
