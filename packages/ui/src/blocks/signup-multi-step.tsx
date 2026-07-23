'use client';

/**
 * Live preview for `signup-multi-step`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/sign-up.ts`.
 */
import type { FormEvent } from 'react';

interface SignupMultiStepProps {
  currentStep?: number;
  totalSteps?: number;
  submitLabel?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupMultiStep({
  currentStep = 1,
  totalSteps = 3,
  submitLabel = 'Continue',
  onSubmit = () => {},
}: SignupMultiStepProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>Account details</span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label="Sign-up progress"
      >
        <div className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-500" style={{ width: `${percent}%` }} />
      </div>

      <h1 className="mt-6 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Tell us about you</h1>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="sms-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
          <input id="sms-name" name="name" type="text" autoComplete="name" required placeholder="Ada Lovelace" className={field} />
        </div>
        <div>
          <label htmlFor="sms-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work email</label>
          <input id="sms-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          disabled={currentStep <= 1}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:disabled:text-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export const minHeight = 460;

export default function SignupMultiStepPreview() {
  return <SignupMultiStep />;
}
