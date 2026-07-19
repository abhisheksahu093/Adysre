import 'server-only';
import { cookies } from 'next/headers';
import { ACCESS_COOKIE, ACCESS_LEVELS, type AccessLevel } from './access';

/**
 * The current user's entitlement, resolved on the server.
 *
 * ─── NOT SECURE YET ─────────────────────────────────────────────────────────
 * This reads a plain cookie the browser can set, so today it is a development
 * switch, not an entitlement check - anyone can hand themselves premium with
 * one line in devtools. It exists so the paywall is wired end-to-end and the
 * redaction path is real; the trust boundary is the only piece missing.
 *
 * When auth lands, replace the cookie read with the session:
 *   1. Read the HTTP-only access token (AUTHENTICATION_RBAC.md).
 *   2. Resolve entitlement server-side from the subscription record - never
 *      from anything the client can write.
 *   3. Keep returning 'free' on any failure. Defaulting closed means a bug
 *      denies access rather than giving the library away.
 */
export async function getAccessLevel(): Promise<AccessLevel> {
  const store = await cookies();
  const value = store.get(ACCESS_COOKIE)?.value;
  return ACCESS_LEVELS.includes(value as AccessLevel) ? (value as AccessLevel) : 'free';
}
