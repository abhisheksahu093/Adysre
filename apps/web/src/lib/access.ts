/**
 * What the current workspace is entitled to.
 *
 * Deliberately coarse: it maps to the pricing tiers, not to roles. Roles
 * (Owner/Admin/Member) answer "what may you administer"; this answers "what has
 * the workspace paid for". Different questions, and conflating them is how an
 * Admin on the free plan ends up with paid content.
 *
 * These values mirror `SubscriptionTier` in `lib/entitlements/types.ts`, which
 * mirrors the database enum. This module stays separate because the template
 * gallery and its data import it, and those must not pull in the server-only
 * entitlement stack.
 */
export const ACCESS_LEVELS = ['free', 'premium', 'enterprise'] as const;
export type AccessLevel = (typeof ACCESS_LEVELS)[number];

/**
 * Whether this level unlocks paid content.
 *
 * Written as "not free" rather than "is premium" deliberately: a fourth tier
 * added tomorrow should unlock paid content by default, rather than being
 * silently treated as free because nobody remembered to extend this.
 */
export function isPremium(level: AccessLevel): boolean {
  return level !== 'free';
}

/** True when this tier is paid content the given level can't use. */
export function isLockedFor(tier: 'free' | 'premium', level: AccessLevel): boolean {
  return tier === 'premium' && !isPremium(level);
}
