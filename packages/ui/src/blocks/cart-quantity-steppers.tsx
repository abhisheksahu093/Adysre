'use client';

import { useState } from 'react';

/**
 * Live preview for `cart-quantity-steppers`.
 * Mirrors the `typescript` variant in `src/data/components/cart.ts` verbatim.
 * The +/- steppers recompute the line totals and subtotal live.
 */
export const minHeight = 320;

interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

interface CartQuantitySteppersProps {
  items: CartLine[];
  currency?: string;
  className?: string;
}

function formatMoney(cents: number, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartQuantitySteppers({ items, currency = '$', className = '' }: CartQuantitySteppersProps) {
  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(items.map((it) => [it.id, it.qty])),
  );
  const setQtyFor = (id: string, next: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(1, next) }));
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * (qty[it.id] ?? it.qty), 0);

  return (
    <div className={`mx-auto w-full max-w-2xl ${className}`}>
      {items.map((it) => {
        const q = qty[it.id] ?? it.qty;
        return (
          <div key={it.id} className="flex flex-col gap-3 border-b border-gray-100 py-4 sm:flex-row sm:items-center dark:border-gray-800">
            <div className={`h-16 w-16 flex-none rounded-lg bg-gradient-to-br ${it.tint}`} aria-hidden="true" />
            <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatMoney(it.priceCents, currency)} each</p></div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                <button type="button" onClick={() => setQtyFor(it.id, q - 1)} className="flex h-9 w-9 items-center justify-center rounded-l-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800" aria-label={`Decrease quantity of ${it.name}`}>-</button>
                <span className="w-10 text-center text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100" aria-live="polite">{q}</span>
                <button type="button" onClick={() => setQtyFor(it.id, q + 1)} className="flex h-9 w-9 items-center justify-center rounded-r-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800" aria-label={`Increase quantity of ${it.name}`}>+</button>
              </div>
              <span className="w-20 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * q, currency)}</span>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between px-1 pt-4 text-sm">
        <span className="font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
        <span className="text-base font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</span>
      </div>
    </div>
  );
}

export default function CartQuantitySteppersPreview() {
  return (
    <CartQuantitySteppers
      items={[
        { id: 'a', name: 'Canvas Tote', priceCents: 2400, qty: 2, tint: 'from-amber-400 to-orange-500' },
        { id: 'b', name: 'Enamel Pin', priceCents: 800, qty: 1, tint: 'from-rose-400 to-pink-500' },
      ]}
    />
  );
}
