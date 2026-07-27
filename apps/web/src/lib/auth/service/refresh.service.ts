import 'server-only';
import { hashRefreshToken, generateRefreshToken, refreshTokenExpiry, signAccessToken } from '../tokens';
import {
  findByRefreshHash,
  matchRefreshToken,
  revokeAllForUser,
  revokeSession,
  rotateSession,
} from '../repository/session.repository';
import { loadAuthContext } from '../repository/user.repository';
import { InvalidSessionError } from './errors';

/**
 * Refresh, with rotation and reuse detection.
 *
 * Rotation means every refresh issues a new token and retires the old one, so a
 * stolen refresh token is useful only until the real client refreshes once.
 * After that the thief's copy is a token that no longer exists, and presenting
 * it is the signal that it was stolen.
 */

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  userId: string;
  tenantId: string;
}

export async function refresh(token: string): Promise<RefreshResult> {
  const presented = hashRefreshToken(token);
  const match = await matchRefreshToken(presented);

  // No session has ever held this token, or it is more than one rotation old.
  // Forged or long stale; nothing to revoke either way.
  if (match.kind === 'unknown') throw new InvalidSessionError();

  if (match.kind === 'reused') {
    // REUSE. This token was retired by a rotation and is being presented again,
    // so two parties hold it and one of them is not the user.
    //
    // There is no way to tell the thief from the victim, so the whole family
    // goes: every session for this user is revoked and everyone signs in again.
    // Signing a legitimate user out is a far better outcome than leaving an
    // attacker with a live session, and this is the event in the system most
    // worth alerting on.
    await revokeAllForUser(match.session.userId);
    throw new InvalidSessionError(true);
  }

  const { session } = match;

  // Revoked, but by us rather than by a replay: a logout, a password reset, or
  // a password change on another device. That is an expired session, not a
  // theft signal, and it must NOT revoke the family. Treating it as reuse is
  // what made a password change sign out the very device that performed it.
  if (session.revokedAt) throw new InvalidSessionError();

  if (session.expiresAt.getTime() <= Date.now()) {
    throw new InvalidSessionError();
  }

  // Re-read roles and permissions from the database rather than copying the old
  // token's claims. This is the moment a revoked role actually takes effect: a
  // claim copied forward would survive for the refresh token's fourteen days
  // instead of the access token's fifteen minutes.
  const auth = await loadAuthContext(session.tenantId, session.userId);

  const next = generateRefreshToken();
  // The outgoing hash is remembered, which is what makes the next replay of it
  // detectable rather than merely unknown.
  await rotateSession(session.id, next.hash, presented, refreshTokenExpiry());

  return {
    accessToken: await signAccessToken(auth),
    refreshToken: next.token,
    userId: session.userId,
    tenantId: session.tenantId,
  };
}

/**
 * Revoke the session a refresh token belongs to.
 *
 * Logout is best effort and never fails: the outcome is "you are signed out"
 * whether or not there was a row to revoke, and a logout that can fail leaves
 * users stuck on a page they cannot leave.
 */
export async function revokeByRefreshToken(token: string | null): Promise<string | null> {
  if (!token) return null;
  try {
    const session = await findByRefreshHash(hashRefreshToken(token));
    if (!session || session.revokedAt) return null;
    await revokeSession(session.id);
    return session.userId;
  } catch (error) {
    console.error(
      `[auth.logout] revoke failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}
