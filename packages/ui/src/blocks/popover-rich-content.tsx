'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `popover-rich-content`.
 *
 * Mirrors the `typescript` code variant verbatim. The action inside is why this
 * is a `role="dialog"` and not a tooltip - you cannot hover your way into a
 * bubble that closes when the pointer leaves the trigger. Open it and Tab: the
 * button is reachable, which is the whole distinction.
 *
 * Seeded open, with `pb-` reserving the panel's room: it is absolutely
 * positioned and therefore out of flow, adding nothing to
 * `document.body.scrollHeight` - what preview-stage.tsx measures.
 *
 * Keep this in step with `src/data/components/popover.ts`.
 */
interface PopoverRichContentProps {
  label: string;
  title: string;
  copy: string;
  ctaLabel?: string;
  onClick?: () => void;
  defaultOpen?: boolean;
}

export function PopoverRichContent({
  label,
  title,
  copy,
  ctaLabel = 'Learn more',
  onClick,
  defaultOpen = false,
}: PopoverRichContentProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
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

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => ctaRef.current?.focus());
        }}
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
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
          <button
            ref={ctaRef}
            type="button"
            onClick={onClick}
            className="mt-3 inline-block rounded-sm text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverRichContentPreview() {
  const [clicks, setClicks] = useState(0);

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-56 pt-4">
      <PopoverRichContent
        label="What is a seat?"
        title="Seats and billing"
        copy="A seat is one person with access to this workspace. Seats are billed monthly and prorated the day someone joins."
        ctaLabel="Read the billing guide"
        onClick={() => setClicks((value) => value + 1)}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Action fired <span className="font-medium tabular-nums">{clicks}</span> times
      </p>
    </div>
  );
}
