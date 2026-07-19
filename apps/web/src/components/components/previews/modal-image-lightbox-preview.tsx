'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `modal-image-lightbox`.
 *
 * Mirrors the `typescript` code variant with the overlay scoped to this stage.
 * The "images" are CSS gradients, not files, so the component stays
 * self-contained. Arrow keys page between slides; the index is clamped so the
 * guarded array access never reads past the ends. Prev/Next/Close are real
 * buttons at least 40px tall.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Slide {
  id: string;
  label: string;
  gradient: string;
}

interface ModalImageLightboxProps {
  open: boolean;
  slides: Slide[];
  startIndex?: number;
  onDismiss: () => void;
}

function ModalImageLightbox({ open, slides, startIndex = 0, onDismiss }: ModalImageLightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (!open) return;
    setIndex(startIndex);
  }, [open, startIndex]);

  const count = slides.length;
  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;
  const current = slides[index];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/80" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-4 text-white">
          <h2 id={titleId} className="min-w-0 truncate text-sm font-semibold">
            {current ? current.label : ''}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onDismiss}
            className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative mt-2">
          <div
            className={`aspect-video w-full rounded-xl bg-gradient-to-br ${current ? current.gradient : 'from-gray-700 to-gray-900'}`}
            role="img"
            aria-label={current ? current.label : 'Image'}
          />
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-center text-xs font-medium text-white/70" aria-live="polite">
          {count === 0 ? '0 / 0' : `${index + 1} / ${count}`}
        </p>
      </div>
    </div>
  );
}

export const minHeight = 420;

const SLIDES: Slide[] = [
  { id: 'a', label: 'Sunrise ridge', gradient: 'from-amber-400 to-rose-500' },
  { id: 'b', label: 'Deep current', gradient: 'from-sky-400 to-indigo-600' },
  { id: 'c', label: 'Moss and stone', gradient: 'from-emerald-400 to-teal-600' },
];

export default function ModalImageLightboxPreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Open gallery
      </button>

      <ModalImageLightbox open={open} slides={SLIDES} startIndex={0} onDismiss={handleDismiss} />
    </div>
  );
}
