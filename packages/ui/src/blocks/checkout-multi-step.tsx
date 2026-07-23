'use client';

import { useState } from 'react';

/**
 * Live preview for `checkout-multi-step`.
 * Mirrors the `typescript` code variant - the step is real state, so Continue
 * and Back drive the progressbar. Keep in step with
 * `src/data/components/checkout.ts`.
 */
const DEFAULT_STEPS = ['Contact', 'Shipping', 'Payment', 'Review'];

interface CheckoutMultiStepProps {
  steps?: string[];
  onComplete?: () => void;
  className?: string;
}

export function CheckoutMultiStep({
  steps = DEFAULT_STEPS,
  onComplete = () => {},
  className = '',
}: CheckoutMultiStepProps) {
  const [step, setStep] = useState<number>(0);
  const count = steps.length;
  const label = steps[step] ?? '';
  const isLast = step === count - 1;

  const back = (): void => setStep((s) => Math.max(0, s - 1));
  const next = (): void => {
    if (isLast) onComplete();
    else setStep((s) => Math.min(count - 1, s + 1));
  };

  return (
    <div className={`mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={count}
        aria-label={`Checkout step ${step + 1} of ${count}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-blue-500"
          style={{ width: `${((step + 1) / count) * 100}%` }}
        />
      </div>

      <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
        {steps.map((s, i) => (
          <li
            key={s}
            aria-current={i === step ? 'step' : undefined}
            className={i === step ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}
          >
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="cm-field">
            {label} details
          </label>
          <input
            id="cm-field"
            type="text"
            placeholder={`Enter ${label.toLowerCase()} details`}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {isLast ? 'Place order' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutMultiStepPreview() {
  return <CheckoutMultiStep />;
}

export const minHeight = 420;
