/**
 * Live preview for `cart-mini-dropdown`.
 * Mirrors the `typescript` variant in `src/data/components/cart.ts` verbatim.
 * The panel is absolutely positioned below the trigger, so the stage needs room
 * for both.
 */
export const minHeight = 340;

interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

interface CartMiniDropdownProps {
  items: CartLine[];
  open?: boolean;
  currency?: string;
  className?: string;
}

function formatMoney(cents: number, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartMiniDropdown({ items, open = true, currency = '$', className = '' }: CartMiniDropdownProps) {
  const count = items.reduce((n, it) => n + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800" aria-haspopup="true" aria-expanded={open} aria-label={`Cart, ${count} items`}>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M3 4h2l2.4 12h9.2l1.8-8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.4" fill="currentColor" /><circle cx="17" cy="20" r="1.4" fill="currentColor" /></svg>
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white" aria-hidden="true">{count}</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900" role="menu">
          <ul className="max-h-64 space-y-1 overflow-y-auto">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-3 rounded-lg p-2">
                <div className={`h-10 w-10 flex-none rounded-md bg-gradient-to-br ${it.tint}`} aria-hidden="true" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p></div>
                <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-gray-100 px-2 pt-3 text-sm dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</span>
          </div>
          <a href="#" className="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">View cart</a>
        </div>
      ) : null}
    </div>
  );
}

export default function CartMiniDropdownPreview() {
  return (
    <CartMiniDropdown
      items={[
        { id: 'a', name: 'Studio Mug', priceCents: 1200, qty: 3, tint: 'from-fuchsia-400 to-purple-500' },
        { id: 'b', name: 'Coaster Pack', priceCents: 900, qty: 1, tint: 'from-teal-400 to-emerald-500' },
      ]}
    />
  );
}
