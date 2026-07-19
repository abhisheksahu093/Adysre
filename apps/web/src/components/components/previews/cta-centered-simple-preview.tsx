/**
 * Live preview for `cta-centered-simple`.
 * Mirrors the `typescript` code variant in `src/data/components/cta.ts`.
 */
interface CtaCenteredSimpleProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

function CtaCenteredSimple({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}: CtaCenteredSimpleProps) {
  return (
    <section className={`mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20 ${className}`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={ctaHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
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

export const minHeight = 280;

export default function CtaCenteredSimplePreview() {
  return (
    <CtaCenteredSimple
      title="Ready to ship faster?"
      copy="Start free, invite your team, and go to production in an afternoon."
      ctaLabel="Get started"
      secondaryCtaLabel="Talk to sales"
    />
  );
}
