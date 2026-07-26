import {
  API_STUDIO_ROLE_PERMISSIONS,
  hasPermission,
  type ApiStudioPermission,
  type ApiStudioRole,
  type Permission,
  type SystemRole,
} from '@adysre/types';
import type { PlatformSession } from '@/lib/auth/access-token';

/**
 * Pure authorization policy for API Studio: no cookies, no environment, no
 * database, so every rule here is unit-testable on its own. The wiring lives in
 * `session.ts` and `guard.ts`, which delegate every decision to this file.
 */

/** Dev-only escape-hatch cookie (see `session.ts`). Never trusted in production. */
export const DEV_SESSION_COOKIE = 'adysre_api_studio_dev';

/**
 * Platform role to module role.
 *
 * A token issued today carries system roles and, for a while yet, no module
 * permissions at all. Rather than deny every request until the API grants
 * `api-studio:*`, a system role maps to the module role with equivalent reach.
 * When the token does carry module permissions they WIN: this map is a
 * fallback, never an escalation over what the token actually says.
 */
const ROLE_MAP: Record<SystemRole, ApiStudioRole | null> = {
  Owner: 'admin',
  Admin: 'admin',
  Manager: 'developer',
  Member: 'developer',
  Custom: 'viewer',
};

/** The module permissions a session effectively holds. */
export function effectivePermissions(session: PlatformSession): readonly Permission[] {
  const fromToken = session.permissions.filter((permission) =>
    permission.startsWith('api-studio:'),
  );
  if (fromToken.length > 0) return fromToken;

  // Union across the session's roles: someone who is both Manager and Admin
  // gets the wider of the two, never the narrower.
  const granted = new Set<Permission>();
  for (const role of session.roles) {
    const moduleRole = ROLE_MAP[role];
    if (!moduleRole) continue;
    for (const permission of API_STUDIO_ROLE_PERMISSIONS[moduleRole]) granted.add(permission);
  }
  return [...granted];
}

/** Whether a session may perform an action. Deny by default. */
export function can(session: PlatformSession, permission: ApiStudioPermission): boolean {
  return hasPermission(effectivePermissions(session), permission);
}

/**
 * Whether a row belongs to the caller's tenant.
 *
 * Every repository already filters by `tenantId`, so this is the second check
 * of the same thing, on purpose: tenant isolation is the one boundary where a
 * single forgotten `where` clause is a data breach rather than a bug.
 */
export function ownsTenant(session: PlatformSession, tenantId: string): boolean {
  return session.tenantId === tenantId;
}
