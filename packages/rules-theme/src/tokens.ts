/**
 * The tokens the builder draws with.
 *
 * Derived from what the components actually use rather than invented: this is
 * the list you get by reading every `bg-`, `text-`, `border-` and `ring-` class
 * in `rules-ui` and `rules-devtools`. A token nobody uses is a promise a host
 * has to keep for nothing, and one the components use but the list omits is a
 * theme that silently half-applies.
 *
 * The NAMES match `@adysre/theme`, deliberately. A host that already has ADYSRE
 * loaded defines these variables already, so the builder inherits its design
 * system instead of imposing a second palette on the page - which is what
 * `ThemePlugin` meant by "token names, never colour literals". A host with no
 * design system imports this package's `tokens.css` and gets a readable default.
 */

export const RULES_TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'muted',
  'muted-foreground',
  'border',
  'input',
  'ring',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'accent',
  'success',
  'warning',
  'danger',
  'danger-foreground',
] as const;

export type RulesToken = (typeof RULES_TOKENS)[number];

/** A complete set. Partial themes are merged onto a base before use. */
export type RulesTokens = Readonly<Record<RulesToken, string>>;

export function isRulesToken(name: string): name is RulesToken {
  return (RULES_TOKENS as readonly string[]).includes(name);
}

/**
 * Which tokens a theme is missing.
 *
 * Reported rather than defaulted, because a token that quietly falls back is a
 * theme that looks applied and is not: half the builder in the host's colours
 * and half in somebody else's, which reads as a rendering bug rather than as an
 * incomplete theme.
 */
export function missingTokens(tokens: Partial<RulesTokens>): RulesToken[] {
  return RULES_TOKENS.filter((token) => {
    const value = tokens[token];
    return value === undefined || value.trim() === '';
  });
}
