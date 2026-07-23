'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `multiselect-inline-tags`.
 *
 * Mirrors the `typescript` code variant. The popup stays CLOSED: Backspace is
 * the component, and it only fires while closed. Focus the control and press
 * Backspace - the last tag goes, and the live region below says which.
 *
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectInlineTagsProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

export function MultiselectInlineTags({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectInlineTagsProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const optionId = (index: number): string => `${baseId}-option-${index}`;
  const selected = items.filter((item) => value.includes(item.value));

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function removeLast(): void {
    const last = value[value.length - 1];
    if (last === undefined) return;
    const item = items.find((i) => i.value === last);
    onSelect?.(value.slice(0, -1));
    setAnnouncement(`${item?.label ?? last} removed. ${value.length - 1} labels remaining.`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (event.key === 'Backspace') {
        event.preventDefault();
        removeLast();
        return;
      }
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) toggleValue(item.value);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={`${baseId}-label`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={`${baseId}-trigger`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${baseId}-listbox`}
        aria-labelledby={`${baseId}-label ${baseId}-trigger`}
        aria-describedby={`${baseId}-hint`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex min-h-[2.375rem] w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-2 py-[0.3125rem] text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className="flex min-w-0 flex-wrap items-center gap-1">
          {selected.length ? (
            selected.map((item) => (
              <span
                key={item.value}
                className="inline-flex items-center rounded bg-gray-100 px-1.5 py-px text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              >
                {item.label}
              </span>
            ))
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Add labels…</span>
          )}
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
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={`${baseId}-hint`}>
        Press Backspace to remove the last label.
      </p>
      {open ? (
        <ul
          id={`${baseId}-listbox`}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={`${baseId}-label`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const checked = value.includes(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-4 w-0.5 shrink-0 rounded-full ${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {checked ? (
                  <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

const LABELS: SelectItem[] = [
  { value: 'bug', label: 'bug' },
  { value: 'regression', label: 'regression' },
  { value: 'p1', label: 'p1' },
  { value: 'docs', label: 'docs' },
  { value: 'good-first-issue', label: 'good first issue' },
  { value: 'wontfix', label: 'wontfix' },
];

export default function MultiselectInlineTagsPreview() {
  const [labels, setLabels] = useState(['bug', 'regression', 'p1']);

  return (
    <div className="w-full max-w-sm">
      <MultiselectInlineTags label="Labels" items={LABELS} value={labels} onSelect={setLabels} />
    </div>
  );
}
