'use client';

/**
 * Live preview for `reset-password-otp-code`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. A single
 * numeric field (inputMode + one-time-code), not six boxes. Keep this in step
 * with `src/data/components/reset-password.ts`.
 */
import { useId, useState } from 'react';
import type { FormEvent } from 'react';

interface ResetPasswordOtpCodeProps {
  title?: string;
  email?: string;
  length?: number;
  submitLabel?: string;
  onSubmit?: (data: { code: string }) => void;
  onResend?: () => void;
  className?: string;
}

export function ResetPasswordOtpCode({
  title = 'Enter the code',
  email,
  length = 6,
  submitLabel = 'Verify code',
  onSubmit = () => {},
  onResend = () => {},
  className = '',
}: ResetPasswordOtpCodeProps) {
  const codeId = useId();
  const [code, setCode] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ code });
  }

  return (
    <div className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        We sent a {length}-digit code to {email ?? 'your email'}.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={codeId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification code</label>
          <input
            id={codeId}
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={length}
            required
            placeholder="------"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 placeholder:tracking-[0.5em] placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400"
          />
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Didn't get it?{' '}
        <button type="button" onClick={onResend} className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Resend</button>
      </p>
    </div>
  );
}

export const minHeight = 400;

export default function ResetPasswordOtpCodePreview() {
  return <ResetPasswordOtpCode email="you@company.com" />;
}
