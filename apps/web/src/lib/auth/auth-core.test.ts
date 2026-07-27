import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { verifyAccessToken } from './access-token';
import { AuthConfigError, accessTtlSeconds, bcryptCost, checkAuthConfig } from './config';
import { hashKind, hashPassword, needsRehash, verifyOrBurn, verifyPassword } from './password';
import {
  generateLinkToken,
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
  safeCompareHex,
  signAccessToken,
} from './tokens';

/**
 * Auth primitives.
 *
 * These are the functions every session in the platform rests on, so the cases
 * that matter are the ones where a wrong answer is a vulnerability rather than
 * a bug: a hash that verifies when it should not, a token that survives its
 * expiry, a timing difference that reveals which addresses are registered.
 *
 * A real secret and a real cost factor are used throughout. Mocking bcrypt here
 * would test the mock.
 */

const ACCESS_SECRET = 'test-access-secret-that-is-definitely-long-enough-12345';
const REFRESH_SECRET = 'test-refresh-secret-that-is-also-long-enough-67890abc';

// Cost 10 rather than the production 12: still a real bcrypt hash, roughly four
// times faster, which keeps this file from dominating the test run.
const TEST_COST = '10';

const saved: Record<string, string | undefined> = {};
const ENV_KEYS = [
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_TTL',
  'JWT_REFRESH_TTL',
  'BCRYPT_COST',
  'NODE_ENV',
];

beforeEach(() => {
  for (const key of ENV_KEYS) saved[key] = process.env[key];
  process.env.JWT_ACCESS_SECRET = ACCESS_SECRET;
  process.env.JWT_REFRESH_SECRET = REFRESH_SECRET;
  process.env.BCRYPT_COST = TEST_COST;
  delete process.env.JWT_ACCESS_TTL;
  delete process.env.JWT_REFRESH_TTL;
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe('config', () => {
  it('refuses a missing secret rather than inventing a default', () => {
    // A default would be identical across every install, so anyone could mint a
    // token for anyone else. Not booting is the better failure.
    delete process.env.JWT_ACCESS_SECRET;
    assert.throws(() => checkAuthConfigThrows(), AuthConfigError);
  });

  it('refuses a secret that is too short', () => {
    process.env.JWT_ACCESS_SECRET = 'short';
    const problems = checkAuthConfig();
    assert.ok(problems.some((p) => p.includes('JWT_ACCESS_SECRET')));
  });

  it('refuses the placeholder from .env.example', () => {
    process.env.JWT_ACCESS_SECRET = 'change-me-access-secret-padded-to-be-long-enough-here';
    const problems = checkAuthConfig();
    assert.ok(problems.some((p) => p.includes('placeholder')), problems.join('; '));
  });

  it('refuses identical access and refresh secrets', () => {
    process.env.JWT_REFRESH_SECRET = ACCESS_SECRET;
    const problems = checkAuthConfig();
    assert.ok(problems.some((p) => p.includes('identical')), problems.join('; '));
  });

  it('accepts a well-formed configuration', () => {
    assert.deepEqual(checkAuthConfig(), []);
  });

  it('defaults the access token to 15 minutes', () => {
    assert.equal(accessTtlSeconds(), 900);
  });

  it('refuses a non-numeric TTL instead of coercing it to NaN', () => {
    // Number('') is 0 and Number('abc') is NaN; either silently produces tokens
    // that expire immediately or never.
    process.env.JWT_ACCESS_TTL = 'abc';
    assert.throws(() => accessTtlSeconds(), AuthConfigError);
  });

  it('refuses a bcrypt cost low enough to be worthless', () => {
    // A fast hash looks identical in every test and is only discovered after a
    // breach, so it is refused rather than accepted.
    process.env.BCRYPT_COST = '4';
    assert.throws(() => bcryptCost(), AuthConfigError);
  });

  it('refuses a bcrypt cost high enough to time out sign-in', () => {
    process.env.BCRYPT_COST = '20';
    assert.throws(() => bcryptCost(), AuthConfigError);
  });

  function checkAuthConfigThrows() {
    const problems = checkAuthConfig();
    if (problems.length > 0) throw new AuthConfigError(problems.join('; '));
  }
});

describe('password hashing', () => {
  it('verifies a correct password', async () => {
    const hash = await hashPassword('CorrectHorse12');
    assert.equal(await verifyPassword('CorrectHorse12', hash), true);
  });

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('CorrectHorse12');
    assert.equal(await verifyPassword('CorrectHorse13', hash), false);
  });

  it('salts, so the same password hashes differently every time', async () => {
    // Without a salt, identical passwords share a hash and one rainbow table
    // breaks every account at once.
    const [a, b] = await Promise.all([hashPassword('SamePassword12'), hashPassword('SamePassword12')]);
    assert.notEqual(a, b);
    assert.equal(await verifyPassword('SamePassword12', a), true);
    assert.equal(await verifyPassword('SamePassword12', b), true);
  });

  it('identifies which algorithm produced a hash', async () => {
    assert.equal(hashKind(await hashPassword('AnyPassword12')), 'bcrypt');
    assert.equal(hashKind('$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$aGFzaA'), 'argon2');
    // What packages/database/prisma/seed.ts used to write.
    assert.equal(hashKind(createHash('sha256').update('ChangeMe123!').digest('hex')), 'unsupported');
    assert.equal(hashKind(''), 'unsupported');
  });

  it('returns false, never throws, for an argon2 hash it cannot read', async () => {
    // Accounts registered through apps/api carry these. Throwing would turn an
    // old account into a 500; returning true would be a catastrophe.
    const argon = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$aGFzaA';
    assert.equal(await verifyPassword('ChangeMe123!', argon), false);
  });

  it('returns false for the raw sha256 the seed used to store', async () => {
    // The dangerous version of this bug: sha256(plain) === stored would make
    // the seeded password verify against an unsalted digest.
    const legacy = createHash('sha256').update('ChangeMe123!').digest('hex');
    assert.equal(await verifyPassword('ChangeMe123!', legacy), false);
  });

  it('does not crash on a malformed hash', async () => {
    assert.equal(await verifyPassword('anything', '$2b$not-a-real-hash'), false);
  });

  it('flags non-bcrypt hashes for rehash on next sign-in', async () => {
    assert.equal(needsRehash('$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$aGFzaA'), true);
    assert.equal(needsRehash(createHash('sha256').update('x').digest('hex')), true);
    assert.equal(needsRehash(await hashPassword('AnyPassword12')), false);
  });

  it('flags a bcrypt hash below the configured cost', async () => {
    const weak = await hashPassword('AnyPassword12'); // cost 10
    process.env.BCRYPT_COST = '12';
    assert.equal(needsRehash(weak), true);
  });
});

describe('login timing', () => {
  /**
   * The unknown-address path must cost what a real comparison costs.
   *
   * Skipping the hash when there is no user returns in about two milliseconds
   * against roughly sixty for a real one at cost 10, and that gap is measurable
   * over a network: it turns login into an oracle for which addresses are
   * registered.
   */
  it('spends real time when there is no account', async () => {
    const started = process.hrtime.bigint();
    const result = await verifyOrBurn('AnyPassword12', null);
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;

    assert.equal(result, false);
    // A generous floor. The failure this catches is an early return costing
    // ~0ms, not a few milliseconds of drift on a loaded machine.
    assert.ok(elapsedMs > 10, `returned in ${elapsedMs.toFixed(1)}ms, so the burn was skipped`);
  });

  it('spends real time on a hash it cannot read', async () => {
    // Otherwise response time reveals which accounts are legacy or OAuth-only.
    const started = process.hrtime.bigint();
    const result = await verifyOrBurn('AnyPassword12', '$argon2id$v=19$m=65536$c2FsdA$aGFzaA');
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;

    assert.equal(result, false);
    assert.ok(elapsedMs > 10, `returned in ${elapsedMs.toFixed(1)}ms`);
  });

  it('still verifies a real account correctly', async () => {
    const hash = await hashPassword('CorrectHorse12');
    assert.equal(await verifyOrBurn('CorrectHorse12', hash), true);
    assert.equal(await verifyOrBurn('WrongHorse12', hash), false);
  });
});

describe('access tokens', () => {
  const auth = {
    userId: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
    tenantId: '9c858901-8a57-4791-81fe-4c455b099bc9',
    roles: ['Owner' as const],
    permissions: ['api-studio:collection:read' as const],
  };

  it('round-trips through verification', async () => {
    const token = await signAccessToken(auth);
    const session = await verifyAccessToken(token, ACCESS_SECRET);

    assert.ok(session);
    assert.equal(session.userId, auth.userId);
    assert.equal(session.tenantId, auth.tenantId);
    assert.deepEqual(session.roles, ['Owner']);
    assert.deepEqual(session.permissions, ['api-studio:collection:read']);
  });

  it('fails verification under a different secret', async () => {
    // The whole trust model: a token minted elsewhere must not be accepted.
    const token = await signAccessToken(auth);
    assert.equal(await verifyAccessToken(token, 'a-completely-different-secret-of-length'), null);
  });

  it('fails verification when the payload is tampered with', async () => {
    const token = await signAccessToken(auth);
    const [header, payload, signature] = token.split('.');
    const forged = JSON.parse(Buffer.from(payload!, 'base64url').toString());
    forged.tenantId = '00000000-0000-0000-0000-000000000000';
    const swapped = `${header}.${Buffer.from(JSON.stringify(forged)).toString('base64url')}.${signature}`;

    assert.equal(await verifyAccessToken(swapped, ACCESS_SECRET), null);
  });

  it('rejects an expired token', async () => {
    process.env.JWT_ACCESS_TTL = '1';
    const token = await signAccessToken(auth);
    // jose allows no clock skew by default, so one second past expiry is enough.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    assert.equal(await verifyAccessToken(token, ACCESS_SECRET), null);
  });

  it('rejects garbage', async () => {
    assert.equal(await verifyAccessToken('not-a-token', ACCESS_SECRET), null);
    assert.equal(await verifyAccessToken('', ACCESS_SECRET), null);
  });

  it('drops permissions that are not module:resource:action', async () => {
    // A malformed claim must not become a permission string the policy layer
    // then tries to match.
    const token = await signAccessToken({ ...auth, permissions: ['admin' as never, 'a:b:c'] });
    const session = await verifyAccessToken(token, ACCESS_SECRET);
    assert.deepEqual(session?.permissions, ['a:b:c']);
  });
});

describe('refresh tokens', () => {
  it('produces a token and a matching hash', () => {
    const { token, hash } = generateRefreshToken();
    assert.equal(hashRefreshToken(token), hash);
  });

  it('never stores the token itself', () => {
    const { token, hash } = generateRefreshToken();
    // A database leak must not hand over usable credentials.
    assert.notEqual(token, hash);
    assert.equal(hash.length, 64); // sha256 hex
    assert.match(hash, /^[0-9a-f]{64}$/);
  });

  it('is unique across calls', () => {
    const tokens = new Set(Array.from({ length: 200 }, () => generateRefreshToken().token));
    assert.equal(tokens.size, 200);
  });

  it('carries enough entropy to be unguessable', () => {
    // 48 bytes base64url. Anything materially shorter is a guessable bearer
    // credential with a 14 day life.
    const { token } = generateRefreshToken();
    assert.ok(token.length >= 60, `token was ${token.length} characters`);
  });

  it('hashes deterministically, because the hash is the lookup key', () => {
    const { token } = generateRefreshToken();
    assert.equal(hashRefreshToken(token), hashRefreshToken(token));
  });

  it('expires 14 days out by default', () => {
    const from = new Date('2026-01-01T00:00:00.000Z');
    assert.equal(refreshTokenExpiry(from).toISOString(), '2026-01-15T00:00:00.000Z');
  });

  it('honours a configured lifetime', () => {
    process.env.JWT_REFRESH_TTL = '3600';
    const from = new Date('2026-01-01T00:00:00.000Z');
    assert.equal(refreshTokenExpiry(from).toISOString(), '2026-01-01T01:00:00.000Z');
  });
});

describe('link tokens', () => {
  it('produces a token and matching hash, and is unique', () => {
    const { token, hash } = generateLinkToken();
    assert.equal(createHash('sha256').update(token).digest('hex'), hash);

    const tokens = new Set(Array.from({ length: 200 }, () => generateLinkToken().token));
    assert.equal(tokens.size, 200);
  });
});

describe('safeCompareHex', () => {
  it('matches equal digests and rejects different ones', () => {
    const a = createHash('sha256').update('a').digest('hex');
    const b = createHash('sha256').update('b').digest('hex');
    assert.equal(safeCompareHex(a, a), true);
    assert.equal(safeCompareHex(a, b), false);
  });

  it('returns false rather than throwing on a length mismatch', () => {
    // timingSafeEqual throws on unequal lengths, which would surface as a 500.
    assert.equal(safeCompareHex('abcd', 'abcdef'), false);
  });

  it('returns false on non-hex input', () => {
    // Buffer.from drops invalid characters instead of failing, so two
    // different pieces of garbage both decode to empty and would compare equal.
    assert.equal(safeCompareHex('zzzz', 'zzzz'), false);
    assert.equal(safeCompareHex('nothex', 'nothex'), false);
  });

  it('returns false for empty input, so two absent hashes never match', () => {
    assert.equal(safeCompareHex('', ''), false);
    assert.equal(safeCompareHex('', 'abcd'), false);
  });

  it('returns false on an odd-length digest', () => {
    assert.equal(safeCompareHex('abc', 'abc'), false);
  });
});
