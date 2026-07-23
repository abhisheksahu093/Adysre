/**
 * Live preview for `hero-stats`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/hero.ts`.
 */
import type { ReactNode } from 'react';

interface HeroStat {
  value: string;
  label: string;
}

interface HeroStatsProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  stats?: HeroStat[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const DEFAULT_STATS: HeroStat[] = [
  { value: '12k+', label: 'Active teams' },
  { value: '99.99%', label: 'Uptime' },
  { value: '840M', label: 'Requests / day' },
  { value: '70+', label: 'Countries' },
];

export function HeroStats({
  title,
  kicker,
  copy,
  stats = DEFAULT_STATS,
  ctaLabel = 'Start free',
  ctaHref = '#',
  className = '',
}: HeroStatsProps) {
  return (
    <section className={`mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 ${className}`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>

      <dl className="mt-10 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <dt className="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</dt>
            <dd className="order-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function HeroStatsPreview() {
  return (
    <HeroStats
      title="Numbers teams grow into"
      kicker="Trusted at scale"
      copy="From first commit to global rollout, the platform keeps up."
      ctaLabel="Start free"
      ctaHref="#"
    />
  );
}

export const minHeight = 340;
