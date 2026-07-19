'use client';

import { useState } from 'react';

/**
 * Live preview for `avatar-menu-trigger`.
 *
 * Mirrors the `typescript` code variant verbatim. Clicking flips aria-expanded
 * and rotates the chevron; min-h-10 keeps the tap target honest even though the
 * avatar inside is only 32px. Keep this in step with
 * `src/data/components/avatars.ts`.
 */
interface AvatarMenuTriggerProps {
  name: string;
  onToggle?: (open: boolean) => void;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

function AvatarMenuTrigger({ name, onToggle, className = '' }: AvatarMenuTriggerProps) {
  const [open, setOpen] = useState(false);

  function toggle(): void {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  }

  return (
    // The whole contract with your menu is two attributes: aria-haspopup
    // promises one, aria-expanded reports it. No "open"/"closed" text needed -
    // expanded state is announced natively. min-h-10 keeps the tap target
    // honest even though the avatar inside is only 32px.
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={toggle}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${
        open ? 'bg-gray-100 dark:bg-gray-800' : ''
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-semibold text-white"
      >
        {initialsOf(name)}
      </span>
      <span className="max-w-[9rem] truncate text-sm font-medium text-gray-700 dark:text-gray-200">
        {name}
      </span>
      {/* The rotation is decoration; aria-expanded is the announcement. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`h-4 w-4 shrink-0 text-gray-500 transition-transform motion-reduce:transition-none dark:text-gray-400 ${
          open ? 'rotate-180' : ''
        }`}
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="sr-only">Account menu</span>
    </button>
  );
}

export default function AvatarMenuTriggerPreview() {
  return <AvatarMenuTrigger name="Sarah Chen" />;
}
