import { jwtVerify } from 'jose';
import { SYSTEM_ROLES, type SystemRole, type Permission } from '@adysre/types';

/**
 * Pure authorization policy for Website Intelligence - no `server-only`, no
 * `next/headers`, no environment reads. Everything here is a plain function of
 * its inputs, so it is unit-testable in isolation. The framework wiring (reading
 * cookies and env) lives in `session.ts`, which delegates every decision here.
 */

/** Matches `ACCESS_COOKIE` in `apps/api/src/modules/auth/auth-cookies.ts`. */
export const ACCESS_COOKIE = 'access_token';

/** Dev-only escape-hatch cookie (see `session.ts`). Never trusted in production. */
export const DEV_SESSION_COOKIE = 'adysre_intel_dev';

/** The verified principal, mirrored from the API's `AuthContext`. */
export interface IntelSession {
  userId: string;
  tenantId: string;
  roles: SystemRole[];
  permissions: Permission[];
}

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
 * Verify an API-issued access token and project it to an `IntelSession`.
 * Returns `null` on any failure - bad signature, expired, or missing the
 * identity claims - so callers fail closed. The token shape is fixed by
 * `apps/api/.../token.service.ts` (HS256, `{ sub, tenantId, roles, permissions }`).
 */
export async function verifyAccessToken(
  token: string,
  secret: string,
): Promise<IntelSession | null> {
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

/** Length-independent constant-time string compare (avoid leaking via timing). */
export function constantTimeEqual(a: string, b: string): boolean {
  let mismatch = a.length ^ b.length;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i % Math.max(b.length, 1));
  }
  return mismatch === 0;
}
