import { registerSchema } from '@adysre/validators';
import { CONFLICT, RATE_LIMITED, created, reportRouteError } from '@/lib/api/response';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { setAuthCookies } from '@/lib/auth/cookies';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import { EmailRegisteredError, SlugTakenError } from '@/lib/auth/service/errors';
// The verification link is issued inside `register`, not here, so no caller can
// create an account without one.
import { register } from '@/lib/auth/service/register.service';

/** bcrypt and Prisma are not Edge-compatible. */
export const runtime = 'nodejs';
/** Sets cookies, so it must never be statically cached. */
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/register
 *
 * Creates a workspace, its Owner, and a signed-in session.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  // Before any database work. A limiter that runs after the reads still lets a
  // caller exhaust the database, which is most of what the limit is for.
  const limit = await rateLimit(`register:${clientIp(request)}`, { max: 5, windowSec: 3600 });
  if (!limit.ok) return RATE_LIMITED(limit.retryAfter);

  const parsed = registerSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalid(parsed.error);

  const context = requestContext(request);

  try {
    const result = await register(parsed.data, context);

    await setAuthCookies(result);
    await recordAuthEvent(
      { tenantId: result.tenantId, actorId: result.userId, ...context },
      'auth.register',
      { organizationSlug: parsed.data.organizationSlug },
    );

    return created({ userId: result.userId, tenantId: result.tenantId }, 'Workspace created.');
  } catch (error) {
    if (error instanceof SlugTakenError) return CONFLICT(error.code, error.message);
    if (error instanceof EmailRegisteredError) return CONFLICT(error.code, error.message);
    return reportRouteError('auth.register', error, 'Could not create the workspace.');
  }
}
