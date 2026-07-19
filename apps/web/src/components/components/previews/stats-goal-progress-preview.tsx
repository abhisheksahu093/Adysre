/**
 * Live preview for `stats-goal-progress`. Mirrors the `typescript` variant verbatim.
 * Keep in step with `src/data/components/stats.ts`.
 */
interface GoalItem {
  label: string;
  value: number;
  target: number;
  unit?: string;
}

interface StatsGoalProgressProps {
  items?: GoalItem[];
  className?: string;
}

const DEFAULT_ITEMS: GoalItem[] = [
  { label: 'New signups', value: 740, target: 1000 },
  { label: 'MRR target', value: 42, target: 50, unit: 'k' },
  { label: 'Tickets closed', value: 318, target: 300 },
  { label: 'Onboarding', value: 56, target: 100, unit: '%' },
];

function StatsGoalProgress({ items = DEFAULT_ITEMS, className = '' }: StatsGoalProgressProps) {
  const fmt = (n: number): string => n.toLocaleString('en-US');
  return (
    <dl className={`w-full space-y-6 ${className}`}>
      {items.map((item) => {
        const pct = Math.max(0, Math.min(100, (item.value / item.target) * 100));
        const reached = item.value >= item.target;
        const unit = item.unit ?? '';
        return (
          <div key={item.label}>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</dt>
              <dd className="text-sm text-gray-500 tabular-nums dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{fmt(item.value)}{unit}</span> / {fmt(item.target)}{unit}
              </dd>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
              role="progressbar"
              aria-valuenow={item.value}
              aria-valuemin={0}
              aria-valuemax={item.target}
              aria-label={item.label}
            >
              <div
                className={`h-full rounded-full ${reached ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-blue-600 dark:bg-blue-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </dl>
  );
}

export const minHeight = 260;

export default function StatsGoalProgressPreview() {
  return <StatsGoalProgress />;
}
