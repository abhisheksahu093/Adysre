/**
 * Live preview for `progress-circular-ring`.
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/progress.ts`.
 */
interface ProgressCircularRingProps {
  value: number;
  label?: string;
  min?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressCircularRing({
  value,
  label = 'Progress',
  min = 0,
  max = 100,
  size = 128,
  strokeWidth = 10,
  className = '',
}: ProgressCircularRingProps) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const center = size / 2;
  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
          <circle cx={center} cy={center} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-gray-200 dark:stroke-gray-800" />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="stroke-blue-600 transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none dark:stroke-blue-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
          {pct}%
        </span>
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

export default function ProgressCircularRingPreview() {
  return <ProgressCircularRing value={72} label="Storage used" />;
}
