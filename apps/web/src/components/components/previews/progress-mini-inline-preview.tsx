/**
 * Live preview for `progress-mini-inline`.
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/progress.ts`.
 */
interface ProgressMiniInlineProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  className?: string;
}

function ProgressMiniInline({
  label,
  value,
  min = 0,
  max = 100,
  className = '',
}: ProgressMiniInlineProps) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="shrink-0 text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-gray-600 dark:text-gray-400">
        {pct}%
      </span>
    </div>
  );
}

export default function ProgressMiniInlinePreview() {
  return (
    <div className="w-full space-y-3">
      <ProgressMiniInline label="Onboarding" value={42} />
      <ProgressMiniInline label="Storage" value={81} />
      <ProgressMiniInline label="Backups" value={17} />
    </div>
  );
}
