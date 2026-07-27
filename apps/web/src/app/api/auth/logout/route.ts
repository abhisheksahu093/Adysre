import { ok } from '@/lib/api/response';
import { getAuthSession } from '@/lib/auth/guard';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { clearAuthCookies, readRefreshCookie } from '@/lib/auth/cookies';
import { verifyOrigin } from '@/lib/auth/http';
import { revokeByRefreshToken } from '@/lib/auth/service/refresh.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/logout
 *
 * Revokes the session row and clears both cookies.
 *
 * **Always answers 200, even with no valid session.** There is nothing to
 * protect here: the outcome is "you are signed out" either way, and a logout
 * that can fail leaves a user stuck on a page they cannot leave. The cookies
 * are cleared before anything that could throw, so the browser is signed out
 * even if the database is unreachable.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const session = await getAuthSession();
  const token = await readRefreshCookie();

  // First and unconditionally. Everything after this is best effort.
  await clearAuthCookies();

  // Never throws: the service swallows and logs its own failures, because a
  // database outage must not turn a logout into a 500.
  await revokeByRefreshToken(token);

  if (session) {
    await recordAuthEvent(
      { tenantId: session.tenantId, actorId: session.userId, ...requestContext(request) },
      'auth.logout',
    );
  }

  return ok({ signedOut: true }, 'Signed out.');
}
