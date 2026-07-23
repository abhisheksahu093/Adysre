import type { FormEvent } from 'react';

/**
 * Live preview for `checkout-single-page`.
 * Mirrors the `typescript` code variant. UI only - the default `onSubmit`
 * cancels navigation so the preview iframe never reloads. Keep in step with
 * `src/data/components/checkout.ts`.
 */
const LABEL = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

interface CheckoutSinglePageProps {
  submitLabel?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function CheckoutSinglePage({
  submitLabel = 'Place order',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}: CheckoutSinglePageProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`mx-auto w-full max-w-lg space-y-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 ${className}`}
    >
      <fieldset className="space-y-4 border-0 p-0">
        <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact</legend>
        <div>
          <label className={LABEL} htmlFor="cs-email">Email</label>
          <input className={INPUT} id="cs-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-0 p-0">
        <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping address</legend>
        <div>
          <label className={LABEL} htmlFor="cs-name">Full name</label>
          <input className={INPUT} id="cs-name" name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
        </div>
        <div>
          <label className={LABEL} htmlFor="cs-street">Address</label>
          <input className={INPUT} id="cs-street" name="street-address" type="text" autoComplete="street-address" placeholder="123 Market St" required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="cs-city">City</label>
            <input className={INPUT} id="cs-city" name="city" type="text" autoComplete="address-level2" placeholder="San Francisco" required />
          </div>
          <div>
            <label className={LABEL} htmlFor="cs-zip">Postal code</label>
            <input className={INPUT} id="cs-zip" name="postal-code" type="text" autoComplete="postal-code" inputMode="numeric" placeholder="94103" required />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-0 p-0">
        <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment</legend>
        <div>
          <label className={LABEL} htmlFor="cs-card">Card number</label>
          <input className={INPUT} id="cs-card" name="cc-number" type="text" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL} htmlFor="cs-exp">Expiry</label>
            <input className={INPUT} id="cs-exp" name="cc-exp" type="text" autoComplete="cc-exp" inputMode="numeric" placeholder="MM / YY" required />
          </div>
          <div>
            <label className={LABEL} htmlFor="cs-csc">CVC</label>
            <input className={INPUT} id="cs-csc" name="cc-csc" type="text" autoComplete="cc-csc" inputMode="numeric" placeholder="123" required />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export default function CheckoutSinglePagePreview() {
  return <CheckoutSinglePage />;
}

export const minHeight = 700;
