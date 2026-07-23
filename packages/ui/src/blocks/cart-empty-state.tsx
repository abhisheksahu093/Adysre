/**
 * Live preview for `cart-empty-state`.
 * Mirrors the `typescript` variant in `src/data/components/cart.ts` verbatim.
 */
export const minHeight = 320;

interface CartEmptyStateProps {
  title?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function CartEmptyState({
  title = 'Your cart is empty',
  copy = 'Browse the catalogue and add something you love - it will show up right here.',
  ctaLabel = 'Start shopping',
  ctaHref = '#',
  className = '',
}: CartEmptyStateProps) {
  return (
    <div className={`mx-auto flex w-full max-w-md flex-col items-center px-4 py-12 text-center ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8"><path d="M3 4h2l2.4 12h9.2l1.8-8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.4" fill="currentColor" /><circle cx="17" cy="20" r="1.4" fill="currentColor" /></svg>
      </div>
      <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {copy ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{copy}</p> : null}
      <a href={ctaHref} className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
    </div>
  );
}

export default function CartEmptyStatePreview() {
  return <CartEmptyState />;
}
