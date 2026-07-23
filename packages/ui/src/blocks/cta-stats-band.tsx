/**
 * Live preview for `cta-stats-band`.
 * Mirrors the `typescript` code variant in `src/data/components/cta.ts`.
 */
interface CtaStat {
  value: string;
  label: string;
}

interface CtaStatsBandProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  stats?: CtaStat[];
}

const DEFAULT_STATS: CtaStat[] = [
  { value: '12k+', label: 'Active teams' },
  { value: '99.99%', label: 'Uptime' },
  { value: '2.4M', label: 'Deploys / day' },
  { value: '90+', label: 'Countries' },
];

export function CtaStatsBand({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  stats = DEFAULT_STATS,
}: CtaStatsBandProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="flex flex-col items-center gap-8 text-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            {title}
          </h2>
          {copy ? (
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {copy}
            </p>
          ) : null}
          <div className="mt-7">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        <dl className="grid w-full grid-cols-2 gap-6 border-t border-gray-200 pt-8 sm:grid-cols-4 dark:border-gray-800">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="order-2 text-sm text-gray-600 dark:text-gray-400">{stat.label}</dt>
              <dd className="order-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export const minHeight = 380;

export default function CtaStatsBandPreview() {
  return (
    <CtaStatsBand
      title="Trusted by teams that ship"
      copy="Join thousands of teams already building on the platform."
      ctaLabel="Get started"
    />
  );
}
