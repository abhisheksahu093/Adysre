'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `multiselect-limit`.
 *
 * Mirrors the `typescript` code variant, seeded at the cap and open - the three
 * dimmed-but-readable rows and the amber "remove one to add another" are the
 * component. Untick one and the rest come back to life.
 *
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectLimitProps {
  label: string;
  items: SelectItem[];
  value: string[];
  count?: number;
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
}

function MultiselectLimit({
  label,
  items,
  value,
  count = 3,
  onSelect,
  disabled = false,
  defaultOpen = false,
}: MultiselectLimitProps) {
  const baseId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const full = value.length >= count;
  const optionId = (index: number): string => `${baseId}-option-${index}`;
  const selectedLabels = items.filter((i) => value.includes(i.value)).map((i) => i.label);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function isCapped(itemValue: string): boolean {
    return full && !value.includes(itemValue);
  }

  function toggleValue(next: string): void {
    if (isCapped(next)) return;
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
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
        aria-describedby={`${baseId}-status`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={`truncate ${selectedLabels.length ? '' : 'text-gray-500 dark:text-gray-400'}`}>
          {selectedLabels.length ? selectedLabels.join(', ') : `Choose up to ${count}…`}
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
      <p
        id={`${baseId}-status`}
        role="status"
        aria-live="polite"
        className={`mt-1.5 text-xs ${
          full ? 'font-medium text-amber-800 dark:text-amber-300' : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {full
          ? `${count} of ${count} chosen - remove one to add another.`
          : `${value.length} of ${count} chosen.`}
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
            const capped = isCapped(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                aria-disabled={capped || undefined}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={`flex items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm ${
                  capped ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } ${
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
    </div>
  );
}

const AREAS: SelectItem[] = [
  { value: 'performance', label: 'Performance' },
  { value: 'accessibility', label: 'Accessibility' },
  { value: 'security', label: 'Security' },
  { value: 'dx', label: 'Developer experience' },
  { value: 'seo', label: 'SEO' },
  { value: 'i18n', label: 'Internationalisation' },
];

export default function MultiselectLimitPreview() {
  // Seeded at the cap - the disabled rows and the amber status are the point.
  const [areas, setAreas] = useState(['performance', 'accessibility', 'security']);

  return (
    <div className="w-full max-w-sm pb-64">
      <MultiselectLimit
        label="Focus areas"
        items={AREAS}
        value={areas}
        count={3}
        onSelect={setAreas}
        defaultOpen
      />
    </div>
  );
}
