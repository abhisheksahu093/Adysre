/**
 * Live preview for `stats-kpi-row`. Mirrors the `typescript` variant verbatim.
 * Keep in step with `src/data/components/stats.ts`.
 */
interface KpiItem {
  label: string;
  value: string;
}

interface StatsKpiRowProps {
  items?: KpiItem[];
  className?: string;
}

const DEFAULT_ITEMS: KpiItem[] = [
  { label: 'Monthly revenue', value: '$48,120' },
  { label: 'Active users', value: '12,480' },
  { label: 'Conversion', value: '3.8%' },
  { label: 'Avg. order', value: '$86.40' },
];

function StatsKpiRow({ items = DEFAULT_ITEMS, className = '' }: StatsKpiRowProps) {
  return (
    <dl className={`grid w-full grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-gray-800 dark:bg-gray-800 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col bg-white p-5 dark:bg-gray-900">
          <dt className="order-2 text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
          <dd className="order-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export const minHeight = 220;

export default function StatsKpiRowPreview() {
  return <StatsKpiRow />;
}
