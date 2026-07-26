'use client';

import { useTranslations } from 'next-intl';
import { Files, Search } from 'lucide-react';
import { Tooltip, cn } from 'adysre';
import { Explorer } from './explorer';
import { SearchPanel } from './search-panel';

export type SidebarView = 'explorer' | 'search';

/**
 * The studio's left rail: an activity switch (Explorer / Search) over the two
 * panels. The active view is owned by the shell so a shortcut or command can
 * bring Search forward.
 */
export function StudioSidebar({ view, onViewChange }: { view: SidebarView; onViewChange: (view: SidebarView) => void }) {
  const t = useTranslations('codeStudio');
  const items: { id: SidebarView; icon: typeof Files; label: string }[] = [
    { id: 'explorer', icon: Files, label: t('explorer') },
    { id: 'search', icon: Search, label: t('search.title') },
  ];

  return (
    <div className="flex h-full">
      <nav className="flex w-10 shrink-0 flex-col items-center gap-1 border-r border-border py-2" aria-label={t('title')}>
        {items.map(({ id, icon: Icon, label }) => (
          <Tooltip key={id} label={label} side="right">
            <button
              type="button"
              aria-label={label}
              aria-pressed={view === id}
              onClick={() => onViewChange(id)}
              className={cn(
                'rounded-md p-2 transition-colors',
                view === id ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </button>
          </Tooltip>
        ))}
      </nav>
      <div className="min-w-0 flex-1">{view === 'explorer' ? <Explorer /> : <SearchPanel />}</div>
    </div>
  );
}
