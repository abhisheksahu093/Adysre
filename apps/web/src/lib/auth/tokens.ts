import { SignJWT } from 'jose';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { AuthContext } from '@adysre/types';
import { accessTokenSecret, accessTtlSeconds, refreshTtlSeconds } from './config';

/**
 * Minting the two tokens.
 *
 * The counterpart to `access-token.ts`, which verifies. Kept separate because
 * verification runs everywhere, including the Edge runtime in middleware, while
 * signing only ever happens in the auth routes. Splitting them keeps
 * `node:crypto` out of anything the Edge has to load.
 *
 * The access token's payload shape is a contract with `apps/api`, which reads
 * the same `JWT_ACCESS_SECRET`. It is defined once as `AuthContext` in
 * `packages/types/src/rbac.ts`; changing it here breaks the other app.
 */

/** Bytes of entropy in a refresh token. 384 bits, far beyond brute force. */
const REFRESH_TOKEN_BYTES = 48;

/**
 * Sign an access token.
 *
 * HS256, symmetric, because both consumers are our own services sharing a
 * secret. An asymmetric algorithm would only pay off if a third party needed
 * to verify without being able to mint.
 *
 * `exp` is set from the configured TTL, and `iat` from now, so a token is
 * self-limiting even if the session row behind it is never cleaned up.
 */
export async function signAccessToken(auth: AuthContext): Promise<string> {
  const secret = new TextEncoder().encode(accessTokenSecret());
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({
    tenantId: auth.tenantId,
    roles: auth.roles,
    permissions: auth.permissions,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(auth.userId)
    .setIssuedAt(now)
    .setExpirationTime(now + accessTtlSeconds())
    .sign(secret);
}

/**
 * A refresh token, and the hash to store for it.
 *
 * Opaque rather than a JWT: it makes no assertions, it identifies a row, and
 * the row is the truth. That is what makes it revocable, which the access token
 * is not.
 *
 * `randomBytes` is a CSPRNG. `Math.random()` is seeded predictably and would
 * make every refresh token guessable from any other.
 */
export function generateRefreshToken(): { token: string; hash: string } {
  const token = randomBytes(REFRESH_TOKEN_BYTES).toString('base64url');
  return { token, hash: hashRefreshToken(token) };
}

/**
 * Hash a refresh token for storage and lookup.
 *
 * SHA-256, not bcrypt, and the difference is deliberate. A password is
 * low-entropy and human-chosen, so a deliberately slow hash is the entire
 * defense. A refresh token is 48 bytes of cryptographic randomness, so brute
 * force is not a threat and a slow hash would only add latency to the hottest
 * authenticated path. Both are hashed for the same reason: a database leak must
 * not hand over usable credentials.
 *
 * Deterministic, unlike bcrypt, which is required here: the stored hash is what
 * we look the session up by.
 */
export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** When a refresh token issued now should expire. */
export function refreshTokenExpiry(from: Date = new Date()): Date {
  return new Date(from.getTime() + refreshTtlSeconds() * 1000);
}

/**
 * Constant-time comparison of two hex digests.
 *
 * The database lookup does the real work, so this is for the rare paths that
 * compare a hash in application code. A plain `===` short-circuits on the first
 * differing byte, and that timing difference can leak a secret one byte at a
 * time.
 */
export function safeCompareHex(a: string, b: string): boolean {
  // Both inputs must be validated as hex BEFORE decoding, because
  // `Buffer.from` silently drops invalid characters instead of failing:
  // `Buffer.from('zzzz', 'hex')` is an empty buffer, so two different pieces of
  // garbage would decode to the same empty value and compare equal. Empty is
  // rejected for the same reason, so two absent hashes never match.
  if (!isHexDigest(a) || !isHexDigest(b)) return false;

  // Length is compared separately: timingSafeEqual throws on a length mismatch
  // rather than returning false.
  if (a.length !== b.length) return false;

  return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
}

/** A non-empty, even-length string of hex digits. */
function isHexDigest(value: string): boolean {
  return value.length > 0 && value.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(value);
}

/**
 * A single-use token for an email link, and its hash.
 *
 * Same construction as a refresh token, kept as its own function because the
 * two have different lifetimes and different tables, and a shared helper would
 * invite someone to shorten one and silently shorten the other.
 */
export function generateLinkToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: createHash('sha256').update(token).digest('hex') };
}
