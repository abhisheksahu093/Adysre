'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `signin-inline-error`.
 *
 * Mirrors the `typescript` code variant verbatim, rendered in its error state so
 * the alert banner and aria-invalid field are visible. `onSubmit` is a no-op.
 * Keep this in step with `src/data/components/sign-in.ts`.
 */
interface SignInInlineErrorProps {
  error?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function SignInInlineError({
  error = "That email and password don't match. Try again.",
  onSubmit,
  className = '',
}: SignInInlineErrorProps) {
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className={`mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>

      {error ? (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <span aria-hidden="true" className="mt-px font-bold">!</span>
          <span>{error}</span>
        </div>
      ) : null}

      <div>
        <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>

      <div>
        <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={`mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 ${error ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500 dark:focus-visible:ring-red-400' : 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400'}`}
        />
        {error ? <p id={errorId} className="mt-1.5 text-xs text-red-600 dark:text-red-400">Check your password and try again.</p> : null}
      </div>

      <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
    </form>
  );
}

export const minHeight = 500;

export default function SignInInlineErrorPreview() {
  return <SignInInlineError />;
}
