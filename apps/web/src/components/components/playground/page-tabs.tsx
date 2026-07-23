'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';
import { cn } from 'adysre';
import { usePlaygroundStore } from '@/stores/playground-store';

/**
 * The site's pages, as tabs above the section rail.
 *
 * A site is more than one page - "About us", "Contact us" - and each needs its
 * own body while sharing the header and footer (see `SITE_SLOT_IDS`). Switching
 * tabs re-points the whole builder: rail, canvas, content and style all read the
 * active page, so the canvas on the right follows the tab on the left.
 *
 * Renaming is inline on double-click rather than behind a dialog: naming a page
 * is the most common thing done to one, and a modal for a single text field is
 * more ceremony than the task deserves.
 */
export function PageTabs() {
  const t = useTranslations('components');
  const pages = usePlaygroundStore((s) => s.pages);
  const activePageId = usePlaygroundStore((s) => s.activePageId);
  const setActivePage = usePlaygroundStore((s) => s.setActivePage);
  const addPage = usePlaygroundStore((s) => s.addPage);
  const renamePage = usePlaygroundStore((s) => s.renamePage);
  const removePage = usePlaygroundStore((s) => s.removePage);

  const [renamingId, setRenamingId] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-border bg-card p-1.5 shadow-sm">
      <div className="flex items-center justify-between gap-2 px-2.5 pb-2 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t('playground.pages.title')}
        </p>
        <button
          type="button"
          onClick={() => addPage(t('playground.pages.newName'))}
          title={t('playground.pages.add')}
          aria-label={t('playground.pages.add')}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
        {pages.map((page) => {
          const active = page.id === activePageId;

          if (renamingId === page.id) {
            return (
              <li key={page.id} className="shrink-0">
                <input
                  autoFocus
                  defaultValue={page.name}
                  aria-label={t('playground.pages.nameLabel')}
                  onBlur={(event) => {
                    renamePage(page.id, event.target.value);
                    setRenamingId(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') event.currentTarget.blur();
                    if (event.key === 'Escape') setRenamingId(null);
                  }}
                  className="h-7 w-28 rounded-md border border-border bg-background px-2 text-[13px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </li>
            );
          }

          return (
            <li
              key={page.id}
              className={cn(
                'group/page flex shrink-0 items-center rounded-lg transition-colors',
                active ? 'bg-primary shadow-sm' : 'hover:bg-muted',
              )}
            >
              <button
                type="button"
                onClick={() => setActivePage(page.id)}
                onDoubleClick={() => setRenamingId(page.id)}
                aria-current={active ? 'page' : undefined}
                title={t('playground.pages.rename')}
                className={cn(
                  'max-w-36 truncate rounded-lg px-3 py-1.5 text-[13px] font-semibold',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
                  active
                    ? 'text-primary-foreground focus-visible:ring-primary-foreground/40'
                    : 'text-foreground focus-visible:ring-ring',
                )}
              >
                {page.name}
              </button>

              {/* A site always keeps one page, so the last tab has no remove. */}
              {pages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePage(page.id)}
                  title={t('playground.pages.remove', { name: page.name })}
                  aria-label={t('playground.pages.remove', { name: page.name })}
                  className={cn(
                    'mr-1 flex h-5 w-5 shrink-0 items-center justify-center rounded',
                    'opacity-0 transition-opacity group-hover/page:opacity-100 focus-visible:opacity-100',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    active
                      ? 'text-primary-foreground/70 hover:text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
