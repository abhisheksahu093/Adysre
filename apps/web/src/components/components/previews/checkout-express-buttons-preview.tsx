/**
 * Live preview for `checkout-express-buttons`.
 * Mirrors the `typescript` code variant. The brand marks are decorative inline
 * SVG stand-ins, not the real trademarked logos. Keep in step with
 * `src/data/components/checkout.ts`.
 */
const ICON = 'h-4 w-4';

interface CheckoutExpressButtonsProps {
  onSelect?: (method: string) => void;
  className?: string;
}

function CheckoutExpressButtons({
  onSelect = () => {},
  className = '',
}: CheckoutExpressButtonsProps) {
  return (
    <div className={`w-full max-w-sm space-y-3 ${className}`}>
      <button
        type="button"
        aria-label="Pay with Apple Pay"
        onClick={() => onSelect('apple')}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true"><path d="M16.5 3c.1 1-.3 2-1 2.8-.6.7-1.7 1.3-2.7 1.2-.1-1 .4-2 1-2.7C14.5 3.6 15.6 3 16.5 3zm2.9 15.3c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3.1-3.6 3.1-1.4 0-1.7-.9-3.5-.9s-2.2.9-3.5.9c-1.5 0-2.7-1.6-3.5-3C1.8 17 1.5 12.6 3.6 10.3c1-1.1 2.3-1.8 3.6-1.8 1.4 0 2.3.9 3.5.9 1.1 0 1.8-.9 3.5-.9 1.2 0 2.5.7 3.4 1.8-3 1.6-2.5 5.9.2 7z" /></svg>
        <span>Apple Pay</span>
      </button>
      <button
        type="button"
        aria-label="Pay with Google Pay"
        onClick={() => onSelect('google')}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" className={ICON} aria-hidden="true"><path fill="#4285F4" d="M12 11v2.8h4c-.2 1-1.4 3-4 3-2.4 0-4.3-2-4.3-4.5S9.6 8 12 8c1.3 0 2.2.6 2.7 1l1.9-1.9C15.4 6 13.9 5.3 12 5.3 8.3 5.3 5.3 8.3 5.3 12s3 6.7 6.7 6.7c3.9 0 6.4-2.7 6.4-6.5 0-.5 0-.8-.1-1.2H12z" /></svg>
        <span>Google Pay</span>
      </button>
      <button
        type="button"
        aria-label="Pay with PayPal"
        onClick={() => onSelect('paypal')}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffc439] px-5 py-3 text-sm font-bold text-[#003087] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true"><path d="M9.5 5h5.2c2.4 0 4 1.4 3.6 3.9-.4 2.6-2.3 3.9-4.8 3.9h-1.4c-.4 0-.7.3-.8.7l-.7 4.2c0 .2-.2.4-.5.4H6.9c-.3 0-.5-.3-.4-.6L8.9 5.4c.1-.2.3-.4.6-.4z" /></svg>
        <span>PayPal</span>
      </button>
      <div className="flex items-center gap-3 py-1" role="separator" aria-label="or pay with card">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export default function CheckoutExpressButtonsPreview() {
  return <CheckoutExpressButtons />;
}

export const minHeight = 300;
