/**
 * Live preview for `error-404-illustration`.
 * Mirrors the `typescript` code variant in `src/data/components/error-pages.ts`.
 */
interface Error404IllustrationProps {
  title?: string;
  message?: string;
  homeLabel?: string;
  homeHref?: string;
  className?: string;
}

export function Error404Illustration({
  title = 'Lost connection',
  message = "The page you were after has wandered off. Let's get you back to solid ground.",
  homeLabel = 'Back to home',
  homeHref = '/',
  className = '',
}: Error404IllustrationProps) {
  return (
    <section className={`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 ${className}`}>
      <svg
        viewBox="0 0 240 120"
        fill="none"
        stroke="currentColor"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-24 w-auto text-blue-500 sm:h-28 dark:text-blue-400"
        aria-hidden="true"
      >
        <path d="M18 60h56" />
        <rect x="74" y="42" width="26" height="36" rx="7" />
        <path d="M100 51h14M100 69h14" />
        <path d="M222 60h-56" />
        <rect x="140" y="42" width="26" height="36" rx="7" />
        <path d="M58 30 48 16M182 30l10-14M120 22V6" />
      </svg>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Error 404</p>
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
      </div>
    </section>
  );
}

export const minHeight = 400;

export default function Error404IllustrationPreview() {
  return <Error404Illustration />;
}
