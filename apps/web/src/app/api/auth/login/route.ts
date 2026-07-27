import { loginSchema } from '@adysre/validators';
import {
  ACCOUNT_LOCKED,
  INVALID_CREDENTIALS,
  RATE_LIMITED,
  TENANT_AMBIGUOUS,
  ok,
  reportRouteError,
} from '@/lib/api/response';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { setAuthCookies } from '@/lib/auth/cookies';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import {
  AccountLockedError,
  InvalidCredentialsError,
  TenantAmbiguousError,
} from '@/lib/auth/service/errors';
import { login } from '@/lib/auth/service/login.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/login
 *
 * Same-origin, so the cookies it sets are sent on every subsequent request to
 * this deployment without any cross-site cookie policy. That is the whole
 * reason authentication moved into the web app.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const parsed = loginSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalid(parsed.error);

  // Limited by IP and by email, and either can trip. Per-IP alone misses a slow
  // distributed attack on one account; per-email alone lets a single IP spray
  // many accounts.
  const ip = clientIp(request);
  const byIp = await rateLimit(`login:ip:${ip}`, { max: 10, windowSec: 900 });
  if (!byIp.ok) return RATE_LIMITED(byIp.retryAfter);

  const byEmail = await rateLimit(`login:email:${parsed.data.email.toLowerCase()}`, {
    max: 10,
    windowSec: 900,
  });
  if (!byEmail.ok) return RATE_LIMITED(byEmail.retryAfter);

  const context = requestContext(request);

  try {
    const result = await login(parsed.data, context);

    await setAuthCookies(result);
    await recordAuthEvent(
      { tenantId: result.tenantId, actorId: result.userId, ...context },
      'auth.login.success',
    );

    return ok(
      {
        userId: result.userId,
        tenantId: result.tenantId,
        requiresEmailVerification: result.requiresEmailVerification,
      },
      'Signed in.',
    );
  } catch (error) {
    if (error instanceof TenantAmbiguousError) return TENANT_AMBIGUOUS(error.workspaces);

    if (error instanceof AccountLockedError) return ACCOUNT_LOCKED(error.until);

    if (error instanceof InvalidCredentialsError) {
      // Not audited here: the service does not know which account was meant,
      // and there is no tenant to attribute an unknown address to. Failures
      // against a REAL account are counted by recordFailedLogin, which is what
      // drives lockout.
      return INVALID_CREDENTIALS();
    }

    return reportRouteError('auth.login', error, 'Could not sign you in.');
  }
}
