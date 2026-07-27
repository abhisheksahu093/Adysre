# API Architecture

> Contract rules come from [`documents/API_STANDARDS.md`](../documents/API_STANDARDS.md).
> This document specifies the auth endpoints implemented as Next.js Route
> Handlers in `apps/web`, and the layering every handler follows.

---

## 1. Two API surfaces, one contract

| Surface | Base | Runtime | Purpose |
|---|---|---|---|
| Web route handlers | `/api/*` on the app origin | Vercel Node functions | Everything a browser calls: auth, API Studio, tools, website intelligence |
| NestJS | `/api/v1/*` on a separate host | long-running Node | Background work, bulk jobs. Not required to sign in. |

Both speak the same envelope, so an endpoint can move between them without the
client noticing. That is why `apps/web/src/lib/api/response.ts` reproduces the
NestJS response shape rather than inventing a lighter one.

**Note on versioning.** Browser endpoints are unversioned (`/api/auth/login`)
because the client is served from the same deployment and always matches.
`/api/v1` is versioned because third parties consume it and section 9 of
`CLAUDE.md` forbids breaking v1.

---

## 2. Response envelope

Success:

```jsonc
{ "success": true, "message": "OK", "data": { }, "meta": { "page": 1, "pageSize": 20, "total": 57 } }
```

Error:

```jsonc
{ "success": false, "code": "INVALID_CREDENTIALS", "message": "Email or password is incorrect." }
```

Never hand-roll these. `lib/api/response.ts` already exports the helpers:

```ts
ok(data, message?, meta?)         // 200
BAD_REQUEST(message)              // 400  VALIDATION_ERROR
UNAUTHENTICATED(message?)         // 401  UNAUTHENTICATED
FORBIDDEN(message?)               // 403  FORBIDDEN
NOT_FOUND(message?)               // 404  NOT_FOUND
CONFLICT(code, message)           // 409  caller-supplied code
UNAVAILABLE(message?)             // 503  PERSISTENCE_UNAVAILABLE
reportRouteError(scope, error)    // 503, logs the cause server-side
```

`code` is for machines and is stable. `message` is for a developer reading a
log and may change. A client that switches on `message` is broken by design.

**`reportRouteError` exists because of a specific failure mode.** A handler that
catches everything and returns a generic 503 tells the caller the right thing
and the operator nothing: the real cause (a constraint violation, a closed
connection) is discarded exactly when it is needed. It logs the cause and
returns the vague response.

Phase 4 adds auth codes to that file:

```ts
export const INVALID_CREDENTIALS = () =>
  fail('INVALID_CREDENTIALS', 'Email or password is incorrect.', 401);
export const ACCOUNT_LOCKED = (until: Date) =>
  fail('ACCOUNT_LOCKED', `Too many attempts. Try again after ${until.toISOString()}.`, 423);
export const RATE_LIMITED = (retryAfterSeconds: number) => /* 429 + Retry-After header */;
export const TENANT_AMBIGUOUS = (workspaces) => /* 409 + the list */;
```

---

## 3. Status codes, and the ones that get chosen wrong

| Code | Meaning here | Common mistake |
|---|---|---|
| 400 | Body failed Zod | Using it for wrong credentials. The body was well-formed; the credentials were wrong. That is 401. |
| 401 | No session, or one that failed verification | Using it for a permission failure. The caller is known, so it is 403. |
| 403 | Verified session, insufficient permission | Using it for cross-tenant access. Return 404: confirming a row exists in another tenant is an id-enumeration oracle. |
| 404 | Absent, or belongs to another tenant | Distinguishing the two, which leaks tenancy. |
| 409 | Slug taken, email registered, ambiguous tenant | Using 400. The request was valid, the state conflicts. |
| 423 | Account locked | Using 401, which invites the client to retry, which extends the lock. |
| 429 | Rate limited. Always carries `Retry-After`. | Omitting the header, which forces clients to guess and hammer. |
| 503 | Database unreachable | Returning 500 with a stack trace. |

**Registration returns 409 for an email already in the tenant, and this is a
deliberate accepted leak.** It confirms an address is registered. The
alternative, always answering 201 and sending a "someone tried to register with
your address" email, is stronger but demands working email delivery, which is
Phase 6. Recorded here so the trade is a decision and not an oversight. Note the
contrast with `/forgot-password`, which never leaks: there the safe answer costs
nothing.

---

## 4. The nine auth endpoints

### `POST /api/auth/register` <sub>public</sub>

```jsonc
// request
{ "email": "a@b.com", "password": "CorrectHorse12", "name": "Ada",
  "organizationName": "Acme", "organizationSlug": "acme" }
// 201
{ "success": true, "data": { "userId": "uuid", "tenantId": "uuid" } }
```
Sets both cookies. `409 SLUG_TAKEN` / `409 EMAIL_REGISTERED`.
Rate limit 5 per hour per IP.

### `POST /api/auth/login` <sub>public</sub>

```jsonc
{ "email": "a@b.com", "password": "...", "tenantSlug": "acme" }  // slug optional
// 200
{ "success": true, "data": { "userId": "uuid", "tenantId": "uuid", "requiresEmailVerification": false } }
```
`401 INVALID_CREDENTIALS`, `423 ACCOUNT_LOCKED`,
`409 TENANT_AMBIGUOUS` (with `data.workspaces`), `429`.
Rate limit 10 per 15 min per IP **and** per email, whichever trips first. Per-IP
alone misses a slow distributed attack on one account; per-email alone lets one
IP spray many accounts.

### `POST /api/auth/refresh` <sub>public, cookie-authenticated</sub>

No body. Reads the `refresh_token` cookie, rotates it, returns new cookies.
`401` on missing, expired, revoked, or reused. Reuse revokes every session for
that user.

### `POST /api/auth/logout` <sub>public, best effort</sub>

Revokes the current session row and clears both cookies.
**Always 200, even with no valid session.** A logout that can fail leaves users
stuck on a page they cannot leave, and there is nothing to protect: the outcome
is "you are signed out" either way.

### `POST /api/auth/forgot-password` <sub>public</sub>

```jsonc
{ "email": "a@b.com" }
// 200, ALWAYS
{ "success": true, "message": "If that address has an account, a reset link is on its way." }
```
Identical response and comparable timing whether or not the account exists.
This endpoint is a user-enumeration oracle if it answers honestly. Rate limit
3 per hour per email.

### `POST /api/auth/reset-password` <sub>public</sub>

```jsonc
{ "token": "<from the link>", "password": "NewPassword12", "confirmPassword": "NewPassword12" }
```
One transaction: mark the token used, set the new hash, clear the lockout,
**revoke every session for the user**. `400 INVALID_RESET_TOKEN` for missing,
expired, and already-used alike.

### `GET /api/auth/me` <sub>authenticated</sub>

```jsonc
{ "success": true, "data": {
  "user": { "id", "email", "name", "avatarUrl", "emailVerifiedAt" },
  "organization": { "id", "name", "slug" },
  "roles": ["Owner"],
  "permissions": ["api-studio:collection:read"]
} }
```
Reads from the **database**, not from the token claims. The token is up to 15
minutes stale, and a profile screen showing a name the user just changed is a
bug report. Authorization still uses the token; this is display data.

Replaces the `DEMO_USER` fallback in `apps/web/src/lib/session.ts`, which
currently returns a fake "Demo Owner" whenever the call fails.

### `PATCH /api/auth/profile` <sub>authenticated</sub>

`{ "name"?, "avatarUrl"? }`. Email changes are **not** handled here: they need
a verification round trip through `email_verifications`, which is Phase 6.
Accepting an email field and silently ignoring it would be worse than rejecting
it.

### `PATCH /api/auth/change-password` <sub>authenticated</sub>

```jsonc
{ "currentPassword": "...", "newPassword": "...", "confirmPassword": "..." }
```
Requires the current password even though the caller is authenticated, because
the threat is an unlocked laptop, not a forged token. On success: revoke all
**other** sessions, keep the current one, issue fresh cookies. Signing out the
device that just did the change is hostile; leaving the other five signed in
defeats the purpose.

---

## 5. Handler layering

Every handler is the same six steps in the same order.

```ts
// apps/web/src/app/api/auth/change-password/route.ts
export async function PATCH(request: Request) {
  // 1. Rate limit BEFORE any work. A limiter that runs after the DB read
  //    still lets an attacker exhaust the database.
  const limit = await rateLimit(request, 'change-password', { max: 5, windowSec: 900 });
  if (!limit.ok) return RATE_LIMITED(limit.retryAfter);

  // 2. Authenticate. Never trust a tenantId from the body.
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  // 3. Validate. safeParse, never parse: a throw here is a 500.
  const body = await readJson(request);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) return BAD_REQUEST(formatZodError(parsed.error));

  // 4. Delegate. No business logic in this file.
  try {
    await changePassword(auth.session, parsed.data);
  } catch (error) {
    if (error instanceof WrongPasswordError) return UNAUTHENTICATED('Current password is incorrect.');
    return reportRouteError('auth.change-password', error);
  }

  // 5. Cookies are the handler's job, never the service's. A service that
  //    imports next/headers cannot be unit tested.
  const cookies = await setAuthCookies(await issueTokens(auth.session));

  // 6. Envelope.
  return ok({ changed: true }, 'Password updated.');
}
```

**Rules that are not negotiable:**

- A route handler never calls `prisma.*`. Repositories do.
- A service never imports `next/headers`, `next/server`, or `NextResponse`.
  Services take plain arguments and return plain values, which is what makes
  them testable without a request.
- `safeParse`, never `parse`.
- Every query filters on `session.tenantId`.

### Runtime

```ts
export const runtime = 'nodejs';   // required: bcryptjs and Prisma are not Edge-compatible
export const dynamic = 'force-dynamic';  // reads cookies, must never be statically cached
```

`middleware.ts` is the exception. It runs on the Edge runtime, so it may only
use `jose` to verify a token. It must not import Prisma or bcryptjs, and it
must not be the only thing standing between a request and data. Middleware
redirects unauthenticated *page* navigations for UX. **Every API route still
authenticates on its own.** Treating middleware as the security boundary is a
well-known Next.js vulnerability class.

---

## 6. Rate limits

| Endpoint | Limit | Key |
|---|---|---|
| `/register` | 5 / hour | IP |
| `/login` | 10 / 15 min | IP and email |
| `/forgot-password` | 3 / hour | email |
| `/reset-password` | 10 / hour | IP |
| `/refresh` | 60 / 15 min | IP |
| `/change-password` | 5 / 15 min | user |
| other authenticated | 300 / min | user |

Counters live in the `rate_limits` table, shared across instances, so these
numbers are accurate rather than per-instance approximations. The increment is
one atomic statement; see `docs/SECURITY_GUIDELINES.md` section 6 for why that
matters and where a fixed window is still weak.

Expired windows are deleted by `POST /api/auth/cleanup`, which authenticates
with `AUTH_CLEANUP_SECRET` rather than a session because the caller is a
machine. An unset secret means nobody can run it.

---

## 7. Client integration

`apps/web/src/lib/api-client.ts` today points at
`NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'` and hardcodes
`headers: { 'x-tenant-slug': 'demo' }`. Both are production bugs. Phase 5
replaces it with a same-origin client:

```ts
export const authApi = createApiClient({
  baseUrl: '',                 // same origin, so the cookie is simply sent
  credentials: 'same-origin',
});
```

The tenant comes from the session, never from a header a browser can edit.

The client wrapper owns silent refresh: on 401, POST `/api/auth/refresh` once,
retry once, otherwise redirect to `/login?next=<path>`. Concurrent 401s must
share one in-flight refresh promise. Ten parallel refreshes present tokens the
first has already rotated away, and reuse detection signs the user out for
doing nothing wrong.

---

## 8. OpenAPI

Phase 6 emits `docs/openapi.json` from the Zod schemas via
`@asteasolutions/zod-to-openapi`, served at `/api/docs`. Generated from the
schemas the handlers actually validate with, so it cannot drift from the
implementation the way a hand-written spec does.
