/**
 * Live preview for `cart-sticky-summary`.
 * Mirrors the `typescript` variant in `src/data/components/cart.ts` verbatim.
 * On the narrow preview stage the summary stacks below the items; the sticky
 * behaviour engages once the columns are side by side from `lg:` up.
 */
export const minHeight = 460;

interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

interface CartStickySummaryProps {
  items: CartLine[];
  currency?: string;
  shippingCents?: number;
  className?: string;
}

function formatMoney(cents: number, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

function CartStickySummary({ items, currency = '$', shippingCents = 0, className = '' }: CartStickySummaryProps) {
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
  const total = subtotal + shippingCents;

  return (
    <div className={`mx-auto grid w-full max-w-5xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_18rem] ${className}`}>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((it) => (
          <li key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <div className={`h-16 w-16 flex-none rounded-lg bg-gradient-to-br ${it.tint}`} aria-hidden="true" />
            <div className="min-w-0 flex-1"><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{it.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">Qty {it.qty}</p></div>
            <div className="text-sm font-semibold tabular-nums text-gray-900 sm:w-20 sm:text-right dark:text-gray-100">{formatMoney(it.priceCents * it.qty, currency)}</div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 lg:sticky lg:top-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Shipping</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(shippingCents, currency)}</dd></div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd className="font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
        </dl>
        <a href="#" className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
      </aside>
    </div>
  );
}

export default function CartStickySummaryPreview() {
  return (
    <CartStickySummary
      items={[
        { id: 'a', name: 'Merino Sweater', priceCents: 9800, qty: 1, tint: 'from-blue-400 to-indigo-500' },
        { id: 'b', name: 'Cotton Socks', priceCents: 1400, qty: 3, tint: 'from-emerald-400 to-teal-500' },
      ]}
    />
  );
}
