/**
 * Auth configuration, read from the environment and validated at the point of
 * use.
 *
 * Every value here is read through a function rather than captured in a
 * module-level constant. Two reasons, and both have bitten this kind of code
 * before. A constant evaluated at import time freezes whatever the environment
 * looked like when the module was first pulled in, which on a serverless
 * platform is during the build, not the request. And a constant cannot be
 * varied by a test, so the validation below would be untestable.
 *
 * Pure by design: no `server-only`, no `next/headers`, no database. That is
 * what lets every rule in this file be unit-tested without a request.
 */

/** Thrown when the environment cannot support authentication at all. */
export class AuthConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthConfigError';
  }
}

/**
 * The minimum secret length worth accepting.
 *
 * HS256 keys shorter than the 32-byte hash output add no security over a
 * 32-byte one, and a short secret is almost always a human-chosen string
 * rather than generated entropy.
 */
const MIN_SECRET_LENGTH = 32;

/** Placeholders shipped in `.env.example`. Never valid anywhere. */
const PLACEHOLDER_PREFIXES = ['change-me', 'changeme', 'your-', 'todo', 'xxx'];

function readSecret(name: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET'): string {
  const value = process.env[name];

  // Throwing is the correct response to a missing secret, not falling back to a
  // default. A platform that boots with no trust model is worse than one that
  // does not boot: the default would be identical across every install, so
  // anyone could mint a valid token for anyone else.
  if (!value) {
    throw new AuthConfigError(
      `${name} is not set. Generate one with \`openssl rand -base64 48\` and add it to .env.`,
    );
  }
  if (value.length < MIN_SECRET_LENGTH) {
    throw new AuthConfigError(
      `${name} is ${value.length} characters; at least ${MIN_SECRET_LENGTH} are required.`,
    );
  }
  const lowered = value.toLowerCase();
  if (PLACEHOLDER_PREFIXES.some((prefix) => lowered.startsWith(prefix))) {
    throw new AuthConfigError(`${name} is still a placeholder value.`);
  }
  return value;
}

export function accessTokenSecret(): string {
  return readSecret('JWT_ACCESS_SECRET');
}

export function refreshTokenSecret(): string {
  return readSecret('JWT_REFRESH_SECRET');
}

/**
 * Access token lifetime, in seconds. Default 15 minutes.
 *
 * This is the ceiling on how long a revoked user keeps access, because an
 * access token is verified by signature alone and never checked against the
 * database. Raising it trades that safety for fewer refresh round trips.
 */
export function accessTtlSeconds(): number {
  return readPositiveInt('JWT_ACCESS_TTL', 900);
}

/** Refresh token lifetime, in seconds. Default 14 days. */
export function refreshTtlSeconds(): number {
  return readPositiveInt('JWT_REFRESH_TTL', 1_209_600);
}

/**
 * bcrypt cost factor. Default 12, roughly 250ms on Vercel's hardware.
 *
 * The slowness is the entire point: whatever a user waits once at sign-in, an
 * attacker waits per guess. Values below 10 are refused outright rather than
 * silently accepted, because a fast hash looks identical in every test and is
 * only discovered after a breach.
 */
export function bcryptCost(): number {
  const cost = readPositiveInt('BCRYPT_COST', 12);
  if (cost < 10) {
    throw new AuthConfigError(`BCRYPT_COST is ${cost}; 10 is the lowest defensible value.`);
  }
  if (cost > 15) {
    // Not a security problem, an availability one: each step doubles the work,
    // so 16 is roughly 16x the default and will exceed a serverless timeout.
    throw new AuthConfigError(`BCRYPT_COST is ${cost}; above 15 sign-in will time out.`);
  }
  return cost;
}

function readPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new AuthConfigError(`${name} must be a positive integer, got ${JSON.stringify(raw)}.`);
  }
  return value;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Validate everything at once, so a misconfigured deployment fails loudly at
 * startup instead of at the first sign-in attempt.
 *
 * Returns the list of problems rather than throwing on the first, because an
 * operator fixing three variables should learn about all three in one pass.
 */
export function checkAuthConfig(): string[] {
  const problems: string[] = [];
  const check = (fn: () => unknown) => {
    try {
      fn();
    } catch (error) {
      problems.push(error instanceof Error ? error.message : String(error));
    }
  };

  check(accessTokenSecret);
  check(refreshTokenSecret);
  check(accessTtlSeconds);
  check(refreshTtlSeconds);
  check(bcryptCost);

  // Distinct secrets. Sharing one means a refresh token's signature would
  // verify as an access token if the formats ever converged, and it removes the
  // ability to rotate one without the other.
  const access = process.env.JWT_ACCESS_SECRET;
  const refresh = process.env.JWT_REFRESH_SECRET;
  if (access && refresh && access === refresh) {
    problems.push('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are identical; they must differ.');
  }

  return problems;
}
