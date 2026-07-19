'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `select-grouped`.
 *
 * Mirrors the `typescript` code variant; `open` is seeded true so the group
 * headings - the entire component - are on screen. Arrow through it: the
 * highlight crosses the headings without stopping on them.
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface GroupOption {
  value: string;
  label: string;
}

interface OptionGroup {
  label: string;
  options: GroupOption[];
}

interface GroupedSelectProps {
  label: string;
  items: OptionGroup[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
}

function GroupedSelect({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  defaultOpen = false,
}: GroupedSelectProps) {
  const baseId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const flat = useMemo(
    () => items.flatMap((group) => group.options.map((option) => ({ ...option, group: group.label }))),
    [items],
  );

  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const found = flat.findIndex((option) => option.value === value);
    return found === -1 ? 0 : found;
  });

  const selected = flat.find((option) => option.value === value);
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
    const option = flat[index];
    if (!option) return;
    onSelect?.(option.value);
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
        setActiveIndex((i) => (i + 1) % flat.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(flat.length - 1);
        return;
      default:
    }
  }

  let cursor = -1;

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
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose a region…'}
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
          id={`${baseId}-listbox`}
          role="listbox"
          aria-labelledby={`${baseId}-label`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((group) => (
            <div key={group.label} role="group" aria-labelledby={`${baseId}-group-${group.label}`}>
              <div
                id={`${baseId}-group-${group.label}`}
                role="presentation"
                className="sticky top-0 bg-white py-1.5 pl-3 pr-2 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                {group.label}
              </div>
              {group.options.map((option) => {
                cursor += 1;
                const index = cursor;
                const isActive = index === activeIndex;
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => commit(index)}
                    className={`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-300'
                    } ${isSelected ? 'font-semibold' : ''}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-4 w-0.5 shrink-0 rounded-full ${
                        isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                      }`}
                    />
                    {option.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const REGIONS: OptionGroup[] = [
  {
    label: 'Americas',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'br', label: 'Brazil' },
    ],
  },
  {
    label: 'EMEA',
    options: [
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
      { value: 'uk', label: 'United Kingdom' },
    ],
  },
  {
    label: 'APAC',
    options: [
      { value: 'jp', label: 'Japan' },
      { value: 'au', label: 'Australia' },
    ],
  },
];

export default function SelectGroupedPreview() {
  const [region, setRegion] = useState('de');

  return (
    <div className="w-full max-w-sm pb-64">
      <GroupedSelect label="Region" items={REGIONS} value={region} onSelect={setRegion} defaultOpen />
    </div>
  );
}
