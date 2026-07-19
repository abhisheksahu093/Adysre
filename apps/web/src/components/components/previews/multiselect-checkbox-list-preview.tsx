'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * Live preview for `multiselect-checkbox-list`.
 *
 * Mirrors the `typescript` code variant; `open` is seeded true so the fieldset
 * of real checkboxes - the reason this is not a listbox - is on screen. Note
 * the preview does not auto-focus the first box on mount, only when the panel
 * is opened by the user; stealing focus inside a preview iframe would scroll
 * the page it is embedded in.
 *
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectCheckboxListProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
}

function MultiselectCheckboxList({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  defaultOpen = false,
}: MultiselectCheckboxListProps) {
  const baseId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    // Preview-only guard: skip the very first run so the seeded-open panel does
    // not grab focus on mount. The shipped component focuses unconditionally.
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (open) firstInputRef.current?.focus();
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  return (
    <div
      className="relative"
      ref={rootRef}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        setOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={`${baseId}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span>
          {label}: {value.length === 0 ? 'none selected' : `${value.length} selected`}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          id={`${baseId}-panel`}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:[color-scheme:dark]"
        >
          <fieldset className="border-0 p-2">
            <legend className="px-1 pb-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {label}
            </legend>
            {items.map((item, index) => (
              <label
                key={item.value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]"
              >
                <input
                  ref={index === 0 ? firstInputRef : undefined}
                  type="checkbox"
                  checked={value.includes(item.value)}
                  onChange={() => toggleValue(item.value)}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>
        </div>
      ) : null}
    </div>
  );
}

const EVENTS: SelectItem[] = [
  { value: 'mentions', label: 'Mentions' },
  { value: 'replies', label: 'Replies' },
  { value: 'assignments', label: 'Assignments' },
  { value: 'deploys', label: 'Deploys' },
  { value: 'digest', label: 'Weekly digest' },
  { value: 'billing', label: 'Billing alerts' },
];

export default function MultiselectCheckboxListPreview() {
  const [events, setEvents] = useState(['mentions', 'replies']);

  return (
    <div className="w-full max-w-sm pb-64">
      <MultiselectCheckboxList
        label="Notifications"
        items={EVENTS}
        value={events}
        onSelect={setEvents}
        defaultOpen
      />
    </div>
  );
}
