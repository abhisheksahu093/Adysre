/**
 * Prompt Library - public entry point.
 *
 * ─── Adding a prompt ────────────────────────────────────────────────────────
 * Open the file for its category (e.g. `./portrait.ts`) and append one object.
 * That's it - the card, search, and every filter pick it up automatically.
 * TypeScript rejects an unknown category, tier, model, style or aspect ratio,
 * so a typo fails at build time rather than producing a prompt no filter can
 * reach.
 *
 * ─── Adding a category ──────────────────────────────────────────────────────
 * 1. Add it to PROMPT_CATEGORIES in `./types.ts`.
 * 2. Create `./<category>.ts` exporting `<name>Prompts: Prompt[]`.
 * 3. Import it and spread it into PROMPTS below.
 * 4. Add a placeholder at `public/prompts/categories/<category>.svg`.
 *
 * The rest of the app imports only from `@/data/prompts` - never from the
 * individual category files - so this stays the one seam to maintain.
 */

import type { Prompt } from './types';
import type { PromptContentMap } from './content/types';

import { portraitPrompts } from './portrait';
import { headshotPrompts } from './headshot';
import { businessPrompts } from './business';
import { fashionPrompts } from './fashion';
import { lifestylePrompts } from './lifestyle';
import { cinematicPrompts } from './cinematic';
import { travelPrompts } from './travel';
import { naturePrompts } from './nature';
import { fitnessPrompts } from './fitness';
import { automotivePrompts } from './automotive';
import { editorialPrompts } from './editorial';
import { fantasyPrompts } from './fantasy';
import { sciFiPrompts } from './sci-fi';
import { animePrompts } from './anime';
import { artisticPrompts } from './artistic';

export * from './types';

export const PROMPTS: Prompt[] = [
  ...portraitPrompts,
  ...headshotPrompts,
  ...businessPrompts,
  ...fashionPrompts,
  ...lifestylePrompts,
  ...cinematicPrompts,
  ...travelPrompts,
  ...naturePrompts,
  ...fitnessPrompts,
  ...automotivePrompts,
  ...editorialPrompts,
  ...fantasyPrompts,
  ...sciFiPrompts,
  ...animePrompts,
  ...artisticPrompts,
];

/**
 * Duplicate ids would break React keys and silently shadow a prompt. With
 * content split across 15 files a collision is easy to miss in review, so fail
 * loudly in development instead.
 */
if (process.env.NODE_ENV !== 'production') {
  const seen = new Set<string>();
  const duplicates = PROMPTS.filter((p) => (seen.has(p.id) ? true : (seen.add(p.id), false)));
  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate prompt ids in @/data/prompts: ${[...new Set(duplicates.map((d) => d.id))].join(', ')}`,
    );
  }
}

/** Every tag in use, deduped and sorted - drives tag suggestions. */
export const ALL_TAGS: string[] = [...new Set(PROMPTS.flatMap((p) => p.tags))].sort();

/** Count of prompts per category, for filter labels. */
export function countByCategory(prompts: Prompt[]): Record<string, number> {
  return prompts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
}

export const CATEGORY_COUNTS: Record<string, number> = countByCategory(PROMPTS);

/** Total number of prompts - the single source of truth for counts. */
export const PROMPT_COUNT = PROMPTS.length;

/** Prompts available on the free tier (the rest are premium). */
export const FREE_PROMPT_COUNT = PROMPTS.filter((p) => p.tier === 'free').length;

/** Number of distinct prompt categories. */
export const PROMPT_CATEGORY_COUNT = Object.keys(CATEGORY_COUNTS).length;

/** A prompt resolved for a locale, plus whether its text is still English. */
export interface LocalizedPrompt extends Prompt {
  /**
   * True when no translated body exists for this locale, so the card is showing
   * the English original. Surfaced in the dialog - a silent fallback would let
   * an untranslated prompt hide indefinitely once the library grows.
   */
  untranslated: boolean;
  /**
   * Premium content the current user hasn't paid for. When true, `body` has
   * been redacted server-side - see `redactLockedPrompts`. Defaults to false
   * here; only the server sets it, because only the server can be trusted to.
   */
  locked: boolean;
}

/**
 * Prompts with their text in `locale`, falling back to English per field.
 *
 * Call this from a Server Component and pass the result down: the import is
 * dynamic so a visitor only ever downloads their own language's prompt text,
 * not all four catalogues.
 */
export async function getPrompts(locale: string): Promise<LocalizedPrompt[]> {
  const asEnglish = (prompt: Prompt): LocalizedPrompt => ({
    ...prompt,
    untranslated: false,
    locked: false,
  });

  if (locale === 'en') return PROMPTS.map(asEnglish);

  let overrides: PromptContentMap = {};
  try {
    const mod = (await import(`./content/${locale}`)) as { default?: PromptContentMap };
    overrides = mod.default ?? {};
  } catch {
    // No catalogue for this locale yet - English is a correct result, not an
    // error, but every prompt is then untranslated.
    return PROMPTS.map((p) => ({ ...p, untranslated: true, locked: false }));
  }

  return PROMPTS.map((prompt) => {
    const t = overrides[prompt.id];
    return {
      ...prompt,
      title: t?.title ?? prompt.title,
      description: t?.description ?? prompt.description,
      body: t?.body ?? prompt.body,
      untranslated: t?.body === undefined,
      locked: false,
    };
  });
}
