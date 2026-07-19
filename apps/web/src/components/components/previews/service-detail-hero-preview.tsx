'use client';

/**
 * Live preview for `service-detail-hero`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the <a> pair for next/link). The meta row wraps rather than
 * scrolls, so the whole hero survives a 390px stage.
 * Keep this in step with `src/data/components/services.ts`.
 */
interface ServiceMeta {
  label: string;
  value: string;
}

interface ServiceDetailHeroProps {
  kicker?: string;
  title: string;
  copy?: string;
  meta?: ServiceMeta[];
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

function ServiceDetailHero({
  kicker,
  title,
  copy,
  meta = [],
  ctaLabel = 'Book a call',
  ctaHref = '#',
  secondaryLabel,
  secondaryHref,
  className = '',
}: ServiceDetailHeroProps) {
  return (
    <section
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}

      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h1>

      {copy ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-[1.0625rem] dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
        {secondaryLabel && secondaryHref ? (
          <a
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {secondaryLabel}
          </a>
        ) : null}
      </div>

      {meta.length > 0 ? (
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-gray-200 pt-6 dark:border-gray-800">
          {meta.map((entry: ServiceMeta) => (
            <div key={entry.label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {entry.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}

const SAMPLE_META: ServiceMeta[] = [
  { label: 'Duration', value: '2-3 weeks' },
  { label: 'Team', value: '2 strategists, 1 engineer' },
  { label: 'Starting at', value: '£18,000' },
];

export default function ServiceDetailHeroPreview() {
  return (
    <ServiceDetailHero
      kicker="Discovery sprint"
      title="Know what to build before you staff it"
      copy="Three weeks of interviews, analytics and prototypes that end in a scoped, costed plan your board can sign off - or a recommendation not to build at all."
      meta={SAMPLE_META}
      ctaLabel="Book a call"
      ctaHref="#"
      secondaryLabel="See the work"
      secondaryHref="#"
    />
  );
}
