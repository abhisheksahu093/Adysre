/**
 * Live preview for `progress-segmented`.
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/progress.ts`.
 */
interface ProgressSegmentedProps {
  value: number;
  label?: string;
  segments?: number;
  min?: number;
  max?: number;
  className?: string;
}

function ProgressSegmented({
  value,
  label = 'Progress',
  segments = 10,
  min = 0,
  max = 100,
  className = '',
}: ProgressSegmentedProps) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  const filled = Math.round((pct / 100) * segments);
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="flex w-full gap-1"
      >
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={`h-2.5 flex-1 rounded-full ${
              i < filled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProgressSegmentedPreview() {
  return <ProgressSegmented label="Profile strength" value={70} />;
}
