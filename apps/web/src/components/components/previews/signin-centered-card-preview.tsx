'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `signin-centered-card`.
 *
 * Mirrors the `typescript` code variant verbatim. The form is live - type into
 * it, toggle the password - but it authenticates nowhere; `onSubmit` is a no-op.
 * Keep this in step with `src/data/components/sign-in.ts`.
 */
interface SignInCenteredCardProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

function SignInCenteredCard({
  title = 'Sign in',
  subtitle = 'Welcome back. Enter your details.',
  submitLabel = 'Sign in',
  onSubmit,
  className = '',
}: SignInCenteredCardProps) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
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

        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative mt-1.5">
            <input
              id={passwordId}
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-16 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-pressed={show}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}

export const minHeight = 420;

export default function SignInCenteredCardPreview() {
  return <SignInCenteredCard />;
}
