import type { FormEvent } from 'react';

/**
 * Live preview for `checkout-gift-options`.
 * Mirrors the `typescript` code variant. Ticking "This is a gift" reveals the
 * details with a CSS-only peer - no JS. Keep in step with
 * `src/data/components/checkout.ts`.
 */
interface CheckoutGiftOptionsProps {
  wrapPrice?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

function CheckoutGiftOptions({
  wrapPrice = '$4.99',
  onSubmit = (e) => e.preventDefault(),
  className = '',
}: CheckoutGiftOptionsProps) {
  return (
    <form onSubmit={onSubmit} className={`w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Gift options</h2>
      <label className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
        <input className="peer mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="is-gift" />
        <span>This is a gift</span>
      </label>
      <div className="hidden space-y-4 border-t border-gray-200 pt-4 peer-has-[:checked]:block dark:border-gray-800">
        <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800">
          <span className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
            <input className="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="checkbox" name="gift-wrap" />
            Add gift wrap
          </span>
          <span className="shrink-0 tabular-nums text-gray-500 dark:text-gray-400">{wrapPrice}</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="gift-msg">Gift message</label>
          <textarea className="mt-1 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" id="gift-msg" name="gift-message" rows={3} maxLength={200} placeholder="Happy birthday! Hope you love it." />
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Up to 200 characters, printed on the packing slip.</p>
        </div>
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Save gift options
      </button>
    </form>
  );
}

export default function CheckoutGiftOptionsPreview() {
  return <CheckoutGiftOptions />;
}

export const minHeight = 320;
