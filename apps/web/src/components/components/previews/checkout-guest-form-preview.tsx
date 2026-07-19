import type { FormEvent } from 'react';

/**
 * Live preview for `checkout-guest-form`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/checkout.ts`.
 */
interface CheckoutGuestFormProps {
  signInHref?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

function CheckoutGuestForm({
  signInHref = '#',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}: CheckoutGuestFormProps) {
  return (
    <form onSubmit={onSubmit} className={`w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Checkout as guest</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">We&apos;ll email your receipt and order updates here.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="gf-email">Email address</label>
        <input
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          id="gf-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Continue as guest
      </button>
      <div className="flex items-center gap-3" role="separator" aria-label="or">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
      <a href={signInHref} className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Sign in to your account
      </a>
    </form>
  );
}

export default function CheckoutGuestFormPreview() {
  return <CheckoutGuestForm />;
}

export const minHeight = 360;
