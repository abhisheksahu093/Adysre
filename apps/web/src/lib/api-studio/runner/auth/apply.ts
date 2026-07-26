import type { ExecutionRequest, WireAuth, WireHeader } from '@/modules/api-studio/types';
import { signRequest } from './aws-sigv4';
import { JwtSigningError, signJwt } from './jwt';
import { canFetchToken, fetchToken, type TokenSender } from './oauth2';

/**
 * Applying the auth strategies the runner owns.
 *
 * Ordering matters and is the reason this is one function rather than three
 * call sites: OAuth 2 and JWT produce a header BEFORE the request is signed,
 * and AWS SigV4 signs whatever the final header set turns out to be. Signing
 * first and adding a header after would produce a valid-looking request the
 * server rejects with a bare 403.
 *
 * Digest is absent on purpose: it needs the server's 401 challenge, so it is
 * handled by the runner's retry rather than here.
 */

export type ApplyResult =
  | { ok: true; headers: WireHeader[]; query: { key: string; value: string }[] }
  | { ok: false; reason: string };

export async function applyWireAuth(params: {
  auth: WireAuth;
  request: ExecutionRequest;
  url: URL;
  headers: readonly WireHeader[];
  body: Buffer | null;
  send: TokenSender;
}): Promise<ApplyResult> {
  const { auth } = params;

  switch (auth.type) {
    case 'digest':
      // Handled by the runner's challenge/response retry.
      return { ok: true, headers: [], query: [] };

    case 'jwt': {
      try {
        const token = signJwt({
          algorithm: auth.algorithm,
          secret: auth.secret,
          secretBase64Encoded: auth.secretBase64Encoded,
          payload: auth.payload,
        });
        const prefix = auth.headerPrefix.trim();
        return auth.addTo === 'query'
          ? { ok: true, headers: [], query: [{ key: auth.paramName || 'token', value: token }] }
          : {
              ok: true,
              headers: [{ name: 'Authorization', value: prefix ? `${prefix} ${token}` : token }],
              query: [],
            };
      } catch (error) {
        return {
          ok: false,
          reason: error instanceof JwtSigningError ? error.message : 'The JWT could not be signed.',
        };
      }
    }

    case 'oauth2': {
      if (!canFetchToken(auth)) {
        return {
          ok: false,
          reason: `The ${auth.grantType} grant needs a browser redirect and is not available here.`,
        };
      }

      const token = await fetchToken(auth, params.send, {
        workspaceId: params.request.workspaceId,
        settings: params.request.settings,
      });
      if (!token.ok) return { ok: false, reason: token.reason };

      const prefix = auth.headerPrefix.trim() || token.tokenType;
      return auth.addTo === 'query'
        ? { ok: true, headers: [], query: [{ key: 'access_token', value: token.accessToken }] }
        : {
            ok: true,
            headers: [{ name: 'Authorization', value: `${prefix} ${token.accessToken}` }],
            query: [],
          };
    }

    case 'awsSignature': {
      if (!auth.accessKeyId || !auth.secretAccessKey || !auth.region || !auth.service) {
        return { ok: false, reason: 'AWS signing needs a key, a secret, a region and a service.' };
      }
      return {
        ok: true,
        headers: signRequest({
          credentials: auth,
          method: params.request.method,
          url: params.url,
          headers: params.headers,
          body: params.body,
        }),
        query: [],
      };
    }

    default:
      return { ok: false, reason: 'Unknown auth strategy.' };
  }
}
