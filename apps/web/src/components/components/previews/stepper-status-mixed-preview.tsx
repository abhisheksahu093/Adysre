/**
 * Live preview for `stepper-status-mixed`.
 *
 * Mirrors the `typescript` code variant verbatim. Each step declares its own
 * state, so the stage shows a complete, an error and a current step at once. The
 * vertical layout needs extra height. Keep this in step with
 * `src/data/components/steppers.ts`.
 */
export const minHeight = 340;

type StepStatus = 'complete' | 'current' | 'error' | 'upcoming';

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status: StepStatus): string {
  const base =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'error') return base + ' bg-red-600 font-bold text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

function titleClass(status: StepStatus): string {
  if (status === 'error') return 'text-sm font-semibold text-red-600 dark:text-red-400';
  if (status === 'upcoming') return 'text-sm font-semibold text-gray-500 dark:text-gray-400';
  return 'text-sm font-semibold text-gray-900 dark:text-gray-100';
}

function stateLabel(status: StepStatus): string {
  if (status === 'complete') return ' (complete)';
  if (status === 'error') return ' (error)';
  if (status === 'current') return ' (current)';
  return '';
}

interface MixedStep {
  title: string;
  description?: string;
  status: StepStatus;
}

interface StepperStatusMixedProps {
  steps: MixedStep[];
}

function StepperStatusMixed({ steps }: StepperStatusMixedProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className="flex gap-4"
              aria-current={step.status === 'current' ? 'step' : undefined}
            >
              <div className="flex flex-col items-center">
                <span className={markerClass(step.status)}>
                  {step.status === 'complete' ? CHECK : step.status === 'error' ? '!' : i + 1}
                </span>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={
                      'mt-1 w-px flex-1 ' +
                      (step.status === 'complete' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                    }
                  />
                ) : null}
              </div>
              <div className={isLast ? '' : 'pb-8'}>
                <h3 className={titleClass(step.status)}>
                  {step.title}
                  <span className="sr-only">{stateLabel(step.status)}</span>
                </h3>
                {step.description ? (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function StepperStatusMixedPreview() {
  return (
    <StepperStatusMixed
      steps={[
        { title: 'Details submitted', description: 'Your account information was saved.', status: 'complete' },
        { title: 'Payment failed', description: 'Your card was declined. Try another payment method.', status: 'error' },
        { title: 'Confirmation', description: 'Review and place your order.', status: 'current' },
        { title: 'Shipped', description: 'We will email tracking once it ships.', status: 'upcoming' },
      ]}
    />
  );
}
