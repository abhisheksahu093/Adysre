# Production Deployment

> Target: **Vercel** for `apps/web`, **Supabase** for PostgreSQL.
> Companion to [`documents/DEPLOYMENT.md`](../documents/DEPLOYMENT.md), which
> covers the Docker Compose path for `apps/api` and `apps/worker`.

---

## 1. What actually deploys

```
                          ┌───────────────────────────────────┐
   Browser ──── https ───►│  Vercel: apps/web                 │
                          │                                   │
                          │  Pages       /[locale]/*          │
                          │  Auth API    /api/auth/*          │◄── same origin,
                          │  Module APIs /api/api-studio/*    │    so the cookie
                          │              /api/tools/*         │    is simply sent
                          │              /api/website-intel/* │
                          └────────────────┬──────────────────┘
                                           │ Prisma over the pooled URL
                                           ▼
                          ┌───────────────────────────────────┐
                          │  Supabase Postgres                │
                          │  pooler :6543  runtime            │
                          │  direct :5432  migrations only    │
                          └───────────────────────────────────┘

   apps/api (NestJS), apps/worker (BullMQ): NOT on this path.
   Deploy separately only when background jobs are needed.
```

`vercel.json` at the repo root builds `apps/web` only. That is correct and
intentional: after Phase 4 nothing on the sign-in path needs the NestJS app.

---

## 2. Supabase

The project is already provisioned (`aws-1-ap-south-1`, ref
`opbqfrifcenkqkqkdjdm`). Confirm these before the first deploy:

1. **Connection strings.** Settings → Database → Connection string.
   - Pooled, port **6543**, transaction mode → `DATABASE_URL`, and it must end
     with `?pgbouncer=true&connection_limit=1`.
   - Direct, port **5432** → `DIRECT_URL`.
2. **`pgcrypto` is enabled.** The schema uses `gen_random_uuid()` as a column
   default. On Supabase this is available by default; verify rather than assume:
   ```sql
   SELECT gen_random_uuid();
   ```
   If it errors: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
3. **Point-in-time recovery.** Paid plans only. Auth data is the one thing you
   cannot reconstruct from anywhere else.
4. **Network restrictions off, or Vercel's ranges allowed.** Vercel functions do
   not have stable egress IPs on the standard plan.

### Applying migrations

Migrations run from your machine or from CI, never from a Vercel build. A build
runs in parallel across deployments and would race the advisory lock.

```bash
# packages/database/.env must hold the SUPABASE URLs for this
pnpm --filter @adysre/database exec prisma migrate deploy
pnpm --filter @adysre/database exec prisma migrate status   # expect "up to date"
```

`migrate deploy`, not `migrate dev`. `dev` can prompt, can reset the database,
and generates new migration files. `deploy` only applies what is committed.

**Order matters for the Phase 2 migration.** It is additive (two new tables,
four nullable or defaulted columns, one index), so apply it to production
*before* deploying the code that uses it. New code against an old schema is an
outage; old code against a new schema is fine.

### Seeding

```bash
pnpm --filter @adysre/database db:seed
```

Run once, and check what it creates first. If it seeds a demo tenant with a
known password, either remove that user or change the password immediately. A
seeded Owner with a documented password is a public account.

---

## 3. Vercel project

**Settings → General**

| Field | Value |
|---|---|
| Framework | Next.js |
| Root Directory | `apps/web` |
| Build Command | leave default (Vercel detects Turborepo) |
| Install Command | from `vercel.json`: `pnpm install --frozen-lockfile --prod=false` |
| Node version | 20.x |

`--prod=false` is required. Devdependencies include the TypeScript and Prisma
tooling the build needs, and omitting it fails the build in a way that reads as
a missing module.

**Prisma client generation.** `postinstall` must run `prisma generate`, or
Vercel's dependency cache serves a stale client that does not know your newest
models. Confirm `packages/database/package.json` has it.

### Environment variables

Settings → Environment Variables. Set for **Production** and **Preview**
separately. Variables are read at build time, so **changing one requires a
redeploy** to take effect.

| Variable | Production value | Secret |
|---|---|---|
| `NODE_ENV` | `production` (Vercel sets it) | no |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` | no |
| `DATABASE_URL` | Supabase pooled, `?pgbouncer=true&connection_limit=1` | **yes** |
| `DIRECT_URL` | Supabase direct, port 5432 | **yes** |
| `JWT_ACCESS_SECRET` | `openssl rand -base64 48` | **yes** |
| `JWT_REFRESH_SECRET` | a **different** `openssl rand -base64 48` | **yes** |
| `JWT_ACCESS_TTL` | `900` | no |
| `JWT_REFRESH_TTL` | `1209600` | no |
| `COOKIE_DOMAIN` | **leave unset** | no |
| `WEBSITE_INTEL_STRICT_AUTH` | `true` once Phase 5 ships | no |
| `API_STUDIO_STRICT_AUTH` | `true` (or unset; production ignores it) | no |
| `ANTHROPIC_API_KEY` | if AI features are on | **yes** |

Traps worth naming:

- **Preview and Production must use different secrets and different databases.**
  A preview deployment is a public URL. Sharing a database with production means
  any preview branch can read and write real customer data.
- **`NEXT_PUBLIC_API_URL` should be removed or emptied** once Phase 5 lands. If
  it still points at `localhost:4000`, the browser tries to reach the user's own
  machine, which is the current production bug.
- **`NEXT_PUBLIC_*` is inlined into the client bundle.** Never a secret.

---

## 4. Deploy order

Do not reorder these. Each step assumes the previous one.

```
1. Set every environment variable in Vercel (Production and Preview)
2. Apply migrations to Supabase        prisma migrate deploy
3. Verify                              prisma migrate status  →  up to date
4. Deploy                              git push, or vercel --prod
5. Smoke test                          section 5
6. Only then flip WEBSITE_INTEL_STRICT_AUTH=true and redeploy
```

Step 6 is last because it removes the anonymous fallback that currently keeps
Website Intelligence usable. Flipping it before sign-in verifiably works locks
everyone out of that module.

---

## 5. Smoke test

Against the real production URL, immediately after deploying.

```bash
BASE=https://your-domain.com
JAR=$(mktemp)

# 1. The app is up
curl -sI $BASE | head -1                     # 200

# 2. Register works, and sets cookies
curl -s -c $JAR -X POST $BASE/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"smoke@yourdomain.com","password":"SmokeTest1234","name":"Smoke",
       "organizationName":"Smoke Test","organizationSlug":"smoke-test-01"}' | jq

# 3. BOTH cookies present, both HttpOnly, both Secure
grep -E 'access_token|refresh_token' $JAR

# 4. The session resolves
curl -s -b $JAR $BASE/api/auth/me | jq '.data.user.email'

# 5. THE ORIGINAL BUG. Expect 200, not 401.
curl -s -o /dev/null -w '%{http_code}\n' -b $JAR $BASE/api/api-studio/workspaces

# 6. Unauthenticated is still refused
curl -s -o /dev/null -w '%{http_code}\n' $BASE/api/api-studio/workspaces   # 401

# 7. Rotation works
before=$(grep refresh_token $JAR | awk '{print $NF}')
curl -s -b $JAR -c $JAR -X POST $BASE/api/auth/refresh > /dev/null
[ "$before" != "$(grep refresh_token $JAR | awk '{print $NF}')" ] && echo "rotation OK"

# 8. Logout clears
curl -s -b $JAR -c $JAR -X POST $BASE/api/auth/logout > /dev/null
curl -s -o /dev/null -w '%{http_code}\n' -b $JAR $BASE/api/auth/me          # 401
```

**Steps 5 and 6 together are the acceptance criteria for the reported issue.**
Step 5 alone passing while step 6 also returns 200 would mean you fixed the 401
by removing the guard, which is worse than the bug.

Delete the smoke-test tenant afterwards.

---

## 6. Production checklist

**Secrets**
- [ ] `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are 48 random bytes, different from each other
- [ ] Neither matches any preview or staging value
- [ ] No `change-me` placeholder survives anywhere
- [ ] No secret sits behind a `NEXT_PUBLIC_` prefix

**Database**
- [ ] `DATABASE_URL` is pooled (6543) with `?pgbouncer=true&connection_limit=1`
- [ ] `DIRECT_URL` is direct (5432)
- [ ] `prisma migrate status` reports up to date
- [ ] Preview uses a separate database from Production
- [ ] Backups or PITR enabled
- [ ] The seeded demo account is removed or its password changed

**Auth**
- [ ] Both cookies are `HttpOnly` and `Secure` in the response headers
- [ ] `COOKIE_DOMAIN` is unset
- [ ] `NEXT_PUBLIC_API_URL` no longer points at localhost
- [ ] Refresh rotates the token
- [ ] Refresh-token reuse revokes the session family
- [ ] Logout clears both cookies and revokes the row
- [ ] Lockout triggers after 5 failed attempts and expires on its own

**Application**
- [ ] `pnpm build` and `pnpm typecheck` pass clean
- [ ] Unauthenticated requests to every `/api/*` module route return 401
- [ ] Cross-tenant access returns 404, not 403
- [ ] Security headers present (`HSTS`, `X-Frame-Options`, `nosniff`)
- [ ] `WEBSITE_INTEL_STRICT_AUTH=true`
- [ ] No dev fallback reachable (verify by requesting with a `adysre_api_studio_dev` cookie set and confirming it is ignored)

**Operations**
- [ ] An alert exists for `auth.refresh.reuse` audit rows
- [ ] Retention job scheduled for expired sessions, resets, verifications
- [ ] A rollback is one click in the Vercel dashboard, and you have confirmed the previous deployment is still listed

---

## 7. Rollback

Vercel keeps previous deployments. Promote the last good one from the
dashboard, or `vercel rollback`.

**Migrations do not roll back with the code**, and Prisma has no down
migrations. This is why the Phase 2 migration is additive only: the previous
deployment runs correctly against the new schema, so a code rollback is safe on
its own. Keep every auth migration additive for this reason. When a column truly
must go, do it in two deployments: stop writing it, deploy, then drop it in the
next migration.

---

## 8. Custom domain

Settings → Domains. Vercel provisions the certificate.

Both the app and its API are on this one origin, so there is no CORS
configuration to do, and no cross-site cookie policy to weaken. Serve the app on
the apex or on a single subdomain, and do not split pages and API across two
hosts. That split is what created the original 401.
