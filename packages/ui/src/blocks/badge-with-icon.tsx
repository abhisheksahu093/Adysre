'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `badge-with-icon`.
 *
 * Mirrors the `typescript` code variant verbatim: one badge with the default
 * bolt, one with a custom icon passed through the slot. Keep this in step with
 * `src/data/components/badges.ts`.
 */
interface IconBadgeProps {
  label: string;
  icon?: ReactNode;
  className?: string;
}

const DEFAULT_ICON = (
  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
    <path d="M8.9 1.2 3.3 8.5a.5.5 0 0 0 .4.8h2.9l-.6 5a.5.5 0 0 0 .9.4l5.7-7.4a.5.5 0 0 0-.4-.8H9.3l.5-4.9a.5.5 0 0 0-.9-.4Z" />
  </svg>
);

export function IconBadge({ label, icon = DEFAULT_ICON, className = '' }: IconBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30 ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}

export default function BadgeWithIconPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-6">
      <IconBadge label="Fast track" />
      <IconBadge
        label="Starred"
        icon={
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
            <path d="M8 1.3l2 4.2 4.6.6-3.4 3.2.9 4.5L8 11.6l-4.1 2.2.9-4.5L1.4 6.1 6 5.5 8 1.3z" />
          </svg>
        }
      />
      <IconBadge
        label="Secure"
        icon={
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 1.5l5.5 2v4c0 3.2-2.3 5.6-5.5 7-3.2-1.4-5.5-3.8-5.5-7v-4L8 1.5z" />
          </svg>
        }
      />
    </div>
  );
}
