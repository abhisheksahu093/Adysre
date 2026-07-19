import type { Accent } from '@/data/landing';

/**
 * Accent family → token-based utility classes.
 *
 * Tailwind only ships classes it can see as complete literals, so an accent's
 * styling can't be assembled as `bg-${accent}`. These static maps are the one
 * place that translation lives, shared by every landing section (Rule 3 - never
 * duplicate). Values are theme tokens, never hardcoded colours.
 */

/** Tinted icon chip: soft background plus matching foreground. */
export const ACCENT_ICON: Record<Accent, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
};

/** Foreground-only accent, e.g. for a step number or inline mark. */
export const ACCENT_TEXT: Record<Accent, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
};

/** Hairline that warms to the accent on hover, for interactive cards. */
export const ACCENT_HOVER_BORDER: Record<Accent, string> = {
  primary: 'hover:border-primary/40',
  secondary: 'hover:border-secondary/40',
  accent: 'hover:border-accent/40',
};
