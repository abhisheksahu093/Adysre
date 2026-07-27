import 'server-only';
import { prisma } from '@adysre/database';
import { createId } from '@/modules/api-studio/utils/ids';

/**
 * Sessions, which are the refresh token store.
 *
 * One row per signed-in device, holding a SHA-256 of the refresh token and
 * never the token itself. The row is what makes a session revocable, which the
 * access token is not.
 *
 * No soft delete here: `revokedAt` is the tombstone, and it has to stay
 * readable rather than be filtered away, because a revoked row is exactly what
 * reuse detection looks for.
 */

export interface SessionRow {
  id: string;
  tenantId: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface CreateSessionInput {
  tenantId: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  ip?: string | null | undefined;
  userAgent?: string | null | undefined;
}

export async function createSession(input: CreateSessionInput): Promise<string> {
  const id = createId();
  await prisma.session.create({
    data: {
      id,
      tenantId: input.tenantId,
      userId: input.userId,
      refreshTokenHash: input.refreshTokenHash,
      expiresAt: input.expiresAt,
      // Recorded so a "signed-in devices" screen can name them, and so an
      // investigation after a reuse event has somewhere to start.
      ip: input.ip ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
  return id;
}

const SESSION_FIELDS = {
  id: true,
  tenantId: true,
  userId: true,
  expiresAt: true,
  revokedAt: true,
} as const;

/**
 * Find a session by the CURRENT refresh token hash.
 *
 * Deliberately not filtered on `revokedAt` or `expiresAt`: the caller decides
 * what a revoked or expired row means, and filtering here would collapse three
 * different situations into one indistinguishable "not found".
 */
export async function findByRefreshHash(hash: string): Promise<SessionRow | null> {
  return prisma.session.findFirst({ where: { refreshTokenHash: hash }, select: SESSION_FIELDS });
}

/** How a presented refresh token matched, which decides what happens next. */
export type TokenMatch =
  /** The token this session currently expects. Rotate it. */
  | { kind: 'current'; session: SessionRow }
  /**
   * The token this session held BEFORE its last rotation. Someone is replaying
   * a retired token, which means two parties hold it.
   */
  | { kind: 'reused'; session: SessionRow }
  /** No session has ever held this token, or it is more than one rotation old. */
  | { kind: 'unknown' };

/**
 * Resolve a presented refresh token.
 *
 * Current first, because that is the overwhelmingly common case and it must not
 * pay for the rare one. Only when there is no current match is the previous
 * generation consulted.
 */
export async function matchRefreshToken(hash: string): Promise<TokenMatch> {
  const current = await prisma.session.findFirst({
    where: { refreshTokenHash: hash },
    select: SESSION_FIELDS,
  });
  if (current) return { kind: 'current', session: current };

  const previous = await prisma.session.findFirst({
    where: { previousTokenHash: hash },
    select: SESSION_FIELDS,
  });
  if (previous) return { kind: 'reused', session: previous };

  return { kind: 'unknown' };
}

/**
 * Rotate: point an existing session at a new refresh token, remembering the old
 * one.
 *
 * The row is updated rather than replaced, so a device keeps one identity for
 * its whole life. Recording the outgoing hash in `previousTokenHash` is what
 * makes reuse detectable: overwriting it and nothing else, as this originally
 * did, leaves a replayed token matching no row at all, which is exactly how a
 * theft signal gets mistaken for a stale request.
 */
export async function rotateSession(
  id: string,
  refreshTokenHash: string,
  previousTokenHash: string,
  expiresAt: Date,
): Promise<void> {
  await prisma.session.update({
    where: { id },
    data: { refreshTokenHash, previousTokenHash, expiresAt },
  });
}

export async function revokeSession(id: string): Promise<void> {
  await prisma.session.updateMany({
    where: { id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/**
 * Revoke every session a user holds.
 *
 * Called on password reset, and on refresh token reuse. In both cases the
 * assumption is that someone else may hold a credential, so signing every
 * device out is the point rather than a side effect.
 */
export async function revokeAllForUser(userId: string): Promise<number> {
  const { count } = await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return count;
}

/**
 * Revoke every session except one.
 *
 * For a password change made by a signed-in user: the other five devices should
 * go, and signing out the device that just did the change would be hostile.
 */
export async function revokeAllForUserExcept(userId: string, keepSessionId: string): Promise<number> {
  const { count } = await prisma.session.updateMany({
    where: { userId, revokedAt: null, id: { not: keepSessionId } },
    data: { revokedAt: new Date() },
  });
  return count;
}
