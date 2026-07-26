import { jwtVerify } from 'jose';
import { SYSTEM_ROLES, type Permission, type SystemRole } from '@adysre/types';

/**
 * Verifying the platform's access token, for any module that needs a principal.
 *
 * This does NOT reimplement authentication. The API (`apps/api`) issues an
 * HTTP-only `access_token` on login; every module in the web app verifies that
 * same token with the shared `JWT_ACCESS_SECRET`. Roles and permissions ride in
 * the token, so a decision needs no round trip and the API need not be running.
 *
 * Pure by design: no `server-only`, no `next/headers`, no environment reads.
 * Reading cookies and env is the caller's job, which is what makes every rule
 * here unit-testable. Website Intelligence and API Studio both consume it, so
 * there is one implementation of "who is this" rather than one per module.
 */

/** Matches `ACCESS_COOKIE` in `apps/api/src/modules/auth/auth-cookies.ts`. */
export const ACCESS_COOKIE = 'access_token';

/** The verified principal, mirrored from the API's `AuthContext`. */
export interface PlatformSession {
  userId: string;
  tenantId: string;
  roles: SystemRole[];
  permissions: Permission[];
}

export function isSystemRole(value: string): value is SystemRole {
  return (SYSTEM_ROLES as readonly string[]).includes(value);
}

/**
 * Verify an API-issued access token and project it to a {@link PlatformSession}.
 *
 * Returns `null` on any failure - bad signature, expired, or missing identity
 * claims - so callers fail closed. The token shape is fixed by
 * `apps/api/.../token.service.ts` (HS256, `{ sub, tenantId, roles, permissions }`).
 */
export async function verifyAccessToken(
  token: string,
  secret: string,
): Promise<PlatformSession | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const userId = typeof payload.sub === 'string' ? payload.sub : '';
    const tenantId = typeof payload.tenantId === 'string' ? payload.tenantId : '';
    if (!userId || !tenantId) return null;
    return {
      userId,
      tenantId,
      roles: toRoles(payload.roles),
      permissions: toPermissions(payload.permissions),
    };
  } catch {
    return null;
  }
}

function toRoles(value: unknown): SystemRole[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is SystemRole => typeof v === 'string' && isSystemRole(v));
}

function toPermissions(value: unknown): Permission[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is Permission => typeof v === 'string' && v.split(':').length === 3);
}

/** Length-independent constant-time string compare (avoid leaking via timing). */
export function constantTimeEqual(a: string, b: string): boolean {
  let mismatch = a.length ^ b.length;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i % Math.max(b.length, 1));
  }
  return mismatch === 0;
}
