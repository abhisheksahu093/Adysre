import { RATE_LIMITED, UNAUTHENTICATED, ok, reportRouteError } from '@/lib/api/response';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { clearAuthCookies, readRefreshCookie, setAuthCookies } from '@/lib/auth/cookies';
import { verifyOrigin } from '@/lib/auth/http';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import { InvalidSessionError } from '@/lib/auth/service/errors';
import { refresh } from '@/lib/auth/service/refresh.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/refresh
 *
 * Rotates the refresh token and issues a new access token. No body: the
 * credential is the HTTP-only cookie, which JavaScript cannot read and
 * therefore cannot send any other way.
 *
 * Clients must share ONE in-flight refresh across concurrent 401s. Ten parallel
 * refreshes send a token the first has already rotated away, and reuse
 * detection then signs the user out for doing nothing wrong.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const limit = await rateLimit(`refresh:${clientIp(request)}`, { max: 60, windowSec: 900 });
  if (!limit.ok) return RATE_LIMITED(limit.retryAfter);

  const token = await readRefreshCookie();
  if (!token) {
    await clearAuthCookies();
    return UNAUTHENTICATED('No session to refresh.');
  }

  const context = requestContext(request);

  try {
    const result = await refresh(token);

    await setAuthCookies(result);
    await recordAuthEvent(
      { tenantId: result.tenantId, actorId: result.userId, ...context },
      'auth.refresh.success',
    );

    return ok({ userId: result.userId, tenantId: result.tenantId }, 'Session refreshed.');
  } catch (error) {
    if (error instanceof InvalidSessionError) {
      // Always clear the cookies. Leaving a dead refresh token in the browser
      // means the client retries with it forever and never reaches the login
      // page it should be at.
      await clearAuthCookies();

      if (error.reused) {
        // The service has already revoked every session for this user. This row
        // is the one worth alerting on: a rotated token was replayed, so it was
        // captured.
        console.error('[auth.refresh] refresh token reuse detected; all sessions revoked');
      }

      return UNAUTHENTICATED('Your session has expired. Please sign in again.');
    }

    return reportRouteError('auth.refresh', error, 'Could not refresh your session.');
  }
}
