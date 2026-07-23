'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `popover-share`.
 *
 * Mirrors the `typescript` code variant verbatim. A `role="dialog"` with a
 * read-only link field and a Copy button that selects the text and flips to a
 * confirmed state, plus a row of destination buttons that stack at 320px. Escape
 * closes with focus restored to the trigger.
 *
 * Seeded open, with `pb-` reserving the absolutely positioned panel's room.
 * Keep this in step with `src/data/components/popover.ts`.
 */
interface PopoverShareProps {
  label: string;
  url: string;
  destinations?: readonly string[];
  onCopy?: () => void;
  defaultOpen?: boolean;
}

export function PopoverShare({
  label,
  url,
  destinations = ['Email', 'Slack', 'Link'],
  onCopy,
  defaultOpen = false,
}: PopoverShareProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const titleId = useId();

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

  function copy(): void {
    inputRef.current?.select();
    // Optional chaining short-circuits where the Clipboard API is unavailable.
    navigator.clipboard?.writeText(url).catch(() => undefined);
    setCopied(true);
    onCopy?.();
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Share this page
          </h3>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={url}
              aria-label="Shareable link"
              className="w-full min-w-0 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400"
            />
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {destinations.map((destination) => (
              <button
                key={destination}
                type="button"
                className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
              >
                {destination}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverSharePreview() {
  const [copies, setCopies] = useState(0);

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-64 pt-4">
      <PopoverShare
        label="Share"
        url="https://adysre.app/p/aurora-launch"
        onCopy={() => setCopies((value) => value + 1)}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Copied <span className="font-medium tabular-nums">{copies}</span> times
      </p>
    </div>
  );
}
