/**
 * Translatable prompt text, keyed by prompt id.
 *
 * Only the three human-readable fields live here. Everything else (category,
 * tier, tags, model, aspectRatio, createdAt…) stays in the category files, so a
 * prompt's metadata is defined exactly once and can't drift between languages.
 *
 * Every field is optional and falls back to the English source individually -
 * a half-translated prompt renders correctly rather than showing blanks.
 */
export interface PromptContent {
  title?: string;
  description?: string;
  body?: string;
}

export type PromptContentMap = Record<string, PromptContent>;
