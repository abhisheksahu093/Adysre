/**
 * Live preview for `cart-with-summary`.
 * Mirrors the `typescript` variant in `src/data/components/cart.ts` verbatim.
 * On the narrow preview stage the summary stacks below the items, so the stage
 * needs the combined height.
 */
export const minHeight = 460;

interface CartLine {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  tint: string;
}

interface CartWithSummaryProps {
  items: CartLine[];
  currency?: string;
  taxRate?: number;
  shippingCents?: number;
  className?: string;
}

function formatMoney(cents: number, currency = '$') {
  return currency + (cents / 100).toFixed(2);
}

export function CartWithSummary({ items, currency = '$', taxRate = 0, shippingCents = 0, className = '' }: CartWithSummaryProps) {
  const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax + shippingCents;

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

      <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(subtotal, currency)}</dd></div>
          {taxRate > 0 ? <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Tax</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(tax, currency)}</dd></div> : null}
          <div className="flex justify-between"><dt className="text-gray-600 dark:text-gray-400">Shipping</dt><dd className="font-medium tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(shippingCents, currency)}</dd></div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base dark:border-gray-800"><dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt><dd className="font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatMoney(total, currency)}</dd></div>
        </dl>
        <a href="#" className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">Checkout</a>
      </aside>
    </div>
  );
}

export default function CartWithSummaryPreview() {
  return (
    <CartWithSummary
      taxRate={0.08}
      shippingCents={600}
      items={[
        { id: 'a', name: 'Desk Lamp', priceCents: 6400, qty: 1, tint: 'from-cyan-400 to-blue-500' },
        { id: 'b', name: 'Cable Tray', priceCents: 1800, qty: 2, tint: 'from-violet-400 to-fuchsia-500' },
      ]}
    />
  );
}
