import 'server-only';
import type { NextResponse } from 'next/server';
import type { ApiStudioPermission } from '@adysre/types';
import type { PlatformSession } from '@/lib/auth/access-token';
import { FORBIDDEN, UNAUTHENTICATED, UNAVAILABLE } from '@/lib/api/response';
import { can } from './auth-policy';
import { getSession, StorageUnavailableError } from './session';

/**
 * Route-handler authorization for `/api/api-studio/*`.
 *
 * Every endpoint starts with one call:
 *
 *   const auth = await authorize(API_STUDIO_PERMISSIONS.collectionRead);
 *   if (!auth.ok) return auth.response;
 *   // auth.session is a verified principal from here on
 *
 * The order is fixed and matters: authenticate, then check the permission, then
 * scope every query by `auth.session.tenantId` (AUTHENTICATION_RBAC.md asks for
 * tenant before permissions; here the tenant IS the session, so it cannot be
 * skipped or spoofed by a body field).
 */

type Authorized = { ok: true; session: PlatformSession };
type Denied = { ok: false; response: NextResponse };

export async function authorize(
  permission: ApiStudioPermission,
): Promise<Authorized | Denied> {
  let session: PlatformSession | null;
  try {
    session = await getSession();
  } catch (error) {
    // Resolving a development session reads the seeded tenant, so the database
    // can fail before any repository is reached. That is a 503, not a 500 with
    // a stack trace, and not a 401 that would send someone to fix their login.
    if (error instanceof StorageUnavailableError) return { ok: false, response: UNAVAILABLE() };
    throw error;
  }

  if (!session) {
    return { ok: false, response: UNAUTHENTICATED('Sign in to use API Studio.') };
  }
  if (!can(session, permission)) {
    return {
      ok: false,
      response: FORBIDDEN(`Your role cannot perform this action (${permission}).`),
    };
  }
  return { ok: true, session };
}
