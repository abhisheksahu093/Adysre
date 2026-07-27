import 'server-only';
import { prisma } from '@adysre/database';

/**
 * Who may change a workspace's plan without paying, and where.
 *
 * ─── WHY THIS IS NOT THE OLD COOKIE ─────────────────────────────────────────
 * The switcher this replaces flipped `adysre_access` in the browser, so anyone
 * could grant themselves premium from devtools. The decision now happens on the
 * SERVER: it reads the verified session, checks the role, checks an explicit
 * environment flag, and checks an optional allowlist. A client can ask; it
 * cannot decide.
 *
 * Three independent conditions, all of which must hold:
 *
 *   1. NOT production. Hard-coded, so no environment variable can switch it on
 *      where real money is involved.
 *   2. `BILLING_ALLOW_DIRECT_GRANT=true`. Off by default, so a developer who
 *      clones the repo does not get a free upgrade button by accident.
 *   3. If `BILLING_TEST_ACCOUNTS` is set, the caller's email is on it.
 *
 * The allowlist exists for shared environments: a preview deployment several
 * people use should not let all of them rewrite its billing state. Left unset,
 * any Owner or Admin of the workspace qualifies, which is right for a laptop.
 */

/** Emails permitted to switch plans, or null when unrestricted. */
function allowlist(): Set<string> | null {
  const raw = process.env.BILLING_TEST_ACCOUNTS;
  if (!raw?.trim()) return null;
  return new Set(
    raw
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  );
}

/** The environment half of the decision, with no knowledge of who is asking. */
export function directGrantEnabled(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.BILLING_ALLOW_DIRECT_GRANT === 'true'
  );
}

export interface SwitchEligibility {
  allowed: boolean;
  /** Why not, for a log. Never shown to the caller verbatim. */
  reason?: string;
}

/**
 * Whether this user may change their workspace's plan without paying.
 *
 * Takes the user id from the verified session and resolves the email itself:
 * an email supplied by the caller would make the allowlist decorative.
 */
export async function canSwitchPlan(userId: string): Promise<SwitchEligibility> {
  if (process.env.NODE_ENV === 'production') {
    return { allowed: false, reason: 'production' };
  }
  if (process.env.BILLING_ALLOW_DIRECT_GRANT !== 'true') {
    return { allowed: false, reason: 'BILLING_ALLOW_DIRECT_GRANT is not true' };
  }

  const permitted = allowlist();
  if (!permitted) return { allowed: true };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) return { allowed: false, reason: 'user not found' };
  if (!permitted.has(user.email.toLowerCase())) {
    return { allowed: false, reason: `${user.email} is not in BILLING_TEST_ACCOUNTS` };
  }
  return { allowed: true };
}
