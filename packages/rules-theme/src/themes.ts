import type { ThemePlugin } from '@adysre/rules-types';
import { missingTokens, RULES_TOKENS, type RulesToken, type RulesTokens } from './tokens.ts';

/**
 * The themes that ship, and how a host makes its own.
 *
 * These are what a project with NO design system gets. A project that has one
 * defines the same variable names already, so the builder inherits it and these
 * are never used - which is the point of naming tokens after ADYSRE's rather
 * than inventing a private set.
 *
 * The colours are deliberately not ADYSRE's raw brand palette. A brand palette
 * is chosen for large surfaces - a button, a banner, a chart - and the builder
 * renders dense small text: `#f59e0b` reads beautifully as a filled badge and
 * sits at 2.1:1 as a sentence, which is a fail. So each accent here is the
 * text-safe variant of the same hue, and `auditTheme` is what proves it rather
 * than a claim in a comment.
 */

export const lightTokens: RulesTokens = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  card: '#ffffff',
  'card-foreground': '#0a0a0a',
  muted: '#f4f4f5',
  'muted-foreground': '#52525b',
  border: '#e4e4e7',
  input: '#8e8e99',
  ring: '#2563eb',
  primary: '#2563eb',
  'primary-foreground': '#ffffff',
  secondary: '#4f46e5',
  'secondary-foreground': '#ffffff',
  accent: '#0e7490',
  success: '#15803d',
  warning: '#b45309',
  danger: '#b91c1c',
  'danger-foreground': '#ffffff',
};

export const darkTokens: RulesTokens = {
  background: '#09090b',
  foreground: '#fafafa',
  card: '#18181b',
  'card-foreground': '#fafafa',
  muted: '#27272a',
  'muted-foreground': '#a1a1aa',
  border: '#3f3f46',
  input: '#71717a',
  ring: '#60a5fa',
  /*
   * Light fill, dark label - the inversion a dark theme needs rather than a
   * stylistic preference. White on blue-500 is 3.68:1 and fails; darkening the
   * fill until white passes puts a near-black button on a near-black page. The
   * audit is what turned that from a matter of taste into an answer.
   */
  primary: '#60a5fa',
  'primary-foreground': '#0a0a0a',
  secondary: '#818cf8',
  'secondary-foreground': '#0a0a0a',
  accent: '#22d3ee',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',
  'danger-foreground': '#0a0a0a',
};

export interface CreateThemeInput {
  id: string;
  tokens: Partial<RulesTokens>;
  /** Applied to the builder's root, when a host styles by class. */
  className?: string;
  /** The set to fill any gaps from. Light by default. */
  base?: RulesTokens;
  labelKey?: string;
}

/**
 * A theme, as a registry plugin.
 *
 * THROWS on a token this build does not know, at construction. A typo in a
 * theme is a programming error, and the moment to find it is when the theme is
 * declared rather than when somebody notices one panel is the wrong colour.
 * Missing tokens are filled from the base instead, because a partial theme is a
 * reasonable thing to write - "ADYSRE, but a different accent" should not mean
 * restating eighteen values.
 */
export function createRulesTheme(input: CreateThemeInput): ThemePlugin {
  const unknown = Object.keys(input.tokens).filter(
    (name) => !(RULES_TOKENS as readonly string[]).includes(name),
  );
  if (unknown.length > 0) {
    throw new Error(
      `Theme "${input.id}" sets tokens this build has no name for: ${unknown.join(', ')}.`,
    );
  }

  const tokens: RulesTokens = { ...(input.base ?? lightTokens), ...input.tokens };

  return {
    id: input.id,
    ...(input.labelKey === undefined ? {} : { labelKey: input.labelKey }),
    ...(input.className === undefined ? {} : { className: input.className }),
    tokens,
  };
}

export const lightRulesTheme: ThemePlugin = createRulesTheme({
  id: 'rules.light',
  labelKey: 'themes.light',
  tokens: lightTokens,
});

export const darkRulesTheme: ThemePlugin = createRulesTheme({
  id: 'rules.dark',
  labelKey: 'themes.dark',
  base: darkTokens,
  tokens: darkTokens,
});

/**
 * A theme as inline custom properties.
 *
 * The escape hatch for a host with no build step, and the way two builders on
 * one page can wear different themes: CSS variables cascade, so setting them on
 * a wrapper scopes the theme to that subtree. A stylesheet cannot do that
 * without a class per theme.
 *
 * Returned as a plain record rather than a style string, so React takes it as
 * `style={...}` directly and nothing has to be escaped.
 */
export function themeStyle(theme: Pick<ThemePlugin, 'tokens'>): Record<string, string> {
  const style: Record<string, string> = {};
  for (const [name, value] of Object.entries(theme.tokens)) style[`--${name}`] = value;
  return style;
}

/** Which tokens a plugin is missing, for a host checking one it was handed. */
export function incompleteTokens(theme: Pick<ThemePlugin, 'tokens'>): RulesToken[] {
  return missingTokens(theme.tokens as Partial<RulesTokens>);
}
