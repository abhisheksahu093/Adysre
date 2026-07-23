/**
 * Live preview for `error-rate-limited`.
 * Mirrors the `typescript` code variant in `src/data/components/error-pages.ts`.
 */
interface ErrorRateLimitedProps {
  code?: string;
  title?: string;
  message?: string;
  retryAfter?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorRateLimited({
  code = '429',
  title = 'Too many requests',
  message,
  retryAfter = '60 seconds',
  retryLabel = 'Try again',
  onRetry,
  className = '',
}: ErrorRateLimitedProps) {
  return (
    <section className={`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 ${className}`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2M9 2h6" />
        </svg>
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
        {message ??
          `You've hit the rate limit. Please wait a moment before trying again${
            retryAfter ? ` - you can retry in about ${retryAfter}` : ''
          }.`}
      </p>
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {retryLabel}
        </button>
      </div>
    </section>
  );
}

export const minHeight = 380;

export default function ErrorRateLimitedPreview() {
  return <ErrorRateLimited />;
}
