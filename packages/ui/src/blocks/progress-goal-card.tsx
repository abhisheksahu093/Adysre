/**
 * Live preview for `progress-goal-card`.
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/progress.ts`.
 */
interface ProgressGoalCardProps {
  title: string;
  current: number;
  goal: number;
  prefix?: string;
  caption?: string;
  className?: string;
}

export function ProgressGoalCard({
  title,
  current,
  goal,
  prefix = '',
  caption,
  className = '',
}: ProgressGoalCardProps) {
  const pct = goal > 0 ? Math.round((current / goal) * 100) : 0;
  return (
    <div className={`w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{pct}%</span>
      </div>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
          {prefix}{current.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">of {prefix}{goal.toLocaleString()}</span>
      </p>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-label={title}
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-emerald-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-emerald-500"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      {caption ? <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{caption}</p> : null}
    </div>
  );
}

export default function ProgressGoalCardPreview() {
  return (
    <ProgressGoalCard
      title="Community fund"
      current={18500}
      goal={25000}
      prefix="$"
      caption="312 backers · 6 days left"
    />
  );
}
