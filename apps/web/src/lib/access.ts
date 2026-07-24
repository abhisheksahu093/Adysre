/**
 * What the current user is entitled to.
 *
 * Kept deliberately coarse for now - it maps to the pricing tiers, not to
 * roles. Roles (Owner/Admin/Member) answer "what may you administer"; this
 * answers "what have you paid for". They are different questions.
 */
export const ACCESS_LEVELS = ['free', 'premium'] as const;
export type AccessLevel = (typeof ACCESS_LEVELS)[number];

/**
 * Dev stand-in for a real entitlement claim, read by `getAccessLevel`.
 * Lives here rather than in `access-server.ts` because that module is
 * `server-only` and the dev switcher (a Client Component) needs the name too.
 */
export const ACCESS_COOKIE = 'adysre_access';

export function isPremium(level: AccessLevel): boolean {
  return level === 'premium';
}

/** True when this tier is paid content the given level can't use. */
export function isLockedFor(tier: 'free' | 'premium', level: AccessLevel): boolean {
  return tier === 'premium' && !isPremium(level);
}
