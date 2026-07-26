import { createHmac, sign as cryptoSign } from 'node:crypto';
import type { JwtAlgorithm } from '@/modules/api-studio/types';

/**
 * JWT signing.
 *
 * Server-side because of the key: an HMAC secret or an RSA private key handed
 * to a browser is a key that has left the building. The token is minted per
 * send rather than stored, so an expiry in the payload means what it says.
 *
 * The payload is whatever the user typed. `iat` is filled in when absent
 * because almost every verifier wants it and forgetting it is a confusing
 * failure; nothing else is invented, because a token that quietly differs from
 * what the user wrote is worse than one that fails.
 */

export class JwtSigningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JwtSigningError';
  }
}

/** Node's name for each JOSE algorithm, plus how it has to be signed. */
const ALGORITHMS: Record<JwtAlgorithm, { node: string; kind: 'hmac' | 'rsa' | 'pss' | 'ec' }> = {
  HS256: { node: 'sha256', kind: 'hmac' },
  HS384: { node: 'sha384', kind: 'hmac' },
  HS512: { node: 'sha512', kind: 'hmac' },
  RS256: { node: 'RSA-SHA256', kind: 'rsa' },
  RS384: { node: 'RSA-SHA384', kind: 'rsa' },
  RS512: { node: 'RSA-SHA512', kind: 'rsa' },
  ES256: { node: 'SHA256', kind: 'ec' },
  ES384: { node: 'SHA384', kind: 'ec' },
  PS256: { node: 'RSA-SHA256', kind: 'pss' },
};

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Mint a signed JWT.
 *
 * @param payload - JSON text as typed. Invalid JSON is an error rather than an
 * empty token: a request authenticated by `{}` would fail somewhere far away.
 * @throws {JwtSigningError} on invalid payload, key or algorithm.
 */
export function signJwt(params: {
  algorithm: JwtAlgorithm;
  secret: string;
  secretBase64Encoded: boolean;
  payload: string;
  /** Injected by tests so a token is reproducible. */
  now?: number;
}): string {
  const spec = ALGORITHMS[params.algorithm];
  if (!spec) throw new JwtSigningError(`Unsupported algorithm ${params.algorithm}.`);

  let claims: Record<string, unknown>;
  try {
    const parsed: unknown = params.payload.trim() === '' ? {} : JSON.parse(params.payload);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('not an object');
    }
    claims = parsed as Record<string, unknown>;
  } catch {
    throw new JwtSigningError('The JWT payload must be a JSON object.');
  }

  if (claims.iat === undefined) {
    claims.iat = Math.floor((params.now ?? Date.now()) / 1_000);
  }

  const header = base64url(JSON.stringify({ alg: params.algorithm, typ: 'JWT' }));
  const body = base64url(JSON.stringify(claims));
  const signingInput = `${header}.${body}`;

  const signature = sign(signingInput, spec, params.secret, params.secretBase64Encoded);
  return `${signingInput}.${base64url(signature)}`;
}

function sign(
  input: string,
  spec: { node: string; kind: 'hmac' | 'rsa' | 'pss' | 'ec' },
  secret: string,
  base64Encoded: boolean,
): Buffer {
  try {
    if (spec.kind === 'hmac') {
      const key = base64Encoded ? Buffer.from(secret, 'base64') : Buffer.from(secret, 'utf8');
      return createHmac(spec.node, key).update(input).digest();
    }

    if (spec.kind === 'ec') {
      // JOSE wants r||s, not the DER sequence Node produces by default.
      return cryptoSign(spec.node, Buffer.from(input), {
        key: secret,
        dsaEncoding: 'ieee-p1363',
      });
    }

    if (spec.kind === 'pss') {
      return cryptoSign(spec.node, Buffer.from(input), {
        key: secret,
        padding: 1 << 5, // RSA_PKCS1_PSS_PADDING
        saltLength: 32,
      } as Parameters<typeof cryptoSign>[2]);
    }

    return cryptoSign(spec.node, Buffer.from(input), secret);
  } catch (error) {
    // A malformed PEM is the common case, and the underlying message is a wall
    // of OpenSSL. Name the problem instead.
    throw new JwtSigningError(
      error instanceof Error && spec.kind === 'hmac'
        ? 'The signing secret could not be used.'
        : 'The signing key could not be read. It must be a PEM private key.',
    );
  }
}
