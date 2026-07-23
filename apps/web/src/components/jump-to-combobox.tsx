'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, ChevronDown, CornerDownLeft } from 'lucide-react';
import { cn } from 'adysre';

export interface JumpToItem {
  /** Stable id passed back to `onSelect`. */
  id: string;
  /** Primary text shown and matched first. */
  label: string;
  /** Optional secondary line (e.g. the category). */
  sublabel?: string;
  /** Extra text folded into matching (tags, aliases) but not displayed. */
  keywords?: string;
}

interface JumpToComboboxProps {
  items: JumpToItem[];
  /** Called with the chosen item's id; the caller navigates or opens it. */
  onSelect: (id: string) => void;
  /** Accessible name for the control. */
  label: string;
  /** How many matches to render at once (keeps the DOM small over long lists). */
  max?: number;
  className?: string;
}

/** Rank a label against the raw query: exact > prefix > substring > 0. */
function labelScore(label: string, q: string): number {
  const h = label.toLowerCase();
  if (h === q) return 3;
  if (h.startsWith(q)) return 2;
  if (h.includes(q)) return 1;
  return 0;
}

/**
 * A searchable "search and jump to" control, styled to sit in a filter bar
 * beside the native `Select`s. A native `<select>` can't host a text field, so
 * this is a light combobox: a trigger that opens a popover with a query input
 * and a filtered listbox. Selecting an item hands its id back to the caller,
 * which decides what "go to" means (navigate to a page, or open a quick view).
 *
 * One control, reused across components, icons, palettes and gradients - the
 * items and the select handler are all that differ.
 */
export function JumpToCombobox({ items, onSelect, label, max = 50, className }: JumpToComboboxProps) {
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, max);
    // Every whitespace-separated token must appear somewhere (name, category or
    // tags), so "pricing three" still finds "Three-Tier Pricing". Ranking then
    // favours a strong match on the visible label.
    const tokens = q.split(/\s+/).filter(Boolean);
    return items
      .map((item) => {
        const hay = `${item.label} ${item.keywords ?? ''}`.toLowerCase();
        if (!tokens.every((tok) => hay.includes(tok))) return null;
        return { item, s: labelScore(item.label, q) };
      })
      .filter((x): x is { item: JumpToItem; s: number } => x !== null)
      .sort((a, b) => b.s - a.s || a.item.label.localeCompare(b.item.label))
      .slice(0, max)
      .map((x) => x.item);
  }, [items, query, max]);

  // Focus the field when the popover opens; reset when it closes.
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    setQuery('');
    setActive(0);
    return undefined;
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted row scrolled into view.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  // Close on outside click and on Escape at the document level.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const choose = (id: string) => {
    setOpen(false);
    onSelect(id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = results[active];
      if (chosen) choose(chosen.id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className={cn(
          'flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background pl-3 pr-8 text-sm text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-left">{tCommon('jumpToPlaceholder')}</span>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-1 w-full min-w-[16rem] overflow-hidden rounded-md border border-border bg-card shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="jump-to-listbox"
              aria-label={label}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={tCommon('jumpToPlaceholder')}
              className="h-10 flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul id="jump-to-listbox" ref={listRef} role="listbox" aria-label={label} className="max-h-72 overflow-y-auto p-1">
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">{tCommon('noResults')}</li>
            ) : (
              results.map((item, i) => (
                <li key={item.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    data-active={i === active}
                    onClick={() => choose(item.id)}
                    onMouseMove={() => setActive(i)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left transition-colors',
                      i === active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted',
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{item.label}</span>
                      {item.sublabel && (
                        <span className="block truncate text-xs text-muted-foreground">{item.sublabel}</span>
                      )}
                    </span>
                    {i === active && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
