/**
 * Translatable component text, keyed by slug.
 *
 * Same split as the prompt library: metadata (category, tags, frameworks,
 * dates, deps) lives in the registry and is defined exactly once; only prose
 * lives here, per locale. That keeps a component's facts from drifting between
 * languages, and keeps 700 entries from becoming 700 x 4 entries to maintain.
 *
 * Every field is optional and falls back to English individually - a
 * half-translated component renders correctly rather than showing blanks.
 */
export interface ComponentContent {
  title?: string;
  description?: string;
  /** Long-form "how to adapt this" prose shown under Customization. */
  customization?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export type ComponentContentMap = Record<string, ComponentContent>;
