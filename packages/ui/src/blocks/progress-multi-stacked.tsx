/**
 * Live preview for `progress-multi-stacked`.
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/progress.ts`.
 */
interface ProgressSegment {
  label: string;
  value: number;
  className: string;
}

interface ProgressMultiStackedProps {
  label: string;
  segments: ProgressSegment[];
  max?: number;
  unit?: string;
  className?: string;
}

export function ProgressMultiStacked({
  label,
  segments,
  max,
  unit = '',
  className = '',
}: ProgressMultiStackedProps) {
  const used = segments.reduce((sum, seg) => sum + seg.value, 0);
  const total = max ?? used;
  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {used} / {total}{unit ? ` ${unit}` : ''}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label}
        className="flex h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        {segments.map((seg) => (
          <span key={seg.label} className={`h-full ${seg.className}`} style={{ width: `${(seg.value / total) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span className={`h-2.5 w-2.5 rounded-sm ${seg.className}`} aria-hidden="true" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{seg.label}</span>
            <span className="tabular-nums">{seg.value}{unit ? ` ${unit}` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProgressMultiStackedPreview() {
  return (
    <ProgressMultiStacked
      label="Disk usage"
      max={256}
      unit="GB"
      segments={[
        { label: 'Media', value: 96, className: 'bg-blue-600 dark:bg-blue-500' },
        { label: 'Documents', value: 60, className: 'bg-emerald-500 dark:bg-emerald-400' },
        { label: 'Apps', value: 24, className: 'bg-amber-500 dark:bg-amber-400' },
      ]}
    />
  );
}
