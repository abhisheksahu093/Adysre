import { createHash, randomBytes } from 'node:crypto';

/**
 * HTTP Digest access authentication (RFC 7616).
 *
 * Digest is the reason the runner can retry: the credential is a hash over a
 * NONCE the server chooses, so the first request must be sent unauthenticated,
 * refused with 401, and repeated with the answer. Nothing about that can happen
 * in the browser, and nothing about it can be pre-computed.
 *
 * Everything here is pure and synchronous. The retry itself lives in the
 * runner, which is the only part that needs to know a request can happen twice.
 */

export interface DigestChallenge {
  realm: string;
  nonce: string;
  /** `auth`, `auth-int`, or empty when the server offers neither. */
  qop: string;
  opaque: string;
  algorithm: string;
  /** The server says the nonce expired and a retry with a fresh one is fine. */
  stale: boolean;
}

/**
 * Parse a `WWW-Authenticate` header.
 *
 * @returns the challenge, or `null` when the header is not a Digest challenge.
 * A server that answers 401 with Basic must not be retried with a Digest hash.
 */
export function parseChallenge(header: string): DigestChallenge | null {
  const trimmed = header.trim();
  if (!/^digest\s/i.test(trimmed)) return null;

  const parameters = new Map<string, string>();
  // Quoted values may contain commas, so the split has to respect quotes.
  const pattern = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|([^,\s]+))/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(trimmed)) !== null) {
    const key = match[1]?.toLowerCase();
    if (key) parameters.set(key, match[2] ?? match[3] ?? '');
  }

  const nonce = parameters.get('nonce');
  if (!nonce) return null;

  return {
    realm: parameters.get('realm') ?? '',
    nonce,
    qop: (parameters.get('qop') ?? '').split(',')[0]?.trim() ?? '',
    opaque: parameters.get('opaque') ?? '',
    algorithm: parameters.get('algorithm') ?? 'MD5',
    stale: (parameters.get('stale') ?? '').toLowerCase() === 'true',
  };
}

function hash(algorithm: string, value: string): string {
  // MD5 is not a choice here: the RFC specifies it, and a server that asks for
  // it will not accept anything else. SHA-256 is used when the server offers it.
  const node = algorithm.toLowerCase().startsWith('sha-256') ? 'sha256' : 'md5';
  return createHash(node).update(value, 'utf8').digest('hex');
}

export interface DigestCredentials {
  username: string;
  password: string;
}

/**
 * Build the `Authorization` header answering a challenge.
 *
 * @param uri - the request target exactly as it goes on the wire (path plus
 * query), because the server hashes the same string and a normalised version
 * would not match.
 * @param body - required only for `qop=auth-int`, which hashes it.
 */
export function buildAuthorization(params: {
  challenge: DigestChallenge;
  credentials: DigestCredentials;
  method: string;
  uri: string;
  body?: Buffer | null;
  /** Injected for tests; random in production, as the RFC requires. */
  cnonce?: string;
  nonceCount?: number;
}): string {
  const { challenge, credentials, method, uri } = params;
  const algorithm = challenge.algorithm || 'MD5';
  const cnonce = params.cnonce ?? randomBytes(8).toString('hex');
  const nc = (params.nonceCount ?? 1).toString(16).padStart(8, '0');

  let ha1 = hash(algorithm, `${credentials.username}:${challenge.realm}:${credentials.password}`);
  if (algorithm.toLowerCase().endsWith('-sess')) {
    ha1 = hash(algorithm, `${ha1}:${challenge.nonce}:${cnonce}`);
  }

  const ha2 =
    challenge.qop === 'auth-int'
      ? hash(algorithm, `${method}:${uri}:${hash(algorithm, (params.body ?? Buffer.alloc(0)).toString('utf8'))}`)
      : hash(algorithm, `${method}:${uri}`);

  const response = challenge.qop
    ? hash(algorithm, `${ha1}:${challenge.nonce}:${nc}:${cnonce}:${challenge.qop}:${ha2}`)
    : hash(algorithm, `${ha1}:${challenge.nonce}:${ha2}`);

  const parts = [
    `username="${escapeQuoted(credentials.username)}"`,
    `realm="${escapeQuoted(challenge.realm)}"`,
    `nonce="${escapeQuoted(challenge.nonce)}"`,
    `uri="${escapeQuoted(uri)}"`,
    `response="${response}"`,
    `algorithm=${algorithm}`,
  ];

  if (challenge.qop) parts.push(`qop=${challenge.qop}`, `nc=${nc}`, `cnonce="${cnonce}"`);
  if (challenge.opaque) parts.push(`opaque="${escapeQuoted(challenge.opaque)}"`);

  return `Digest ${parts.join(', ')}`;
}

/** A quote or backslash inside a quoted parameter would end it early. */
function escapeQuoted(value: string): string {
  return value.replace(/[\\"]/g, '\\$&');
}
