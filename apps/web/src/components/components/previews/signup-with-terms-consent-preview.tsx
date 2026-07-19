'use client';

/**
 * Live preview for `signup-with-terms-consent`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/sign-up.ts`.
 */
import type { FormEvent } from 'react';

interface SignupWithTermsConsentProps {
  title?: string;
  termsHref?: string;
  privacyHref?: string;
  submitLabel?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

function SignupWithTermsConsent({
  title = 'Create your account',
  termsHref = '#',
  privacyHref = '#',
  submitLabel = 'Create account',
  onSubmit = () => {},
}: SignupWithTermsConsentProps) {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="stc-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <input id="stc-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
        </div>
        <div>
          <label htmlFor="stc-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input id="stc-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          id="stc-consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        />
        <label htmlFor="stc-consent" className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          I agree to the{' '}
          <a href={termsHref} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms of Service</a>
          {' '}and{' '}
          <a href={privacyHref} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>.
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export const minHeight = 460;

export default function SignupWithTermsConsentPreview() {
  return <SignupWithTermsConsent />;
}
