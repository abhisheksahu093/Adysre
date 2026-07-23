/**
 * Live preview for `error-search-no-results`.
 * Mirrors the `typescript` code variant in `src/data/components/error-pages.ts`.
 */
interface ErrorSearchNoResultsProps {
  query?: string;
  title?: string;
  message?: string;
  clearLabel?: string;
  onClear?: () => void;
  browseLabel?: string;
  browseHref?: string;
  className?: string;
}

export function ErrorSearchNoResults({
  query,
  title = 'No results found',
  message,
  clearLabel = 'Clear search',
  onClear,
  browseLabel = 'Browse all',
  browseHref = '/',
  className = '',
}: ErrorSearchNoResultsProps) {
  return (
    <section className={`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 ${className}`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      <p className="mt-3 max-w-md break-words text-base leading-relaxed text-gray-600 dark:text-gray-400">
        {message ?? (
          <>
            We couldn't find anything
            {query ? (
              <>
                {' for '}
                <span className="font-semibold text-gray-900 dark:text-gray-100">"{query}"</span>
              </>
            ) : null}
            . Try a different term or check your spelling.
          </>
        )}
      </p>
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {clearLabel}
        </button>
        <a
          href={browseHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {browseLabel}
        </a>
      </div>
    </section>
  );
}

export const minHeight = 380;

export default function ErrorSearchNoResultsPreview() {
  return <ErrorSearchNoResults query="quantum widgets" />;
}
