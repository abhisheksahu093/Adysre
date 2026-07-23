'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-command`.
 *
 * Mirrors the `typescript` code variant verbatim, plus `defaultOpen`. A command
 * palette keeps focus in the input and moves a virtual highlight through the
 * list with `aria-activedescendant` - the combobox pattern, not roving focus,
 * because you must keep typing while you steer. The input is a `role="combobox"`
 * pointing at a `role="listbox"`; Enter runs the highlighted option.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
interface Command {
  id: string;
  label: string;
  hint?: string;
}

const COMMANDS: readonly Command[] = [
  { id: 'new-doc', label: 'New document', hint: 'C' },
  { id: 'search', label: 'Search everything', hint: '/' },
  { id: 'invite', label: 'Invite teammate' },
  { id: 'settings', label: 'Open settings', hint: ',' },
  { id: 'theme', label: 'Toggle theme' },
  { id: 'logout', label: 'Sign out' },
];

interface DropdownCommandProps {
  label: string;
  commands: readonly Command[];
  placeholder?: string;
  onRun?: (id: string) => void;
  defaultOpen?: boolean;
}

export function DropdownCommand({
  label,
  commands,
  placeholder = 'Type a command…',
  onRun,
  defaultOpen = false,
}: DropdownCommandProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;

  const filtered = useMemo(
    () => commands.filter((command) => command.label.toLowerCase().includes(query.trim().toLowerCase())),
    [commands, query],
  );

  useEffect(() => {
    setActive(0);
  }, [query]);

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
    setQuery('');
    triggerRef.current?.focus();
  }

  function run(command: Command | undefined): void {
    if (!command) return;
    onRun?.(command.id);
    close();
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((prev) => (filtered.length === 0 ? 0 : (prev + 1) % filtered.length));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((prev) => (filtered.length === 0 ? 0 : (prev - 1 + filtered.length) % filtered.length));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      run(filtered[active]);
    }
  }

  const activeId = filtered[active] ? `${baseId}-opt-${filtered[active]?.id}` : undefined;

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
        <kbd className="rounded border border-gray-300 px-1 text-[10px] font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-gray-200 p-2 dark:border-gray-700">
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              value={query}
              placeholder={placeholder}
              aria-label={label}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              className="w-full rounded-md bg-transparent px-1.5 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          <ul id={listId} role="listbox" aria-label={label} className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li role="none" className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No commands
              </li>
            ) : (
              filtered.map((command, index) => {
                const isActive = index === active;
                return (
                  <li
                    key={command.id}
                    id={`${baseId}-opt-${command.id}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActive(index)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      run(command);
                    }}
                    className={
                      isActive
                        ? 'flex cursor-pointer items-center justify-between gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                        : 'flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300'
                    }
                  >
                    <span className="truncate">{command.label}</span>
                    {command.hint ? (
                      <kbd className="rounded border border-gray-300 px-1 text-[10px] font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">
                        {command.hint}
                      </kbd>
                    ) : null}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function DropdownCommandPreview() {
  const [note, setNote] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-72 pt-4">
      <DropdownCommand label="Command" commands={COMMANDS} onRun={setNote} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Ran: <span className="font-medium">{note}</span>
      </p>
    </div>
  );
}
