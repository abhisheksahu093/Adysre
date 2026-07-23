'use client';

import { useId, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Boxes, ChevronRight, Search, type LucideIcon } from 'lucide-react';
import { cn } from '@adysre/ui';
import { COMPONENT_TEMPLATES, type CatalogueEntry } from '@/data/design-playground/component-templates';
import { useDesignDocumentStore } from '@/stores/design-document-store';

/**
 * The components panel: UI primitives the user can stamp onto the canvas.
 *
 * The panel knows nothing about any particular component. It searches, groups
 * and inserts whatever the catalogue hands it, so a new button variant is an
 * entry in `data/design-playground/component-templates.ts` and never a change
 * here (PRD §7.3).
 *
 * Inserted templates become real, editable nodes - a button is a frame with a
 * text child that the user can recolour, rename and pull apart.
 */
export function ComponentsPanel() {
  const t = useTranslations('designPlayground');

  return (
    <CatalogueBrowser
      entries={COMPONENT_TEMPLATES}
      // The same glyph the rail uses for this panel, so tile and tab agree.
      icon={Boxes}
      searchLabel={t('panels.components.search')}
      emptyLabel={t('panels.components.empty')}
      insertLabel={(name) => t('panels.components.insert', { name })}
    />
  );
}

/**
 * The shared catalogue browser, used by the components and sections panels.
 *
 * Exported rather than duplicated: both panels are the same interaction over
 * the same entry shape, and two copies would drift the moment one gained a
 * feature (the layers/pages panels share `InlineRename` the same way).
 */
export function CatalogueBrowser({
  entries,
  icon: Icon,
  searchLabel,
  emptyLabel,
  insertLabel,
}: {
  entries: readonly CatalogueEntry[];
  /** Glyph shown in each row's preview tile; identifies the catalogue at a glance. */
  icon: LucideIcon;
  searchLabel: string;
  emptyLabel: string;
  insertLabel: (name: string) => string;
}) {
  const [query, setQuery] = useState('');
  /*
   * Categories the user has folded away. Collapsed rather than expanded is the
   * stored set, so a category added to the catalogue later arrives OPEN - the
   * opposite would hide new sections behind a preference nobody set.
   */
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set());
  const insertTemplate = useDesignDocumentStore((s) => s.insertTemplate);
  const searchId = useId();

  // Substring matching over name + category is enough for a catalogue this
  // size, and it keeps the panel dependency-free - no fuzzy-search library for
  // a few dozen rows.
  const groups = useMemo(() => groupEntries(entries, query), [entries, query]);

  return (
    <div className="flex min-h-0 flex-col">
      <label htmlFor={searchId} className="sr-only">
        {searchLabel}
      </label>
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchLabel}
          className="h-8 w-full rounded-md border border-border bg-background pl-7 pr-2 text-[13px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {groups.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed border-border p-3 text-center text-xs leading-relaxed text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        groups.map((group) => {
          // A search has already narrowed the list to what was asked for, so a
          // folded category would hide a match: filtering wins over the fold.
          const open = query.trim() !== '' || !collapsed.has(group.category);
          const panelId = `${searchId}-${group.category.replace(/\W+/g, '-')}`;

          return (
          <section key={group.category} className="mt-3">
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() =>
                  setCollapsed((current) => {
                    const next = new Set(current);
                    if (next.has(group.category)) next.delete(group.category);
                    else next.add(group.category);
                    return next;
                  })
                }
                className={cn(
                  'flex w-full items-center gap-1 rounded-md px-1 py-1 text-left',
                  'text-[11px] font-semibold uppercase tracking-wide text-muted-foreground',
                  'transition-colors hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              >
                <ChevronRight
                  aria-hidden
                  className={cn('h-3 w-3 shrink-0 transition-transform', open && 'rotate-90')}
                />
                <span className="truncate">{group.category}</span>
                <span className="ml-auto shrink-0 tabular-nums text-muted-foreground/60">
                  {group.entries.length}
                </span>
              </button>
            </h3>
            <ul id={panelId} hidden={!open} className="-mx-1 mt-1 space-y-0.5">
              {group.entries.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    // No drag-and-drop yet and the rail cannot see the canvas
                    // pan, so a click places the template at the page origin
                    // (inside the frame there, if any) and selects it - the
                    // user then moves it with the pointer or the inspector.
                    //
                    // The root takes the CATALOGUE's name, not the template's:
                    // the layer should read "Hero", which is what the user
                    // clicked, rather than the internal "Section / Hero".
                    onClick={() => insertTemplate({ ...entry.spec, name: entry.name })}
                    title={insertLabel(entry.name)}
                    className={cn(
                      'group flex w-full items-center gap-2 rounded-md p-1 text-left',
                      'text-foreground hover:bg-muted',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    )}
                  >
                    {/* A lightweight tile, not a live render: drawing Konva in
                        the rail would mount a second stage per row. */}
                    <span
                      aria-hidden
                      className="flex h-9 w-12 shrink-0 items-center justify-center rounded border border-border bg-muted/50 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-[13px]">{entry.name}</span>
                      <span className="truncate text-[11px] tabular-nums text-muted-foreground">
                        {entry.width} × {entry.height}
                      </span>
                    </span>
                    <span className="sr-only">{insertLabel(entry.name)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          );
        })
      )}
    </div>
  );
}

interface CatalogueGroup {
  category: string;
  entries: CatalogueEntry[];
}

/**
 * Filter, then bucket by category.
 *
 * Category order follows the catalogue array rather than an alphabetical sort,
 * so the author controls what the user meets first.
 */
function groupEntries(entries: readonly CatalogueEntry[], query: string): CatalogueGroup[] {
  const needle = query.trim().toLowerCase();
  const groups: CatalogueGroup[] = [];

  for (const entry of entries) {
    if (needle && !`${entry.name} ${entry.category}`.toLowerCase().includes(needle)) continue;
    const group = groups.find((candidate) => candidate.category === entry.category);
    if (group) group.entries.push(entry);
    else groups.push({ category: entry.category, entries: [entry] });
  }

  return groups;
}
