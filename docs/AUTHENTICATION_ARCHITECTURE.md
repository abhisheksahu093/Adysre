# Authentication Architecture

> **Status:** authoritative for implementation. Complements
> [`documents/AUTHENTICATION_RBAC.md`](../documents/AUTHENTICATION_RBAC.md),
> which states the platform policy. This file states how that policy is built in
> `apps/web`.

---

## 1. Why authentication lives in `apps/web`

ADYSRE's constitution (`CLAUDE.md` section 7) describes a NestJS API at
`apps/api`. That app exists and its auth module works. It is **not on the
production request path**, and this document explains why the decision changed.

The deployment target is Vercel. `vercel.json` builds `apps/web` and nothing
else. When the login form posted to `NEXT_PUBLIC_API_URL`
(`http://localhost:4000/api/v1` by default), production had nothing listening,
so no session cookie was ever set. Every route handler that reads that cookie,
including all of `/api/api-studio/*`, answered 401. The 401 was not a bug in
those routes. It was the correct answer to a request that genuinely carried no
credential.

Deploying NestJS separately would fix the first problem and introduce a worse
one: a cookie set by `api.adysre.com` is not sent to `app.adysre.com` unless you
widen it to a shared parent domain and set `SameSite=None`. That combination
turns off the browser's built-in CSRF protection and forces you to reimplement
it with tokens. Same-origin is not a shortcut here. It is the stronger posture.

**Decision.** Authentication is served by Next.js Route Handlers under
`apps/web/src/app/api/auth/*`, same-origin with the pages that consume it.
`apps/api` is retained for background and long-running work and is not required
for a user to sign in.

**Layering still applies.** `documents/BACKEND_ARCHITECTURE.md` requires
Controller to Service to Repository to Database, and that only repositories
touch Prisma. Route handlers are the controllers. The rule is unchanged:

```
route.ts (controller)  →  lib/auth/service/*  →  lib/auth/repository/*  →  Prisma
   parse + validate         business rules         the only Prisma caller
   set cookies              no req/res knowledge
   shape the envelope
```

A route handler that calls `prisma.*` directly is a bug, not a shortcut.

---

## 2. The two tokens

Two tokens with different jobs. Confusing them is the source of most auth bugs.

|  | Access token | Refresh token |
|---|---|---|
| Format | JWT, HS256, signed | Opaque, 48 random bytes, base64url |
| Contains | `sub`, `tenantId`, `roles`, `permissions`, `exp` | nothing, it is a lookup key |
| Lifetime | 15 minutes (`JWT_ACCESS_TTL=900`) | 14 days (`JWT_REFRESH_TTL=1209600`) |
| Stored server-side | No | Yes, as SHA-256 in `sessions.refresh_token_hash` |
| Verified by | signature check, no database round trip | hash lookup against `sessions` |
| Revocable | No, only expiry | Yes, immediately |
| Cookie | `access_token` | `refresh_token` |

**Why the access token is not revocable.** That is the trade. A signature check
needs no database, so every request in every module decides authorization
locally and stays fast. The cost is a 15 minute window where a revoked user is
still accepted. Fifteen minutes is the deliberate ceiling on that window.

**Why the refresh token is opaque and hashed.** It is a bearer credential with a
14 day life. If the database leaks, SHA-256 hashes are useless to the attacker,
exactly as with passwords. It carries no claims because it makes no assertions:
it identifies a row, and the row is the truth.

**Why SHA-256 for refresh tokens but bcrypt for passwords.** A refresh token is
48 bytes of cryptographic randomness, so brute force is not a threat and a slow
hash would only add latency to every refresh. A password is low-entropy and
human-chosen, so the slow hash is the entire defense.

---

## 3. Flow diagrams

### 3.1 Registration

```
Browser                    Route Handler                 Postgres
   │                                                        │
   │ POST /api/auth/register                                │
   │ {email,password,name,organizationName,organizationSlug}│
   ├───────────────────────►│                               │
   │                        │ 1. Zod: registerSchema        │
   │                        │    (password >= 12 chars,     │
   │                        │     upper + lower + digit)    │
   │                        │                               │
   │                        │ 2. slug already taken? ───────►│
   │                        │◄─────────────── 409 CONFLICT  │
   │                        │                               │
   │                        │ 3. bcrypt.hash(password, 12)  │
   │                        │    ~250ms, intentionally slow │
   │                        │                               │
   │                        │ 4. ONE transaction: ─────────►│
   │                        │      Organization             │
   │                        │      User (tenant Owner)      │
   │                        │      Role + UserRole          │
   │                        │      EmailVerification        │
   │                        │      AuditLog auth.register   │
   │                        │◄──────────────── committed    │
   │                        │                               │
   │                        │ 5. issue access + refresh     │
   │                        │    INSERT sessions ──────────►│
   │◄───────────────────────┤                               │
   │  201 + Set-Cookie x2   │                               │
   │  {success,data:{userId,tenantId}}                      │
```

Step 4 is one transaction on purpose. A half-registered tenant (an Organization
with no Owner) is unrecoverable through the UI and has to be repaired by hand.

### 3.2 Login, and how the tenant is resolved

`users` is unique on `(tenant_id, email)`, not on `email`. The same address can
legitimately exist in two tenants, so email and password alone do not always
identify one account.

```
POST /api/auth/login {email, password}
        │
        ├─ count users with this email across all tenants
        │
        ├─ 0 matches ──► bcrypt.compare against a DUMMY hash, then 401
        │                (the dummy compare is not decoration: skipping it
        │                 returns in 2ms instead of 250ms and tells an
        │                 attacker the address is unregistered)
        │
        ├─ 1 match  ──► normal path
        │
        └─ 2+ matches ──► verify the password against each candidate.
                          Exactly one verifies  ──► log into that tenant.
                          Several verify (same password reused)
                             ──► 409 TENANT_AMBIGUOUS + the list of
                                 workspaces, client re-posts with
                                 {email, password, tenantSlug}.
```

Once a candidate is chosen:

```
   ├─ user.lockedUntil > now?      ──► 423 ACCOUNT_LOCKED
   ├─ user.isActive false?         ──► 401 (never say why)
   ├─ user.passwordHash is null?   ──► 401 OAUTH_ONLY_ACCOUNT
   ├─ bcrypt.compare fails         ──► failedLoginAttempts += 1
   │                                   5 strikes ⇒ lockedUntil = now + 15min
   │                                   audit auth.login.failed, then 401
   └─ verifies
         ├─ hash starts with "$argon2" ⇒ rehash with bcrypt, UPDATE user
         │  (transparent migration from apps/api, nobody resets a password)
         ├─ failedLoginAttempts = 0, lockedUntil = null
         ├─ load roles + permissions via UserRole → Role → RolePermission
         ├─ INSERT sessions (refresh hash, ip, user_agent, expires_at)
         ├─ audit auth.login.success
         └─ 200 + Set-Cookie access_token, refresh_token
```

### 3.3 Authenticated request, no database round trip

```
GET /api/api-studio/workspaces
   │ Cookie: access_token=eyJ...
   ▼
authorize(permission)                    [lib/api-studio/guard.ts, EXISTS]
   │
   ├─ getSession()                       [lib/api-studio/session.ts, EXISTS]
   │    └─ verifyAccessToken(token, JWT_ACCESS_SECRET)
   │         └─ jose.jwtVerify: signature + exp.  No DB. Sub-millisecond.
   │              └─ PlatformSession {userId, tenantId, roles, permissions}
   │
   ├─ null?          ──► 401 UNAUTHENTICATED
   ├─ can(session)?  ──► 403 FORBIDDEN if not
   └─ ok             ──► handler runs, EVERY query scoped by session.tenantId
```

This is the part that already works. It has been waiting for a cookie that
nothing was setting. Nothing in `guard.ts` or `session.ts` needs to change.

### 3.4 Refresh with rotation and reuse detection

```
POST /api/auth/refresh          (cookie refresh_token=<opaque>)
        │
        ├─ sha256(token) → SELECT * FROM sessions WHERE refresh_token_hash = $1
        │
        ├─ no row      ──► 401. Either forged or already rotated away.
        │
        ├─ revokedAt set ──► REUSE DETECTED.
        │                    A token that was already rotated is being replayed,
        │                    which means it was captured. Revoke EVERY session
        │                    for that user, audit auth.refresh.reuse, 401.
        │                    Better to sign someone out than to let a thief in.
        │
        ├─ expiresAt < now ──► 401, clear both cookies
        │
        └─ valid
             ├─ generate a NEW refresh token
             ├─ UPDATE this row: new hash, new expiry  (rotation)
             ├─ re-read roles + permissions from the DB, do NOT copy the
             │  old token's claims (this is where a revoked role takes effect)
             ├─ sign a NEW access token
             └─ 200 + Set-Cookie x2
```

Rotation means a stolen refresh token has value only until the legitimate client
refreshes once. After that, the thief's copy triggers reuse detection and burns
the whole session family.

### 3.5 Silent refresh in the browser

The client never inspects the token, because it cannot: the cookie is HTTP-only.
It reacts to a 401 instead.

```
fetch('/api/api-studio/...')  ──► 401
        │
        ├─ POST /api/auth/refresh
        │     ├─ 200 ──► retry the original request ONCE
        │     └─ 401 ──► clear client state, redirect to /login?next=<path>
        │
        └─ concurrent 401s share ONE in-flight refresh promise.
           Without that, ten parallel requests fire ten refreshes; nine of them
           present a token the first has already rotated away, and reuse
           detection signs the user out for doing nothing wrong.
```

The shared in-flight promise is not an optimization. It is required for
correctness once rotation and reuse detection are both on.

---

## 4. Cookies

Set by `lib/auth/cookies.ts`. One helper, so the two cookies can never drift.

```ts
{
  httpOnly: true,                                  // JS cannot read it, XSS cannot steal it
  secure:   process.env.NODE_ENV === 'production', // localhost is http, so not in dev
  sameSite: 'lax',                                 // CSRF defense; 'strict' breaks OAuth returns
  path:     '/',                                   // access_token is read by every module
  domain:   undefined,                             // host-only. See below.
  maxAge:   900 | 1209600,
}
```

**`domain` is deliberately unset in production.** The existing
`apps/api/.../auth-cookies.ts` reads `COOKIE_DOMAIN`, which was needed for a
cross-origin API. Same-origin does not need it, and omitting it produces a
host-only cookie that a sibling subdomain cannot read. Setting
`COOKIE_DOMAIN=.adysre.com` would widen the blast radius of any subdomain
takeover for no benefit.

**`sameSite: 'lax'` and not `'strict'`.** Strict withholds the cookie on every
cross-site navigation, including the return leg of an OAuth redirect and any
link from an email. Lax withholds it on cross-site POST, which is the CSRF case
that matters.

**`refresh_token` uses `path: '/'`, not `/api/auth/refresh`.** Narrowing the
path is tempting and it breaks logout, which must clear the cookie from a
different path. A cookie can only be cleared from a path that can see it.

---

## 5. Files this design creates

```
apps/web/src/
├── app/api/auth/
│   ├── register/route.ts          POST
│   ├── login/route.ts             POST
│   ├── logout/route.ts            POST
│   ├── refresh/route.ts           POST
│   ├── forgot-password/route.ts   POST
│   ├── reset-password/route.ts    POST
│   ├── me/route.ts                GET
│   ├── profile/route.ts           PATCH
│   └── change-password/route.ts   PATCH
├── lib/auth/
│   ├── access-token.ts     EXISTS. Pure verify. Unchanged.
│   ├── password.ts         bcryptjs + argon2 rehash-on-login
│   ├── tokens.ts           sign access, generate + hash refresh
│   ├── cookies.ts          set / clear, one place
│   ├── session.ts          server-side "who is this", for pages and handlers
│   ├── guard.ts            requireAuth / requirePermission for handlers
│   ├── rate-limit.ts       fixed-window limiter
│   ├── audit.ts            AuditLog writer
│   ├── service/
│   │   ├── register.service.ts
│   │   ├── login.service.ts
│   │   ├── password-reset.service.ts
│   │   └── profile.service.ts
│   └── repository/
│       ├── user.repository.ts     the only Prisma caller for users
│       ├── session.repository.ts
│       └── verification.repository.ts
└── middleware.ts           protected-route redirects (edge, no Prisma)
```

`packages/validators/src/auth.ts` gains `changePasswordSchema`,
`updateProfileSchema`, and a `tenantSlug` option on `loginSchema`.

---

## 6. What stays in `apps/api`

Untouched and still valid: the NestJS guards, the OAuth controller, the users
module. `apps/api` remains the home for work that does not fit a 60 second
serverless function (bulk imports, scheduled jobs, BullMQ consumers). It reads
the same `JWT_ACCESS_SECRET`, so a token minted by `apps/web` is accepted there
without any extra work.

**Invariant to preserve:** the token payload shape
(`{sub, tenantId, roles, permissions}`) is a contract between the two apps.
Changing it in one place breaks the other. It is defined once, in
`packages/types/src/rbac.ts` as `AuthContext`.

---

## 7. Open items, deliberately deferred

| Item | Phase |
|---|---|
| Email delivery (verification and reset links are logged in dev) | 6 |
| Rate limiting backed by Redis rather than per-instance memory | 6 |
| Passkeys / WebAuthn | roadmap |
| `Workspace` and `Membership` models (many users to many tenants) | after 6 |
| Rotating `JWT_ACCESS_SECRET` without signing everyone out | roadmap |
