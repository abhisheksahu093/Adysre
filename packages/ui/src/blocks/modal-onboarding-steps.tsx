'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `modal-onboarding-steps`.
 *
 * Mirrors the `typescript` code variant with the overlay scoped to this stage.
 * A multi-step wizard inside one dialog: the step count lives in state, Back is
 * disabled on the first step, and the primary button becomes Finish on the last.
 * `aria-current` marks the active dot and an `aria-live` region announces each
 * step change, so the progress is not colour-only. The dialog keeps its focus
 * trap and Escape throughout.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Step {
  title: string;
  body: string;
}

interface ModalOnboardingStepsProps {
  open: boolean;
  steps: Step[];
  onFinish: () => void;
  onDismiss: () => void;
}

export function ModalOnboardingSteps({ open, steps, onFinish, onDismiss }: ModalOnboardingStepsProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
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
  const count = steps.length;
  const current = steps[index];
  const isLast = index >= count - 1;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {steps.map((step, i) => (
              <span
                key={step.title}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-1.5 bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onDismiss}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              className="h-4 w-4"
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

        <div className="mt-4" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
            Step {index + 1} of {count}
          </p>
          <h2 id={titleId} className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {current ? current.title : ''}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {current ? current.body : ''}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => (isLast ? onFinish() : setIndex((i) => Math.min(count - 1, i + 1)))}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export const minHeight = 440;

const STEPS: Step[] = [
  { title: 'Welcome aboard', body: 'A quick three-step setup gets your workspace ready. It takes under a minute.' },
  { title: 'Invite your team', body: 'Add the people you work with so shared projects show up for everyone from day one.' },
  { title: 'You are all set', body: 'Your workspace is ready. You can revisit any of these settings later from the menu.' },
];

export default function ModalOnboardingStepsPreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="relative flex min-h-[440px] w-full items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Start setup
      </button>

      <ModalOnboardingSteps open={open} steps={STEPS} onFinish={handleDismiss} onDismiss={handleDismiss} />
    </div>
  );
}
