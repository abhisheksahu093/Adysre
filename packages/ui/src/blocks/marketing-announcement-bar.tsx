'use client';

import { useState } from 'react';

/**
 * Live preview for `marketing-announcement-bar`.
 *
 * Mirrors the `typescript` code variant verbatim. Message and link stack below
 * `sm` so nothing overflows at 320px; the close button is a 40px tap target.
 * Keep in step with `src/data/components/marketing.ts`.
 */
interface AnnouncementBarProps {
  message: string;
  linkLabel?: string;
  linkHref?: string;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

export function AnnouncementBar({
  message,
  linkLabel,
  linkHref = '#',
  dismissLabel = 'Dismiss announcement',
  onDismiss,
  className = '',
}: AnnouncementBarProps) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  function handleDismiss() {
    setOpen(false);
    onDismiss?.();
  }

  return (
    <div className={`w-full bg-blue-600 text-white ${className}`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <p className="flex min-w-0 flex-1 flex-col items-center gap-x-2 gap-y-0.5 text-center text-sm sm:flex-row sm:justify-center">
          <span>{message}</span>
          {linkLabel ? (
            <a
              href={linkHref}
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
            >
              {linkLabel}
              <span aria-hidden="true">&rarr;</span>
            </a>
          ) : null}
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={dismissLabel}
          className="-mr-1.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 motion-reduce:transition-none"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function MarketingAnnouncementBarPreview() {
  return (
    <AnnouncementBar
      message="New: real-time collaboration is now in public beta."
      linkLabel="Read the announcement"
      linkHref="#"
    />
  );
}
