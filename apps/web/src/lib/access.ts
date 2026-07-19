import type { LocalizedPrompt } from '@/data/prompts';

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

/** True when this prompt is paid content the given level can't use. */
export function isLockedFor(tier: 'free' | 'premium', level: AccessLevel): boolean {
  return tier === 'premium' && !isPremium(level);
}

/**
 * Strip the body of every prompt the user hasn't paid for.
 *
 * ─── WHY THIS EXISTS ────────────────────────────────────────────────────────
 * Hiding the Copy button is not access control. The prompt list is serialised
 * into the RSC payload, so an unredacted `body` is readable from devtools by
 * anyone, locked UI or not. The paywall has to be enforced where the data is
 * produced - here, on the server - and the UI lock is only the polite version
 * of the same decision.
 *
 * MUST be called on the server, with a level resolved from a trusted session.
 * See `getAccessLevel` in `lib/access-server.ts`.
 */
export function redactLockedPrompts(
  prompts: LocalizedPrompt[],
  level: AccessLevel,
): LocalizedPrompt[] {
  return prompts.map((prompt) => {
    const locked = isLockedFor(prompt.tier, level);
    if (!locked) return { ...prompt, locked: false };
    // Title, description and tags stay: users must be able to browse and search
    // what they'd be buying. Only the payload they're paying for is withheld.
    return { ...prompt, locked: true, body: '' };
  });
}
