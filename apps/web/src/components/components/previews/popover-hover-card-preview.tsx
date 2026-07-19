'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';

/**
 * Live preview for `popover-hover-card`.
 *
 * Mirrors the `typescript` code variant verbatim. Unlike the click popovers,
 * this opens on hover AND focus - the focus half is not optional, or the card is
 * invisible to the keyboard and to touch, which cannot hover at all. A short
 * delay stops it flickering as the pointer passes through; the `relatedTarget`
 * check on blur keeps it open while focus moves into the card's own link.
 * Escape dismisses immediately.
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

interface PopoverHoverCardProps {
  trigger: string;
  name: string;
  meta: string;
  description: string;
  linkLabel?: string;
  delay?: number;
  defaultOpen?: boolean;
}

function PopoverHoverCard({
  trigger,
  name,
  meta,
  description,
  linkLabel = 'View profile',
  delay = 200,
  defaultOpen = false,
}: PopoverHoverCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const cardId = useId();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function show(): void {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delay);
  }

  function hide(): void {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  }

  function onBlur(event: FocusEvent<HTMLSpanElement>): void {
    // Keep open while focus moves BETWEEN the trigger and the card's own link.
    if (rootRef.current?.contains(event.relatedTarget as Node | null)) return;
    hide();
  }

  function onKeyDown(event: KeyboardEvent<HTMLSpanElement>): void {
    if (event.key === 'Escape') hide();
  }

  return (
    <span
      className="relative inline-block"
      ref={rootRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={cardId}
        className="rounded-sm font-semibold text-blue-700 underline decoration-dotted underline-offset-2 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:text-blue-200 dark:focus-visible:ring-blue-400"
      >
        {trigger}
      </button>

      {open ? (
        <span
          id={cardId}
          role="dialog"
          aria-label={name}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 block w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 text-left shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <span className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-semibold text-white"
            >
              {initialsOf(name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{meta}</span>
            </span>
          </span>
          <span className="mt-3 block text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</span>
          <a
            href="#profile"
            className="mt-3 inline-block rounded-sm text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {linkLabel}
          </a>
        </span>
      ) : null}
    </span>
  );
}

export default function PopoverHoverCardPreview() {
  return (
    <div className="flex w-full justify-center pb-64 pt-4 text-sm text-gray-600 dark:text-gray-400">
      <p className="max-w-xs text-center">
        Reviewed by{' '}
        <PopoverHoverCard
          trigger="@dorian"
          name="Dorian Vega"
          meta="Design Systems - joined 2023"
          description="Maintains the token pipeline and the icon set. Reviews on Tuesdays and Thursdays."
          defaultOpen
        />{' '}
        earlier today.
      </p>
    </div>
  );
}
