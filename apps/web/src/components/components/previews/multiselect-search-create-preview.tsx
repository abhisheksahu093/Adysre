'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `multiselect-search-create`.
 *
 * Mirrors the `typescript` code variant, seeded open with a query that matches
 * nothing exactly - so the "Create “…”" row is on screen, which is the whole
 * component. Clear the query and it disappears; type "design" exactly and it
 * disappears too, because there is nothing left to create.
 *
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface MultiselectSearchCreateProps {
  label: string;
  items: string[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
  defaultQuery?: string;
  defaultOpen?: boolean;
}

type Row = { kind: 'tag' | 'create'; tag: string };

function MultiselectSearchCreate({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  defaultQuery = '',
  defaultOpen = false,
}: MultiselectSearchCreateProps) {
  const baseId = useId();
  const [known, setKnown] = useState<string[]>(items);
  const [query, setQuery] = useState(defaultQuery);
  const [open, setOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const rows = useMemo<Row[]>(() => {
    const trimmed = query.trim();
    const q = trimmed.toLowerCase();
    const matches: Row[] = known
      .filter((tag) => tag.toLowerCase().includes(q))
      .map((tag) => ({ kind: 'tag', tag }));
    const exact = known.some((tag) => tag.toLowerCase() === q);
    if (trimmed && !exact) matches.push({ kind: 'create', tag: trimmed });
    return matches;
  }, [known, query]);

  const clamped = Math.min(activeIndex, Math.max(0, rows.length - 1));
  const optionId = (index: number): string => `${baseId}-option-${index}`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function commit(index: number): void {
    const row = rows[index];
    if (!row) return;

    if (row.kind === 'create') {
      setKnown((prev) => [...prev, row.tag]);
      onSelect?.([...value, row.tag]);
      setQuery('');
      setActiveIndex(0);
      setAnnouncement(`Created and added “${row.tag}”.`);
      return;
    }
    onSelect?.(value.includes(row.tag) ? value.filter((v) => v !== row.tag) : [...value, row.tag]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (!rows.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      commit(clamped);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((clamped + 1) % rows.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((clamped - 1 + rows.length) % rows.length);
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
      <input
        id={`${baseId}-input`}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${baseId}-listbox`}
        aria-autocomplete="list"
        aria-describedby={`${baseId}-status`}
        autoComplete="off"
        placeholder="Search or create a tag…"
        disabled={disabled}
        value={query}
        {...(open && rows.length ? { 'aria-activedescendant': optionId(clamped) } : {})}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      />
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={`${baseId}-status`}
        role="status"
        aria-live="polite"
      >
        {announcement ||
          `${rows.length} ${rows.length === 1 ? 'result' : 'results'}. ${value.length} selected.`}
      </p>
      {open && rows.length > 0 ? (
        <ul
          id={`${baseId}-listbox`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {rows.map((row, index) => {
            const isActive = index === clamped;
            const checked = row.kind === 'tag' && value.includes(row.tag);
            return (
              <li
                key={`${row.kind}-${row.tag}`}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  commit(index);
                }}
                className={`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm ${
                  row.kind === 'create'
                    ? 'mt-1 rounded-b-md border-t border-gray-200 pt-2 font-medium dark:border-gray-700'
                    : ''
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
                {row.kind === 'create' ? (
                  <svg
                    className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                ) : null}
                <span className="flex-1 truncate">
                  {row.kind === 'create' ? `Create “${row.tag}”` : row.tag}
                </span>
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

const TAGS = ['design', 'engineering', 'research', 'roadmap', 'security'];

export default function MultiselectSearchCreatePreview() {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="w-full max-w-sm pb-56">
      {/* "desig" filters down to a real match AND has no exact one, so the stage
          shows both rows at once - which is the distinction that matters: the
          offer is about no EXACT match, not about no results. It sits last,
          where it cannot steal the Enter meant for "design". */}
      <MultiselectSearchCreate
        label="Tags"
        items={TAGS}
        value={tags}
        onSelect={setTags}
        defaultQuery="desig"
        defaultOpen
      />
    </div>
  );
}
