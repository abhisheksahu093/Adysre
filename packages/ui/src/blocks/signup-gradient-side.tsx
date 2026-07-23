'use client';

/**
 * Live preview for `signup-gradient-side`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/sign-up.ts`.
 */
import type { FormEvent } from 'react';

interface SignupGradientSideProps {
  title?: string;
  panelHeading?: string;
  panelText?: string;
  submitLabel?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupGradientSide({
  title = 'Create your account',
  panelHeading = 'Join 40,000+ teams',
  panelText = '"We shipped our first release the same afternoon we signed up. The setup we dreaded took ten minutes."',
  submitLabel = 'Create account',
  onSubmit = () => {},
}: SignupGradientSideProps) {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
        className="order-1 p-6 sm:p-8"
      >
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">It takes less than a minute.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="sgs-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input id="sgs-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
          </div>
          <div>
            <label htmlFor="sgs-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id="sgs-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </form>

      <section className="order-2 flex flex-col justify-center gap-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white sm:p-8">
        <h2 className="text-lg font-semibold">{panelHeading}</h2>
        <p className="text-sm leading-relaxed text-blue-50">{panelText}</p>
        <p className="text-xs font-medium text-blue-100">- Priya N., Head of Engineering</p>
      </section>
    </div>
  );
}

export const minHeight = 560;

export default function SignupGradientSidePreview() {
  return <SignupGradientSide />;
}
