import {
  TAVOLA_CATEGORIES,
  TAVOLA_CONTENT,
  TAVOLA_COPY,
  TAVOLA_DISHES,
  TAVOLA_POSTS,
  TAVOLA_REVIEWS,
  TAVOLA_STEPS,
  type TavolaCategory,
  type TavolaCopy,
  type TavolaDish,
  type TavolaPost,
  type TavolaReview,
  type TavolaStep,
} from '@/data/templates/tavola-kitchen-content';
import {
  TAVOLA_CATEGORIES_JA,
  TAVOLA_CONTENT_JA,
  TAVOLA_COPY_JA,
  TAVOLA_DISHES_JA,
  TAVOLA_POSTS_JA,
  TAVOLA_REVIEWS_JA,
  TAVOLA_STEPS_JA,
} from '@/data/templates/tavola-kitchen-content-ja';
import type { TemplateContent } from '@/data/templates/types';
import type { TavolaLocaleId } from './tavola-settings';

/**
 * TAVOLA - everything the restaurant renders, per language.
 *
 * The whole catalogue is localised, not just the chrome: a visitor reading in
 * Japanese should see 「サフランのリゾット」 on the card, in the menu filter and in
 * the basket, not an English dish name inside a Japanese page.
 *
 * The two bundles are structurally identical BY CONTRACT - same ids, same
 * hrefs, same prices, same array order - because ids drive filtering, the
 * basket and `?page=` routing. `tavola-locale-parity.test.ts` asserts it.
 */
export interface TavolaBundle {
  content: TemplateContent;
  copy: TavolaCopy;
  categories: TavolaCategory[];
  dishes: TavolaDish[];
  steps: TavolaStep[];
  posts: TavolaPost[];
  reviews: TavolaReview[];
}

export const TAVOLA_BUNDLES: Record<TavolaLocaleId, TavolaBundle> = {
  en: {
    content: TAVOLA_CONTENT,
    copy: TAVOLA_COPY,
    categories: TAVOLA_CATEGORIES,
    dishes: TAVOLA_DISHES,
    steps: TAVOLA_STEPS,
    posts: TAVOLA_POSTS,
    reviews: TAVOLA_REVIEWS,
  },
  ja: {
    content: TAVOLA_CONTENT_JA,
    copy: TAVOLA_COPY_JA,
    categories: TAVOLA_CATEGORIES_JA,
    dishes: TAVOLA_DISHES_JA,
    steps: TAVOLA_STEPS_JA,
    posts: TAVOLA_POSTS_JA,
    reviews: TAVOLA_REVIEWS_JA,
  },
};
