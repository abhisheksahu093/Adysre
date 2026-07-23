/**
 * Live preview for `error-404-centered`.
 * Mirrors the `typescript` code variant in `src/data/components/error-pages.ts`.
 */
interface Error404CenteredProps {
  code?: string;
  title?: string;
  message?: string;
  homeLabel?: string;
  homeHref?: string;
  contactLabel?: string;
  contactHref?: string;
  className?: string;
}

export function Error404Centered({
  code = '404',
  title = 'Page not found',
  message = "Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.",
  homeLabel = 'Go home',
  homeHref = '/',
  contactLabel = 'Contact support',
  contactHref = '/contact',
  className = '',
}: Error404CenteredProps) {
  return (
    <section className={`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 ${className}`}>
      <p className="bg-gradient-to-b from-gray-900 to-gray-400 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl dark:from-white dark:to-gray-600">
        {code}
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
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

export default function Error404CenteredPreview() {
  return <Error404Centered />;
}
