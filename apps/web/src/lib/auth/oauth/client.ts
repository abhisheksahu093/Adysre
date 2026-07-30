import 'server-only';
import type { OAuthProvider } from '@adysre/validators';
import { redirectUri, type OAuthProviderConfig } from './config';

/**
 * The half of the OAuth exchange that talks to the provider: spend the
 * authorization code, then read back a normalized profile.
 *
 * Every provider quirk is contained here (GitHub's separate emails call and its
 * mandatory User-Agent, Microsoft's Graph shape, Google's boolean-or-string
 * `email_verified`), so the route handlers and the account logic stay
 * provider-agnostic.
 *
 * `server-only` because these calls carry the client secret. The pure URL
 * building lives in `config.ts` without that marker, so it stays testable -
 * the same split `access-token.ts` makes for the same reason.
 */

/** A provider's user, normalized to the fields our accounts need. */
export interface OAuthProfile {
  provider: OAuthProvider;
  /** Stable id of the account at the provider. */
  providerAccountId: string;
  email: string;
  /** Whether the provider vouches that the email belongs to this user. */
  emailVerified: boolean;
  name: string;
}

/** Raised when a provider answers in a way we cannot proceed from. */
export class OAuthProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OAuthProviderError';
  }
}

/** Exchange the authorization code for the provider's access token. */
export async function exchangeCode(config: OAuthProviderConfig, code: string): Promise<string> {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri(config.provider),
  });

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    // GitHub returns form-encoded unless asked for JSON; the others always
    // return JSON. Asking for JSON everywhere keeps the parse uniform.
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: body.toString(),
    // Never cached: this is a one-time code being spent.
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new OAuthProviderError(`Token exchange failed for ${config.provider}`);
  }

  const json = (await response.json()) as { access_token?: string; error?: string };
  if (!json.access_token) {
    throw new OAuthProviderError(`No access token returned by ${config.provider}`);
  }
  return json.access_token;
}

/** Read the signed-in user's profile from the provider. */
export async function fetchProfile(
  config: OAuthProviderConfig,
  accessToken: string,
): Promise<OAuthProfile> {
  switch (config.provider) {
    case 'google':
      return fetchGoogle(config, accessToken);
    case 'microsoft':
      return fetchMicrosoft(config, accessToken);
    case 'github':
      return fetchGithub(config, accessToken);
  }
}

async function fetchGoogle(
  config: OAuthProviderConfig,
  token: string,
): Promise<OAuthProfile> {
  const data = await getJson<{
    sub: string;
    email?: string;
    email_verified?: boolean | string;
    name?: string;
  }>(config.userInfoUrl, token);

  return {
    provider: 'google',
    providerAccountId: data.sub,
    email: (data.email ?? '').toLowerCase(),
    // The OIDC claim can arrive as a boolean or the string "true".
    emailVerified: data.email_verified === true || data.email_verified === 'true',
    name: data.name ?? '',
  };
}

async function fetchMicrosoft(
  config: OAuthProviderConfig,
  token: string,
): Promise<OAuthProfile> {
  const data = await getJson<{
    id: string;
    mail?: string | null;
    userPrincipalName?: string;
    displayName?: string;
  }>(config.userInfoUrl, token);

  const email = (data.mail ?? data.userPrincipalName ?? '').toLowerCase();
  return {
    provider: 'microsoft',
    providerAccountId: data.id,
    email,
    // Entra ID accounts are directory-managed, so a returned address is owned
    // by the signed-in user.
    emailVerified: Boolean(email),
    name: data.displayName ?? '',
  };
}

async function fetchGithub(
  config: OAuthProviderConfig,
  token: string,
): Promise<OAuthProfile> {
  const user = await getJson<{ id: number; login: string; name?: string | null }>(
    config.userInfoUrl,
    token,
  );

  // GitHub keeps emails behind a second call; take the primary verified one,
  // and never an unverified address - anyone can add any address to a GitHub
  // account, so an unverified one proves nothing about who is signing in.
  let email = '';
  let emailVerified = false;
  if (config.emailsUrl) {
    const emails = await getJson<Array<{ email: string; primary: boolean; verified: boolean }>>(
      config.emailsUrl,
      token,
    );
    const chosen = emails.find((e) => e.primary && e.verified) ?? emails.find((e) => e.verified);
    if (chosen) {
      email = chosen.email.toLowerCase();
      emailVerified = chosen.verified;
    }
  }

  return {
    provider: 'github',
    providerAccountId: String(user.id),
    email,
    emailVerified,
    name: user.name ?? user.login,
  };
}

async function getJson<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      // GitHub rejects API calls without a User-Agent.
      'User-Agent': 'ADYSRE',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new OAuthProviderError(`Provider profile request failed (${response.status})`);
  }
  return (await response.json()) as T;
}
