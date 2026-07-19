/**
 * Live preview for `cart-full-page`.
 * Mirrors the `typescript` variant in `src/data/components/cart.ts` verbatim.
 */
export const minHeight = 440;

interface CartLine {
  id: string;
  name: string;
  meta?: string;
  priceCents: number;
  qty: number;
  tint: string;
}

interface CartFullPageProps {
  items: CartLine[];
  currency?: string;
  shippingCents?: number;
  className?: string;
}

function formatMoney(cents: number, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

function CartFullPage({ items, currency = '$', shippingCents = 0, className = '' }: CartFullPageProps) {
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
  const total = subtotal + shippingCents;

  return (
    <section className={`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 ${className}`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">Shopping cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.map((it) => (
            <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <div className={`h-20 w-20 flex-none rounded-lg bg-gradient-to-br ${it.tint}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p>
                {it.meta ? <p className="text-xs text-gray-500 dark:text-gray-400">{it.meta} - Qty {it.qty}</p> : <p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p>}
              </div>
              <div className="text-sm font-semibold tabular-nums text-gray-900 sm:w-24 sm:text-right dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Shipping</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(shippingCents, currency)}</dd></div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd className="font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
          </dl>
          <a href="#" className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Proceed to checkout</a>
        </aside>
      </div>
    </section>
  );
}

export default function CartFullPagePreview() {
  return (
    <CartFullPage
      shippingCents={800}
      items={[
        { id: 'a', name: 'Aero Runner', meta: 'Size 42', priceCents: 12000, qty: 1, tint: 'from-sky-400 to-indigo-500' },
        { id: 'b', name: 'Trail Cap', meta: 'One size', priceCents: 2500, qty: 2, tint: 'from-rose-400 to-orange-500' },
      ]}
    />
  );
}
