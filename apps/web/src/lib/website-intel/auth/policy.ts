import { SYSTEM_ROLES, type SystemRole } from '@adysre/types';
import {
  ACCESS_COOKIE,
  constantTimeEqual,
  verifyAccessToken,
  type PlatformSession,
} from '@/lib/auth/access-token';

/**
 * Pure authorization policy for Website Intelligence - no `server-only`, no
 * `next/headers`, no environment reads. Everything here is a plain function of
 * its inputs, so it is unit-testable in isolation. The framework wiring (reading
 * cookies and env) lives in `session.ts`, which delegates every decision here.
 *
 * Token verification itself is NOT module-specific and lives in
 * `lib/auth/access-token`, shared with the other modules that gate routes. What
 * stays here is the part that really is this module's: which roles may write,
 * and the dev escape hatch with its own cookie.
 */

export { ACCESS_COOKIE, constantTimeEqual, verifyAccessToken };

/** Dev-only escape-hatch cookie (see `session.ts`). Never trusted in production. */
export const DEV_SESSION_COOKIE = 'adysre_intel_dev';

/** The verified principal, mirrored from the API's `AuthContext`. */
export type IntelSession = PlatformSession;

/**
 * Roles allowed to mutate (run scans, manage schedules/channels). Reads only
 * need an authenticated session; writes need one of these. Coarser on purpose
 * than the full `module:resource:action` model, which the demo session lacks.
 */
export const WRITE_ROLES: readonly SystemRole[] = ['Owner', 'Admin', 'Manager'];

/** True when the session may perform mutating operations. */
export function canWrite(session: IntelSession): boolean {
  return session.roles.some((role) => WRITE_ROLES.includes(role));
}

function isSystemRole(value: string): value is SystemRole {
  return (SYSTEM_ROLES as readonly string[]).includes(value);
}

/**
 * Resolve the dev-only stand-in session from the escape-hatch cookie value.
 * MUST only ever be called outside production (enforced by the caller).
 *
 * Grammar (all parts optional): `<role>@<tenant>`
 *   - unset            → usable demo Owner in tenant `demo`
 *   - `Member`         → that role, tenant `demo`
 *   - `Owner@acme`     → that role, tenant `acme` (simulate a second org locally)
 *   - `@acme`          → default Owner, tenant `acme`
 *   - `anonymous`      → denied, so the unauthenticated path is testable
 * An unrecognised role falls back to Owner (never a silent deny).
 */
export function resolveDevSession(cookie: string | undefined): IntelSession | null {
  if (cookie === 'anonymous') return null;
  const [rolePart, tenantPart] = (cookie ?? '').split('@');
  const role: SystemRole = rolePart && isSystemRole(rolePart) ? rolePart : 'Owner';
  const tenantId = tenantPart?.trim() || 'demo';
  return { userId: `demo-user-${tenantId}`, tenantId, roles: [role], permissions: [] };
}
