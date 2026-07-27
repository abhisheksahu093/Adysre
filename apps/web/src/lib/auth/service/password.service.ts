import 'server-only';
import type { AuthContext } from '@adysre/types';
import { hashPassword, verifyOrBurn } from '../password';
import { generateLinkToken, hashRefreshToken } from '../tokens';
import {
  createReset,
  findByTokenHash,
  redeemReset,
} from '../repository/password-reset.repository';
import {
  findCandidatesByEmail,
  findPasswordHash,
  updatePasswordHash,
} from '../repository/user.repository';
import {
  findByRefreshHash,
  revokeAllForUser,
  revokeAllForUserExcept,
} from '../repository/session.repository';
import { InvalidTokenError, WrongPasswordError } from './errors';

/**
 * Forgotten passwords, resets, and changing a password while signed in.
 */

/**
 * Start a reset.
 *
 * Returns the raw token for the caller to put in a link, or null when there is
 * no account. **The route must answer identically either way.** This function
 * returning null is not an error and must never become one: an endpoint that
 * says "no such address" is a list of who is registered, and this endpoint is
 * unauthenticated.
 *
 * A reset is created for every matching account, since one address can hold
 * accounts in several tenants and the person asking cannot say which.
 */
export async function requestPasswordReset(
  email: string,
  requestedIp?: string | null,
): Promise<{ token: string; userId: string; tenantId: string; name: string }[]> {
  const candidates = await findCandidatesByEmail(email.toLowerCase());

  // `name` rides along so the mail can greet the recipient without a second
  // query, and so the caller never has to reach back into the repository.
  const issued: { token: string; userId: string; tenantId: string; name: string }[] = [];
  for (const candidate of candidates) {
    // An OAuth-only account has no password to reset, and issuing a link would
    // let someone set one and bypass the identity provider entirely.
    if (!candidate.passwordHash) continue;
    if (!candidate.isActive) continue;

    const { token, hash } = generateLinkToken();
    await createReset({
      tenantId: candidate.tenantId,
      userId: candidate.id,
      tokenHash: hash,
      requestedIp,
    });
    issued.push({
      token,
      userId: candidate.id,
      tenantId: candidate.tenantId,
      name: candidate.name,
    });
  }
  return issued;
}

/**
 * Redeem a reset token and set a new password.
 *
 * Every failure raises the same error: missing, expired, already used, and
 * forged are indistinguishable to the caller. Telling them apart would confirm
 * which guesses had once been real tokens.
 */
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ userId: string; tenantId: string; sessionsRevoked: number }> {
  // The token arrives raw and is hashed to look up, exactly as at issue time.
  const reset = await findByTokenHash(hashLinkToken(token));

  if (!reset) throw new InvalidTokenError();
  if (reset.usedAt) throw new InvalidTokenError();
  if (reset.expiresAt.getTime() <= Date.now()) throw new InvalidTokenError();

  const passwordHash = await hashPassword(newPassword);
  const result = await redeemReset({
    resetId: reset.id,
    userId: reset.userId,
    passwordHash,
  });

  // Lost a race with a simultaneous redemption of the same token.
  if (!result.ok) throw new InvalidTokenError();

  return {
    userId: reset.userId,
    tenantId: reset.tenantId,
    sessionsRevoked: result.sessionsRevoked,
  };
}

/**
 * Change a password for a signed-in user.
 *
 * The current password is required even though the session is already valid,
 * because the threat model here is an unlocked laptop rather than a forged
 * token.
 *
 * Every other session is revoked and the current one is kept. Signing out the
 * device that just made the change is hostile; leaving the other five signed in
 * defeats the point of changing it.
 */
export async function changePassword(
  auth: AuthContext,
  currentPassword: string,
  newPassword: string,
  currentRefreshToken: string | null,
): Promise<{ sessionsRevoked: number }> {
  const stored = await findPasswordHash(auth.tenantId, auth.userId);

  // Burns the same time when there is no stored hash, so an OAuth-only account
  // cannot be identified by how fast this refuses.
  if (!(await verifyOrBurn(currentPassword, stored))) throw new WrongPasswordError();

  await updatePasswordHash(auth.userId, await hashPassword(newPassword));

  // Identify the caller's own session by the refresh token it presented, so it
  // survives while every other device is signed out. With no refresh token
  // there is nothing to preserve, and revoking everything is the safe choice.
  const current = currentRefreshToken
    ? await findByRefreshHash(hashRefreshToken(currentRefreshToken))
    : null;

  // With no identifiable current session, revoke everything. Passing a sentinel
  // like '' to the "except" query would be compared against a uuid column and
  // Postgres rejects it as invalid syntax, so the two cases need two calls.
  const revoked = current
    ? await revokeAllForUserExcept(auth.userId, current.id)
    : await revokeAllForUser(auth.userId);

  return { sessionsRevoked: revoked };
}

/** Link tokens are hashed with sha256, the same as at issue time. */
function hashLinkToken(token: string): string {
  // Reuses the refresh hash function: both are sha256 hex of the raw token, and
  // having one implementation means they cannot drift apart.
  return hashRefreshToken(token);
}
