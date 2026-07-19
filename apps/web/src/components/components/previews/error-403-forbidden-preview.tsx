/**
 * Live preview for `error-403-forbidden`.
 * Mirrors the `typescript` code variant in `src/data/components/error-pages.ts`.
 */
interface Error403ForbiddenProps {
  code?: string;
  title?: string;
  message?: string;
  homeLabel?: string;
  homeHref?: string;
  contactLabel?: string;
  contactHref?: string;
  className?: string;
}

function Error403Forbidden({
  code = '403',
  title = 'Access denied',
  message = "You don't have permission to view this page. If you think this is a mistake, ask an admin for access.",
  homeLabel = 'Go home',
  homeHref = '/',
  contactLabel = 'Request access',
  contactHref = '/contact',
  className = '',
}: Error403ForbiddenProps) {
  return (
    <section className={`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 ${className}`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" />
        </svg>
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={homeHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {homeLabel}
        </a>
        <a
          href={contactHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {contactLabel}
        </a>
      </div>
    </section>
  );
}

export const minHeight = 380;

export default function Error403ForbiddenPreview() {
  return <Error403Forbidden />;
}
