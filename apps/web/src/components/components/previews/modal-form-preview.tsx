'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

/**
 * Live preview for `modal-form`.
 *
 * Mirrors the `typescript` code variant verbatim. Focus lands on the first
 * FIELD, not the close button - the user opened this to type. Press Enter from
 * the name field and the real `<form>` submits; leave it empty and the browser's
 * own `required` validation fires before the handler runs. The harness echoes
 * the last submitted draft so the submit path is visible.
 *
 * The `min-h` wrapper is required: a `position: fixed` overlay adds nothing to
 * `document.body.scrollHeight`, which is what preview-stage.tsx measures.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ProjectDraft {
  name: string;
  description: string;
}

interface ModalFormProps {
  open: boolean;
  title: string;
  ctaLabel?: string;
  dismissLabel?: string;
  onDismiss: () => void;
  onSubmit?: (draft: ProjectDraft) => void;
}

function ModalForm({
  open,
  title,
  ctaLabel = 'Create',
  dismissLabel = 'Cancel',
  onDismiss,
  onSubmit,
}: ModalFormProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const nameId = useId();
  const descId = useId();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    firstFieldRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
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

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ name, description });
    setName('');
    setDescription('');
    onDismiss();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor={nameId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Project name
            </label>
            <input
              ref={firstFieldRef}
              id={nameId}
              name="name"
              type="text"
              required
              placeholder="Orbit redesign"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={descId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id={descId}
              name="description"
              rows={3}
              placeholder="What is this for?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {dismissLabel}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ModalFormPreview() {
  const [open, setOpen] = useState(true);
  const [lastDraft, setLastDraft] = useState('Nothing yet');
  const handleDismiss = useCallback(() => setOpen(false), []);
  const handleSubmit = useCallback((draft: ProjectDraft) => {
    setLastDraft(draft.name || '(unnamed)');
  }, []);

  return (
    <div className="flex min-h-[28rem] w-full flex-col items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        New project
      </button>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last created: <span className="font-medium">{lastDraft}</span>
      </p>

      <ModalForm
        open={open}
        title="New project"
        ctaLabel="Create"
        dismissLabel="Cancel"
        onDismiss={handleDismiss}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
