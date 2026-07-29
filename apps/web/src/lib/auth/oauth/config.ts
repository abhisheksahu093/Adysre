import { OAUTH_PROVIDERS, type OAuthProvider } from '@adysre/validators';

/**
 * OAuth provider configuration, resolved entirely from the environment, so
 * enabling a provider is a matter of setting its client id and secret and never
 * a code change. A provider with no credentials is reported as unconfigured and
 * its button is disabled rather than offered and then failing.
 *
 * ## Why this lives in apps/web
 *
 * A working copy of this flow exists in `apps/api`. It cannot be the one users
 * hit: the deployment target builds `apps/web` only, so `apps/api` is a
 * different origin, and a session cookie set there would need `SameSite=None`
 * plus a hand-rolled CSRF scheme to be readable by the pages that consume it.
 * Authentication is same-origin here for exactly that reason (see
 * `docs/AUTHENTICATION_ARCHITECTURE.md`), and OAuth is part of authentication.
 *
 * The endpoints below are the providers' standard OAuth 2.0 / OIDC URLs. Each
 * `redirect_uri` is derived from the app's own public URL and must match,
 * character for character, the callback registered in the provider's console.
 */

export interface OAuthProviderConfig {
  provider: OAuthProvider;
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  /** GitHub only: emails are a separate call from the profile. */
  emailsUrl?: string;
  scope: string;
}

type Endpoints = Omit<OAuthProviderConfig, 'provider' | 'clientId' | 'clientSecret'>;

const ENDPOINTS: Record<OAuthProvider, Endpoints> = {
  google: {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    scope: 'openid email profile',
  },
  microsoft: {
    authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    scope: 'openid email profile User.Read',
  },
  github: {
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    emailsUrl: 'https://api.github.com/user/emails',
    scope: 'read:user user:email',
  },
};

const ENV_KEYS: Record<OAuthProvider, { id: string; secret: string }> = {
  google: { id: 'GOOGLE_CLIENT_ID', secret: 'GOOGLE_CLIENT_SECRET' },
  microsoft: { id: 'MICROSOFT_CLIENT_ID', secret: 'MICROSOFT_CLIENT_SECRET' },
  github: { id: 'GITHUB_CLIENT_ID', secret: 'GITHUB_CLIENT_SECRET' },
};

/** True only for a value that is a known provider id. */
export function isOAuthProvider(value: string): value is OAuthProvider {
  return (OAUTH_PROVIDERS as readonly string[]).includes(value);
}

/**
 * Public base URL of this app, with no trailing slash.
 *
 * Read at call time rather than frozen into a module constant, so a test or a
 * preview deployment can set it without a rebuild. Same reason the rest of
 * `lib/auth/config.ts` reads through functions.
 */
export function appUrl(): string {
  return (
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000'
  ).replace(/\/+$/, '');
}

/** The callback URL to register with the provider, and to send in the flow. */
export function redirectUri(provider: OAuthProvider): string {
  return `${appUrl()}/api/auth/oauth/${provider}/callback`;
}

/** Full config for a provider, or null when its credentials are not set. */
export function getProviderConfig(provider: OAuthProvider): OAuthProviderConfig | null {
  const keys = ENV_KEYS[provider];
  const clientId = process.env[keys.id];
  const clientSecret = process.env[keys.secret];
  if (!clientId || !clientSecret) return null;
  return { provider, clientId, clientSecret, ...ENDPOINTS[provider] };
}

/** The providers that currently have credentials configured, in display order. */
export function configuredProviders(): OAuthProvider[] {
  return OAUTH_PROVIDERS.filter((provider) => getProviderConfig(provider) !== null);
}

/**
 * Where to send the browser to grant access. `state` is the CSRF nonce.
 *
 * Pure string building, which is why it lives here and not in `client.ts`: that
 * module carries `server-only` because it sends the client secret over the
 * wire, and `server-only` throws outside a React server context, so anything
 * marked with it cannot be unit-tested. These parameters are exactly the ones
 * worth testing, since a wrong `redirect_uri` or a missing scope fails at the
 * provider with a message that names no field.
 *
 * The secret is deliberately absent from this URL. It is a top-level navigation
 * the user can read; the secret belongs only in the server-to-server exchange.
 */
export function buildAuthorizationUrl(config: OAuthProviderConfig, state: string): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri(config.provider),
    response_type: 'code',
    scope: config.scope,
    state,
  });

  // Google returns a refresh token only when explicitly asked, and otherwise
  // silently reuses the last account, which makes switching accounts look
  // broken. Harmless for the others, which ignore unknown params.
  if (config.provider === 'google') {
    params.set('access_type', 'offline');
    params.set('prompt', 'select_account');
  }
  if (config.provider === 'microsoft') {
    params.set('response_mode', 'query');
  }

  return `${config.authorizeUrl}?${params.toString()}`;
}
