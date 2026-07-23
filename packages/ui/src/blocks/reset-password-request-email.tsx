'use client';

/**
 * Live preview for `reset-password-request-email`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/reset-password.ts`.
 */
import { useId, useState } from 'react';
import type { FormEvent } from 'react';

interface ResetPasswordRequestEmailProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  onSubmit?: (data: { email: string }) => void;
  className?: string;
}

export function ResetPasswordRequestEmail({
  title = 'Forgot your password?',
  subtitle = "Enter your email and we'll send a reset link.",
  submitLabel = 'Send reset link',
  onSubmit = () => {},
  className = '',
}: ResetPasswordRequestEmailProps) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ email });
  }

  return (
    <div className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <a href="#" className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
      </p>
    </div>
  );
}

export const minHeight = 380;

export default function ResetPasswordRequestEmailPreview() {
  return <ResetPasswordRequestEmail />;
}
