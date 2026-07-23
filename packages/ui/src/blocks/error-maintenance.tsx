/**
 * Live preview for `error-maintenance`.
 * Mirrors the `typescript` code variant in `src/data/components/error-pages.ts`.
 */
interface ErrorMaintenanceProps {
  title?: string;
  message?: string;
  eta?: string;
  statusLabel?: string;
  statusHref?: string;
  className?: string;
}

export function ErrorMaintenance({
  title = 'Down for maintenance',
  message = "We're making things better behind the scenes and will be back shortly. Thanks for your patience.",
  eta = 'about 30 minutes',
  statusLabel = 'View status page',
  statusHref = '/status',
  className = '',
}: ErrorMaintenanceProps) {
  return (
    <section className={`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 ${className}`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      {eta ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <span className="h-2 w-2 rounded-full bg-indigo-500 motion-safe:animate-pulse dark:bg-indigo-400" aria-hidden="true" />
          Estimated back in {eta}
        </p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={statusHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {statusLabel}
        </a>
      </div>
    </section>
  );
}

export const minHeight = 400;

export default function ErrorMaintenancePreview() {
  return <ErrorMaintenance />;
}
