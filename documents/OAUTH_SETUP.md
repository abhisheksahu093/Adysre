# OAuth Setup (Google, Microsoft, GitHub)

ADYSRE supports signing up and signing in with Google, Microsoft and GitHub.
This is a standard OAuth 2.0 Authorization Code flow handled entirely by the
API; the web app only kicks it off and shows the result.

Nothing is hardcoded: a provider turns on the moment its client id and secret
are present in the environment, and its button is automatically disabled
everywhere until then.

---

## 1. How the flow works

```
Browser ──▶ GET /api/v1/auth/oauth/:provider        (API sets a state cookie, redirects to provider)
Provider ─▶ consent screen ─▶ redirects back to:
Browser ──▶ GET /api/v1/auth/oauth/:provider/callback?code=…&state=…
                             │  API verifies state, exchanges code for a token,
                             │  reads the profile, finds-or-creates the account,
                             │  sets HTTP-only session cookies,
                             ▼
Browser ──▶ {APP_URL}/dashboard          (or {APP_URL}/login?error=… on failure)
```

**Account behaviour**

- If the provider returns a **verified email that already has an account**, that
  user is signed in (so "Sign in with Google" and an earlier email signup with
  the same address are the same account).
- Otherwise a **new organization** is created with this person as its **Owner**,
  mirroring email registration but with no password.

Linking to an existing account requires the provider to mark the email verified;
Google, Microsoft and GitHub all do (GitHub via the primary verified email).

---

## 2. Environment variables

Set these in your `.env` (see `.env.example`):

```bash
# Public base URL of the API, reachable by the browser. Used to build the
# callback URL. Must match what you register with each provider, exactly.
API_PUBLIC_URL=http://localhost:4000

# Where the browser lands after the flow (the web app).
APP_URL=http://localhost:3000

# Fill the pair for each provider you want to enable. Leave blank to disable.
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

The **callback (redirect) URL** for each provider is:

```
{API_PUBLIC_URL}/api/v1/auth/oauth/{provider}/callback
```

For local development that is:

| Provider  | Callback URL                                                     |
| --------- | --------------------------------------------------------------- |
| Google    | `http://localhost:4000/api/v1/auth/oauth/google/callback`       |
| Microsoft | `http://localhost:4000/api/v1/auth/oauth/microsoft/callback`    |
| GitHub    | `http://localhost:4000/api/v1/auth/oauth/github/callback`       |

Register the exact string, including scheme and path. In production, swap the
host for your real API domain (and use HTTPS).

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

1. Fill in at least one provider pair and restart the API.
2. `GET {API_PUBLIC_URL}/api/v1/auth/oauth/providers` should list the enabled
   providers; the web sign-in / sign-up buttons for the others stay disabled.
3. Open `/login` or `/register`, click the provider, complete consent, and you
   should land on `/dashboard` signed in.

## 7. Security notes

- Tokens are stored only in **HTTP-only cookies**; the browser never sees them.
- A one-time `state` value is double-submitted through an HTTP-only cookie to
  block CSRF on the callback.
- Provider and database errors are never shown to the browser; the callback
  redirects to `/login?error=<code>` and the UI maps the code to friendly copy.
- Client secrets live only in the server environment, never in the web bundle.
