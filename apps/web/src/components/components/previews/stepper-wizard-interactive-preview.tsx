'use client';

import { useState } from 'react';

/**
 * Live preview for `stepper-wizard-interactive`.
 *
 * Mirrors the `typescript` code variant verbatim. The Back/Next controls really
 * drive the state, so the stage needs extra height for the header, the content
 * panel and the button row. Keep this in step with
 * `src/data/components/steppers.ts`.
 */
export const minHeight = 300;

type StepStatus = 'complete' | 'current' | 'upcoming';

function markerClass(status: StepStatus): string {
  const base =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

interface WizardStep {
  title: string;
  description?: string;
}

interface StepperWizardInteractiveProps {
  steps: WizardStep[];
  initialStep?: number;
}

function StepperWizardInteractive({ steps, initialStep = 0 }: StepperWizardInteractiveProps) {
  const [current, setCurrent] = useState(initialStep);
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;
  const active = steps[current];

  return (
    <div className="w-full">
      <ol className="flex items-center" aria-label="Progress">
        {steps.map((step, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLastMarker = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className={isLastMarker ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
              {!isLastMarker ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 ' + (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div
        className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
        role="group"
        aria-label={active ? active.title : undefined}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{active ? active.title : ''}</h3>
        {active && active.description ? (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{active.description}</p>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={isFirst}
          className="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
          disabled={isLast}
          className="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {isLast ? 'Done' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default function StepperWizardInteractivePreview() {
  return (
    <StepperWizardInteractive
      initialStep={1}
      steps={[
        { title: 'Account', description: 'Choose how you want to sign in.' },
        { title: 'Company details', description: 'Tell us who you are so we can tailor the workspace.' },
        { title: 'Confirm', description: 'Review everything and finish setup.' },
      ]}
    />
  );
}
