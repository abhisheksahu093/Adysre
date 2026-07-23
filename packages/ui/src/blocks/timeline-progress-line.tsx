/**
 * Live preview for `timeline-progress-line`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/timeline.ts`.
 */
import type { ReactNode } from 'react';

interface ProgressStep {
  title: ReactNode;
  description?: ReactNode;
}

interface TimelineProgressLineProps {
  steps: ProgressStep[];
  currentStep?: number;
  className?: string;
}

const CheckMark = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export function TimelineProgressLine({ steps, currentStep = 0, className = '' }: TimelineProgressLineProps) {
  return (
    <ol className={`mx-auto w-full max-w-md ${className}`}>
      {steps.map((step, i) => {
        const completed = i < currentStep;
        const active = i === currentStep;
        const isLast = i === steps.length - 1;
        return (
          <li
            key={i}
            className={`relative flex gap-4 ${isLast ? '' : 'pb-6'}`}
            aria-current={active ? 'step' : undefined}
          >
            <div className="flex flex-col items-center">
              {completed ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500">
                  <CheckMark />
                </span>
              ) : active ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-white dark:border-blue-500 dark:bg-gray-950">
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                </span>
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950" />
              )}
              {!isLast ? (
                <span
                  className={`mt-1 w-0.5 grow ${completed ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-800'}`}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className={`-mt-0.5 ${isLast ? '' : 'pb-1'}`}>
              <h3
                className={`text-sm font-semibold ${active ? 'text-blue-700 dark:text-blue-300' : completed ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
              >
                {step.title}
              </h3>
              {step.description ? (
                <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function TimelineProgressLinePreview() {
  return (
    <TimelineProgressLine
      currentStep={1}
      steps={[
        { title: 'Order placed', description: 'We received your order.' },
        { title: 'Packed', description: 'Your parcel is being prepared.' },
        { title: 'Shipped', description: 'On its way to you.' },
        { title: 'Delivered', description: 'Estimated in 2 days.' },
      ]}
    />
  );
}

export const minHeight = 320;
