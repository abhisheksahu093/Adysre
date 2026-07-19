import type { FormEvent } from 'react';

/**
 * Live preview for `checkout-two-column`.
 * Mirrors the `typescript` code variant against a fixed sample cart. The stage
 * is narrow, so the grid renders as one stacked column here - exactly the
 * sub-`lg` layout. Keep in step with `src/data/components/checkout.ts`.
 */
interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

interface CheckoutTwoColumnProps {
  items: OrderItem[];
  currency?: string;
  shipping?: number;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

function CheckoutTwoColumn({
  items,
  currency = '$',
  shipping = 0,
  onSubmit = (e) => e.preventDefault(),
}: CheckoutTwoColumnProps) {
  const money = (n: number): string => `${currency}${n.toFixed(2)}`;
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const total = subtotal + shipping;

  return (
    <form onSubmit={onSubmit} className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping &amp; payment</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ct-email">Email</label>
          <input className={INPUT} id="ct-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ct-name">Full name</label>
          <input className={INPUT} id="ct-name" name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ct-card">Card number</label>
          <input className={INPUT} id="ct-card" name="cc-number" type="text" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234" required />
        </div>
      </div>

      <aside className="h-fit space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.name} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 text-gray-700 dark:text-gray-300">{it.name}</span>
              <span className="shrink-0 text-right tabular-nums text-gray-900 dark:text-gray-100">{money(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-1 border-t border-gray-200 pt-3 text-sm dark:border-gray-800">
          <div className="flex justify-between gap-3">
            <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
            <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
            <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(shipping)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-gray-200 pt-2 text-base font-semibold dark:border-gray-800">
            <dt className="text-gray-900 dark:text-gray-100">Total</dt>
            <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(total)}</dd>
          </div>
        </dl>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Pay {money(total)}
        </button>
      </aside>
    </form>
  );
}

export default function CheckoutTwoColumnPreview() {
  return (
    <CheckoutTwoColumn
      items={[
        { name: 'Wireless keyboard', qty: 1, price: 79 },
        { name: 'USB-C cable', qty: 1, price: 12 },
      ]}
      shipping={5}
    />
  );
}

export const minHeight = 560;
