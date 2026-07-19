/**
 * Live preview for `cart-drawer-side`.
 * Mirrors the `typescript` variant in `src/data/components/cart.ts` verbatim.
 * The drawer is scoped to its own relative box, so the stage needs the panel's
 * full height.
 */
export const minHeight = 500;

interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

interface CartDrawerSideProps {
  items: CartLine[];
  open?: boolean;
  currency?: string;
  onClose?: () => void;
  className?: string;
}

function formatMoney(cents: number, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

function CartDrawerSide({ items, open = true, currency = '$', onClose, className = '' }: CartDrawerSideProps) {
  if (!open) return null;
  const count = items.reduce((n, it) => n + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);

  return (
    <div className={`relative h-[30rem] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <button type="button" onClick={onClose} className="absolute inset-0 z-10 bg-black/40" aria-label="Close cart" />

      <aside className="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col bg-white shadow-xl dark:bg-gray-900" role="dialog" aria-label="Shopping cart">
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Your cart ({count})</h2>
          <button type="button" onClick={onClose} className="-mr-1 flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Close cart">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </header>

        {items.length === 0 ? (
          <p className="flex-1 px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Your cart is empty.</p>
        ) : (
          <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
            {items.map((it) => (
              <li key={it.id} className="flex gap-3 p-4">
                <div className={`h-16 w-16 flex-none rounded-lg bg-gradient-to-br ${it.tint}`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p>
                </div>
                <div className="text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
              </li>
            ))}
          </ul>
        )}

        <footer className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</span>
          </div>
          <a href="#" className="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
        </footer>
      </aside>
    </div>
  );
}

export default function CartDrawerSidePreview() {
  return (
    <CartDrawerSide
      items={[
        { id: 'a', name: 'Aero Runner', priceCents: 12000, qty: 1, tint: 'from-sky-400 to-indigo-500' },
        { id: 'b', name: 'Trail Cap', priceCents: 2500, qty: 2, tint: 'from-rose-400 to-orange-500' },
      ]}
    />
  );
}
