'use client';

/**
 * Live preview for `about-stats`.
 *
 * Mirrors the `typescript` code variant verbatim. Four metrics - two per row on
 * a narrow stage, one row from `sm`, which is the whole responsive story.
 * Keep this in step with `src/data/components/about.ts`.
 */
interface AboutStat {
  label: string;
  value: string;
}

interface AboutStatsProps {
  kicker?: string;
  title?: string;
  stats: AboutStat[];
  className?: string;
}

export function AboutStats({ kicker, title, stats, className = '' }: AboutStatsProps) {
  return (
    <section
      aria-labelledby="abt-stats-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-stats-title"
          className="mb-8 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {stats.map((stat: AboutStat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-1.5">
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</dt>
            <dd className="text-4xl font-bold leading-[1.05] tracking-tight tabular-nums text-gray-900 dark:text-gray-100">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const SAMPLE_STATS: AboutStat[] = [
  { label: 'People', value: '12' },
  { label: 'Projects shipped', value: '148' },
  { label: 'Client retention', value: '94%' },
  { label: 'Countries', value: '9' },
];

export default function AboutStatsPreview() {
  return <AboutStats title="Where we are after six years" stats={SAMPLE_STATS} />;
}
