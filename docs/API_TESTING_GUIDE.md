# API Testing Guide

> How to exercise the auth endpoints by hand, and the cases that must pass
> before Phase 4 is considered done.

---

## 1. Cookies make this different from normal API testing

Both tokens are `HttpOnly`. JavaScript cannot read them and neither can you, in
the browser console or anywhere else. Every tool below therefore needs a
**cookie jar**, and testing by pasting a bearer token will not work because
there is no bearer token.

This is the point. If you can copy your session out of the browser, so can an
XSS payload.

---

## 2. curl

```bash
BASE=http://localhost:3000          # or your production URL
JAR=/tmp/adysre.cookies
rm -f $JAR

# -c writes the jar, -b reads it. Most requests need both.
curl -s -c $JAR -b $JAR -X POST $BASE/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"dev@local.test","password":"LocalDev1234"}' | jq
```

Useful flags:

```bash
-i                      # show response headers, needed to inspect Set-Cookie
-o /dev/null -w '%{http_code}\n'    # status code only
-v 2>&1 | grep -i cookie            # what actually went over the wire
```

Read the jar directly to confirm flags:

```bash
cat $JAR
# #HttpOnly_localhost  FALSE  /  FALSE  1790000000  access_token  eyJ...
#  ^^^^^^^^^ this prefix is the HttpOnly flag. Its absence is a finding.
```

---

## 3. REST Client (VS Code)

Phase 4 ships `docs/http/auth.http`. The extension keeps cookies between
requests in a file automatically.

```http
@base = http://localhost:3000

### Register
POST {{base}}/api/auth/register
Content-Type: application/json

{
  "email": "dev@local.test",
  "password": "LocalDev1234",
  "name": "Dev User",
  "organizationName": "Local Dev",
  "organizationSlug": "local-dev"
}

### Me
GET {{base}}/api/auth/me

### The endpoint that was returning 401
GET {{base}}/api/api-studio/workspaces
```

---

## 4. Postman and Bruno

Both work, with one setting each.

**Postman:** Settings → General → **Automatically follow redirects: off**, and
confirm the cookie jar is enabled for your host (Cookies, under the Send
button). Postman stores `HttpOnly` cookies but will not show their values, which
is correct behaviour and not a bug.

**Bruno:** cookies are on by default. Preferred here because collections are
plain files that live in git alongside the code they test.

Do not import a collection that hardcodes a token. There is no token to
hardcode.

---

## 5. The test matrix

Every row must pass before Phase 4 is done. Rows marked **security** are the
ones where a wrong answer is a vulnerability rather than a bug.

### Register

| # | Case | Expected |
|---|---|---|
| 1 | Valid payload | 201, both cookies set, `data.userId` and `data.tenantId` present |
| 2 | Password `short1A` | 400 `VALIDATION_ERROR` |
| 3 | Password with no uppercase | 400 |
| 4 | Slug already taken | 409 `SLUG_TAKEN` |
| 5 | Email already in that tenant | 409 `EMAIL_REGISTERED` |
| 6 | Slug `Not A Slug` | 400 |
| 7 | Body is not JSON | 400, **not** 500 |
| 8 | 6 registrations from one IP in an hour | 429 with `Retry-After` |
| 9 | **security** Response contains no password or hash | grep the body |
| 10 | **security** A failed register leaves no partial Organization | check the table |

### Login

| # | Case | Expected |
|---|---|---|
| 11 | Correct credentials | 200, both cookies |
| 12 | Wrong password | 401 `INVALID_CREDENTIALS` |
| 13 | Unknown email | 401 `INVALID_CREDENTIALS`, **byte-identical to #12** |
| 14 | **security** Timing of #12 vs #13 | within ~50ms of each other |
| 15 | 5 wrong passwords, then the correct one | 423 `ACCOUNT_LOCKED` |
| 16 | Wait out the lock, then correct password | 200, `failed_login_attempts` back to 0 |
| 17 | Account with `is_active = false` | 401, and the reason is not disclosed |
| 18 | OAuth-only account (`password_hash` is null) | 401, **not** a 500 |
| 19 | Same email in two tenants, one password | 409 `TENANT_AMBIGUOUS` + `data.workspaces` |
| 20 | #19 retried with `tenantSlug` | 200, into the right tenant |
| 21 | An argon2-era account logs in | 200, and `password_hash` now starts with `$2` |

Timing check for #14:

```bash
for email in real@local.test nobody@nowhere.test; do
  echo -n "$email  "
  curl -s -o /dev/null -w '%{time_total}\n' -X POST $BASE/api/auth/login \
    -H 'content-type: application/json' \
    -d "{\"email\":\"$email\",\"password\":\"wrong-password\"}"
done
```

A large gap means the dummy-hash compare is missing and the endpoint is a user
enumeration oracle.

### Refresh and rotation

| # | Case | Expected |
|---|---|---|
| 22 | Valid refresh cookie | 200, and the cookie **value changes** |
| 23 | No refresh cookie | 401 |
| 24 | Garbage cookie value | 401 |
| 25 | **security** Replay a rotated token | 401, **and every session for that user is revoked** |
| 26 | Expired session row | 401, both cookies cleared |
| 27 | Refresh after the user's role changed | new access token carries the **new** role |
| 28 | 10 concurrent refreshes from one client | one succeeds, and the user is not signed out |

Test 25 is the important one:

```bash
cp $JAR $JAR.old                                        # capture the pre-rotation token
curl -s -b $JAR -c $JAR -X POST $BASE/api/auth/refresh > /dev/null   # rotate
curl -s -b $JAR.old -X POST $BASE/api/auth/refresh | jq             # replay the old one
# expect 401, an audit row auth.refresh.reuse, and:
curl -s -o /dev/null -w '%{http_code}\n' -b $JAR $BASE/api/auth/me   # 401, family revoked
```

Test 27 catches a specific bug: if refresh copies claims from the old token
instead of re-reading the database, a revoked permission survives for 14 days
rather than 15 minutes.

### Password reset

| # | Case | Expected |
|---|---|---|
| 29 | Existing email | 200 |
| 30 | Unknown email | 200, **byte-identical message to #29** |
| 31 | Valid token, valid password | 200 |
| 32 | **security** Sessions from before the reset | all 401 afterwards |
| 33 | Reuse the same reset token | 400 `INVALID_RESET_TOKEN` |
| 34 | Token older than 1 hour | 400 |
| 35 | `password` and `confirmPassword` differ | 400 |
| 36 | 4 requests for one email in an hour | 429 |
| 37 | **security** Reset clears `locked_until` | a locked account can sign in after reset |

### Me, profile, change password

| # | Case | Expected |
|---|---|---|
| 38 | `GET /me` authenticated | 200, user + organization + roles + permissions |
| 39 | `GET /me` with no cookie | 401 |
| 40 | `GET /me` after `PATCH /profile` | reflects the change **immediately**, not in 15 min |
| 41 | `PATCH /profile` with an `email` field | ignored or 400, never a silent email change |
| 42 | `PATCH /change-password`, correct current | 200 |
| 43 | Wrong current password | 401 |
| 44 | **security** After #42, other sessions | revoked |
| 45 | **security** After #42, the current session | still works, no re-login required |

### Tenant isolation, the highest-severity group

Create two tenants and sign into each with a separate jar.

| # | Case | Expected |
|---|---|---|
| 46 | Tenant A reads its own workspace | 200 |
| 47 | **security** Tenant A reads B's workspace by id | **404**, not 403, not 200 |
| 48 | **security** Tenant A updates B's row by id | 404, and B's row is unchanged |
| 49 | **security** Tenant A deletes B's row | 404, row intact |
| 50 | **security** `tenantId` in the body pointing at B | ignored entirely |

Test 50 is the one to run manually every time an endpoint is added:

```bash
curl -s -b $JAR_A -X POST $BASE/api/api-studio/workspaces \
  -H 'content-type: application/json' \
  -d '{"name":"Injected","tenantId":"<TENANT_B_UUID>"}' | jq
# the created row MUST carry tenant A's id
```

### Cookie flags

| # | Case | Expected |
|---|---|---|
| 51 | `Set-Cookie` on login | `HttpOnly` on both |
| 52 | In production | `Secure` on both |
| 53 | Both cookies | `SameSite=Lax` |
| 54 | Production `Set-Cookie` | no `Domain=` attribute |
| 55 | `document.cookie` in the console | neither token visible |

```bash
curl -si -X POST $BASE/api/auth/login -H 'content-type: application/json' \
  -d '{"email":"dev@local.test","password":"LocalDev1234"}' | grep -i set-cookie
```

---

## 6. Automated tests

```bash
pnpm test                              # everything
pnpm --filter @adysre/web test         # web only
```

Split by what needs a database:

**Unit, no database.** The pure functions, which is why they were written pure:
`verifyAccessToken`, `can`/`effectivePermissions`, `safeNext`, password policy,
`verifyPassword`'s argon2 branch detection.

**Integration, real database.** Route handlers against a test schema. Every row
in section 5 marked **security** must have an automated test. A manual matrix
gets skipped under deadline pressure; a failing test does not.

```ts
// the shape these tests take
it('returns 404 when a workspace belongs to another tenant', async () => {
  const { session: a } = await seedTenant('a');
  const { workspace: bWorkspace } = await seedTenant('b');
  const res = await GET(requestAs(a, `/api/api-studio/workspaces/${bWorkspace.id}`));
  expect(res.status).toBe(404);     // NOT 403: 403 confirms the row exists
});
```

---

## 7. The regression test for the reported bug

Keep this one. It is the acceptance criterion for the whole effort, and it has
two halves that must both hold.

```bash
BASE=https://your-domain.com
JAR=$(mktemp)

# Half 1: an authenticated caller gets through
curl -s -c $JAR -X POST $BASE/api/auth/login -H 'content-type: application/json' \
  -d '{"email":"you@yourdomain.com","password":"..."}' > /dev/null
curl -s -o /dev/null -w 'authenticated: %{http_code}\n' -b $JAR $BASE/api/api-studio/workspaces

# Half 2: an unauthenticated caller still does not
curl -s -o /dev/null -w 'anonymous:     %{http_code}\n' $BASE/api/api-studio/workspaces
```

```
authenticated: 200
anonymous:     401
```

Both lines, or the fix is not a fix. `200` on the second line means the guard
was removed rather than the credential supplied, which turns a login bug into a
data breach.
