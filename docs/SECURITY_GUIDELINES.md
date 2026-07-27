# Security Guidelines

> Binding for anything touching authentication, tenancy, or user data.
> Policy source: [`documents/AUTHENTICATION_RBAC.md`](../documents/AUTHENTICATION_RBAC.md).

---

## 1. Four rules that override convenience

1. **Deny by default.** Every failure path returns a denial. A `catch` that
   falls through to "allow" is the worst bug in this codebase, because it looks
   like resilience.
2. **The tenant comes from the verified token.** Never from a body, query
   string, header, or path. A `tenantId` a client can set is not a boundary.
3. **Never log a secret.** No password, token, reset link, or session cookie in
   a log line, an audit `metadata` blob, or an error message.
4. **Fail closed on misconfiguration.** A missing `JWT_ACCESS_SECRET` in
   production throws at startup. It never falls back to a default, because a
   known default is worse than an outage.

---

## 2. Passwords

**Algorithm: bcryptjs, cost factor 12.**

Why not argon2, which `apps/api` uses: it is a native module that compiles per
platform and is a recurring source of Vercel build failures. bcryptjs is pure
JavaScript and installs identically everywhere. Argon2 is the stronger
algorithm; a hash function that will not deploy protects nothing.

Cost 12 is roughly 250ms on Vercel's hardware. That is the point. Anything a
user waits 250ms for, an attacker also waits 250ms for, per guess.

**Migration from argon2 is transparent.** Existing hashes start with `$argon2`.
On a successful login against one, the plaintext is in hand for exactly that
moment, so it is rehashed with bcrypt and the row updated. Nobody resets a
password, and the old hashes disappear as users sign in.

```ts
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (hash.startsWith('$argon2')) return argon2.verify(hash, plain);
  return bcrypt.compare(plain, hash);
}
export function needsRehash(hash: string): boolean {
  return hash.startsWith('$argon2') || bcrypt.getRounds(hash) < 12;
}
```

**Policy** (already in `packages/validators/src/common.ts`): minimum 12
characters, one lower, one upper, one digit, maximum 128.

No special-character requirement and no forced rotation, both deliberate. NIST
SP 800-63B dropped composition rules and periodic expiry because they push
people toward `Password1!` and `Password2!`. Length is what matters.

The 128 character maximum is not cosmetic. bcrypt silently truncates at 72
bytes, and unbounded input is a cheap denial of service since every byte costs
CPU.

**Never** log a password, echo it in an error, or store it anywhere but
`users.password_hash`.

---

## 3. Tokens

Covered in `AUTHENTICATION_ARCHITECTURE.md` section 2. The security-relevant
invariants:

- Access token: 15 minutes. Not revocable, which is the accepted cost of
  stateless verification. Fifteen minutes is the ceiling on a revoked user's
  remaining access.
- Refresh token: opaque, 48 bytes from `crypto.randomBytes`. **Never
  `Math.random()`**, which is seeded predictably and is not a CSPRNG.
- Only SHA-256 hashes of refresh tokens are stored. A database leak yields
  nothing usable.
- Rotation on every refresh. Reuse of a rotated token revokes every session for
  that user.
- Reset and verification tokens are hashed the same way, single-use via
  `usedAt`, and time-bounded (1 hour, 24 hours).

**Secrets.** `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` must be at least 32
bytes of randomness, must differ from each other, and must differ per
environment.

```bash
openssl rand -base64 48
```

Reusing the staging secret in production means a staging token authenticates in
production. Validate at startup:

```ts
export function accessTokenSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret || secret.length < 32 || secret.startsWith('change-me')) {
    throw new Error('JWT_ACCESS_SECRET is missing, too short, or still the placeholder.');
  }
  return secret;
}
```

Throwing is correct. A platform that boots with no trust model is worse than
one that does not boot.

---

## 4. Cookies

```ts
httpOnly: true    // XSS cannot read it
secure:   NODE_ENV === 'production'
sameSite: 'lax'   // CSRF defense; 'strict' breaks OAuth returns and email links
path:     '/'
domain:   undefined   // host-only, NOT .adysre.com
```

**`httpOnly` is the single highest-value flag here.** Without it, one XSS
anywhere in the app is a full session theft. With it, an XSS can act as the user
while the page is open but cannot walk away with the credential.

**Why `domain` is unset.** A cookie scoped to `.adysre.com` is readable by every
subdomain, so one compromised or forgotten subdomain reads production sessions.
Host-only is the default for a reason. `COOKIE_DOMAIN` in `.env.example` exists
for the cross-origin NestJS setup and should stay empty for the web app.

---

## 5. CSRF

Same-origin plus `SameSite=Lax` is the primary defense: the browser will not
attach the cookie to a cross-site POST.

That is necessary and not quite sufficient. Add **origin verification** on every
state-changing handler:

```ts
export function verifyOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;   // same-origin GET/HEAD may omit it
  const allowed = [process.env.NEXT_PUBLIC_APP_URL, ...(process.env.ALLOWED_ORIGINS?.split(',') ?? [])]
    .filter(Boolean);
  return allowed.includes(origin);
}
```

Reject mismatches with 403 before doing any work.

On top of that, **double-submit tokens** guard the operations where a
successful forgery is unrecoverable. Currently `PATCH /api/auth/change-password`,
because a forged password change locks the real owner out of their account. Add
member removal and billing changes as those ship.

Not everywhere, deliberately: a token on every endpoint becomes ceremony that
gets copy-pasted without thought, and ceremony nobody understands is not
security. Three checks on the operations that matter beats one check nobody
maintains on all of them.

```
GET /api/auth/csrf   →  sets `adysre_csrf` (readable) and returns the token
PATCH /api/auth/...  →  echo it in `x-csrf-token`, compared in constant time
```

The cookie is **not** `HttpOnly`, and that is correct: the page's own
JavaScript has to read it to set the header. The token authorises nothing on
its own, it only proves the request came from a page on this origin. A
cross-site attacker can cause the cookie to be sent but cannot read it, so they
cannot produce the header. An XSS that could read it could make the request
directly anyway.

A missing token is a failure, never a skip. `verifyCsrf` returns false when
either side is absent, so the check cannot be opted out of by omitting it.

---

## 6. Rate limiting and lockout

Limits are tabulated in `docs/API_ARCHITECTURE.md` section 6.

**Lockout:** 5 consecutive failures locks for 15 minutes via
`users.locked_until`. The counter resets on success.

Locking is a denial-of-service vector against a known user: an attacker who
knows an address can keep it locked forever. Fifteen minutes with automatic
expiry keeps that at nuisance level while making online brute force
uneconomical. A permanent lock needing an admin would be the vulnerability.

`locked_until` is a timestamp and not a boolean specifically so no scheduled job
is needed to clear it. A cleanup job that fails silently locks users out
permanently.

**Counters live in Postgres** (`rate_limits`), so the numbers mean what they
say no matter how many instances are warm. The earlier in-memory version was
per-instance, which made the effective limit the stated number times the
instance count: a limit nobody could reason about, and one that loosened
silently as traffic grew.

The increment is a single `INSERT ... ON CONFLICT DO UPDATE`, and it has to be.
A read followed by a write lets concurrent callers all observe the same count
and all pass a limit they should have exhausted, which is exactly the traffic
shape an attacker produces and a normal user never does.

**The limiter fails open.** If the counter is unreachable the request proceeds,
because the endpoints it guards all need that same database to do anything and
will fail on their own terms. Failing closed would turn a database blip into a
blanket outage and make the limiter itself a way to take the platform down.
Account lockout, which is also database-backed, is the control that actually
stops password guessing.

**Known weakness of a fixed window:** a caller can spend a full window at the
end of one and again at the start of the next, briefly doubling the rate. A
sliding window needs per-request timestamps, which is a lot of storage for a
control whose job is to blunt automation rather than to meter precisely.

---

## 7. Enumeration and timing

Endpoints that take an email must not reveal whether it is registered.

| Endpoint | Behaviour |
|---|---|
| `/forgot-password` | Always 200, identical message. Comparable timing. |
| `/login` | Identical `INVALID_CREDENTIALS` for unknown address and wrong password. |
| `/register` | **Does** leak, via 409. Accepted trade, see `API_ARCHITECTURE.md` section 3. |

**Timing is part of the response.** A login for an unknown address that skips
bcrypt returns in ~2ms while a real one takes ~250ms, and that difference is
trivially measurable over a network. Always compare against a dummy hash:

```ts
const DUMMY_HASH = '$2a$12$' + 'x'.repeat(53);   // a real-shaped bcrypt hash

if (!user) {
  await bcrypt.compare(plain, DUMMY_HASH);   // burn the same ~250ms
  return INVALID_CREDENTIALS();
}
```

Never remove that line as an optimization. It is load-bearing.

---

## 8. Tenant isolation

Postgres does not enforce this. Every query does.

```ts
// WRONG. Reads across tenants. No test fails.
await prisma.apiCollection.findFirst({ where: { id } });

// RIGHT.
await prisma.apiCollection.findFirst({ where: { id, tenantId: session.tenantId, ...notDeleted } });
```

**A row in another tenant returns 404, never 403.** 403 confirms the row exists,
which lets an attacker map another tenant's ids by probing.

Checklist for every handler:

- [ ] `tenantId` comes from the verified session only
- [ ] Every read filters on `tenantId`
- [ ] Every write sets `tenantId` from the session
- [ ] Updates and deletes filter on `tenantId` in the `where`, not after the fetch
- [ ] Cross-tenant misses return 404
- [ ] Soft-deleted rows excluded via `notDeleted`

The update case is the one that gets missed:

```ts
// WRONG. Fetch-then-check is a race, and the update is unscoped.
const row = await repo.findById(id);
if (row.tenantId !== session.tenantId) return NOT_FOUND();
await prisma.apiCollection.update({ where: { id }, data });

// RIGHT. One statement, the database enforces it.
const { count } = await prisma.apiCollection.updateMany({
  where: { id, tenantId: session.tenantId, ...notDeleted }, data,
});
if (count === 0) return NOT_FOUND();
```

---

## 9. Authorization

Order is fixed: **authenticate, then tenant, then permission.** The tenant check
comes first because a permission check that runs before it can pass against the
wrong tenant's data. In this design the tenant *is* the session, so it cannot be
skipped.

Permissions are `module:resource:action` strings, typed as a template literal in
`packages/types/src/rbac.ts` so the compiler rejects `'admin'`. Never compare
role names in a handler:

```ts
if (session.roles.includes('Owner')) { }        // WRONG, hardcodes a role (Rule 6)
if (can(session, 'api-studio:collection:write')) { }   // RIGHT
```

---

## 10. Input handling

- Validate every body, query, and param with Zod. `safeParse`, never `parse`.
- Never interpolate into raw SQL. Prisma parameterizes; `$queryRawUnsafe` does
  not, and it should not appear in this repo.
- Cap array lengths and string sizes in schemas. An unbounded array is a memory
  exhaustion vector.
- Escape nothing by hand for HTML. React escapes by default;
  `dangerouslySetInnerHTML` needs a written justification.

**Redirect parameters are an open-redirect vector.** `?next=` after login must
be a same-origin relative path:

```ts
export function safeNext(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return APP_HOME;
  return next;
}
```

`//evil.com` is protocol-relative and a browser treats it as absolute. Checking
only the leading `/` is the bug.

---

## 11. Audit logging

Log every one of these to `audit_logs`:

```
auth.register            auth.login.success       auth.login.failed
auth.logout              auth.refresh.success     auth.refresh.reuse   ← investigate
auth.password.reset.requested   auth.password.reset.completed
auth.password.changed    auth.account.locked      auth.oauth.linked
```

Record `ip`, `userAgent`, and a `reason`. **Never** the password, token, or
link. `actorId` is null for pre-auth events, which is why the column is
nullable.

`auth.refresh.reuse` should page someone. It means a refresh token was replayed
after rotation, which means it was captured.

---

## 12. Response headers

Set in `next.config.ts` for all routes:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

`X-Frame-Options: DENY` prevents clickjacking, where the app is framed
invisibly over bait and a user clicks a real button unknowingly.

`Referrer-Policy` matters specifically for reset links: with a permissive
policy, a page loaded at `/reset-password?token=...` leaks the full URL,
including the token, in the `Referer` header of every outbound request it makes.

CSP is Phase 6. It needs per-route nonces to coexist with Next's inline
scripts, and a wrong CSP breaks the app in ways that are hard to diagnose.

---

## 13. Pre-merge checklist

Any PR touching auth, tenancy, or user data:

- [ ] No secret in any log or audit `metadata`
- [ ] Every DB call filters on `tenantId` from the session
- [ ] Cross-tenant miss returns 404, not 403
- [ ] Errors deny; no `catch` falls through to allow
- [ ] Zod `safeParse` on every input
- [ ] Rate limit on the endpoint, applied before any database work
- [ ] Privileged action writes an audit row
- [ ] New env vars documented in `.env.example` and `docs/ENVIRONMENT_SETUP.md`
- [ ] No new native dependency without confirming it builds on Vercel
- [ ] Timing-equal failure paths on anything that takes an email
