'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `multiselect-search-keyboard`.
 *
 * Mirrors the `typescript` code variant, seeded open with the shortcut legend
 * visible. Click into the field and try it: ↓/↑ wrap at both ends, Home/End
 * jump, Enter toggles without closing, Escape clears the query before it closes,
 * and Backspace on an empty query drops the last chip.
 *
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectSearchKeyboardProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
}

const KBD =
  'inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

function MultiselectSearchKeyboard({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  defaultOpen = false,
}: MultiselectSearchKeyboardProps) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));
  const selected = items.filter((item) => value.includes(item.value));
  const optionId = (index: number): string => `${baseId}-option-${index}`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[clamped]?.scrollIntoView({ block: 'nearest' });
  }, [open, clamped]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        if (query) {
          setQuery('');
          setActiveIndex(0);
        } else {
          setOpen(false);
        }
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'Backspace':
        if (query || !value.length) return;
        event.preventDefault();
        onSelect?.(value.slice(0, -1));
        return;
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        else if (results.length) setActiveIndex((clamped + 1) % results.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) setOpen(true);
        else if (results.length) setActiveIndex((clamped - 1 + results.length) % results.length);
        return;
      case 'Home':
        if (!open || !results.length) return;
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        if (!open || !results.length) return;
        event.preventDefault();
        setActiveIndex(results.length - 1);
        return;
      case 'Enter': {
        if (!open || !results.length) return;
        event.preventDefault();
        const item = results[clamped];
        if (item) toggleValue(item.value);
        return;
      }
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
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((item) => (
          <span
            key={item.value}
            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {item.label}
          </span>
        ))}
        <input
          id={`${baseId}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${baseId}-listbox`}
          aria-autocomplete="list"
          aria-describedby={`${baseId}-help ${baseId}-status`}
          autoComplete="off"
          placeholder="Type to filter…"
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
          className="min-w-28 flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>
      <p
        className="mt-1.5 flex flex-wrap items-center gap-1 text-[0.6875rem] text-gray-500 dark:text-gray-400"
        id={`${baseId}-help`}
      >
        <kbd className={KBD}>↑</kbd>
        <kbd className={KBD}>↓</kbd> move · <kbd className={KBD}>Home</kbd>
        <kbd className={KBD}>End</kbd> jump · <kbd className={KBD}>Enter</kbd> toggle ·{' '}
        <kbd className={KBD}>Esc</kbd> clear, then close · <kbd className={KBD}>⌫</kbd> remove last
      </p>
      <p
        className="mt-1 text-xs text-gray-500 dark:text-gray-400"
        id={`${baseId}-status`}
        role="status"
        aria-live="polite"
      >
        {results.length
          ? `${results.length} ${results.length === 1 ? 'command' : 'commands'} available.`
          : 'No commands match.'}{' '}
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
              No commands match “{query}”.
            </li>
          ) : (
            results.map((item, index) => {
              const isActive = index === clamped;
              const checked = value.includes(item.value);
              return (
                <li
                  key={item.value}
                  id={optionId(index)}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
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

const COMMANDS: SelectItem[] = [
  { value: 'build', label: 'Build' },
  { value: 'deploy', label: 'Deploy' },
  { value: 'rollback', label: 'Rollback' },
  { value: 'restart', label: 'Restart' },
  { value: 'scale-up', label: 'Scale up' },
  { value: 'scale-down', label: 'Scale down' },
  { value: 'purge-cache', label: 'Purge cache' },
];

export default function MultiselectSearchKeyboardPreview() {
  const [commands, setCommands] = useState(['deploy']);

  return (
    <div className="w-full max-w-sm pb-72">
      <MultiselectSearchKeyboard
        label="Commands"
        items={COMMANDS}
        value={commands}
        onSelect={setCommands}
        defaultOpen
      />
    </div>
  );
}
