import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  TAVOLA_CATEGORIES,
  TAVOLA_CONTENT,
  TAVOLA_COPY,
  TAVOLA_DISHES,
  TAVOLA_PAGES,
  TAVOLA_POSTS,
  TAVOLA_REVIEWS,
  TAVOLA_STEPS,
  TAVOLA_STEP_ICONS,
  toTavolaPage,
} from './tavola-kitchen-content';
import {
  TAVOLA_CATEGORIES_JA,
  TAVOLA_CONTENT_JA,
  TAVOLA_COPY_JA,
  TAVOLA_DISHES_JA,
  TAVOLA_POSTS_JA,
  TAVOLA_REVIEWS_JA,
  TAVOLA_STEPS_JA,
} from './tavola-kitchen-content-ja';

/**
 * Locale parity for the Tavola restaurant.
 *
 * The two language bundles are structurally identical by CONTRACT: ids drive
 * the menu filter, the basket and `?page=` navigation, and prices drive the
 * totals. Only human-readable text may differ.
 *
 * A drifted id is the dangerous failure here, because it breaks silently and
 * only for the language nobody on the team reads - the menu filter would return
 * nothing, or a basket line would resolve to no dish and vanish. A drifted
 * PRICE is worse: the same order would cost different amounts depending on the
 * language it was placed in. These assertions are cheaper than finding either
 * in production.
 */

/** Every leaf string in an object, so a whole bundle can be checked at once. */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

describe('tavola locale parity', () => {
  it('keeps nav hrefs identical, so routing cannot diverge', () => {
    assert.deepEqual(
      TAVOLA_CONTENT_JA.nav.map((link) => link.href),
      TAVOLA_CONTENT.nav.map((link) => link.href),
    );
  });

  it('points every nav link at a page that exists', () => {
    for (const link of TAVOLA_CONTENT.nav) {
      const page = /^\?page=([^#&]+)/.exec(link.href)?.[1];
      assert.ok(page, `${link.href} is not a page link`);
      assert.ok(
        TAVOLA_PAGES.includes(page as (typeof TAVOLA_PAGES)[number]),
        `nav points at "${page}", which is not a page`,
      );
    }
  });

  it('keeps dish ids, order and categories identical', () => {
    assert.deepEqual(
      TAVOLA_DISHES_JA.map((dish) => dish.id),
      TAVOLA_DISHES.map((dish) => dish.id),
    );
    assert.deepEqual(
      TAVOLA_DISHES_JA.map((dish) => dish.categoryId),
      TAVOLA_DISHES.map((dish) => dish.categoryId),
    );
  });

  it('keeps every price identical - the base is money, not copy', () => {
    assert.deepEqual(
      TAVOLA_DISHES_JA.map((dish) => dish.price),
      TAVOLA_DISHES.map((dish) => dish.price),
      'a translated price would mean a different bill in each language',
    );
  });

  it('files every dish under a category that exists, in both languages', () => {
    const en = new Set(TAVOLA_CATEGORIES.map((category) => category.id));
    const ja = new Set(TAVOLA_CATEGORIES_JA.map((category) => category.id));
    assert.deepEqual([...ja].sort(), [...en].sort());
    for (const dish of TAVOLA_DISHES) {
      assert.ok(en.has(dish.categoryId), `${dish.id} has no category`);
    }
  });

  it('keeps step ids identical and backed by an icon', () => {
    assert.deepEqual(
      TAVOLA_STEPS_JA.map((step) => step.id),
      TAVOLA_STEPS.map((step) => step.id),
    );
    for (const step of TAVOLA_STEPS) {
      assert.ok(step.id in TAVOLA_STEP_ICONS, `${step.id} has no icon`);
    }
  });

  it('keeps post and review ids identical', () => {
    assert.deepEqual(
      TAVOLA_POSTS_JA.map((post) => post.id),
      TAVOLA_POSTS.map((post) => post.id),
    );
    assert.deepEqual(
      TAVOLA_REVIEWS_JA.map((review) => review.id),
      TAVOLA_REVIEWS.map((review) => review.id),
    );
  });

  it('keeps ratings identical - a rating is data, not prose', () => {
    assert.deepEqual(
      TAVOLA_REVIEWS_JA.map((review) => review.rating),
      TAVOLA_REVIEWS.map((review) => review.rating),
    );
  });

  it('translates every copy key rather than leaving English behind', () => {
    const en = strings(TAVOLA_COPY);
    const ja = strings(TAVOLA_COPY_JA);
    assert.equal(ja.length, en.length, 'the two copy objects have different shapes');

    // Some values are legitimately identical across languages (the `{count}`
    // placeholder, a phone number). Everything else should have been rewritten.
    const untranslated = en.filter((value, index) => value === ja[index] && /[a-z]{4,}/i.test(value));
    assert.deepEqual(untranslated, [], 'these strings were left in English');
  });

  it('gives both languages the same section shape', () => {
    assert.equal(TAVOLA_CONTENT_JA.services.items.length, TAVOLA_CONTENT.services.items.length);
    assert.equal(TAVOLA_CONTENT_JA.faq.items.length, TAVOLA_CONTENT.faq.items.length);
    assert.equal(TAVOLA_CONTENT_JA.footer.columns.length, TAVOLA_CONTENT.footer.columns.length);
    assert.deepEqual(
      TAVOLA_CONTENT_JA.footer.columns.map((column) => column.links.length),
      TAVOLA_CONTENT.footer.columns.map((column) => column.links.length),
    );
  });

  it('falls back to home for an unknown page rather than rendering nothing', () => {
    assert.equal(toTavolaPage(undefined), 'home');
    assert.equal(toTavolaPage('not-a-page'), 'home');
    assert.equal(toTavolaPage('menu'), 'menu');
  });
});
