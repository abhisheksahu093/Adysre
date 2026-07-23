/**
 * Live preview for `progress-linear-label`.
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/progress.ts`.
 */
interface ProgressLinearLabelProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  showValue?: boolean;
  className?: string;
}

export function ProgressLinearLabel({
  label,
  value,
  min = 0,
  max = 100,
  showValue = true,
  className = '',
}: ProgressLinearLabelProps) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        {showValue ? (
          <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            {pct}%
          </span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-blue-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ProgressLinearLabelPreview() {
  return <ProgressLinearLabel label="Uploading files" value={68} />;
}
