/**
 * Live preview for `stats-big-number-hero`. Mirrors the `typescript` variant verbatim.
 * Keep in step with `src/data/components/stats.ts`.
 */
interface StatsBigNumberHeroProps {
  value: string;
  label: string;
  description?: string;
  delta?: string;
  direction?: 'up' | 'down';
  className?: string;
}

function StatsBigNumberHero({
  value,
  label,
  description,
  delta,
  direction = 'up',
  className = '',
}: StatsBigNumberHeroProps) {
  const up = direction === 'up';
  return (
    <section className={`mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <dl>
        <dt className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-3 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100">{value}</dd>
      </dl>
      {delta ? (
        <p className={`mx-auto mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
          {delta}
        </p>
      ) : null}
      {description ? (
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
      ) : null}
    </section>
  );
}

export const minHeight = 260;

export default function StatsBigNumberHeroPreview() {
  return (
    <StatsBigNumberHero
      value="$4.2M"
      label="Total processed"
      delta="18% this quarter"
      direction="up"
      description="Across every workspace since launch, settled and reconciled in real time."
    />
  );
}
