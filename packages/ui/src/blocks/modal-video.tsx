'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `modal-video`.
 *
 * Mirrors the `typescript` code variant with the overlay scoped to this stage.
 * There is no real video element - the "player" is a gradient poster with a CSS
 * play button; pressing play swaps to a mocked timeline so the pattern is
 * self-contained and ships no media. The progress bar animation is dropped under
 * `motion-reduce`.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalVideoProps {
  open: boolean;
  title: string;
  posterGradient?: string;
  onDismiss: () => void;
}

export function ModalVideo({
  open,
  title,
  posterGradient = 'from-indigo-500 via-purple-500 to-pink-500',
  onDismiss,
}: ModalVideoProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!open) {
      setPlaying(false);
      return;
    }
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
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

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <style>{'@keyframes modal-video-progress{from{width:0%}to{width:100%}}'}</style>
      <div className="absolute inset-0 bg-black/70" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <h2 id={titleId} className="min-w-0 truncate text-sm font-semibold text-gray-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onDismiss}
            className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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

        <div className={`relative flex aspect-video w-full items-center justify-center bg-gradient-to-br ${posterGradient}`}>
          {playing ? null : (
            <button
              type="button"
              aria-label="Play video"
              onClick={() => setPlaying(true)}
              className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
            >
              <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
          {playing ? (
            <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white" aria-live="polite">
              Playing preview
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            aria-label={playing ? 'Pause' : 'Play'}
            aria-pressed={playing}
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-gray-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {playing ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className={`h-full rounded-full bg-white ${playing ? 'animate-[modal-video-progress_8s_linear] motion-reduce:animate-none' : ''}`}
              style={{ width: playing ? undefined : '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const minHeight = 420;

export default function ModalVideoPreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Watch intro
      </button>

      <ModalVideo open={open} title="Product tour (2:14)" onDismiss={handleDismiss} />
    </div>
  );
}
