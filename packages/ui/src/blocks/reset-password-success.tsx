/**
 * Live preview for `reset-password-success`.
 *
 * Mirrors the `typescript` code variant. Static outcome screen - no state. Keep
 * this in step with `src/data/components/reset-password.ts`.
 */
interface ResetPasswordSuccessProps {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function ResetPasswordSuccess({
  title = 'Password updated',
  message = 'Your password has been changed. You can now sign in with your new password.',
  ctaLabel = 'Continue to sign in',
  ctaHref = '#',
  className = '',
}: ResetPasswordSuccessProps) {
  return (
    <div className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-6 w-6"><path d="m5 13 4 4L19 7" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {message ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p> : null}

      <a href={ctaHref} className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {ctaLabel}
      </a>
    </div>
  );
}

export const minHeight = 360;

export default function ResetPasswordSuccessPreview() {
  return <ResetPasswordSuccess />;
}
