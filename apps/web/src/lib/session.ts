import { fetchMe } from './auth';
import type { AccessLevel } from './access';

/**
 * The signed-in user shown in the profile menu and on the profile page.
 *
 * Reads `GET /api/auth/me`, which returns the profile from the DATABASE rather
 * than from token claims, so a name the user just changed appears immediately
 * instead of up to fifteen minutes later.
 */

export interface SessionUser {
  name: string;
  email: string;
  /**
   * Org role - what you may administer (Owner/Admin/Member).
   * Deliberately separate from `accessLevel`: an Owner on the free plan still
   * can't take premium templates, and a Member on a Team plan can.
   */
  role: string;
  /** What the user has paid for. Drives the premium paywall. */
  accessLevel: AccessLevel;
}

/**
 * What the UI shows before the profile has loaded, and when nobody is signed
 * in.
 *
 * This used to be a fake "Demo Owner" returned whenever the call FAILED, which
 * meant a signed-out user, an expired session and a broken database all
 * rendered as a plausible signed-in person. The UI could not tell that anything
 * was wrong, and neither could anyone testing it.
 *
 * Now it is visibly empty and `role` is empty, so a caller can distinguish
 * "not signed in" from "signed in as somebody". `accessLevel` stays `free`
 * because a fallback must never hand out paid content.
 */
export const ANONYMOUS_USER: SessionUser = {
  name: '',
  email: '',
  role: '',
  accessLevel: 'free',
};

/** Whether this is a real signed-in user rather than the anonymous placeholder. */
export function isSignedIn(user: SessionUser): boolean {
  return user.email !== '';
}

/**
 * Load the current user, or the anonymous placeholder when there is no session.
 *
 * A 401 is an expected answer here, not an error: it is what "you are signed
 * out" looks like, and this is called on pages that render for both states.
 */
export async function fetchProfile(): Promise<SessionUser> {
  try {
    const profile = await fetchMe();
    return {
      name: profile.user.name,
      email: profile.user.email,
      // The token's roles, which is what authorization actually uses. Falls
      // back to Member, the least privileged named role, rather than to Owner.
      role: profile.roles?.[0] ?? 'Member',
      // Resolved from the workspace's subscription by the endpoint, which fails
      // closed. The `??` covers an older deployment answering without the
      // field: absent means free, never premium.
      accessLevel: profile.accessLevel ?? 'free',
    };
  } catch {
    return ANONYMOUS_USER;
  }
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
