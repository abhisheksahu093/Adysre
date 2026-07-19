'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `badge-corner-notification`.
 *
 * Mirrors the `typescript` code variant verbatim. Two hosts show the two
 * modes: an inbox button with a capped count, and an avatar with a presence
 * dot. Keep this in step with `src/data/components/badges.ts`.
 */
interface CornerBadgeProps {
  children: ReactNode;
  count?: number;
  max?: number;
  dot?: boolean;
  srLabel?: string;
  className?: string;
}

function CornerBadge({
  children,
  count = 0,
  max = 99,
  dot = false,
  srLabel = '',
  className = '',
}: CornerBadgeProps) {
  const show = dot || count > 0;
  const display = count > max ? `${max}+` : String(count);

  return (
    <span className={`relative inline-flex ${className}`}>
      {children}
      {show ? (
        dot ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white dark:ring-gray-900">
            {srLabel ? <span className="sr-only">{srLabel}</span> : null}
          </span>
        ) : (
          <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.6875rem] font-semibold leading-none text-white ring-2 ring-white dark:ring-gray-900">
            {display}
            {srLabel ? <span className="sr-only"> {srLabel}</span> : null}
          </span>
        )
      ) : null}
    </span>
  );
}

export default function BadgeCornerNotificationPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 p-6">
      <CornerBadge count={3} srLabel="unread messages">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18v12H3z" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <span className="sr-only">Inbox</span>
        </button>
      </CornerBadge>

      <CornerBadge count={120} srLabel="unread notifications">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 19h16l-2-3v-5a6 6 0 1 0-12 0v5l-2 3z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
          <span className="sr-only">Notifications</span>
        </button>
      </CornerBadge>

      <CornerBadge dot srLabel="Online">
        {/* Initials avatar - no external images in previews. */}
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-800 dark:bg-violet-500/20 dark:text-violet-300">
          AK
        </span>
      </CornerBadge>
    </div>
  );
}
