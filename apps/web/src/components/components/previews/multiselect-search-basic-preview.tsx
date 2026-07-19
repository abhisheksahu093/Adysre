'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `multiselect-search-basic`.
 *
 * Mirrors the `typescript` code variant; `open` is seeded true so the filtered
 * list is on screen. Type in the field - the list narrows and the count below
 * it (a live region) keeps up.
 *
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectSearchProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
}

function MultiselectSearch({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  defaultOpen = false,
}: MultiselectSearchProps) {
  const baseId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const optionId = (index: number): string => `${baseId}-option-${index}`;
  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));

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

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        return;
      case 'Enter': {
        event.preventDefault();
        const item = results[clamped];
        if (item) toggleValue(item.value);
        return;
      }
      case 'ArrowDown':
        event.preventDefault();
        if (results.length) setActiveIndex((clamped + 1) % results.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (results.length) setActiveIndex((clamped - 1 + results.length) % results.length);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={`${baseId}-input`}
      >
        {label}
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={`${baseId}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${baseId}-listbox`}
          aria-autocomplete="list"
          aria-describedby={`${baseId}-count`}
          autoComplete="off"
          placeholder="Filter skills…"
          disabled={disabled}
          value={query}
          {...(open && results.length ? { 'aria-activedescendant': optionId(clamped) } : {})}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
      </div>
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={`${baseId}-count`}
        role="status"
        aria-live="polite"
      >
        {results.length === 0
          ? 'No skills match.'
          : `${results.length} ${results.length === 1 ? 'skill' : 'skills'} available.`}{' '}
        {value.length} selected.
      </p>
      {open ? (
        <ul
          id={`${baseId}-listbox`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 ? (
            <li
              role="presentation"
              className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No skills match “{query}”.
            </li>
          ) : (
            results.map((item, index) => {
              const isActive = index === clamped;
              const checked = value.includes(item.value);
              return (
                <li
                  key={item.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(item.value);
                  }}
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
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}

const SKILLS: SelectItem[] = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'figma', label: 'Figma' },
  { value: 'kubernetes', label: 'Kubernetes' },
];

export default function MultiselectSearchBasicPreview() {
  const [skills, setSkills] = useState(['react', 'typescript']);

  return (
    <div className="w-full max-w-sm pb-72">
      <MultiselectSearch
        label="Skills"
        items={SKILLS}
        value={skills}
        onSelect={setSkills}
        defaultOpen
      />
    </div>
  );
}
