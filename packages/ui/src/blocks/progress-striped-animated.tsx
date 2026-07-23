/**
 * Live preview for `progress-striped-animated`.
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/progress.ts`.
 */
const STRIPE_KEYFRAMES = `
  @keyframes progress-stripes { from { background-position: 1rem 0; } to { background-position: 0 0; } }
`;

interface ProgressStripedAnimatedProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  className?: string;
}

export function ProgressStripedAnimated({
  label,
  value,
  min = 0,
  max = 100,
  className = '',
}: ProgressStripedAnimatedProps) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  return (
    <div className={`w-full ${className}`}>
      <style>{STRIPE_KEYFRAMES}</style>
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
        className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-600 bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] animate-[progress-stripes_1s_linear_infinite] motion-reduce:animate-none dark:bg-blue-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ProgressStripedAnimatedPreview() {
  return <ProgressStripedAnimated label="Processing" value={55} />;
}
