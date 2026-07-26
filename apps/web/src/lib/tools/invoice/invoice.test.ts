import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { InvoiceDocument } from './types';
import { computeTotals, lineAmount, round2 } from './totals';
import { toItemsCsv, toJson, parseItemsCsv } from './exchange';
import { SAMPLE_DOCUMENT } from './sample';

/**
 * Invoice engine tests. Money is the load-bearing part, so the totals are
 * asserted to the cent across discount and tax modes, and the CSV round-trips
 * back into line items.
 */

function doc(over: Partial<InvoiceDocument> = {}): InvoiceDocument {
  return { ...SAMPLE_DOCUMENT, ...over };
}

describe('round2 / lineAmount', () => {
  it('rounds half up without the 1.005 float bug', () => {
    assert.equal(round2(1.005), 1.01);
    assert.equal(round2(2.675), 2.68);
  });
  it('multiplies quantity by price', () => {
    assert.equal(lineAmount({ id: 'x', description: '', quantity: 12, unitPrice: 145 }), 1740);
  });
});

describe('computeTotals', () => {
  const items = [
    { id: 'a', description: 'A', quantity: 2, unitPrice: 100 }, // 200
    { id: 'b', description: 'B', quantity: 1, unitPrice: 50 }, //  50
  ]; // subtotal 250

  it('exclusive tax with a percent discount', () => {
    const t = computeTotals(
      doc({ items, discount: { mode: 'percent', value: 10 }, tax: { mode: 'exclusive', rate: 8, label: 'Tax' }, shipping: 15 }),
    );
    assert.equal(t.subtotal, 250);
    assert.equal(t.discountAmount, 25); // 10% of 250
    assert.equal(t.taxableBase, 225);
    assert.equal(t.taxAmount, 18); // 8% of 225
    assert.equal(t.shipping, 15);
    assert.equal(t.total, 258); // 225 + 18 + 15
  });

  it('inclusive tax backs the tax out of the prices', () => {
    const t = computeTotals(
      doc({ items, discount: { mode: 'none', value: 0 }, tax: { mode: 'inclusive', rate: 25, label: 'VAT' }, shipping: 0 }),
    );
    assert.equal(t.subtotal, 250);
    assert.equal(t.taxableBase, 200); // 250 / 1.25
    assert.equal(t.taxAmount, 50);
    assert.equal(t.total, 250); // unchanged — tax was already inside
  });

  it('fixed discount cannot exceed the subtotal; no tax mode', () => {
    const t = computeTotals(
      doc({ items, discount: { mode: 'fixed', value: 999 }, tax: { mode: 'none', rate: 0, label: 'Tax' }, shipping: 10 }),
    );
    assert.equal(t.discountAmount, 250); // clamped to subtotal
    assert.equal(t.taxAmount, 0);
    assert.equal(t.total, 10); // 0 goods + shipping
  });
});

describe('export / import', () => {
  it('toJson is valid and carries document + totals', () => {
    const parsed = JSON.parse(toJson(doc()));
    assert.equal(parsed.document.number, 'INV-1024');
    assert.equal(typeof parsed.totals.total, 'number');
  });

  it('items CSV escapes commas and round-trips back to line items', () => {
    const csv = toItemsCsv(doc({ items: [{ id: 'x', description: 'Design, dev & QA', quantity: 3, unitPrice: 100 }] }));
    assert.match(csv, /"Design, dev & QA",3,100,300\.00/);

    let n = 0;
    const items = parseItemsCsv(csv, () => `p-${(n += 1)}`);
    assert.equal(items.length, 1);
    assert.equal(items[0]?.description, 'Design, dev & QA');
    assert.equal(items[0]?.quantity, 3);
    assert.equal(items[0]?.unitPrice, 100);
  });

  it('parses a header-less CSV too', () => {
    const items = parseItemsCsv('Widget,5,20\nGadget,2,35', () => 'p');
    assert.equal(items.length, 2);
    assert.equal(items[1]?.description, 'Gadget');
    assert.equal(items[1]?.unitPrice, 35);
  });
});
