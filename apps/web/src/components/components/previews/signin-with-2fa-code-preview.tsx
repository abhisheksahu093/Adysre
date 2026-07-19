'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `signin-with-2fa-code`.
 *
 * Mirrors the `typescript` code variant verbatim. A single numeric one-time-code
 * field with a resend action; both handlers are no-ops.
 * Keep this in step with `src/data/components/sign-in.ts`.
 */
interface SignInWith2faCodeProps {
  title?: string;
  length?: number;
  onSubmit?: (code: string) => void;
  onResend?: () => void;
  className?: string;
}

function SignInWith2faCode({
  title = 'Two-factor authentication',
  length = 6,
  onSubmit,
  onResend,
  className = '',
}: SignInWith2faCodeProps) {
  const codeId = useId();
  const [code, setCode] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(code);
  }

  return (
    <div className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Enter the {length}-digit code from your authenticator app.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="text-left">
          <label htmlFor={codeId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification code</label>
          <input
            id={codeId}
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={length}
            required
            placeholder="000000"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, length))}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 placeholder:tracking-[0.5em] placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus-visible:ring-blue-400"
          />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Verify</button>
      </form>

      <button type="button" onClick={() => onResend?.()} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400">Resend code</button>
    </div>
  );
}

export const minHeight = 360;

export default function SignInWith2faCodePreview() {
  return <SignInWith2faCode />;
}
