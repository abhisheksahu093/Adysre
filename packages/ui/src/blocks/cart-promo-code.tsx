'use client';

import { useState, type FormEvent } from 'react';

/**
 * Live preview for `cart-promo-code`.
 * Mirrors the `typescript` variant in `src/data/components/cart.ts` verbatim.
 * Try SAVE10 to see the discount and total recompute.
 */
export const minHeight = 300;

interface CartPromoCodeProps {
  subtotalCents: number;
  currency?: string;
  codes?: Record<string, number>;
  className?: string;
}

interface AppliedCode {
  code: string;
  amount: number;
}

function formatMoney(cents: number, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartPromoCode({ subtotalCents, currency = '$', codes = { SAVE10: 0.1 }, className = '' }: CartPromoCodeProps) {
  const [value, setValue] = useState('');
  const [applied, setApplied] = useState<AppliedCode | null>(null);
  const [error, setError] = useState('');

  const apply = (e: FormEvent) => {
    e.preventDefault();
    const key = value.trim().toUpperCase();
    const rate = codes[key];
    if (rate === undefined) {
      setApplied(null);
      setError('That code is not valid.');
      return;
    }
    setError('');
    setApplied({ code: key, amount: Math.round(subtotalCents * rate) });
  };

  const discount = applied ? applied.amount : 0;
  const total = subtotalCents - discount;

  return (
    <form onSubmit={apply} className={`mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <label htmlFor="promo" className="sr-only">Promo code</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input id="promo" name="promo" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter promo code" className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
        <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:focus-visible:ring-offset-gray-900">Apply</button>
      </div>

      <p className="mt-3 text-sm" aria-live="polite">
        {applied ? <span className="text-emerald-600 dark:text-emerald-400">Code {applied.code} applied - you saved {formatMoney(applied.amount, currency)}.</span> : null}
        {error ? <span className="text-red-600 dark:text-red-400">{error}</span> : null}
      </p>

      <dl className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
        <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotalCents, currency)}</dd></div>
        {discount > 0 ? <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Discount</dt><dd className="tabular-nums text-emerald-600 dark:text-emerald-400">-{formatMoney(discount, currency)}</dd></div> : null}
        <div className="flex justify-between border-t border-gray-100 pt-1.5 text-base font-semibold dark:border-gray-800"><dt className="text-gray-900 dark:text-gray-100">Total</dt><dd className="tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
      </dl>
    </form>
  );
}

export default function CartPromoCodePreview() {
  return <CartPromoCode subtotalCents={12000} codes={{ SAVE10: 0.1, WELCOME: 0.2 }} />;
}
