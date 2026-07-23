/**
 * Live preview for `stats-dashboard-summary`. Mirrors the `typescript` variant verbatim.
 * Keep in step with `src/data/components/stats.ts`.
 */
interface SummaryItem {
  label: string;
  value: string;
  delta?: string;
  direction?: 'up' | 'down';
}

interface StatsDashboardSummaryProps {
  title?: string;
  caption?: string;
  items?: SummaryItem[];
  className?: string;
}

const DEFAULT_ITEMS: SummaryItem[] = [
  { label: 'Revenue', value: '$48,120', delta: '12.5%', direction: 'up' },
  { label: 'Orders', value: '1,204', delta: '8.2%', direction: 'up' },
  { label: 'Avg. order', value: '$86.40', delta: '1.1%', direction: 'down' },
  { label: 'Refunds', value: '$1,120', delta: '3.1%', direction: 'down' },
];

export function StatsDashboardSummary({
  title = 'Overview',
  caption,
  items = DEFAULT_ITEMS,
  className = '',
}: StatsDashboardSummaryProps) {
  return (
    <section className={`w-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {caption ? <p className="text-xs text-gray-500 dark:text-gray-400">{caption}</p> : null}
      </div>
      <dl className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4 dark:divide-gray-800">
        {items.map((item) => {
          const up = item.direction === 'up';
          return (
            <div key={item.label} className="p-5">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
              {item.delta ? (
                <p className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
                  {item.delta}
                </p>
              ) : null}
            </div>
          );
        })}
      </dl>
    </section>
  );
}

export const minHeight = 320;

export default function StatsDashboardSummaryPreview() {
  return <StatsDashboardSummary caption="Last 30 days" />;
}
