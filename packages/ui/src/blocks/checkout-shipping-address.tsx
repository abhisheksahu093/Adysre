import type { FormEvent } from 'react';

/**
 * Live preview for `checkout-shipping-address`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/checkout.ts`.
 */
const INPUT =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const LABEL = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

interface CheckoutShippingAddressProps {
  submitLabel?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function CheckoutShippingAddress({
  submitLabel = 'Save address',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}: CheckoutShippingAddressProps) {
  return (
    <form onSubmit={onSubmit} className={`w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping address</h2>
      <div>
        <label className={LABEL} htmlFor="sa-name">Full name</label>
        <input className={INPUT} id="sa-name" name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
      </div>
      <div>
        <label className={LABEL} htmlFor="sa-street">Street address</label>
        <input className={INPUT} id="sa-street" name="street-address" type="text" autoComplete="street-address" placeholder="123 Market St" required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="sa-city">City</label>
          <input className={INPUT} id="sa-city" name="city" type="text" autoComplete="address-level2" placeholder="San Francisco" required />
        </div>
        <div>
          <label className={LABEL} htmlFor="sa-state">State / region</label>
          <input className={INPUT} id="sa-state" name="state" type="text" autoComplete="address-level1" placeholder="CA" required />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="sa-zip">Postal code</label>
          <input className={INPUT} id="sa-zip" name="postal-code" type="text" autoComplete="postal-code" inputMode="numeric" placeholder="94103" required />
        </div>
        <div>
          <label className={LABEL} htmlFor="sa-country">Country</label>
          <input className={INPUT} id="sa-country" name="country" type="text" autoComplete="country-name" placeholder="United States" required />
        </div>
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {submitLabel}
      </button>
    </form>
  );
}

export default function CheckoutShippingAddressPreview() {
  return <CheckoutShippingAddress />;
}

export const minHeight = 600;
