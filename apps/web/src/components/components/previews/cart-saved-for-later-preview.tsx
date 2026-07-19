'use client';

import { useState } from 'react';

/**
 * Live preview for `cart-saved-for-later`.
 * Mirrors the `typescript` variant in `src/data/components/cart.ts` verbatim.
 * Rows move between the two lists on the labelled buttons.
 */
export const minHeight = 400;

interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

interface CartSavedForLaterProps {
  cartItems: CartLine[];
  savedItems: CartLine[];
  currency?: string;
  className?: string;
}

function formatMoney(cents: number, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

function CartSavedForLater({ cartItems, savedItems, currency = '$', className = '' }: CartSavedForLaterProps) {
  const [cart, setCart] = useState<CartLine[]>(cartItems);
  const [saved, setSaved] = useState<CartLine[]>(savedItems);

  const save = (id: string) => {
    const item = cart.find((it) => it.id === id);
    if (!item) return;
    setCart((c) => c.filter((it) => it.id !== id));
    setSaved((s) => [item, ...s]);
  };
  const restore = (id: string) => {
    const item = saved.find((it) => it.id === id);
    if (!item) return;
    setSaved((s) => s.filter((it) => it.id !== id));
    setCart((c) => [item, ...c]);
  };

  return (
    <div className={`mx-auto w-full max-w-2xl space-y-8 ${className}`}>
      <section aria-labelledby="cart-h">
        <h2 id="cart-h" className="text-sm font-semibold text-gray-900 dark:text-gray-100">In your cart ({cart.length})</h2>
        <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
          {cart.map((it) => (
            <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <div className={`h-14 w-14 flex-none rounded-lg bg-gradient-to-br ${it.tint}`} aria-hidden="true" />
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatMoney(it.priceCents, currency)}</p></div>
              <button type="button" onClick={() => save(it.id)} className="self-start rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:self-auto dark:text-blue-400 dark:hover:bg-blue-950" aria-label={`Save ${it.name} for later`}>Save for later</button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="saved-h">
        <h2 id="saved-h" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Saved for later ({saved.length})</h2>
        <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
          {saved.map((it) => (
            <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <div className={`h-14 w-14 flex-none rounded-lg bg-gradient-to-br ${it.tint}`} aria-hidden="true" />
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatMoney(it.priceCents, currency)}</p></div>
              <button type="button" onClick={() => restore(it.id)} className="self-start rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:self-auto dark:text-blue-400 dark:hover:bg-blue-950" aria-label={`Move ${it.name} to cart`}>Move to cart</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function CartSavedForLaterPreview() {
  return (
    <CartSavedForLater
      cartItems={[{ id: 'a', name: 'Trail Bottle', priceCents: 2200, qty: 1, tint: 'from-lime-400 to-emerald-500' }]}
      savedItems={[{ id: 'b', name: 'Wool Beanie', priceCents: 2800, qty: 1, tint: 'from-violet-400 to-fuchsia-500' }]}
    />
  );
}
