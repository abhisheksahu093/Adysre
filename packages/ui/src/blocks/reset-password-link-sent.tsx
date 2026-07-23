'use client';

/**
 * Live preview for `reset-password-link-sent`.
 *
 * Mirrors the `typescript` code variant. UI-only: onResend is a no-op. Keep this
 * in step with `src/data/components/reset-password.ts`.
 */
interface ResetPasswordLinkSentProps {
  email?: string;
  resendLabel?: string;
  onResend?: () => void;
  backHref?: string;
  className?: string;
}

export function ResetPasswordLinkSent({
  email = 'your inbox',
  resendLabel = 'Resend email',
  onResend = () => {},
  backHref = '#',
  className = '',
}: ResetPasswordLinkSentProps) {
  return (
    <div className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Check your email</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        We sent a password reset link to <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>. It expires in 30 minutes.
      </p>

      <button type="button" onClick={onResend} className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {resendLabel}
      </button>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <a href={backHref} className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
      </p>
    </div>
  );
}

export const minHeight = 400;

export default function ResetPasswordLinkSentPreview() {
  return <ResetPasswordLinkSent email="you@company.com" />;
}
