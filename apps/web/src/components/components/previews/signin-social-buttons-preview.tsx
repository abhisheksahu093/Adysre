'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `signin-social-buttons`.
 *
 * Mirrors the `typescript` code variant verbatim. Social and submit handlers
 * are no-ops - nothing authenticates.
 * Keep this in step with `src/data/components/sign-in.ts`.
 */
interface SignInSocialButtonsProps {
  title?: string;
  onSocial?: (provider: string) => void;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

function SignInSocialButtons({
  title = 'Sign in',
  onSocial,
  onSubmit,
  className = '',
}: SignInSocialButtonsProps) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <h1 className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-3">
        <button type="button" onClick={() => onSocial?.('google')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
          <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-red-500 to-yellow-500 text-[0.65rem] font-bold text-white">G</span>
          Continue with Google
        </button>
        <button type="button" onClick={() => onSocial?.('github')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
          <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-[0.65rem] font-bold text-white dark:bg-gray-100 dark:text-gray-900">GH</span>
          Continue with GitHub
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
      </form>
    </div>
  );
}

export const minHeight = 540;

export default function SignInSocialButtonsPreview() {
  return <SignInSocialButtons />;
}
