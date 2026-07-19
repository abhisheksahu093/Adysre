'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

/**
 * Live preview for `popover-form`.
 *
 * Mirrors the `typescript` code variant verbatim. Focus moves into the field on
 * open - the reason the panel exists - and Escape closes with focus restored to
 * the trigger. Seeded open, with `pb-` reserving the absolutely positioned
 * panel's room (it is out of flow, so it adds nothing to
 * `document.body.scrollHeight`, which is what preview-stage.tsx measures).
 *
 * Keep this in step with `src/data/components/popover.ts`.
 */
interface PopoverFormProps {
  label: string;
  title: string;
  fieldLabel: string;
  defaultValue?: string;
  onSubmit?: (value: string) => void;
  defaultOpen?: boolean;
}

function PopoverForm({
  label,
  title,
  fieldLabel,
  defaultValue = '',
  onSubmit,
  defaultOpen = false,
}: PopoverFormProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [value, setValue] = useState(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const titleId = useId();
  const fieldId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') close();
  }

  function onSubmitForm(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(value);
    close();
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
          if (next) window.requestAnimationFrame(() => inputRef.current?.focus());
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
          <form onSubmit={onSubmitForm} className="mt-3">
            <label
              htmlFor={fieldId}
              className="block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              {fieldLabel}
            </label>
            <input
              ref={inputRef}
              id={fieldId}
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverFormPreview() {
  const [saved, setSaved] = useState('Aurora');

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-56 pt-4">
      <PopoverForm
        label="Rename project"
        title="Rename project"
        fieldLabel="Project name"
        defaultValue="Aurora"
        onSubmit={setSaved}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Saved as: <span className="font-medium">{saved}</span>
      </p>
    </div>
  );
}
