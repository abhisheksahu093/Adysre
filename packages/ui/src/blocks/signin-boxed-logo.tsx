'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `signin-boxed-logo`.
 *
 * Mirrors the `typescript` code variant verbatim. A gradient logo badge sits
 * above the card; `onSubmit` is a no-op.
 * Keep this in step with `src/data/components/sign-in.ts`.
 */
interface SignInBoxedLogoProps {
  brand?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function SignInBoxedLogo({
  brand = 'Adysre',
  onSubmit,
  className = '',
}: SignInBoxedLogoProps) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const initial = brand.trim().charAt(0).toUpperCase() || 'A';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={`mx-auto w-full max-w-sm ${className}`}>
      <div className="flex flex-col items-center">
        <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-sm">{initial}</span>
        <h1 className="mt-3 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in to {brand}</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
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

export const minHeight = 460;

export default function SignInBoxedLogoPreview() {
  return <SignInBoxedLogo />;
}
