import { UNAUTHENTICATED, ok, reportRouteError } from '@/lib/api/response';
import { constantTimeEqual } from '@/lib/auth/access-token';
import { sweepExpiredRecords } from '@/lib/auth/retention';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/cleanup
 *
 * Deletes expired sessions, reset and verification tokens, and rate-limit
 * windows. Intended for a scheduled caller (Vercel Cron, or `pg_cron` hitting
 * this URL).
 *
 * Authenticated by a shared secret rather than a user session, because the
 * caller is a machine with no account. Following the same pattern Website
 * Intelligence already uses for its schedule sweep, so there is one convention
 * for machine callers rather than one per module.
 *
 * **Unset secret means nobody can run it.** Not "anyone can": an endpoint that
 * deletes rows must never be open by default, and a missing configuration is
 * exactly when a mistake is most likely.
 */
export async function POST(request: Request) {
  const expected = process.env.AUTH_CLEANUP_SECRET;
  if (!expected) {
    return UNAUTHENTICATED('Cleanup is not configured.');
  }

  // Accepts either header, matching the existing cron convention.
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const supplied = bearer || request.headers.get('x-cron-secret') || '';

  // Constant time: a plain !== leaks the secret one byte at a time to a caller
  // patient enough to measure.
  if (!constantTimeEqual(supplied, expected)) {
    return UNAUTHENTICATED('Invalid cleanup secret.');
  }

  try {
    const result = await sweepExpiredRecords();
    console.info(
      `[auth.cleanup] removed ${result.sessions} sessions, ${result.passwordResets} resets, ` +
        `${result.emailVerifications} verifications, ${result.rateLimits} rate limit windows`,
    );
    return ok(result, 'Expired records removed.');
  } catch (error) {
    return reportRouteError('auth.cleanup', error, 'Cleanup failed.');
  }
}
