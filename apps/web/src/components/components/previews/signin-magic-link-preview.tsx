'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `signin-magic-link`.
 *
 * Mirrors the `typescript` code variant verbatim. Submitting swaps in a
 * UI-only "check your inbox" state; no link is actually sent.
 * Keep this in step with `src/data/components/sign-in.ts`.
 */
interface SignInMagicLinkProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

function SignInMagicLink({
  title = 'Sign in with a link',
  submitLabel = 'Email me a link',
  onSubmit,
  className = '',
}: SignInMagicLinkProps) {
  const emailId = useId();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSent(true);
    onSubmit?.(email);
  }

  if (sent) {
    return (
      <div className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Check your inbox</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">We sent a sign-in link to {email || 'your email'}.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400">Use a different email</button>
      </div>
    );
  }

  return (
    <div className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">No password. We email you a one-time link.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
      </form>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">By continuing you agree to the terms of service.</p>
    </div>
  );
}

export const minHeight = 340;

export default function SignInMagicLinkPreview() {
  return <SignInMagicLink />;
}
