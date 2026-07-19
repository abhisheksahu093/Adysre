/**
 * Live preview for `stats-cards-trend`. Mirrors the `typescript` variant verbatim.
 * Keep in step with `src/data/components/stats.ts`.
 */
interface TrendItem {
  label: string;
  value: string;
  delta: string;
  direction: 'up' | 'down';
  hint?: string;
}

interface StatsCardsTrendProps {
  items?: TrendItem[];
  className?: string;
}

const DEFAULT_ITEMS: TrendItem[] = [
  { label: 'Revenue', value: '$48,120', delta: '12.5%', direction: 'up', hint: 'vs last month' },
  { label: 'New users', value: '1,204', delta: '8.2%', direction: 'up', hint: 'vs last month' },
  { label: 'Churn', value: '2.1%', delta: '0.4%', direction: 'down', hint: 'vs last month' },
  { label: 'Refunds', value: '$1,120', delta: '3.1%', direction: 'down', hint: 'vs last month' },
];

function StatsCardsTrend({ items = DEFAULT_ITEMS, className = '' }: StatsCardsTrendProps) {
  return (
    <dl className={`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((item) => {
        const up = item.direction === 'up';
        return (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
            <dd className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{item.value}</span>
              <span className={`inline-flex items-center gap-1 text-sm font-semibold ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
                {item.delta}
              </span>
            </dd>
            {item.hint ? <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{item.hint}</p> : null}
          </div>
        );
      })}
    </dl>
  );
}

export const minHeight = 320;

export default function StatsCardsTrendPreview() {
  return <StatsCardsTrend />;
}
