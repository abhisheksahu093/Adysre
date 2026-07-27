import 'server-only';
import { prisma } from '@adysre/database';
import { createId } from '@/modules/api-studio/utils/ids';

/**
 * Email verification tokens.
 *
 * Same construction as password resets: only a SHA-256 of the token is stored,
 * single use through `usedAt`, and time bounded. The window is longer (24 hours
 * against one) because verification proves an address and grants nothing on its
 * own, while a reset link is an account takeover in a single click.
 */

/** 24 hours. */
export const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;

export interface VerificationRow {
  id: string;
  tenantId: string;
  userId: string;
  email: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export async function createVerification(input: {
  tenantId: string;
  userId: string;
  email: string;
  tokenHash: string;
}): Promise<void> {
  await prisma.emailVerification.create({
    data: {
      id: createId(),
      tenantId: input.tenantId,
      userId: input.userId,
      // Stored on the row rather than read from the user at redemption, because
      // this table also backs CHANGING an address and must remember which one
      // the link was issued for.
      email: input.email.toLowerCase(),
      tokenHash: input.tokenHash,
      expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
    },
  });
}

export async function findByTokenHash(hash: string): Promise<VerificationRow | null> {
  return prisma.emailVerification.findUnique({
    where: { tokenHash: hash },
    select: { id: true, tenantId: true, userId: true, email: true, expiresAt: true, usedAt: true },
  });
}

/**
 * Redeem a verification token.
 *
 * One transaction: mark the token used and stamp the user. Conditional on the
 * token still being unused, so two simultaneous clicks (a mail client
 * prefetching the link, then the human clicking it) cannot both succeed.
 *
 * `emailVerifiedAt` is only set when the row's stored address still matches the
 * user's current one. Otherwise the address changed after the link was issued
 * and this link proves nothing about the address they hold now.
 */
export async function redeemVerification(input: {
  verificationId: string;
  userId: string;
  email: string;
}): Promise<{ ok: boolean; alreadyVerified: boolean }> {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.emailVerification.updateMany({
      where: { id: input.verificationId, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (count === 0) return { ok: false, alreadyVerified: false };

    const user = await tx.user.findUnique({
      where: { id: input.userId },
      select: { email: true, emailVerifiedAt: true },
    });
    if (!user || user.email !== input.email) return { ok: false, alreadyVerified: false };
    if (user.emailVerifiedAt) return { ok: true, alreadyVerified: true };

    await tx.user.update({
      where: { id: input.userId },
      data: { emailVerifiedAt: new Date() },
    });

    // Any other outstanding link for this user is now redundant.
    await tx.emailVerification.updateMany({
      where: { userId: input.userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    return { ok: true, alreadyVerified: false };
  });
}

/** The address and verification state, for issuing or re-issuing a link. */
export async function findVerificationTarget(
  tenantId: string,
  userId: string,
): Promise<{ email: string; name: string; emailVerifiedAt: Date | null } | null> {
  return prisma.user.findFirst({
    where: { id: userId, tenantId, deletedAt: null },
    select: { email: true, name: true, emailVerifiedAt: true },
  });
}
