'use client';

/**
 * Live preview for `cart-line-items`.
 * Mirrors the `typescript` variant in `src/data/components/cart.ts` verbatim.
 */
export const minHeight = 280;

interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

interface CartLineItemsProps {
  items: CartLine[];
  currency?: string;
  onRemove?: (id: string) => void;
  className?: string;
}

function formatMoney(cents: number, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartLineItems({ items, currency = '$', onRemove, className = '' }: CartLineItemsProps) {
  return (
    <ul className={`mx-auto w-full max-w-2xl divide-y divide-gray-100 dark:divide-gray-800 ${className}`}>
      {items.map((it) => (
        <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
          <div className={`h-16 w-16 flex-none rounded-lg bg-gradient-to-br ${it.tint}`} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</span>
            <button type="button" onClick={() => onRemove?.(it.id)} className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:hover:text-gray-200" aria-label={`Remove ${it.name} from cart`}>
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function CartLineItemsPreview() {
  return (
    <CartLineItems
      items={[
        { id: 'a', name: 'Field Notebook', priceCents: 1800, qty: 1, tint: 'from-emerald-400 to-teal-500' },
        { id: 'b', name: 'Ink Pen Set', priceCents: 2400, qty: 2, tint: 'from-amber-400 to-orange-500' },
        { id: 'c', name: 'Desk Blotter', priceCents: 3200, qty: 1, tint: 'from-cyan-400 to-blue-500' },
      ]}
    />
  );
}
