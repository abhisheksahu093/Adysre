import { BadGatewayException, Injectable } from '@nestjs/common';
import type { OAuthProvider } from '@adysre/validators';
import { redirectUri, type OAuthProviderConfig } from './oauth.config.js';

/** A provider's user, normalized to the fields our accounts need. */
export interface OAuthProfile {
  provider: OAuthProvider;
  /** Stable id of the account at the provider. */
  providerAccountId: string;
  email: string;
  /** Whether the provider vouches the email belongs to this user. */
  emailVerified: boolean;
  name: string;
}

/**
 * Drives the OAuth 2.0 Authorization Code exchange with each provider: builds
 * the authorization URL, swaps the returned code for an access token, and reads
 * back a normalized profile. All provider-specific quirks (GitHub's separate
 * emails call, Microsoft's Graph shape) are contained here so the controller
 * and the account logic stay provider-agnostic.
 */
@Injectable()
export class OAuthService {
  /** Where to send the browser to grant access. `state` is the CSRF nonce. */
  buildAuthorizationUrl(config: OAuthProviderConfig, state: string): string {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri(config.provider),
      response_type: 'code',
      scope: config.scope,
      state,
    });
    // Google returns a refresh token only when explicitly asked; harmless for
    // the others, which ignore unknown params.
    if (config.provider === 'google') {
      params.set('access_type', 'offline');
      params.set('prompt', 'select_account');
    }
    if (config.provider === 'microsoft') {
      params.set('response_mode', 'query');
    }
    return `${config.authorizeUrl}?${params.toString()}`;
  }

  /** Exchange the authorization code for the provider's access token. */
  async exchangeCode(config: OAuthProviderConfig, code: string): Promise<string> {
    const body = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri(config.provider),
    });

    const res = await fetch(config.tokenUrl, {
      method: 'POST',
      // GitHub returns form-encoded unless asked for JSON; the others always
      // return JSON. Asking for JSON everywhere keeps the parse uniform.
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: body.toString(),
    });

    if (!res.ok) {
      throw new BadGatewayException(`Token exchange failed for ${config.provider}`);
    }
    const json = (await res.json()) as { access_token?: string; error?: string };
    if (!json.access_token) {
      throw new BadGatewayException(`No access token returned by ${config.provider}`);
    }
    return json.access_token;
  }

  /** Read the signed-in user's profile from the provider. */
  async fetchProfile(config: OAuthProviderConfig, accessToken: string): Promise<OAuthProfile> {
    switch (config.provider) {
      case 'google':
        return this.fetchGoogle(config, accessToken);
      case 'microsoft':
        return this.fetchMicrosoft(config, accessToken);
      case 'github':
        return this.fetchGithub(config, accessToken);
    }
  }

  private async fetchGoogle(config: OAuthProviderConfig, token: string): Promise<OAuthProfile> {
    const data = await this.getJson<{
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

  private async fetchMicrosoft(config: OAuthProviderConfig, token: string): Promise<OAuthProfile> {
    const data = await this.getJson<{
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

  private async fetchGithub(config: OAuthProviderConfig, token: string): Promise<OAuthProfile> {
    const user = await this.getJson<{ id: number; login: string; name?: string | null }>(
      config.userInfoUrl,
      token,
    );

    // GitHub keeps emails behind a second call; pick the primary verified one.
    let email = '';
    let emailVerified = false;
    if (config.emailsUrl) {
      const emails = await this.getJson<
        Array<{ email: string; primary: boolean; verified: boolean }>
      >(config.emailsUrl, token);
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

  private async getJson<T>(url: string, token: string): Promise<T> {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        // GitHub rejects API calls without a User-Agent.
        'User-Agent': 'ADYSRE',
      },
    });
    if (!res.ok) {
      throw new BadGatewayException(`Provider profile request failed (${res.status})`);
    }
    return (await res.json()) as T;
  }
}
