/**
 * Live preview for `stats-with-sparklines`. Mirrors the `typescript` variant verbatim.
 * Keep in step with `src/data/components/stats.ts`.
 */
interface SparkItem {
  label: string;
  value: string;
  direction: 'up' | 'down';
  points: number[];
}

interface StatsWithSparklinesProps {
  items?: SparkItem[];
  className?: string;
}

const DEFAULT_ITEMS: SparkItem[] = [
  { label: 'Sessions', value: '18,420', direction: 'up', points: [40, 52, 48, 70, 66, 92] },
  { label: 'Signups', value: '1,204', direction: 'up', points: [20, 30, 28, 45, 60, 72] },
  { label: 'Bounce rate', value: '41.2%', direction: 'down', points: [80, 72, 76, 50, 44, 30] },
  { label: 'Latency', value: '128ms', direction: 'down', points: [90, 84, 88, 60, 52, 40] },
];

function sparkPoints(values: number[]): string {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? 100 / (values.length - 1) : 0;
  return values
    .map((v, i) => `${(i * step).toFixed(1)},${(32 - ((v - min) / range) * 32).toFixed(1)}`)
    .join(' ');
}

export function StatsWithSparklines({ items = DEFAULT_ITEMS, className = '' }: StatsWithSparklinesProps) {
  return (
    <dl className={`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
          <dd className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
          <svg
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
            className={`mt-3 h-8 w-full ${item.direction === 'up' ? 'text-emerald-500' : 'text-red-500'}`}
            aria-hidden="true"
          >
            <polyline
              points={sparkPoints(item.points)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </dl>
  );
}

export const minHeight = 340;

export default function StatsWithSparklinesPreview() {
  return <StatsWithSparklines />;
}
