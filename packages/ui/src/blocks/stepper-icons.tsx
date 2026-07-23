import type { ReactNode } from 'react';

/**
 * Live preview for `stepper-icons`.
 *
 * Mirrors the `typescript` code variant verbatim. Labels collapse below sm so
 * the icon row survives 320px. Keep this in step with
 * `src/data/components/steppers.ts`.
 */
type StepStatus = 'complete' | 'current' | 'upcoming';

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status: StepStatus): string {
  const base = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

interface IconStep {
  label: string;
  icon: ReactNode;
}

interface StepperIconsProps {
  steps: IconStep[];
  current?: number;
}

export function StepperIcons({ steps, current = 0 }: StepperIconsProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : step.icon}</span>
                <span
                  className={
                    'hidden text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {step.label}
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

const CartIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.3a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 8H6" />
    <circle cx="9" cy="20" r="1" />
    <circle cx="18" cy="20" r="1" />
  </svg>
);

const ListIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h12" />
  </svg>
);

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function StepperIconsPreview() {
  return (
    <StepperIcons
      current={1}
      steps={[
        { label: 'Cart', icon: CartIcon },
        { label: 'Details', icon: ListIcon },
        { label: 'Confirm', icon: CheckIcon },
      ]}
    />
  );
}
