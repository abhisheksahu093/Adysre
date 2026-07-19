'use client';

import { useState } from 'react';

/**
 * Live preview for `stepper-clickable-navigation`.
 *
 * Mirrors the `typescript` code variant verbatim. Visited steps are real
 * buttons you can click to jump back; upcoming steps are disabled. Labels
 * collapse below sm so the row survives 320px. Keep this in step with
 * `src/data/components/steppers.ts`.
 */
type StepStatus = 'complete' | 'current' | 'upcoming';

function markerClass(status: StepStatus): string {
  const base =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white group-hover:bg-blue-700';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

interface StepperClickableNavigationProps {
  steps: string[];
  initialStep?: number;
  onStepChange?: (index: number) => void;
}

function StepperClickableNavigation({
  steps,
  initialStep = 0,
  onStepChange,
}: StepperClickableNavigationProps) {
  const [current, setCurrent] = useState(initialStep);

  function go(i: number): void {
    if (i > current) return; // cannot skip ahead of the furthest reached step
    setCurrent(i);
    if (onStepChange) onStepChange(i);
  }

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          const clickable = i <= current;
          return (
            <li
              key={label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <button
                type="button"
                onClick={() => go(i)}
                disabled={!clickable}
                aria-label={'Step ' + (i + 1) + ': ' + label}
                className={
                  'group flex items-center gap-2 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:gap-3 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ' +
                  (clickable ? 'cursor-pointer' : 'cursor-not-allowed')
                }
              >
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                <span
                  className={
                    'hidden pr-1 text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {label}
                </span>
              </button>
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

export default function StepperClickableNavigationPreview() {
  return (
    <StepperClickableNavigation steps={['Details', 'Address', 'Payment']} initialStep={1} />
  );
}
