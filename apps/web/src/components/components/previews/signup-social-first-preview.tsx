'use client';

/**
 * Live preview for `signup-social-first`.
 *
 * Mirrors the `typescript` code variant. UI-only: handlers are no-ops. Keep this
 * in step with `src/data/components/sign-up.ts`.
 */
import type { FormEvent } from 'react';

interface SignupSocialFirstProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onSocial?: (provider: string) => void;
}

function SignupSocialFirst({
  title = 'Create your account',
  submitLabel = 'Continue with email',
  onSubmit = () => {},
  onSocial = () => {},
}: SignupSocialFirstProps) {
  const social =
    'inline-flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
      <h1 className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-3">
        <button type="button" onClick={() => onSocial('google')} className={social}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" /><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" /><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z" /><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-5 6.7-5Z" /></svg>
          Continue with Google
        </button>
        <button type="button" onClick={() => onSocial('github')} className={social}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1 .8 2.1v3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" /></svg>
          Continue with GitHub
        </button>
      </div>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
      >
        <label htmlFor="ssf-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
        <input
          id="ssf-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        />
        <button
          type="submit"
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}

export const minHeight = 520;

export default function SignupSocialFirstPreview() {
  return <SignupSocialFirst />;
}
