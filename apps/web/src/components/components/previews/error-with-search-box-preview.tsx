/**
 * Live preview for `error-with-search-box`.
 * Mirrors the `typescript` code variant in `src/data/components/error-pages.ts`.
 */
interface ErrorWithSearchBoxProps {
  code?: string;
  title?: string;
  message?: string;
  action?: string;
  placeholder?: string;
  buttonLabel?: string;
  homeLabel?: string;
  homeHref?: string;
  className?: string;
}

function ErrorWithSearchBox({
  code = '404',
  title = 'Page not found',
  message = "We couldn't find that page. Try searching for what you need.",
  action = '/search',
  placeholder = 'Search the site…',
  buttonLabel = 'Search',
  homeLabel = 'Or go back home',
  homeHref = '/',
  className = '',
}: ErrorWithSearchBoxProps) {
  return (
    <section className={`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 ${className}`}>
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <form action={action} method="get" role="search" className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <label htmlFor="error-search" className="sr-only">Search the site</label>
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            id="error-search"
            name="q"
            type="search"
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {buttonLabel}
        </button>
      </form>
      <a
        href={homeHref}
        className="mt-6 text-sm font-medium text-blue-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {homeLabel}
      </a>
    </section>
  );
}

export const minHeight = 400;

export default function ErrorWithSearchBoxPreview() {
  return <ErrorWithSearchBox />;
}
