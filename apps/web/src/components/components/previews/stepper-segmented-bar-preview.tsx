/**
 * Live preview for `stepper-segmented-bar`.
 *
 * Mirrors the `typescript` code variant verbatim. Every segment is flex-1, so
 * the bar splits evenly and never overflows the stage at any width. Keep this in
 * step with `src/data/components/steppers.ts`.
 */
interface StepperSegmentedBarProps {
  steps: string[];
  current?: number;
}

function StepperSegmentedBar({ steps, current = 0 }: StepperSegmentedBarProps) {
  const total = steps.length;
  const active = steps[current];
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{active}</h3>
        <p className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
          {current + 1} / {total}
        </p>
      </div>
      <ol className="mt-2 flex gap-1.5" aria-label="Progress">
        {steps.map((label, i) => {
          const done = i <= current;
          return (
            <li
              key={label}
              aria-current={i === current ? 'step' : undefined}
              className={
                'h-1.5 flex-1 rounded-full transition-colors motion-reduce:transition-none ' +
                (done ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
              }
            >
              <span className="sr-only">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function StepperSegmentedBarPreview() {
  return (
    <StepperSegmentedBar steps={['Welcome', 'Profile', 'Workspace', 'Invite']} current={1} />
  );
}
