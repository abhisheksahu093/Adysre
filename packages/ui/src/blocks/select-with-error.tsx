'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `select-with-error`.
 *
 * Mirrors the `typescript` code variant. The popup stays CLOSED here - the
 * error state is the component, and it lives on the closed control. Pick a
 * country and the message, the red ring and `aria-invalid` all clear together,
 * which is the behaviour worth seeing.
 *
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface SelectItem {
  value: string;
  label: string;
}

interface SelectWithErrorProps {
  label: string;
  items: SelectItem[];
  value?: string;
  message?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export function SelectWithError({
  label,
  items,
  value,
  message,
  onSelect,
  disabled = false,
}: SelectWithErrorProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const invalid = Boolean(message);
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;
  const selected = items.find((item) => item.value === value);
  const optionId = (index: number): string => `${baseId}-option-${index}`;

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

  function commit(index: number): void {
    const item = items[index];
    if (!item) return;
    onSelect?.(item.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
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
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${hintId} ${errorId}` : hintId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-600 aria-[invalid=true]:shadow-[inset_0_0_0_1px_#dc2626] aria-[invalid=true]:focus-visible:ring-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[invalid=true]:border-red-400 dark:aria-[invalid=true]:shadow-[inset_0_0_0_1px_#f87171] dark:aria-[invalid=true]:focus-visible:ring-red-400"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose a country…'}
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
        <ul
          id={`${baseId}-listbox`}
          role="listbox"
          aria-labelledby={`${baseId}-label`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={item.value === value}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => commit(index)}
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
                {item.label}
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={hintId}>
        Sets the tax rate on your invoices.
      </p>
      {invalid ? (
        <p
          className="mt-1 flex items-start gap-1.5 text-xs font-medium text-red-700 dark:text-red-300"
          id={errorId}
        >
          <svg
            className="mt-px h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {message}
        </p>
      ) : null}
    </div>
  );
}

const COUNTRIES: SelectItem[] = [
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'ie', label: 'Ireland' },
];

export default function SelectWithErrorPreview() {
  const [country, setCountry] = useState('');

  return (
    <div className="w-full max-w-sm pb-56">
      <SelectWithError
        label="Billing country"
        items={COUNTRIES}
        value={country}
        onSelect={setCountry}
        // Present means invalid. Choosing a country clears it, and aria-invalid
        // plus the describedby list come off with it.
        {...(country ? {} : { message: 'Select a billing country to continue.' })}
      />
    </div>
  );
}
