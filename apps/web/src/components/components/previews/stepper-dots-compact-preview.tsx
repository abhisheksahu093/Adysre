/**
 * Live preview for `stepper-dots-compact`.
 *
 * Mirrors the `typescript` code variant verbatim. The tightest footprint of the
 * set, so nothing here needs extra height or overrides. Keep this in step with
 * `src/data/components/steppers.ts`.
 */
type StepStatus = 'complete' | 'current' | 'upcoming';

function dotClass(status: StepStatus): string {
  const base = 'block h-2.5 rounded-full transition-all';
  if (status === 'complete') return base + ' w-2.5 bg-blue-600';
  if (status === 'current') return base + ' w-6 bg-blue-600';
  return base + ' w-2.5 bg-gray-300 dark:bg-gray-700';
}

interface StepperDotsCompactProps {
  steps: string[];
  current?: number;
}

function StepperDotsCompact({ steps, current = 0 }: StepperDotsCompactProps) {
  const active = steps[current];
  return (
    <nav aria-label="Progress" className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <ol className="flex items-center gap-2">
        {steps.map((label, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          return (
            <li key={label}>
              <span className={dotClass(status)} aria-current={status === 'current' ? 'step' : undefined} />
              <span className="sr-only">
                {label}
                {status === 'complete' ? ' (complete)' : status === 'current' ? ' (current)' : ''}
              </span>
            </li>
          );
        })}
      </ol>
      {active ? (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          <span className="text-gray-500 dark:text-gray-400">
            Step {current + 1} of {steps.length}:
          </span>{' '}
          {active}
        </p>
      ) : null}
    </nav>
  );
}

export default function StepperDotsCompactPreview() {
  return <StepperDotsCompact steps={['Plan', 'Build', 'Review', 'Ship']} current={1} />;
}
