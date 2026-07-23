/**
 * Live preview for `error-empty-state`.
 * Mirrors the `typescript` code variant in `src/data/components/error-pages.ts`.
 */
interface ErrorEmptyStateProps {
  title?: string;
  message?: string;
  createLabel?: string;
  createHref?: string;
  learnLabel?: string;
  learnHref?: string;
  className?: string;
}

export function ErrorEmptyState({
  title = 'No projects yet',
  message = 'Create your first project to get started. It only takes a minute.',
  createLabel = 'Create project',
  createHref = '/new',
  learnLabel,
  learnHref = '#',
  className = '',
}: ErrorEmptyStateProps) {
  return (
    <section className={`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 ${className}`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <path d="M3 7l2-3h14l2 3M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18" />
          <path d="M9 13h6" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={createHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {createLabel}
        </a>
        {learnLabel ? (
          <a
            href={learnHref}
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            {learnLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}

export const minHeight = 360;

export default function ErrorEmptyStatePreview() {
  return <ErrorEmptyState learnLabel="Learn more" />;
}
