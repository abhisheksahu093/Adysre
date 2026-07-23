'use client';

/**
 * Live preview for `signup-invite-code`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/sign-up.ts`.
 */
import type { FormEvent } from 'react';

interface SignupInviteCodeProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupInviteCode({
  title = 'Join the private beta',
  submitLabel = 'Redeem invite',
  onSubmit = () => {},
}: SignupInviteCodeProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Access is invite-only for now.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="sic-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invite code</label>
          <input
            id="sic-code"
            name="inviteCode"
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            required
            placeholder="XXXX-XXXX-XXXX"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm uppercase tracking-widest text-gray-900 shadow-sm placeholder:text-gray-400 placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
        <div>
          <label htmlFor="sic-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <input
            id="sic-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        No code?{' '}
        <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Join the waitlist</a>
      </p>
    </form>
  );
}

export const minHeight = 470;

export default function SignupInviteCodePreview() {
  return <SignupInviteCode />;
}
