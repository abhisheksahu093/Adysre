import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  LUMIERE_CONTENT,
  LUMIERE_PRODUCTS,
  LUMIERE_PRODUCT_CATEGORIES,
  LUMIERE_SALON,
  LUMIERE_SERVICE_CATEGORIES,
  LUMIERE_STYLISTS,
} from './lumiere-salon-content';
import {
  LUMIERE_CONTENT_JA,
  LUMIERE_PRODUCTS_JA,
  LUMIERE_PRODUCT_CATEGORIES_JA,
  LUMIERE_SALON_JA,
  LUMIERE_SERVICE_CATEGORIES_JA,
  LUMIERE_STYLISTS_JA,
} from './lumiere-salon-content-ja';

/**
 * Locale parity for the Lumière salon.
 *
 * The two language bundles are structurally identical by CONTRACT: ids drive
 * the shop filter and `?page=` navigation, and prices drive the basket. Only
 * human-readable text may differ.
 *
 * A drifted id is the dangerous failure here, because it breaks silently and
 * only for the language nobody on the team reads - the shop filter would return
 * nothing, or a nav link would land on the home page. These assertions are
 * cheaper than finding that in production.
 */

describe('lumiere locale parity', () => {
  it('keeps nav hrefs identical, so routing cannot diverge', () => {
    assert.equal(LUMIERE_CONTENT_JA.nav.length, LUMIERE_CONTENT.nav.length);
    assert.deepEqual(
      LUMIERE_CONTENT_JA.nav.map((link) => link.href),
      LUMIERE_CONTENT.nav.map((link) => link.href),
    );
  });

  it('keeps service category and treatment ids identical', () => {
    assert.deepEqual(
      LUMIERE_SERVICE_CATEGORIES_JA.map((category) => category.id),
      LUMIERE_SERVICE_CATEGORIES.map((category) => category.id),
    );

    LUMIERE_SERVICE_CATEGORIES.forEach((category, index) => {
      const translated = LUMIERE_SERVICE_CATEGORIES_JA[index];
      assert.ok(translated);
      assert.deepEqual(
        translated.treatments.map((treatment) => treatment.id),
        category.treatments.map((treatment) => treatment.id),
        `treatment ids drifted in "${category.id}"`,
      );
      assert.deepEqual(
        translated.treatments.map((treatment) => [treatment.price, treatment.duration]),
        category.treatments.map((treatment) => [treatment.price, treatment.duration]),
        `prices or durations drifted in "${category.id}"`,
      );
    });
  });

  it('keeps product ids, categories and prices identical', () => {
    assert.deepEqual(
      LUMIERE_PRODUCTS_JA.map((product) => product.id),
      LUMIERE_PRODUCTS.map((product) => product.id),
    );
    assert.deepEqual(
      LUMIERE_PRODUCTS_JA.map((product) => product.category),
      LUMIERE_PRODUCTS.map((product) => product.category),
      'a drifted category id empties the shop filter in that language',
    );
    assert.deepEqual(
      LUMIERE_PRODUCTS_JA.map((product) => product.price),
      LUMIERE_PRODUCTS.map((product) => product.price),
      'price is currency-converted at render; the base must not be translated',
    );
  });

  it('keeps product category ids identical, so the filter chips still match', () => {
    assert.deepEqual(
      LUMIERE_PRODUCT_CATEGORIES_JA.map((category) => category.id),
      LUMIERE_PRODUCT_CATEGORIES.map((category) => category.id),
    );

    // Every product must belong to a category that exists in its own bundle.
    const ids = new Set(LUMIERE_PRODUCT_CATEGORIES_JA.map((category) => category.id));
    for (const product of LUMIERE_PRODUCTS_JA) {
      assert.ok(ids.has(product.category), `ja product "${product.id}" has no category`);
    }
  });

  it('keeps stylist ids identical, so a booking selection survives a language switch', () => {
    assert.deepEqual(
      LUMIERE_STYLISTS_JA.map((stylist) => stylist.id),
      LUMIERE_STYLISTS.map((stylist) => stylist.id),
    );
  });

  it('translates every common copy key rather than dropping one', () => {
    assert.deepEqual(
      Object.keys(LUMIERE_SALON_JA.common).sort(),
      Object.keys(LUMIERE_SALON.common).sort(),
    );
    for (const [key, value] of Object.entries(LUMIERE_SALON_JA.common)) {
      assert.ok(typeof value === 'string' && value.length > 0, `ja common.${key} is empty`);
    }
  });

  it('actually differs - a bundle that is still English is not a translation', () => {
    assert.notEqual(LUMIERE_CONTENT_JA.hero.title, LUMIERE_CONTENT.hero.title);
    assert.notEqual(
      LUMIERE_SERVICE_CATEGORIES_JA[0]?.treatments[0]?.name,
      LUMIERE_SERVICE_CATEGORIES[0]?.treatments[0]?.name,
    );
  });
});
