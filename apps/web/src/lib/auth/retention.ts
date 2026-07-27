import 'server-only';
import { prisma } from '@adysre/database';

/**
 * Deleting rows that have outlived their purpose.
 *
 * Sessions, reset tokens, verification tokens and rate-limit windows all
 * accumulate forever otherwise. None of it is harmful on its own, but a table
 * of millions of expired credentials is a larger breach when one happens, and
 * the indexes that keep refresh fast get slower for no benefit.
 *
 * **`audit_logs` is deliberately absent.** It is the compliance record and the
 * only place a past incident can be reconstructed from; it is never swept on a
 * schedule.
 */

/**
 * Thirty days PAST expiry, not at expiry.
 *
 * An incident investigation starts days or weeks after the event and needs to
 * see the token rows involved: which sessions existed, when a reset was
 * requested, from which IP. Deleting on the expiry timestamp destroys exactly
 * the evidence that makes the investigation possible, to save nothing.
 */
const GRACE_DAYS = 30;

export interface SweepResult {
  sessions: number;
  passwordResets: number;
  emailVerifications: number;
  rateLimits: number;
}

export async function sweepExpiredRecords(now: Date = new Date()): Promise<SweepResult> {
  const cutoff = new Date(now.getTime() - GRACE_DAYS * 24 * 60 * 60 * 1000);

  // Sequential rather than concurrent. These are DELETEs over indexed ranges on
  // a pooled connection with a low limit; firing them together mostly produces
  // pool contention on a job that has no deadline.
  const sessions = await prisma.session.deleteMany({ where: { expiresAt: { lt: cutoff } } });
  const passwordResets = await prisma.passwordReset.deleteMany({
    where: { expiresAt: { lt: cutoff } },
  });
  const emailVerifications = await prisma.emailVerification.deleteMany({
    where: { expiresAt: { lt: cutoff } },
  });

  // Rate limit windows carry no evidentiary value and are pure overhead once
  // the window has passed, so they go as soon as they expire.
  const rateLimits = await prisma.rateLimit.deleteMany({ where: { resetAt: { lt: now } } });

  return {
    sessions: sessions.count,
    passwordResets: passwordResets.count,
    emailVerifications: emailVerifications.count,
    rateLimits: rateLimits.count,
  };
}
