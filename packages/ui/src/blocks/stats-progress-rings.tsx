/**
 * Live preview for `stats-progress-rings`. Mirrors the `typescript` variant verbatim.
 * Keep in step with `src/data/components/stats.ts`.
 */
interface RingItem {
  label: string;
  value: number;
  color: string;
}

interface StatsProgressRingsProps {
  items?: RingItem[];
  className?: string;
}

const DEFAULT_ITEMS: RingItem[] = [
  { label: 'Storage used', value: 72, color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Uptime', value: 99, color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Quota', value: 48, color: 'text-violet-600 dark:text-violet-400' },
  { label: 'Coverage', value: 86, color: 'text-amber-600 dark:text-amber-400' },
];

const R = 36;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function StatsProgressRings({ items = DEFAULT_ITEMS, className = '' }: StatsProgressRingsProps) {
  return (
    <dl className={`grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((item) => {
        const pct = Math.max(0, Math.min(100, item.value));
        const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
        return (
          <div key={item.label} className="flex flex-col items-center">
            <div
              className={`relative ${item.color}`}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={item.label}
            >
              <svg viewBox="0 0 88 88" className="h-24 w-24 -rotate-90">
                <circle cx="44" cy="44" r={R} fill="none" strokeWidth={8} stroke="currentColor" className="text-gray-200 dark:text-gray-800" />
                <circle
                  cx="44"
                  cy="44"
                  r={R}
                  fill="none"
                  strokeWidth={8}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900 dark:text-gray-100">{pct}%</span>
            </div>
            <dt className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
          </div>
        );
      })}
    </dl>
  );
}

export const minHeight = 320;

export default function StatsProgressRingsPreview() {
  return <StatsProgressRings />;
}
