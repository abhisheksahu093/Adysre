'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `modal-command-palette`.
 *
 * Mirrors the `typescript` code variant with the overlay scoped to this stage.
 * A Spotlight-style palette: it opens top-aligned, focuses the search input, and
 * filters the list as you type. Arrow keys move a highlighted row and Enter runs
 * it; Escape closes. The list is a real `listbox`/`option` pairing so the active
 * row is announced.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
interface Command {
  id: string;
  label: string;
  hint: string;
}

interface ModalCommandPaletteProps {
  open: boolean;
  commands: Command[];
  placeholder?: string;
  onRun: (command: Command) => void;
  onDismiss: () => void;
}

export function ModalCommandPalette({
  open,
  commands,
  placeholder = 'Type a command or search...',
  onRun,
  onDismiss,
}: ModalCommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    inputRef.current?.focus();
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === '') return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (results.length === 0 ? 0 : (i + 1) % results.length));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (results.length === 0 ? 0 : (i - 1 + results.length) % results.length));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const chosen = results[active];
      if (chosen) onRun(chosen);
    }
  }

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-start justify-center p-4 pt-10"
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative flex max-h-[calc(100dvh-5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex flex-none items-center gap-2 border-b border-gray-200 px-4 dark:border-gray-800">
          <svg
            className="h-4 w-4 flex-none text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-controls={listId}
            aria-label="Search commands"
            className="w-full min-w-0 bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
          />
        </div>
        <ul id={listId} role="listbox" aria-label="Commands" className="min-h-0 flex-1 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No matching commands
            </li>
          ) : (
            results.map((command, i) => (
              <li key={command.id} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onClick={() => onRun(command)}
                  onMouseMove={() => setActive(i)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm focus-visible:outline-none ${
                    i === active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="min-w-0 truncate font-medium">{command.label}</span>
                  <span
                    className={`flex-none text-xs ${i === active ? 'text-blue-100' : 'text-gray-400'}`}
                  >
                    {command.hint}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export const minHeight = 460;

const COMMANDS: Command[] = [
  { id: 'new', label: 'Create new project', hint: 'C' },
  { id: 'invite', label: 'Invite teammate', hint: 'I' },
  { id: 'settings', label: 'Open settings', hint: ',' },
  { id: 'theme', label: 'Toggle theme', hint: 'T' },
  { id: 'search', label: 'Search documentation', hint: '/' },
];

export default function ModalCommandPalettePreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="relative flex min-h-[460px] w-full items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Open command palette
      </button>

      <ModalCommandPalette open={open} commands={COMMANDS} onRun={handleDismiss} onDismiss={handleDismiss} />
    </div>
  );
}
