import { OAUTH_PROVIDERS, type OAuthProvider } from '@adysre/validators';

/**
 * OAuth provider configuration - resolved entirely from the environment, so
 * enabling a provider is a matter of setting its client id and secret, never a
 * code change. A provider with no credentials is simply reported as
 * unconfigured and its buttons are disabled in the UI.
 *
 * The endpoints below are the providers' standard OAuth 2.0 / OIDC URLs. Each
 * `redirect_uri` is derived from `API_PUBLIC_URL` and must match, character for
 * character, the callback URL registered in that provider's console.
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

/** Public base URL of this API (no trailing slash), used to build redirect URIs. */
export function apiPublicUrl(): string {
  return (process.env.API_PUBLIC_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
}

/** Public base URL of the web app the browser returns to after OAuth. */
export function appUrl(): string {
  return (process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(
    /\/+$/,
    '',
  );
}

/** The callback URL to register with the provider, and to send in the flow. */
export function redirectUri(provider: OAuthProvider): string {
  return `${apiPublicUrl()}/api/v1/auth/oauth/${provider}/callback`;
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
  return OAUTH_PROVIDERS.filter((p) => getProviderConfig(p) !== null);
}
