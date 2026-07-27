import { updateProfileSchema } from '@adysre/validators';
import { NOT_FOUND, RATE_LIMITED, ok, reportRouteError } from '@/lib/api/response';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { requireAuth } from '@/lib/auth/guard';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { rateLimit } from '@/lib/auth/rate-limit';
import { findProfile, updateProfile } from '@/lib/auth/repository/user.repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/auth/profile
 *
 * Updates your own name or avatar.
 *
 * Email is not editable here. Changing an address needs a verification round
 * trip through `email_verifications` (Phase 6), and `updateProfileSchema` is
 * `.strict()` so sending one is a 400 rather than a silent no-op that reports
 * success while nothing changed.
 */
export async function PATCH(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const limit = await rateLimit(`profile:${auth.session.userId}`, { max: 30, windowSec: 60 });
  if (!limit.ok) return RATE_LIMITED(limit.retryAfter);

  const parsed = updateProfileSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalid(parsed.error);

  try {
    // Scoped by tenant in the WHERE clause, so the database enforces ownership
    // rather than a fetch-then-compare in application code.
    const updated = await updateProfile(auth.session.tenantId, auth.session.userId, parsed.data);
    if (!updated) return NOT_FOUND('Your account could not be found.');

    await recordAuthEvent(
      {
        tenantId: auth.session.tenantId,
        actorId: auth.session.userId,
        ...requestContext(request),
      },
      'auth.profile.updated',
      { fields: Object.keys(parsed.data) },
    );

    // Re-read and return the whole profile, so the client does not have to
    // guess what the server stored and can replace its cache outright.
    const profile = await findProfile(auth.session.tenantId, auth.session.userId);
    if (!profile) return NOT_FOUND('Your account could not be found.');

    return ok(
      {
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          emailVerifiedAt: profile.emailVerifiedAt,
          lastLoginAt: profile.lastLoginAt,
        },
        organization: profile.organization,
      },
      'Profile updated.',
    );
  } catch (error) {
    return reportRouteError('auth.profile', error, 'Could not update your profile.');
  }
}
