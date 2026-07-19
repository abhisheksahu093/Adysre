/**
 * Live preview for `about-quote-highlight`.
 * Mirrors the `typescript` variant in `src/data/components/about.ts` verbatim.
 */
export const minHeight = 320;

interface AboutQuoteHighlightProps {
  quote: string;
  attributionName: string;
  attributionRole?: string;
  initials?: string;
  className?: string;
}

function AboutQuoteHighlight({
  quote,
  attributionName,
  attributionRole,
  initials,
  className = '',
}: AboutQuoteHighlightProps) {
  return (
    <section
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 text-center md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <figure className="m-0">
        <svg
          className="mx-auto h-8 w-8 text-blue-600/30 dark:text-blue-400/30"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M9.5 5C6.5 6.7 5 9.3 5 12.9V19h6v-6H8.2c0-2.2.9-3.7 2.6-4.7L9.5 5Zm9 0c-3 1.7-4.5 4.3-4.5 7.9V19h6v-6h-2.8c0-2.2.9-3.7 2.6-4.7L18.5 5Z" />
        </svg>
        <blockquote className="mt-5 text-balance text-2xl font-semibold leading-snug tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {quote}
        </blockquote>
        <figcaption className="mt-6 flex items-center justify-center gap-3">
          {initials ? (
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {initials}
            </span>
          ) : null}
          <span className="text-left">
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{attributionName}</span>
            {attributionRole ? (
              <span className="block text-sm text-gray-500 dark:text-gray-400">{attributionRole}</span>
            ) : null}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}

export default function AboutQuoteHighlightPreview() {
  return (
    <AboutQuoteHighlight
      quote="They shipped in ten weeks what our last vendor could not describe in ten months. We own every line of it."
      attributionName="Dana Levine"
      attributionRole="VP Engineering, Northwind"
      initials="DL"
    />
  );
}
