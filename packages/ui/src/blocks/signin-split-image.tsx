'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `signin-split-image`.
 *
 * Mirrors the `typescript` code variant verbatim. Below `md` the decorative
 * panel is hidden and the form fills the width. `onSubmit` is a no-op.
 * Keep this in step with `src/data/components/sign-in.ts`.
 */
interface SignInSplitImageProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function SignInSplitImage({
  title = 'Welcome back',
  submitLabel = 'Sign in',
  onSubmit,
  className = '',
}: SignInSplitImageProps) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={`mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <div className="p-6 sm:p-8">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Sign in to continue to your workspace.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <div>
            <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>

      <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:flex md:flex-col md:justify-end" aria-hidden="true">
        <p className="text-lg font-semibold text-white">Everything your team ships, in one place.</p>
        <p className="mt-2 text-sm text-blue-100">Trusted by product teams shipping every day.</p>
      </div>
    </div>
  );
}

export const minHeight = 420;

export default function SignInSplitImagePreview() {
  return <SignInSplitImage />;
}
