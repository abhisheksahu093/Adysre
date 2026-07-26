import type { ExecutionRequest, ExecutionResult, WireAuth } from '@/modules/api-studio/types';
import { createId } from '@/modules/api-studio/utils/ids';

/**
 * OAuth 2 token acquisition.
 *
 * Only the grants that a server can complete on its own: client credentials,
 * resource-owner password, and refreshing. Authorization code needs a human at
 * a browser being redirected to a consent screen, which is a flow with a UI and
 * a callback route, not a function call - so it is refused by name rather than
 * half-implemented.
 *
 * The token request goes out through the CALLER'S sender, which in production
 * is the runner itself. That is deliberate: the token endpoint is a URL a user
 * supplied, so it must pass the same host policy, timeout and size caps as any
 * other request. An OAuth flow that bypassed the SSRF check would be a hole
 * shaped exactly like the one the policy exists to close.
 */

export type TokenSender = (request: ExecutionRequest) => Promise<ExecutionResult>;

export type OAuth2Config = Extract<WireAuth, { type: 'oauth2' }>;

export type TokenResult =
  | { ok: true; accessToken: string; tokenType: string }
  | { ok: false; reason: string };

/** Grants a server can complete without a browser. */
const SERVER_GRANTS = new Set(['client_credentials', 'password', 'refresh_token']);

export function canFetchToken(config: OAuth2Config): boolean {
  // An access token already in hand needs no grant at all.
  return config.accessToken.trim() !== '' || SERVER_GRANTS.has(config.grantType);
}

/**
 * Obtain an access token.
 *
 * @param settings - transport settings inherited from the request being
 * authenticated, so a token fetch cannot outlive its own request's timeout.
 */
export async function fetchToken(
  config: OAuth2Config,
  send: TokenSender,
  context: { workspaceId: string; settings: ExecutionRequest['settings'] },
): Promise<TokenResult> {
  if (config.accessToken.trim() !== '') {
    return { ok: true, accessToken: config.accessToken.trim(), tokenType: config.headerPrefix || 'Bearer' };
  }

  if (!SERVER_GRANTS.has(config.grantType)) {
    return {
      ok: false,
      reason: `The ${config.grantType} grant needs a browser redirect and is not available here.`,
    };
  }

  if (config.accessTokenUrl.trim() === '') {
    return { ok: false, reason: 'No token URL was set.' };
  }

  const form = new URLSearchParams({ grant_type: config.grantType });
  if (config.scope) form.set('scope', config.scope);
  if (config.audience) form.set('audience', config.audience);
  if (config.grantType === 'password') {
    form.set('username', config.username);
    form.set('password', config.password);
  }
  if (config.grantType === 'refresh_token') form.set('refresh_token', config.refreshToken);

  const headers = [
    { name: 'Content-Type', value: 'application/x-www-form-urlencoded' },
    { name: 'Accept', value: 'application/json' },
  ];

  // Client authentication goes in the header or the body, per the server's
  // expectation. RFC 6749 prefers the header; plenty of servers only read body.
  if (config.clientAuthentication === 'basic') {
    const basic = Buffer.from(`${config.clientId}:${config.clientSecret}`, 'utf8').toString('base64');
    headers.push({ name: 'Authorization', value: `Basic ${basic}` });
  } else {
    form.set('client_id', config.clientId);
    if (config.clientSecret) form.set('client_secret', config.clientSecret);
  }

  const result = await send({
    id: createId(),
    workspaceId: context.workspaceId,
    requestNodeId: null,
    agent: 'server',
    method: 'POST',
    url: config.accessTokenUrl,
    headers,
    body: { encoding: 'text', content: form.toString() },
    // A token endpoint must not be followed to another host: a redirect there
    // would hand the client secret to whoever the redirect names.
    settings: { ...context.settings, followRedirects: false, storeCookies: false },
  });

  if (!result.ok) return { ok: false, reason: result.error.message };
  if (result.response.status >= 400) {
    return { ok: false, reason: `The token endpoint answered ${result.response.status}.` };
  }

  try {
    const parsed = JSON.parse(result.response.body) as {
      access_token?: unknown;
      token_type?: unknown;
    };
    const token = typeof parsed.access_token === 'string' ? parsed.access_token : '';
    if (!token) return { ok: false, reason: 'The token endpoint returned no access_token.' };

    return {
      ok: true,
      accessToken: token,
      tokenType: typeof parsed.token_type === 'string' && parsed.token_type ? parsed.token_type : 'Bearer',
    };
  } catch {
    return { ok: false, reason: 'The token endpoint did not return JSON.' };
  }
}
