import { resetPasswordSchema } from '@adysre/validators';
import { BAD_REQUEST, RATE_LIMITED, ok, reportRouteError } from '@/lib/api/response';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { clearAuthCookies } from '@/lib/auth/cookies';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import { InvalidTokenError } from '@/lib/auth/service/errors';
import { resetPassword } from '@/lib/auth/service/password.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/reset-password
 *
 * Redeems a reset token, sets the new password, and revokes every session for
 * that user. The revocation is the point: someone resetting after a compromise
 * expects the attacker to be signed out, and leaving other sessions live makes
 * the reset theatre.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const limit = await rateLimit(`reset:${clientIp(request)}`, { max: 10, windowSec: 3600 });
  if (!limit.ok) return RATE_LIMITED(limit.retryAfter);

  const parsed = resetPasswordSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalid(parsed.error);

  const context = requestContext(request);

  try {
    const result = await resetPassword(parsed.data.token, parsed.data.password);

    // The caller's own cookies are cleared too. Every session was just revoked,
    // including any this browser holds, so leaving them behind would present a
    // token that no longer refreshes and look like a broken app.
    await clearAuthCookies();

    await recordAuthEvent(
      { tenantId: result.tenantId, actorId: result.userId, ...context },
      'auth.password.reset.completed',
      { sessionsRevoked: result.sessionsRevoked },
    );

    return ok({ reset: true }, 'Password updated. Please sign in.');
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      // One answer for missing, expired, already used, and forged. Telling them
      // apart would confirm which guesses had once been real tokens.
      return BAD_REQUEST(error.message);
    }
    return reportRouteError('auth.reset-password', error, 'Could not reset your password.');
  }
}
