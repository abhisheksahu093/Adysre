/**
 * Live preview for `checkout-order-summary`.
 * Mirrors the `typescript` code variant against a fixed sample cart. Keep in
 * step with `src/data/components/checkout.ts`.
 */
interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface CheckoutOrderSummaryProps {
  items: OrderItem[];
  currency?: string;
  shipping?: number;
  tax?: number;
}

export function CheckoutOrderSummary({
  items,
  currency = '$',
  shipping = 0,
  tax = 0,
}: CheckoutOrderSummaryProps) {
  const money = (n: number): string => `${currency}${n.toFixed(2)}`;
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const total = subtotal + shipping + tax;

  return (
    <section className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950" aria-labelledby="os-title">
      <h2 id="os-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order summary</h2>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it.name} className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 text-sm text-gray-700 dark:text-gray-300">
              {it.name} <span className="text-gray-400">&times;{it.qty}</span>
            </span>
            <span className="shrink-0 text-right text-sm tabular-nums text-gray-900 dark:text-gray-100">{money(it.price * it.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1.5 border-t border-gray-200 pt-4 text-sm dark:border-gray-800">
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(shipping)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-600 dark:text-gray-400">Tax</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(tax)}</dd>
        </div>
        <div className="mt-1 flex justify-between gap-3 border-t border-gray-200 pt-3 text-base font-semibold dark:border-gray-800">
          <dt className="text-gray-900 dark:text-gray-100">Total</dt>
          <dd className="text-right tabular-nums text-gray-900 dark:text-gray-100">{money(total)}</dd>
        </div>
      </dl>
    </section>
  );
}

export default function CheckoutOrderSummaryPreview() {
  return (
    <CheckoutOrderSummary
      items={[
        { name: 'Wireless keyboard', qty: 1, price: 79 },
        { name: 'USB-C cable', qty: 2, price: 12 },
      ]}
      shipping={5}
      tax={8.24}
    />
  );
}

export const minHeight = 340;
