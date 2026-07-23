import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DEFAULT_PAGE_ORDER,
  PLAYGROUND_SLOTS,
  SITE_SLOT_IDS,
  createPlaygroundPage,
  isSiteSlot,
  normalizePageOrder,
  reorder,
  type PlaygroundSlotId,
} from './index';

/**
 * The multipage model turns on three small pure functions: what belongs to the
 * site rather than a page, how a stored order survives the slot list changing,
 * and what a drag actually does to an array. All three are cheap to get subtly
 * wrong and expensive to debug through a canvas, so they are pinned here.
 */

describe('slot scope', () => {
  it('keeps the header and footer at site level', () => {
    for (const id of SITE_SLOT_IDS) assert.equal(isSiteSlot(id), true);
  });

  it('leaves every other slot to the page', () => {
    const body = PLAYGROUND_SLOTS.filter((slot) => !isSiteSlot(slot.id));
    assert.equal(body.length, PLAYGROUND_SLOTS.length - SITE_SLOT_IDS.length);
    assert.equal(
      body.some((slot) => SITE_SLOT_IDS.includes(slot.id as (typeof SITE_SLOT_IDS)[number])),
      false,
    );
  });

  it('never puts the shared chrome in a page order', () => {
    for (const id of SITE_SLOT_IDS) assert.equal(DEFAULT_PAGE_ORDER.includes(id), false);
  });
});

describe('normalizePageOrder', () => {
  it('keeps the user arrangement it is given', () => {
    const custom = [...DEFAULT_PAGE_ORDER].reverse();
    assert.deepEqual(normalizePageOrder(custom), custom);
  });

  it('drops ids that no longer exist', () => {
    const stored = ['hero', 'a-slot-we-deleted', 'pricing'];
    assert.equal(normalizePageOrder(stored).includes('a-slot-we-deleted' as PlaygroundSlotId), false);
  });

  it('appends slots added since the order was saved', () => {
    // A site saved before `blog` existed must still be able to reach it.
    const stored: PlaygroundSlotId[] = ['hero', 'pricing'];
    const normalized = normalizePageOrder(stored);
    assert.deepEqual(normalized.slice(0, 2), stored, 'the saved arrangement stays in front');
    assert.equal(normalized.length, DEFAULT_PAGE_ORDER.length, 'and every slot is present');
    for (const id of DEFAULT_PAGE_ORDER) assert.equal(normalized.includes(id), true);
  });

  it('never duplicates a slot', () => {
    const normalized = normalizePageOrder(['hero', 'hero', 'pricing']);
    assert.equal(new Set(normalized).size, normalized.length);
  });

  it('turns an empty order into the default one', () => {
    assert.deepEqual(normalizePageOrder([]), DEFAULT_PAGE_ORDER);
  });
});

describe('reorder', () => {
  const list = ['a', 'b', 'c', 'd'];

  it('moves an item down', () => {
    assert.deepEqual(reorder(list, 0, 2), ['b', 'c', 'a', 'd']);
  });

  it('moves an item up', () => {
    assert.deepEqual(reorder(list, 3, 1), ['a', 'd', 'b', 'c']);
  });

  it('is a no-op when nothing moves', () => {
    assert.deepEqual(reorder(list, 1, 1), list);
  });

  it('clamps a drop past either end rather than losing the item', () => {
    assert.deepEqual(reorder(list, 0, 99), ['b', 'c', 'd', 'a']);
    assert.deepEqual(reorder(list, 2, -5), ['c', 'a', 'b', 'd']);
  });

  it('never mutates its input', () => {
    const original = [...list];
    reorder(list, 0, 3);
    assert.deepEqual(list, original);
  });

  it('keeps every item', () => {
    assert.deepEqual([...reorder(list, 1, 3)].sort(), [...list].sort());
  });
});

describe('createPlaygroundPage', () => {
  it('starts a page with the full default order and nothing chosen', () => {
    const page = createPlaygroundPage('page-2', 'About us');
    assert.equal(page.name, 'About us');
    assert.deepEqual(page.order, DEFAULT_PAGE_ORDER);
    assert.deepEqual(page.selections, {});
    assert.deepEqual(page.sectionStyles, {});
  });

  it('gives each page its own order array', () => {
    // Shared array identity would make dragging on one page reorder them all.
    const a = createPlaygroundPage('a', 'A');
    const b = createPlaygroundPage('b', 'B');
    a.order.reverse();
    assert.deepEqual(b.order, DEFAULT_PAGE_ORDER);
  });
});
