/**
 * Live preview for `progress-steps-checklist`.
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/progress.ts`.
 */
interface ChecklistStep {
  label: string;
  done: boolean;
}

interface ProgressStepsChecklistProps {
  title: string;
  steps: ChecklistStep[];
  className?: string;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
      <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProgressStepsChecklist({
  title,
  steps,
  className = '',
}: ProgressStepsChecklistProps) {
  const done = steps.filter((s) => s.done).length;
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;
  return (
    <div className={`w-full max-w-sm ${className}`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
          {done} of {steps.length}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-label={title}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="h-full rounded-full bg-green-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-green-500" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-3 space-y-2">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-2.5 text-sm">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                step.done
                  ? 'bg-green-600 text-white dark:bg-green-500'
                  : 'border border-gray-300 text-transparent dark:border-gray-700'
              }`}
              aria-hidden="true"
            >
              <CheckIcon />
            </span>
            <span className={step.done ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}>
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProgressStepsChecklistPreview() {
  return (
    <ProgressStepsChecklist
      title="Account setup"
      steps={[
        { label: 'Verify email', done: true },
        { label: 'Add your name', done: true },
        { label: 'Invite a teammate', done: false },
        { label: 'Connect a repo', done: false },
      ]}
    />
  );
}

export const minHeight = 220;
