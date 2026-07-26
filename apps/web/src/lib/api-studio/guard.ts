import 'server-only';
import type { NextResponse } from 'next/server';
import type { ApiStudioPermission } from '@adysre/types';
import type { PlatformSession } from '@/lib/auth/access-token';
import { FORBIDDEN, UNAUTHENTICATED } from '@/lib/api/response';
import { can } from './auth-policy';
import { getSession } from './session';

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
  const session = await getSession();
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
