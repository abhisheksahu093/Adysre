'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `popover-user-card`.
 *
 * Mirrors the `typescript` code variant verbatim. The panel is a
 * `role="dialog"` labelled by the person's name, holds a Follow action, and the
 * avatar is initials on a gradient - no external image. Escape closes with focus
 * restored to the trigger.
 *
 * Seeded open, with `pb-` reserving the absolutely positioned panel's room.
 * Keep this in step with `src/data/components/popover.ts`.
 */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

interface PopoverUserCardProps {
  name: string;
  role: string;
  bio: string;
  onFollow?: () => void;
  defaultOpen?: boolean;
}

export function PopoverUserCard({ name, role, bio, onFollow, defaultOpen = false }: PopoverUserCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const nameId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {name}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={nameId}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-semibold text-white"
            >
              {initialsOf(name)}
            </span>
            <div className="min-w-0">
              <p id={nameId} className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                {name}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{role}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{bio}</p>
          <button
            type="button"
            onClick={onFollow}
            className="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Follow
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverUserCardPreview() {
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-64 pt-4">
      <PopoverUserCard
        name="Mara Lindqvist"
        role="Staff Engineer - Platform"
        bio="Works on the deployment pipeline and the CLI. Usually online 09:00-17:00 CET."
        onFollow={() => setFollowing((value) => !value)}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {following ? 'Following' : 'Not following'}
      </p>
    </div>
  );
}
