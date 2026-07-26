'use client';

import { useTranslations } from 'next-intl';
import { Pin, Plus, X } from 'lucide-react';
import { cn } from 'adysre';
import type { ApiTab } from '../types';
import { METHOD_TONES } from '../constants/http';
import { TonePill } from './tone';

/**
 * The tab strip.
 *
 * An unsaved tab shows a dot where its close button is, and the dot BECOMES the
 * close button on hover: the indicator and the action occupy one slot, so a
 * dirty tab is never wider than a clean one and the row does not reflow as you
 * type.
 */
export function TabBar({
  tabs,
  activeId,
  onSelect,
  onClose,
  onPin,
  onNew,
}: {
  tabs: ApiTab[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onPin: (id: string, pinned: boolean) => void;
  onNew: () => void;
}) {
  const t = useTranslations('apiStudio');

  return (
    <div className="flex items-stretch gap-1 overflow-x-auto border-b border-border px-1.5 py-1">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <div
            key={tab.id}
            className={cn(
              'group flex shrink-0 items-center gap-1.5 rounded-md ps-2 pe-1 transition-colors',
              active ? 'bg-primary/10' : 'hover:bg-muted',
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex max-w-48 items-center gap-1.5 py-1.5 text-xs',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <TonePill tone={METHOD_TONES[tab.draft.method]} className="w-11 justify-center">
                {tab.draft.method.slice(0, 4)}
              </TonePill>
              <span className="truncate">{tab.title}</span>
            </button>

            <button
              type="button"
              onClick={() => onPin(tab.id, !tab.pinned)}
              aria-label={tab.pinned ? t('tabs.unpin') : t('tabs.pin')}
              title={tab.pinned ? t('tabs.unpin') : t('tabs.pin')}
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                tab.pinned ? 'text-primary' : 'opacity-0 group-hover:opacity-100 focus:opacity-100',
              )}
            >
              <Pin className="h-3 w-3" aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => onClose(tab.id)}
              aria-label={
                tab.dirty ? t('tabs.closeUnsaved', { name: tab.title }) : t('tabs.close', { name: tab.title })
              }
              title={tab.dirty ? t('tabs.unsaved') : t('tabs.close', { name: tab.title })}
              className="group/close flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {tab.dirty ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-warning group-hover/close:hidden" aria-hidden />
                  <X className="hidden h-3 w-3 group-hover/close:block" aria-hidden />
                </>
              ) : (
                <X className="h-3 w-3" aria-hidden />
              )}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onNew}
        aria-label={t('tabs.new')}
        title={t('tabs.new')}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
