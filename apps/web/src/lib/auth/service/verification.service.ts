import 'server-only';
import { sendEmail } from '@/lib/email/transport';
import { verificationEmail } from '@/lib/email/templates';
import { generateLinkToken, hashRefreshToken } from '../tokens';
import {
  createVerification,
  findByTokenHash,
  findVerificationTarget,
  redeemVerification,
} from '../repository/verification.repository';
import { InvalidTokenError } from './errors';

/**
 * Proving that an address belongs to the person using it.
 *
 * Verification is reported but never enforced at sign-in. Blocking an
 * unverified account would mean that any failure to deliver mail, a typo, an
 * aggressive spam filter, a provider outage, locks someone out of the workspace
 * they just paid for, with the only recovery path being the mail that is not
 * arriving. It gates privileged actions later instead.
 */

/**
 * Issue a verification link and mail it.
 *
 * Returns the raw token so development and tests can use it without reading a
 * mailbox. Never throws: a mail failure must not undo the registration that
 * triggered it.
 */
export async function sendVerificationLink(input: {
  tenantId: string;
  userId: string;
  email: string;
  name?: string;
}): Promise<{ token: string; delivered: boolean }> {
  const { token, hash } = generateLinkToken();

  await createVerification({
    tenantId: input.tenantId,
    userId: input.userId,
    email: input.email,
    tokenHash: hash,
  });

  const delivered = await sendEmail(verificationEmail(input.email, token, input.name));
  return { token, delivered };
}

/**
 * Re-issue a link for a signed-in user.
 *
 * Returns null when the address is already verified, so the caller can answer
 * without sending a second, confusing email.
 */
export async function resendVerification(
  tenantId: string,
  userId: string,
): Promise<{ delivered: boolean } | null> {
  const target = await findVerificationTarget(tenantId, userId);
  if (!target || target.emailVerifiedAt) return null;

  const { delivered } = await sendVerificationLink({
    tenantId,
    userId,
    email: target.email,
    name: target.name,
  });
  return { delivered };
}

/**
 * Redeem a token.
 *
 * Missing, expired, already used and forged all raise the same error, for the
 * same reason as password reset: distinguishing them confirms which guesses
 * were once real tokens.
 */
export async function verifyEmail(token: string): Promise<{ alreadyVerified: boolean }> {
  const row = await findByTokenHash(hashLinkToken(token));

  if (!row) throw new InvalidTokenError();
  if (row.usedAt) throw new InvalidTokenError();
  if (row.expiresAt.getTime() <= Date.now()) throw new InvalidTokenError();

  const result = await redeemVerification({
    verificationId: row.id,
    userId: row.userId,
    email: row.email,
  });

  // Lost a race, or the address changed after the link was issued so this link
  // no longer proves anything about the address held now.
  if (!result.ok) throw new InvalidTokenError();

  return { alreadyVerified: result.alreadyVerified };
}

/** Link tokens are sha256 hex, the same as refresh tokens. One implementation. */
function hashLinkToken(token: string): string {
  return hashRefreshToken(token);
}
