'use client';

/**
 * Live preview for `hero-centered`.
 *
 * Mirrors the `typescript` code variant verbatim. The stage is only ~390px wide
 * at its narrowest, which is exactly the case the component's own `sm:` steps
 * exist for - the type and padding shrink themselves, so nothing is overridden
 * here. Keep this in step with `src/data/components/hero.ts`.
 */
interface HeroCenteredProps {
  title: string;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

function HeroCentered({
  title,
  kicker,
  copy,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}: HeroCenteredProps) {
  return (
    <section className={`mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20 ${className}`}>
      {kicker ? (
        <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
          {kicker}
        </p>
      ) : null}

      <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>

      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={ctaHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
        {secondaryCtaLabel ? (
          <a
            href={secondaryCtaHref}
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {secondaryCtaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}

export default function HeroCenteredPreview() {
  return (
    <HeroCentered
      title="Ship your product, not your infrastructure"
      kicker="New - v2.0 is out"
      copy="Everything you need to launch, measure and scale - in one place, with no servers to babysit."
      ctaLabel="Start free trial"
      ctaHref="#"
      secondaryCtaLabel="Book a demo"
      secondaryCtaHref="#"
    />
  );
}
