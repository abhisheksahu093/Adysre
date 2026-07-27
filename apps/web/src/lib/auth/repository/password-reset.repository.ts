import 'server-only';
import { prisma } from '@adysre/database';
import { createId } from '@/modules/api-studio/utils/ids';

/**
 * Password reset tokens.
 *
 * Only a SHA-256 of each token is stored, so read access to this table is not
 * enough to take over accounts. Tokens are single-use through `usedAt` and
 * expire in one hour.
 */

/** One hour. A reset link is an account takeover in a single click. */
export const RESET_TTL_MS = 60 * 60 * 1000;

export interface ResetRow {
  id: string;
  tenantId: string;
  userId: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export async function createReset(input: {
  tenantId: string;
  userId: string;
  tokenHash: string;
  requestedIp?: string | null | undefined;
}): Promise<void> {
  await prisma.passwordReset.create({
    data: {
      id: createId(),
      tenantId: input.tenantId,
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: new Date(Date.now() + RESET_TTL_MS),
      requestedIp: input.requestedIp ?? null,
    },
  });
}

/**
 * Find a reset by token hash.
 *
 * Not filtered on `usedAt` or `expiresAt`: the caller decides, so that a used
 * or expired token can be told apart in logs while still answering the client
 * with one indistinguishable error.
 */
export async function findByTokenHash(hash: string): Promise<ResetRow | null> {
  return prisma.passwordReset.findUnique({
    where: { tokenHash: hash },
    select: { id: true, tenantId: true, userId: true, expiresAt: true, usedAt: true },
  });
}

/**
 * Redeem a reset: mark it used, set the new password, and revoke every session.
 *
 * All four steps in one transaction, because a partial application is worse
 * than a failure. Two cases specifically. If the password changes but the token
 * is not marked used, the link works again and the reset is not a reset. If the
 * password changes but sessions survive, then someone resetting after a
 * compromise has not actually evicted the attacker, which is the entire reason
 * they came here.
 *
 * Marking the token used is conditional on it still being unused, so two
 * simultaneous redemptions cannot both succeed.
 */
export async function redeemReset(input: {
  resetId: string;
  userId: string;
  passwordHash: string;
}): Promise<{ ok: boolean; sessionsRevoked: number }> {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.passwordReset.updateMany({
      where: { id: input.resetId, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Someone else redeemed it first. Change nothing.
    if (count === 0) return { ok: false, sessionsRevoked: 0 };

    await tx.user.update({
      where: { id: input.userId },
      data: {
        passwordHash: input.passwordHash,
        // Clear the lockout too: a user who has just proved control of their
        // account should not still be locked out by the attempts that led them
        // to reset it.
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedBy: input.userId,
      },
    });

    const revoked = await tx.session.updateMany({
      where: { userId: input.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    // Any other outstanding reset is now stale, and leaving it live would mean
    // an attacker who requested one earlier still holds a working link.
    await tx.passwordReset.updateMany({
      where: { userId: input.userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    return { ok: true, sessionsRevoked: revoked.count };
  });
}
