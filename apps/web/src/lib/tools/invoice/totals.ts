import type { InvoiceDocument, LineItem } from './types';

/**
 * The totals engine - the one place money is computed, so a printed invoice and
 * an exported CSV can never disagree. Pure and unit-tested. Everything is
 * rounded to 2 decimals (the currency minor unit) at the boundaries where a
 * human reads a number; intermediate sums stay full-precision.
 */

export interface Totals {
  subtotal: number;
  discountAmount: number;
  taxableBase: number;
  taxAmount: number;
  shipping: number;
  total: number;
}

/** Round to 2 decimals, avoiding the classic 1.005 float error. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function lineAmount(item: LineItem): number {
  return round2((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0));
}

export function computeTotals(doc: InvoiceDocument): Totals {
  const subtotal = doc.items.reduce((sum, item) => sum + lineAmount(item), 0);

  const discountAmount =
    doc.discount.mode === 'percent'
      ? subtotal * (clampPct(doc.discount.value) / 100)
      : doc.discount.mode === 'fixed'
        ? Math.min(Math.max(doc.discount.value, 0), subtotal)
        : 0;

  const afterDiscount = subtotal - discountAmount;
  const shipping = Math.max(Number(doc.shipping) || 0, 0);
  const rate = Math.max(Number(doc.tax.rate) || 0, 0);

  let taxAmount = 0;
  let taxableBase = afterDiscount;

  if (doc.tax.mode === 'exclusive') {
    taxAmount = afterDiscount * (rate / 100);
  } else if (doc.tax.mode === 'inclusive') {
    // Prices already include tax: back it out of the discounted amount.
    taxableBase = afterDiscount / (1 + rate / 100);
    taxAmount = afterDiscount - taxableBase;
  }

  const total =
    doc.tax.mode === 'exclusive'
      ? afterDiscount + taxAmount + shipping
      : afterDiscount + shipping;

  return {
    subtotal: round2(subtotal),
    discountAmount: round2(discountAmount),
    taxableBase: round2(taxableBase),
    taxAmount: round2(taxAmount),
    shipping: round2(shipping),
    total: round2(total),
  };
}

function clampPct(value: number): number {
  return Math.min(Math.max(Number(value) || 0, 0), 100);
}
