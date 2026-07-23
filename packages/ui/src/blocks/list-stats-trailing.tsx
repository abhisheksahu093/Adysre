/**
 * Live preview for `list-stats-trailing`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/lists.ts`.
 */
interface StatItem {
  id: string;
  label: string;
  value: string;
  sublabel?: string;
  delta?: string;
  trend?: 'up' | 'down';
}

interface ListStatsTrailingProps {
  items: StatItem[];
  ariaLabel?: string;
}

export function ListStatsTrailing({ items, ariaLabel = 'Statistics' }: ListStatsTrailingProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => {
        const up = (item.trend ?? 'up') === 'up';
        return (
          <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.label}
              </span>
              {item.sublabel ? (
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {item.sublabel}
                </span>
              ) : null}
            </span>
            <span className="flex shrink-0 flex-col items-end">
              <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                {item.value}
              </span>
              {item.delta ? (
                <span
                  className={`text-xs font-medium tabular-nums ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                >
                  {up ? '▲' : '▼'} {item.delta}
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const STATS: StatItem[] = [
  { id: '1', label: 'Monthly active users', value: '48,290', sublabel: 'Last 30 days', delta: '12.4%', trend: 'up' },
  { id: '2', label: 'Trial conversions', value: '1,204', sublabel: 'Last 30 days', delta: '3.1%', trend: 'up' },
  { id: '3', label: 'Churned accounts', value: '86', sublabel: 'Last 30 days', delta: '5.8%', trend: 'down' },
  { id: '4', label: 'Avg. response time', value: '212ms', sublabel: 'p95 this week', delta: '9.0%', trend: 'down' },
];

export const minHeight = 260;

export default function ListStatsTrailingPreview() {
  return (
    <div className="w-full max-w-sm">
      <ListStatsTrailing items={STATS} ariaLabel="Key metrics" />
    </div>
  );
}
