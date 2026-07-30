# OAuth Setup (Google, Microsoft, GitHub)

ADYSRE supports signing up and signing in with Google, Microsoft and GitHub.
This is a standard OAuth 2.0 Authorization Code flow, served by **`apps/web`**
as same-origin route handlers under `/api/auth/oauth/*`.

> **Moved.** This flow used to live in `apps/api` at
> `/api/v1/auth/oauth/*`. It could not stay there: the deployment target builds
> `apps/web` only, so `apps/api` is a different origin, and a session cookie set
> there would need `SameSite=None` plus a hand-rolled CSRF scheme to be readable
> by the pages that consume it. Sign-in is same-origin for that reason (see
> `docs/AUTHENTICATION_ARCHITECTURE.md`) and OAuth is part of sign-in.
> **If you registered the old callback URLs, update them in each provider's
> console** to the ones in section 2. The `apps/api` implementation is left in
> place but is no longer on the sign-in path.

Nothing is hardcoded: a provider turns on the moment its client id and secret
are present in the environment, and its button is disabled until then.

---

## 1. How the flow works

```
Browser ──▶ GET /api/auth/oauth/:provider    (sets an HTTP-only state cookie,
                                              redirects to the provider)
Provider ─▶ consent screen ─▶ redirects back to:
Browser ──▶ GET /api/auth/oauth/:provider/callback?code=…&state=…
                             │  verifies state, exchanges code for a token,
                             │  reads the profile, finds-or-creates the account,
                             │  sets HTTP-only session cookies,
                             ▼
Browser ──▶ {APP_URL}{next}              (or {APP_URL}/login?error=… on failure)
```

`next` is the path the user was heading for before being bounced to sign-in. It
is validated with `safeNext` on the way in and again on the way out, so it can
never become an open redirect. It defaults to the app home.

**Account behaviour: three ways in, tried in this order**

1. **A known provider account.** `oauth_accounts` is checked first, on the
   provider's own account id. This is what makes identity survive an email
   change: rename your Google address and you still land in your own workspace.
2. **A verified email that already has an account.** The link is created and the
   user signs in, so "Sign in with Google" and an earlier email signup with the
   same address become the same account.
3. **Neither.** A **new organization** is created with this person as its
   **Owner**, mirroring email registration but with no password, and with the
   email already marked verified because the provider just proved it.

**Verification gates step 2 only.** Creating a link on an email match is a claim
that two identities are the same person, and the only evidence is the address,
so an unverified one is refused (`oauth_unverified`). Without that, anyone able
to put a victim's address on a throwaway provider account would inherit that
victim's workspace. Once the link exists it stands on the provider's account id,
which cannot be spoofed by claiming an address, so step 1 needs no such check.
Google, Microsoft and GitHub all report verification (GitHub via the primary
verified email).

**An address in more than one workspace is refused** (`oauth_ambiguous`) when
there is no link yet: password sign-in answers that with a workspace picker, and
a provider redirect has nowhere to ask.

### The `oauth_accounts` table

One row per user per provider (`packages/database/prisma/schema.prisma`,
migration `20260729183000_oauth_account_linking`).

- `(provider, provider_account_id)` is unique **platform-wide**, not per tenant.
  At the callback there is a provider account and nothing else, so there is no
  tenant to scope by. It also enforces the rule that matters: one provider
  account belongs to exactly one user.
- `(user_id, provider)` is unique too, so re-linking overwrites rather than
  accumulating rows nobody can see. Someone who deletes their Google account and
  makes a new one keeps their workspace.
- `email` is stored for the audit trail and support, and is deliberately never
  used to find the row.
- There is **no `deleted_at`**, unlike the business tables and like `sessions`.
  Unlinking must free both unique pairs, and a soft-deleted row would keep
  occupying them: you would unlink Google and then be unable to link it again.

---

## 2. Environment variables

Set these in your `.env` (see `.env.example`):

```bash
# Public base URL of the WEB app. This builds the callback URL, so it must
# match what you register with each provider, exactly.
# Falls back to NEXT_PUBLIC_APP_URL, then to http://localhost:3000.
APP_URL=http://localhost:3000

# Fill the pair for each provider you want to enable. Leave blank to disable.
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Both halves of a pair are required. A provider with an id but no secret stays
disabled on purpose: it would work right up to the token exchange and then fail
with the user's consent already granted.

The **callback (redirect) URL** for each provider is:

```
{APP_URL}/api/auth/oauth/{provider}/callback
```

For local development that is:

| Provider  | Callback URL                                              |
| --------- | --------------------------------------------------------- |
| Google    | `http://localhost:3000/api/auth/oauth/google/callback`    |
| Microsoft | `http://localhost:3000/api/auth/oauth/microsoft/callback` |
| GitHub    | `http://localhost:3000/api/auth/oauth/github/callback`    |

Register the exact string, including scheme and path. A trailing slash is a
different URL and providers will reject it. In production, swap the host for
your real web domain (and use HTTPS).

---

## 3. Google

1. Google Cloud Console → **APIs & Services → Credentials**.
2. Configure the **OAuth consent screen** (External), add the `email`, `profile`
   and `openid` scopes.
3. **Create Credentials → OAuth client ID → Web application**.
4. Under **Authorized redirect URIs**, add the Google callback URL above.
5. Copy the client id and secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

Scopes requested: `openid email profile`.

## 4. Microsoft (Entra ID)

1. Azure Portal → **Microsoft Entra ID → App registrations → New registration**.
2. Supported account types: pick "Accounts in any organizational directory and
   personal Microsoft accounts" for the broadest reach.
3. **Redirect URI**: platform **Web**, value = the Microsoft callback URL above.
4. **Certificates & secrets → New client secret**; copy the secret **value**.
5. Copy the Application (client) ID and the secret into `MICROSOFT_CLIENT_ID` /
   `MICROSOFT_CLIENT_SECRET`.

Scopes requested: `openid email profile User.Read`.

## 5. GitHub

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. **Authorization callback URL** = the GitHub callback URL above.
3. Generate a client secret.
4. Copy the client id and secret into `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`.

Scopes requested: `read:user user:email` (the email scope is required so we can
read the primary verified address).

---

## 6. Verifying

1. Fill in at least one provider pair and restart the **web** dev server, so it
   picks up the new environment.
2. `GET {APP_URL}/api/auth/oauth/providers` should list the enabled providers:
   ```bash
   curl -s http://localhost:3000/api/auth/oauth/providers
   # {"success":true,"message":"OK","data":{"providers":["google"]}}
   ```
   Buttons for providers not in that list stay disabled.
3. Open `/login` or `/register`, click the provider, complete consent, and you
   should land signed in on the app home (or on `?next=` if you arrived from a
   protected page).

If a provider rejects the redirect, the registered callback almost always
differs from `{APP_URL}/api/auth/oauth/{provider}/callback` by a scheme, a port
or a trailing slash.

## 7. Security notes

- Tokens are stored only in **HTTP-only cookies**; the browser never sees them.
- A one-time `state` nonce is double-submitted through an HTTP-only cookie and
  compared in constant time, which is what makes the callback trustworthy: it
  stops an attacker who can trigger the callback in a victim's browser from
  signing that victim into the attacker's account. The cookie is read and
  cleared before any other decision, so a nonce cannot be replayed, and it
  expires after ten minutes.
- The callback runs **no** `verifyOrigin` check, deliberately: it arrives as a
  top-level navigation from the provider, so the Origin header is absent or
  cross-site. The nonce does that job here.
- Provider and database errors are never shown to the browser; the callback
  redirects to `/login?error=<code>` and the UI maps the code to friendly copy.
  Unknown codes render nothing, so a hand-edited URL cannot put arbitrary text
  on the sign-in page.
- `next` is validated with `safeNext` on the way in and again on the way out, so
  the flow cannot be turned into an open redirect.
- Client secrets live only in the server environment, never in the web bundle:
  `lib/auth/oauth/client.ts` carries `server-only`, and the authorization URL
  the browser sees contains the client **id** only.
- The start leg is rate limited per IP, so it cannot be used as an open redirect
  generator pointed at a provider.
