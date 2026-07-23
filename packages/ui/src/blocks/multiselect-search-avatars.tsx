'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `multiselect-search-avatars`.
 *
 * Mirrors the `typescript` code variant; seeded open so the avatar/name/email
 * rows are on screen. Avatars are drawn from initials - no network, ever.
 * Type "@adysre" to see the filter search the email as well as the name.
 *
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface Person {
  id: string;
  name: string;
  email: string;
}

interface PeoplePickerProps {
  label: string;
  items: Person[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100 ${
        size === 'sm' ? 'h-[1.125rem] w-[1.125rem] text-[0.5rem]' : 'h-7 w-7 text-[0.625rem]'
      }`}
    >
      {initials(name)}
    </span>
  );
}

export function PeoplePicker({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  defaultOpen = false,
}: PeoplePickerProps) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (person) => person.name.toLowerCase().includes(q) || person.email.toLowerCase().includes(q),
    );
  }, [items, query]);

  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));
  const selected = items.filter((person) => value.includes(person.id));
  const optionId = (index: number): string => `${baseId}-option-${index}`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(id: string): void {
    onSelect?.(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === 'Backspace' && !query && value.length) {
      event.preventDefault();
      onSelect?.(value.slice(0, -1));
      return;
    }
    if (!results.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const person = results[clamped];
      if (person) toggleValue(person.id);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((clamped + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((clamped - 1 + results.length) % results.length);
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
        {selected.map((person) => (
          <span
            key={person.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-0.5 pl-0.5 pr-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          >
            <Avatar name={person.name} size="sm" />
            {person.name}
            <button
              type="button"
              aria-label={`Remove ${person.name}`}
              onClick={() => {
                toggleValue(person.id);
                inputRef.current?.focus();
              }}
              className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-gray-700/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-gray-200/20 dark:focus-visible:outline-blue-400"
            >
              <svg
                className="h-[0.5625rem] w-[0.5625rem]"
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
        <input
          ref={inputRef}
          id={`${baseId}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${baseId}-listbox`}
          aria-autocomplete="list"
          aria-describedby={`${baseId}-status`}
          autoComplete="off"
          placeholder="Search people…"
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
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={`${baseId}-status`}
        role="status"
        aria-live="polite"
      >
        {results.length
          ? `${results.length} ${results.length === 1 ? 'person' : 'people'} available.`
          : 'Nobody matches.'}{' '}
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
              Nobody matches “{query}”.
            </li>
          ) : (
            results.map((person, index) => {
              const isActive = index === clamped;
              const checked = value.includes(person.id);
              return (
                <li
                  key={person.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(person.id);
                  }}
                  className={`flex cursor-pointer items-center gap-2 rounded-md py-1.5 pl-1 pr-2 ${
                    isActive ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-7 w-0.5 shrink-0 rounded-full ${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }`}
                  />
                  <Avatar name={person.name} />
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-sm text-gray-900 dark:text-gray-100">
                      {person.name}
                    </span>
                    <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {person.email}
                    </span>
                  </span>
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

const TEAM: Person[] = [
  { id: 'ada', name: 'Ada Lovelace', email: 'ada@adysre.com' },
  { id: 'grace', name: 'Grace Hopper', email: 'grace@adysre.com' },
  { id: 'alan', name: 'Alan Turing', email: 'alan@adysre.com' },
  { id: 'katherine', name: 'Katherine Johnson', email: 'katherine@adysre.com' },
  { id: 'linus', name: 'Linus Chen', email: 'linus@adysre.com' },
  { id: 'mei', name: 'Mei Chen', email: 'mei.chen@adysre.com' },
];

export default function MultiselectSearchAvatarsPreview() {
  const [assignees, setAssignees] = useState(['ada']);

  return (
    <div className="w-full max-w-sm pb-72">
      {/* Two Chens on purpose: the email is what tells them apart, which is why
          it is real text in the row and not decoration. */}
      <PeoplePicker
        label="Assignees"
        items={TEAM}
        value={assignees}
        onSelect={setAssignees}
        defaultOpen
      />
    </div>
  );
}
