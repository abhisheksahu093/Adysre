/**
 * Live preview for `progress-radial-dashboard`.
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/progress.ts`.
 */
interface ProgressRadialDashboardProps {
  value: number;
  label?: string;
  min?: number;
  max?: number;
  unit?: string;
  className?: string;
}

export function ProgressRadialDashboard({
  value,
  label = 'Score',
  min = 0,
  max = 100,
  unit = '',
  className = '',
}: ProgressRadialDashboardProps) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  const arc = 'M 20 100 A 80 80 0 0 1 180 100';
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
      className={`relative inline-block w-full max-w-[240px] ${className}`}
    >
      <svg viewBox="0 0 200 110" className="w-full" aria-hidden="true">
        <path d={arc} fill="none" strokeWidth={16} strokeLinecap="round" pathLength={100} className="stroke-gray-200 dark:stroke-gray-800" />
        <path
          d={arc}
          fill="none"
          strokeWidth={16}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${pct} 100`}
          className="stroke-indigo-600 transition-[stroke-dasharray] duration-500 ease-out motion-reduce:transition-none dark:stroke-indigo-500"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{value}{unit}</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
    </div>
  );
}

export default function ProgressRadialDashboardPreview() {
  return <ProgressRadialDashboard value={68} label="Performance score" />;
}
