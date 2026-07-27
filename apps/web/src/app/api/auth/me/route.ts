import { NOT_FOUND, ok, reportRouteError } from '@/lib/api/response';
import { requireAuth } from '@/lib/auth/guard';
import { findProfile } from '@/lib/auth/repository/user.repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/me
 *
 * The signed-in user, their workspace, and what they may do.
 *
 * Profile fields are read from the DATABASE, while roles and permissions come
 * from the verified token. That split is deliberate. The token is up to fifteen
 * minutes stale, so a name the user just changed would still show the old value
 * and read as a bug. Authorization keeps using the token, because that is what
 * every other route authorizes against and a second source would let this
 * endpoint disagree with them.
 */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const profile = await findProfile(auth.session.tenantId, auth.session.userId);

    // A valid token whose user is gone: deleted, or moved tenants. The token is
    // still cryptographically fine, so this is not a 401.
    if (!profile) return NOT_FOUND('Your account could not be found.');

    return ok({
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        emailVerifiedAt: profile.emailVerifiedAt,
        lastLoginAt: profile.lastLoginAt,
      },
      organization: profile.organization,
      roles: auth.session.roles,
      permissions: auth.session.permissions,
    });
  } catch (error) {
    return reportRouteError('auth.me', error, 'Could not load your profile.');
  }
}
