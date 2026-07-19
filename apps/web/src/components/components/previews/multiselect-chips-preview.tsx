'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `multiselect-chips`.
 *
 * Mirrors the `typescript` code variant; `open` is seeded true so both halves -
 * the chips in the control and the ticked rows in the popup - are visible at
 * once, which is the relationship the component is about.
 *
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectChipsProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
}

function OptionBox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[0.25rem] border ${
        checked
          ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
          : 'border-gray-400 dark:border-gray-500'
      }`}
    >
      {checked ? (
        <svg
          className="h-2.5 w-2.5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 5 5L20 7" />
        </svg>
      ) : null}
    </span>
  );
}

function MultiselectChips({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  defaultOpen = false,
}: MultiselectChipsProps) {
  const baseId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

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
        toggleRef.current?.focus();
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
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((item) => (
          <span
            key={item.value}
            className="inline-flex items-center gap-1 rounded-md bg-blue-50 py-0.5 pl-2 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {item.label}
            <button
              type="button"
              aria-label={`Remove ${item.label}`}
              disabled={disabled}
              onClick={() => {
                toggleValue(item.value);
                toggleRef.current?.focus();
              }}
              className="inline-flex h-4 w-4 items-center justify-center rounded hover:bg-blue-800/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-blue-200/20 dark:focus-visible:outline-blue-400"
            >
              <svg
                className="h-2.5 w-2.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <button
          ref={toggleRef}
          id={`${baseId}-toggle`}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${baseId}-listbox`}
          aria-labelledby={`${baseId}-label ${baseId}-toggle`}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
          className="flex min-w-24 flex-1 items-center justify-between gap-2 rounded py-1 pl-1.5 pr-1 text-left text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-gray-500 dark:text-gray-400">
            {selected.length ? 'Add a skill…' : 'Choose skills…'}
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
      </div>
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
                <OptionBox checked={checked} />
                <span className="flex-1">{item.label}</span>
              </li>
            );
          })}
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
];

export default function MultiselectChipsPreview() {
  const [skills, setSkills] = useState(['react', 'typescript']);

  return (
    <div className="w-full max-w-sm pb-64">
      <MultiselectChips
        label="Skills"
        items={SKILLS}
        value={skills}
        onSelect={setSkills}
        defaultOpen
      />
    </div>
  );
}
