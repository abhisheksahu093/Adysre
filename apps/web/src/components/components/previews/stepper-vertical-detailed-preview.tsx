/**
 * Live preview for `stepper-vertical-detailed`.
 *
 * Mirrors the `typescript` code variant verbatim. The stage is taller than the
 * default because four steps with descriptions stack vertically. Keep this in
 * step with `src/data/components/steppers.ts`.
 */
export const minHeight = 360;

type StepStatus = 'complete' | 'current' | 'upcoming';

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status: StepStatus): string {
  const base =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

interface VerticalStep {
  title: string;
  description?: string;
}

interface StepperVerticalDetailedProps {
  steps: VerticalStep[];
  current?: number;
}

function StepperVerticalDetailed({ steps, current = 0 }: StepperVerticalDetailedProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol>
        {steps.map((step, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className="flex gap-4"
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex flex-col items-center">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={
                      'mt-1 w-px flex-1 ' + (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                    }
                  />
                ) : null}
              </div>
              <div className={isLast ? '' : 'pb-8'}>
                <h3
                  className={
                    'text-sm font-semibold ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {step.title}
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

export default function StepperVerticalDetailedPreview() {
  return (
    <StepperVerticalDetailed
      current={1}
      steps={[
        { title: 'Create account', description: 'Set your email and a password to get started.' },
        { title: 'Verify email', description: 'Enter the six-digit code we just sent you.' },
        { title: 'Invite your team', description: 'Add teammates now or skip and do it later.' },
      ]}
    />
  );
}
