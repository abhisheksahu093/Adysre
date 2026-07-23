import type { FormEvent } from 'react';

/**
 * Live preview for `checkout-payment-form`.
 * Mirrors the `typescript` code variant. UI only - no tokenisation, no charge;
 * the default `onSubmit` cancels navigation. Keep in step with
 * `src/data/components/checkout.ts`.
 */
const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const LABEL = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

interface CheckoutPaymentFormProps {
  payLabel?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function CheckoutPaymentForm({
  payLabel = 'Pay now',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}: CheckoutPaymentFormProps) {
  return (
    <form onSubmit={onSubmit} className={`w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment details</h2>
        <div className="flex gap-1" aria-hidden="true">
          <span className="flex h-5 w-8 items-center justify-center rounded bg-gradient-to-r from-indigo-500 to-blue-600 text-[8px] font-bold text-white">VISA</span>
          <span className="flex h-5 w-8 items-center justify-center rounded bg-gradient-to-r from-orange-500 to-red-500 text-[8px] font-bold text-white">MC</span>
        </div>
      </div>
      <div>
        <label className={LABEL} htmlFor="pf-card">Card number</label>
        <input className={INPUT} id="pf-card" name="cc-number" type="text" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234" />
      </div>
      <div>
        <label className={LABEL} htmlFor="pf-name">Name on card</label>
        <input className={INPUT} id="pf-name" name="cc-name" type="text" autoComplete="cc-name" placeholder="Ada Lovelace" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL} htmlFor="pf-exp">Expiry</label>
          <input className={INPUT} id="pf-exp" name="cc-exp" type="text" autoComplete="cc-exp" inputMode="numeric" placeholder="MM / YY" />
        </div>
        <div>
          <label className={LABEL} htmlFor="pf-csc">CVC</label>
          <input className={INPUT} id="pf-csc" name="cc-csc" type="text" autoComplete="cc-csc" inputMode="numeric" placeholder="123" />
        </div>
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {payLabel}
      </button>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">Your payment details are never stored by this demo.</p>
    </form>
  );
}

export default function CheckoutPaymentFormPreview() {
  return <CheckoutPaymentForm />;
}

export const minHeight = 440;
