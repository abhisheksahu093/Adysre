'use client';

import { useTranslations } from 'next-intl';
import { cn } from 'adysre';
import type { TemplateSummary } from '@/data/templates/types';

/**
 * Gallery filters.
 *
 * Two controls, and the split is deliberate: the TABS answer "what am I allowed
 * to take" (all / free / premium / new / multipage) because that is the
 * question a visitor arrives with, and the CHIPS below answer "what business is
 * it for". Counts are shown on every option so an empty result is predictable
 * before you click it.
 */

export const TEMPLATE_TABS = ['all', 'free', 'premium', 'new', 'multipage'] as const;
export type TemplateTabId = (typeof TEMPLATE_TABS)[number];

/** The one place a tab's meaning is defined, so the tab strip and the grid agree. */
export function matchesTab(template: TemplateSummary, tab: TemplateTabId): boolean {
  switch (tab) {
    case 'free':
      return template.tier === 'free';
    case 'premium':
      return template.tier === 'premium';
    case 'new':
      return template.isNew;
    case 'multipage':
      return template.pages.length > 1;
    case 'all':
    default:
      return true;
  }
}

export function TemplateFilters({
  templates,
  tab,
  onTabChange,
  theme,
  onThemeChange,
}: {
  templates: TemplateSummary[];
  tab: TemplateTabId;
  onTabChange: (tab: TemplateTabId) => void;
  theme: string | null;
  onThemeChange: (theme: string | null) => void;
}) {
  const t = useTranslations('templates');

  // Themes come from what is actually registered, not a hardcoded list, so a
  // new vertical appears here the moment its template does.
  const themes = [...new Set(templates.filter((x) => matchesTab(x, tab)).map((x) => x.themeKey))].sort();
  const countFor = (id: TemplateTabId) => templates.filter((x) => matchesTab(x, id)).length;

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label={t('filters.tabsLabel')} className="flex flex-wrap gap-1">
        {TEMPLATE_TABS.map((id) => {
          const active = tab === id;
          const count = countFor(id);
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                onTabChange(id);
                // A theme chip that no longer exists in the new tab would
                // silently empty the grid, so selection resets with the tab.
                onThemeChange(null);
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {t(`filters.tabs.${id}`)}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                  active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {themes.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('filters.theme')}
          </span>
          <button
            type="button"
            aria-pressed={theme === null}
            onClick={() => onThemeChange(null)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              theme === null
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground',
            )}
          >
            {t('filters.allThemes')}
          </button>
          {themes.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={theme === id}
              onClick={() => onThemeChange(theme === id ? null : id)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs transition-colors',
                theme === id
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground',
              )}
            >
              {t(`themes.${id}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
