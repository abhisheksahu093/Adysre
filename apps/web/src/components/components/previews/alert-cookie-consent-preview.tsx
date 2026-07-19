'use client';

/**
 * Live preview for `alert-cookie-consent`.
 *
 * Mirrors the `typescript` code variant. Accept and Reject are equally prominent
 * real buttons; the banner is a labelled region, not a modal, so it never traps
 * focus. Buttons stack under the copy at 320px and go inline from sm: up. The
 * Reset control is preview scaffolding.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import { useState, type ReactNode } from 'react';

interface AlertCookieConsentProps {
  message: ReactNode;
  acceptLabel?: string;
  rejectLabel?: string;
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

function AlertCookieConsent({
  message,
  acceptLabel = 'Accept all',
  rejectLabel = 'Reject non-essential',
  onAccept,
  onReject,
  className = '',
}: AlertCookieConsentProps) {
  const [answered, setAnswered] = useState<boolean>(false);
  if (answered) return null;

  return (
    <section
      aria-label="Cookie consent"
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <p className="min-w-0 flex-1 text-sm leading-normal text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setAnswered(true);
              onReject?.();
            }}
            className="order-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900 sm:order-1"
          >
            {rejectLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              setAnswered(true);
              onAccept?.();
            }}
            className="order-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-offset-gray-900 sm:order-2"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function AlertCookieConsentPreview() {
  const [instance, setInstance] = useState<number>(0);

  return (
    <div className="w-full max-w-lg">
      <div className="min-h-[6.5rem]">
        <AlertCookieConsent
          key={instance}
          message={
            <>
              We use cookies to keep you signed in and to measure traffic.{' '}
              <a
                href="#"
                className="font-medium text-gray-900 underline underline-offset-2 hover:no-underline dark:text-gray-100"
              >
                See our policy
              </a>
              .
            </>
          }
        />
      </div>

      <button
        type="button"
        onClick={() => setInstance((n) => n + 1)}
        className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        Reset preview
      </button>
    </div>
  );
}

export const minHeight = 240;
