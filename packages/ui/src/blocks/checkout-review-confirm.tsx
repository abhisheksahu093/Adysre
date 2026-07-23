import type { FormEvent } from 'react';

/**
 * Live preview for `checkout-review-confirm`.
 * Mirrors the `typescript` code variant with sample summary values. The masked
 * card is display text only. Keep in step with
 * `src/data/components/checkout.ts`.
 */
const EDIT =
  'shrink-0 rounded text-sm font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

interface CheckoutReviewConfirmProps {
  email: string;
  address: string;
  cardLast4: string;
  total: string;
  onConfirm?: (e: FormEvent<HTMLFormElement>) => void;
}

export function CheckoutReviewConfirm({
  email,
  address,
  cardLast4,
  total,
  onConfirm = (e) => e.preventDefault(),
}: CheckoutReviewConfirmProps) {
  return (
    <form onSubmit={onConfirm} className="w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Review your order</h2>
      <dl className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Contact</dt>
            <dd className="mt-0.5 truncate text-sm text-gray-900 dark:text-gray-100">{email}</dd>
          </div>
          <a className={EDIT} href="#contact">Edit</a>
        </div>
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Ship to</dt>
            <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-100">{address}</dd>
          </div>
          <a className={EDIT} href="#shipping">Edit</a>
        </div>
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Payment</dt>
            <dd className="mt-0.5 text-sm tabular-nums text-gray-900 dark:text-gray-100">&bull;&bull;&bull;&bull; {cardLast4}</dd>
          </div>
          <a className={EDIT} href="#payment">Edit</a>
        </div>
      </dl>
      <div className="flex items-center justify-between gap-3 text-base font-semibold">
        <span className="text-gray-900 dark:text-gray-100">Total</span>
        <span className="text-right tabular-nums text-gray-900 dark:text-gray-100">{total}</span>
      </div>
      <label className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
        <input className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="agree" required />
        <span>I agree to the terms of sale and refund policy.</span>
      </label>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Confirm &amp; pay {total}
      </button>
    </form>
  );
}

export default function CheckoutReviewConfirmPreview() {
  return (
    <CheckoutReviewConfirm
      email="you@example.com"
      address="123 Market St, San Francisco, CA 94103"
      cardLast4="4242"
      total="$116.24"
    />
  );
}

export const minHeight = 480;
