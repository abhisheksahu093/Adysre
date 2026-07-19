/**
 * Prompt Library schema - the contract every prompt file conforms to.
 *
 * Everything filterable is a `const` list here, and the types are derived from
 * those lists. That means a typo (`categroy: 'protrait'`, `model: ['Fluxx']`)
 * fails `pnpm typecheck` instead of silently producing a prompt that no filter
 * can ever reach - the failure mode that actually bites at 1,000+ entries.
 */

export const PROMPT_CATEGORIES = [
  { id: 'portrait', label: 'Portrait' },
  { id: 'headshot', label: 'Headshot' },
  { id: 'business', label: 'Business' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'travel', label: 'Travel' },
  { id: 'nature', label: 'Nature' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'automotive', label: 'Automotive' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'sci-fi', label: 'Sci-Fi' },
  { id: 'anime', label: 'Anime' },
  { id: 'artistic', label: 'Artistic' },
] as const;

export type PromptCategory = (typeof PROMPT_CATEGORIES)[number]['id'];

export const PROMPT_TIERS = [
  { id: 'free', label: 'Free' },
  { id: 'premium', label: 'Premium' },
] as const;

export type PromptTier = (typeof PROMPT_TIERS)[number]['id'];

/** Generators a prompt is known to produce good results on. */
export const PROMPT_MODELS = [
  { id: 'gpt-image', label: 'GPT Image' },
  { id: 'flux', label: 'FLUX' },
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'sdxl', label: 'SDXL' },
] as const;

export type PromptModel = (typeof PROMPT_MODELS)[number]['id'];

export const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square' },
  { id: '4:5', label: '4:5 Portrait' },
  { id: '3:4', label: '3:4 Portrait' },
  { id: '9:16', label: '9:16 Story' },
  { id: '16:9', label: '16:9 Wide' },
] as const;

export type AspectRatio = (typeof ASPECT_RATIOS)[number]['id'];

export const PROMPT_STYLES = [
  { id: 'photorealistic', label: 'Photorealistic' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'monochrome', label: 'Monochrome' },
  { id: 'painterly', label: 'Painterly' },
  { id: 'illustrated', label: 'Illustrated' },
  { id: '3d-render', label: '3D Render' },
  { id: 'anime', label: 'Anime' },
] as const;

export type PromptStyle = (typeof PROMPT_STYLES)[number]['id'];

export interface Prompt {
  /** Unique, kebab-case, stable - it's the React key and the future DB id. */
  id: string;
  title: string;
  /** One line shown under the title on the card. */
  description: string;
  /** The full prompt text - this is what Copy puts on the clipboard. */
  body: string;
  category: PromptCategory;
  tier: PromptTier;
  /** Lowercase keywords. Required: search is only as good as its tags. */
  tags: string[];
  /**
   * Path under apps/web/public, e.g. `/prompts/golden-hour.webp`.
   * Optional - falls back to the category placeholder, so a prompt can ship
   * before its artwork exists.
   */
  image?: string;
  style?: PromptStyle;
  aspectRatio?: AspectRatio[];
  model?: PromptModel[];
  /** Hand-picked showcase prompts. */
  featured?: boolean;
  /**
   * Popular right now. Hand-set for launch; this should become derived from
   * real copy/generate counts once the API exists - a hardcoded flag can't
   * actually track what's trending.
   */
  trending?: boolean;
  /**
   * ISO date (YYYY-MM-DD). "New" is derived from this rather than stored as a
   * flag: a `new: true` boolean is written once and never unset, so at 1,260
   * prompts every one of them stays "new" forever.
   */
  createdAt: string;
}

/** How long a prompt counts as New. */
export const NEW_WINDOW_DAYS = 30;

export function isNew(prompt: Prompt, now: number = Date.now()): boolean {
  const created = new Date(prompt.createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return (now - created) / 86_400_000 <= NEW_WINDOW_DAYS;
}

/** Resolve a prompt's artwork, falling back to its category placeholder. */
export function promptImage(prompt: Prompt): string {
  return prompt.image ?? `/prompts/categories/${prompt.category}.svg`;
}
