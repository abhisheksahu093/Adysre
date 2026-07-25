'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Input, Select, cn } from 'adysre';
import type { TemplateSummary } from '@/data/templates/types';

/**
 * Gallery filters.
 *
 * Three controls, and the split is deliberate: the TABS answer "what am I
 * allowed to take" (all / free / premium / new / multipage), the SEARCH box
 * answers "I know the name", and the THEME select answers "what business is it
 * for". Counts on every tab keep an empty result predictable before you click.
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
  query,
  onQueryChange,
}: {
  templates: TemplateSummary[];
  tab: TemplateTabId;
  onTabChange: (tab: TemplateTabId) => void;
  theme: string | null;
  onThemeChange: (theme: string | null) => void;
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const t = useTranslations('templates');

  // Themes come from what is actually registered in the current tab, not a
  // hardcoded list, so a new vertical appears the moment its template does.
  const themes = [...new Set(templates.filter((x) => matchesTab(x, tab)).map((x) => x.themeKey))].sort(
    (a, b) => t(`themes.${a}`).localeCompare(t(`themes.${b}`)),
  );
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
                // A theme that no longer exists in the new tab would silently
                // empty the grid, so selection resets with the tab.
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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t('filters.searchPlaceholder')}
            aria-label={t('filters.searchLabel')}
            className="pl-9"
          />
        </div>

        {themes.length > 1 && (
          <Select
            value={theme ?? ''}
            onChange={(e) => onThemeChange(e.target.value === '' ? null : e.target.value)}
            aria-label={t('filters.theme')}
            className="sm:w-56"
          >
            <option value="">{t('filters.allThemes')}</option>
            {themes.map((id) => (
              <option key={id} value={id}>
                {t(`themes.${id}`)}
              </option>
            ))}
          </Select>
        )}
      </div>
    </div>
  );
}
