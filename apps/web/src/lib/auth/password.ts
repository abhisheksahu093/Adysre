import bcrypt from 'bcryptjs';
import { bcryptCost } from './config';

/**
 * Password hashing and verification.
 *
 * bcryptjs, not argon2. Argon2 is the stronger algorithm and it is a native
 * module that compiles per platform, which is a recurring source of Vercel
 * build failures. A hash function that will not deploy protects nothing.
 * bcryptjs is pure JavaScript and installs identically everywhere.
 *
 * Pure by design: no database, no cookies, no `server-only`. Every rule here is
 * unit-testable, which matters more for this file than for most.
 */

const dummyCache = new Map<number, string>();

/**
 * A hash that no password matches, at the configured cost.
 *
 * Used to spend the same CPU on a login for an address that does not exist as
 * on one that does. Without it, the unknown-address path returns in about two
 * milliseconds while a real comparison takes about 250, and that gap is
 * trivially measurable over a network: it turns the login endpoint into a user
 * enumeration oracle that reveals which addresses are registered.
 *
 * Derived at the current cost rather than hardcoded, so raising `BCRYPT_COST`
 * cannot reopen the timing gap by leaving the dummy cheaper than the real
 * comparison.
 */
function dummyForCost(cost: number): string {
  const cached = dummyCache.get(cost);
  if (cached) return cached;
  // Synchronous on purpose: this happens once per cost factor per process, and
  // an async cache would need locking to avoid a stampede on cold start.
  const hash = bcrypt.hashSync('adysre-dummy-password-never-matches', cost);
  dummyCache.set(cost, hash);
  return hash;
}

/** Hash a plaintext password for storage. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, bcryptCost());
}

/**
 * Which algorithm produced a stored hash.
 *
 * `unsupported` covers two real cases in this repo. Accounts registered through
 * the NestJS app carry argon2 hashes, and the database seed once wrote a raw
 * unsalted SHA-256. Neither can be verified here without pulling in a native
 * module, so both are treated as "this account needs a password reset" rather
 * than crashing or, far worse, being coerced to a match.
 */
export type HashKind = 'bcrypt' | 'argon2' | 'unsupported';

export function hashKind(hash: string): HashKind {
  if (/^\$2[aby]?\$\d{2}\$/.test(hash)) return 'bcrypt';
  if (hash.startsWith('$argon2')) return 'argon2';
  return 'unsupported';
}

/**
 * Verify a password against a stored hash.
 *
 * Returns false, never throws, for any hash this build cannot read. Throwing
 * would turn an old account into a 500; returning true would be a
 * catastrophe. False sends the user to password reset, which is the only
 * correct outcome.
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (hashKind(hash) !== 'bcrypt') return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    // A malformed hash makes bcrypt throw. Deny by default.
    return false;
  }
}

/**
 * Verify against a possibly-absent user, spending the same time either way.
 *
 * Call this on the login path instead of branching on whether the user exists.
 * The branch is the vulnerability: skipping the hash comparison when there is
 * no user is exactly what leaks which addresses are registered.
 *
 * @param hash - the stored hash, or null/undefined when no account was found
 */
export async function verifyOrBurn(plain: string, hash: string | null | undefined): Promise<boolean> {
  if (!hash) {
    // Deliberate waste. Never remove this as an optimization; it is
    // load-bearing. See docs/SECURITY_GUIDELINES.md section 7.
    await bcrypt.compare(plain, dummyForCost(safeCost()));
    return false;
  }
  if (hashKind(hash) !== 'bcrypt') {
    // An unreadable hash must also burn the time, or the response time reveals
    // which accounts are OAuth-only or legacy.
    await bcrypt.compare(plain, dummyForCost(safeCost()));
    return false;
  }
  return verifyPassword(plain, hash);
}

/** The configured cost, or the default if configuration is broken. */
function safeCost(): number {
  try {
    return bcryptCost();
  } catch {
    return 12;
  }
}

/**
 * Whether a stored hash should be replaced on the next successful sign-in.
 *
 * True for anything not bcrypt, and for bcrypt below the configured cost. A
 * successful login is the only moment the plaintext exists, so it is the only
 * chance to upgrade a hash without asking the user to do anything.
 */
export function needsRehash(hash: string): boolean {
  if (hashKind(hash) !== 'bcrypt') return true;
  try {
    return bcrypt.getRounds(hash) < bcryptCost();
  } catch {
    return true;
  }
}
