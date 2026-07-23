'use client';

/**
 * Live preview for `reset-password-expired-link`.
 *
 * Mirrors the `typescript` code variant. UI-only: onResend is a no-op. Keep this
 * in step with `src/data/components/reset-password.ts`.
 */
interface ResetPasswordExpiredLinkProps {
  title?: string;
  message?: string;
  resendLabel?: string;
  onResend?: () => void;
  backHref?: string;
  className?: string;
}

export function ResetPasswordExpiredLink({
  title = 'This link has expired',
  message = "Reset links are valid for 30 minutes. Request a fresh one and we'll email it right over.",
  resendLabel = 'Request a new link',
  onResend = () => {},
  backHref = '#',
  className = '',
}: ResetPasswordExpiredLinkProps) {
  return (
    <div className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {message ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p> : null}

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

export default function ResetPasswordExpiredLinkPreview() {
  return <ResetPasswordExpiredLink />;
}
