/**
 * Live preview for `stats-comparison-grid`. Mirrors the `typescript` variant verbatim.
 * Keep in step with `src/data/components/stats.ts`.
 */
interface ComparisonItem {
  label: string;
  value: string;
  previous: string;
  delta: string;
  direction: 'up' | 'down';
}

interface StatsComparisonGridProps {
  items?: ComparisonItem[];
  className?: string;
}

const DEFAULT_ITEMS: ComparisonItem[] = [
  { label: 'Revenue', value: '$48,120', previous: '$42,760', delta: '12.5%', direction: 'up' },
  { label: 'Orders', value: '1,204', previous: '1,110', delta: '8.5%', direction: 'up' },
  { label: 'Refund rate', value: '1.8%', previous: '2.3%', delta: '0.5%', direction: 'down' },
  { label: 'Support load', value: '312', previous: '344', delta: '9.3%', direction: 'down' },
];

export function StatsComparisonGrid({ items = DEFAULT_ITEMS, className = '' }: StatsComparisonGridProps) {
  return (
    <dl className={`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((item) => {
        const up = item.direction === 'up';
        return (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
            <dd className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
            <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span className={`inline-flex items-center gap-1 font-semibold ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
                {item.delta}
              </span>
              vs {item.previous} last period
            </p>
          </div>
        );
      })}
    </dl>
  );
}

export const minHeight = 320;

export default function StatsComparisonGridPreview() {
  return <StatsComparisonGrid />;
}
