'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `select-with-icons`.
 *
 * Mirrors the `typescript` code variant; `open` is seeded true because a closed
 * trigger shows one icon and the component is about the list of them.
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface IconSelectItem {
  value: string;
  label: string;
  icon: ReactNode;
}

interface IconSelectProps {
  label: string;
  items: IconSelectItem[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
}

export function IconSelect({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  defaultOpen = false,
}: IconSelectProps) {
  const baseId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const found = items.findIndex((item) => item.value === value);
    return found === -1 ? 0 : found;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          {selected ? (
            <>
              <span className="shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true">
                {selected.icon}
              </span>
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Choose a team…</span>
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
            const isSelected = item.value === value;
            return (
              <li
                key={item.value}
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
                <span
                  aria-hidden="true"
                  className={`shrink-0 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

const ICON = 'h-4 w-4';
const SVG = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const TEAMS: IconSelectItem[] = [
  {
    value: 'design',
    label: 'Design',
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" {...SVG} aria-hidden="true">
        <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      </svg>
    ),
  },
  {
    value: 'engineering',
    label: 'Engineering',
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" {...SVG} aria-hidden="true">
        <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
      </svg>
    ),
  },
  {
    value: 'marketing',
    label: 'Marketing',
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" {...SVG} aria-hidden="true">
        <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
  },
  {
    value: 'sales',
    label: 'Sales',
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" {...SVG} aria-hidden="true">
        <path d="M3 3v18h18M18 9l-5 5-3-3-4 4" />
      </svg>
    ),
  },
  {
    value: 'support',
    label: 'Support',
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" {...SVG} aria-hidden="true">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
];

export default function SelectWithIconsPreview() {
  const [team, setTeam] = useState('engineering');

  return (
    <div className="w-full max-w-sm pb-56">
      <IconSelect label="Team" items={TEAMS} value={team} onSelect={setTeam} defaultOpen />
    </div>
  );
}
