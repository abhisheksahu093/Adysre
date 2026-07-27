import { changePasswordSchema } from '@adysre/validators';
import { FORBIDDEN, RATE_LIMITED, UNAUTHENTICATED, ok, reportRouteError } from '@/lib/api/response';
import { verifyCsrf } from '@/lib/auth/csrf';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { readRefreshCookie, setAuthCookies } from '@/lib/auth/cookies';
import { requireAuth } from '@/lib/auth/guard';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { rateLimit } from '@/lib/auth/rate-limit';
import { loadAuthContext } from '@/lib/auth/repository/user.repository';
import { WrongPasswordError } from '@/lib/auth/service/errors';
import { issueSession } from '@/lib/auth/service/issue';
import { changePassword } from '@/lib/auth/service/password.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/auth/change-password
 *
 * Requires the current password even though the caller is already
 * authenticated, because the threat here is an unlocked laptop rather than a
 * forged token.
 *
 * Every other session is revoked; this one is replaced with fresh tokens.
 * Signing out the device that just made the change would be hostile, and
 * leaving the other five signed in would defeat the purpose of changing it.
 */
export async function PATCH(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  // The third CSRF check, on top of SameSite=Lax and the Origin check. Applied
  // here specifically because a successful forgery is unrecoverable: it locks
  // the real owner out of their own account.
  if (!(await verifyCsrf(request))) {
    return FORBIDDEN('Missing or invalid CSRF token. Reload the page and try again.');
  }

  // Tighter than most authenticated endpoints: this one accepts a password
  // guess, so it is a brute-force target against anyone who leaves a session
  // open.
  const limit = await rateLimit(`change-password:${auth.session.userId}`, { max: 5, windowSec: 900 });
  if (!limit.ok) return RATE_LIMITED(limit.retryAfter);

  const parsed = changePasswordSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalid(parsed.error);

  const currentRefresh = await readRefreshCookie();
  const context = requestContext(request);

  try {
    const { sessionsRevoked } = await changePassword(
      auth.session,
      parsed.data.currentPassword,
      parsed.data.newPassword,
      currentRefresh,
    );

    // The old refresh token was rotated or revoked by the change, so this
    // browser needs a new pair or its very next refresh would fail and it would
    // be signed out anyway. Read the context back from the database so the new
    // token reflects any role change since sign-in.
    const refreshed = await loadAuthContext(auth.session.tenantId, auth.session.userId);
    const issued = await issueSession(refreshed, context);
    await setAuthCookies(issued);

    await recordAuthEvent(
      { tenantId: auth.session.tenantId, actorId: auth.session.userId, ...context },
      'auth.password.changed',
      { sessionsRevoked },
    );

    return ok({ changed: true, sessionsRevoked }, 'Password updated.');
  } catch (error) {
    if (error instanceof WrongPasswordError) {
      return UNAUTHENTICATED('Your current password is incorrect.');
    }
    return reportRouteError('auth.change-password', error, 'Could not change your password.');
  }
}
