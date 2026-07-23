'use client';

/**
 * Live preview for `reset-password-minimal`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/reset-password.ts`.
 */
import { useId, useState } from 'react';
import type { FormEvent } from 'react';

interface ResetPasswordMinimalProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (data: { email: string }) => void;
  className?: string;
}

export function ResetPasswordMinimal({
  title = 'Reset password',
  submitLabel = 'Send link',
  onSubmit = () => {},
  className = '',
}: ResetPasswordMinimalProps) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ email });
  }

  return (
    <form onSubmit={handleSubmit} className={`mx-auto w-full max-w-sm ${className}`}>
      <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">We'll email you a link to reset it.</p>

      <div className="mt-5">
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

      <button type="submit" className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {submitLabel}
      </button>
    </form>
  );
}

export const minHeight = 260;

export default function ResetPasswordMinimalPreview() {
  return <ResetPasswordMinimal />;
}
