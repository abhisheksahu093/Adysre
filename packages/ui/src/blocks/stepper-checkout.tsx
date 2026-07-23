/**
 * Live preview for `stepper-checkout`.
 *
 * Mirrors the `typescript` code variant verbatim. Below sm the labelled row
 * collapses and the active stage is restated as a single line, keeping the four
 * stages inside 320px. Keep this in step with
 * `src/data/components/steppers.ts`.
 */
type StepStatus = 'complete' | 'current' | 'upcoming';

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status: StepStatus): string {
  const base =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

interface StepperCheckoutProps {
  steps: string[];
  current?: number;
}

export function StepperCheckout({ steps, current = 0 }: StepperCheckoutProps) {
  const active = steps[current];
  return (
    <nav aria-label="Checkout progress" className="w-full">
      {active ? (
        <p className="mb-3 text-sm font-medium text-gray-900 sm:hidden dark:text-gray-100">
          <span className="text-gray-500 dark:text-gray-400">
            Step {current + 1} of {steps.length}:
          </span>{' '}
          {active}
        </p>
      ) : null}
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                <span
                  className={
                    'hidden text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {label}
                </span>
              </div>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 sm:mx-3 ' +
                    (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function StepperCheckoutPreview() {
  return <StepperCheckout steps={['Cart', 'Shipping', 'Payment', 'Review']} current={1} />;
}
