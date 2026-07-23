'use client';

import { useId, useMemo, useState, type KeyboardEvent } from 'react';

/**
 * Live preview for `search-command-modal`.
 *
 * Mirrors the `typescript` code variant verbatim. Click the trigger to open the
 * palette; Arrow keys move the active row, Enter runs it, Escape or a backdrop
 * click closes. The ⌘K badge is decorative - no global shortcut is bound. Keep
 * this in step with `src/data/components/search-bars.ts`.
 */
interface Command {
  id: string;
  label: string;
  hint?: string;
}

interface SearchCommandModalProps {
  commands: Command[];
  buttonLabel?: string;
  onRun?: (id: string) => void;
  className?: string;
}

export function SearchCommandModal({
  commands,
  buttonLabel = 'Search…',
  onRun,
  className = '',
}: SearchCommandModalProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo<Command[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(term));
  }, [commands, query]);

  function close() { setOpen(false); setQuery(''); setActive(0); }
  function run(id: string) { onRun?.(id); close(); }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (event.key === 'Enter') { const c = results[active]; if (c) { event.preventDefault(); run(c.id); } }
    else if (event.key === 'Escape') { event.preventDefault(); close(); }
  }

  const listId = `${baseId}-list`;
  const activeCmd = results[active];
  const activeId = activeCmd ? `${baseId}-opt-${activeCmd.id}` : undefined;

  return (
    <div className={className}>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => { setOpen(true); setActive(0); }}
        className="inline-flex w-full max-w-xs items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
        <span className="mr-auto">{buttonLabel}</span>
        <kbd className="rounded border border-gray-300 px-1.5 text-xs dark:border-gray-700">⌘K</kbd>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[10vh]" role="presentation" onClick={close}>
          <div role="dialog" aria-modal="true" aria-label="Command menu" onClick={(event) => event.stopPropagation()} className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 border-b border-gray-200 px-3 dark:border-gray-800">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
              <label className="sr-only" htmlFor={`${baseId}-input`}>Type a command</label>
              <input
                id={`${baseId}-input`}
                autoFocus
                type="text"
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                autoComplete="off"
                value={query}
                placeholder="Type a command or search…"
                onChange={(event) => { setQuery(event.target.value); setActive(0); }}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-400"
              />
            </div>

            <ul id={listId} role="listbox" aria-label="Commands" className="max-h-72 overflow-auto p-1">
              {results.length === 0 ? (
                <li role="presentation" className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No commands found.</li>
              ) : results.map((cmd, index) => {
                const isActive = index === active;
                return (
                  <li
                    key={cmd.id}
                    id={`${baseId}-opt-${cmd.id}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseDown={(event) => { event.preventDefault(); run(cmd.id); }}
                    onMouseEnter={() => setActive(index)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200'}`}
                  >
                    <span>{cmd.label}</span>
                    {cmd.hint ? <span className={isActive ? 'text-blue-100' : 'text-gray-400'}>{cmd.hint}</span> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const SAMPLE_COMMANDS: Command[] = [
  { id: 'new-doc', label: 'New document', hint: 'C' },
  { id: 'invite', label: 'Invite teammate', hint: 'I' },
  { id: 'settings', label: 'Open settings', hint: '⌘,' },
  { id: 'theme', label: 'Toggle theme' },
  { id: 'logout', label: 'Log out' },
];

export default function SearchCommandModalPreview() {
  return <SearchCommandModal commands={SAMPLE_COMMANDS} buttonLabel="Search or run a command…" />;
}
