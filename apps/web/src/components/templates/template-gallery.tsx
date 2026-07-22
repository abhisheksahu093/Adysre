'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LayoutTemplate } from 'lucide-react';
import type { TemplateSummary } from '@/data/templates/types';
import { TemplateCard } from './template-card';
import { TemplateDialog } from './template-dialog';
import { TemplateFilters, matchesTab, type TemplateTabId } from './template-filters';

/**
 * The templates gallery: filters, a card grid, and the one open dialog.
 *
 * Selection and filter state live here so only one dialog can ever be mounted
 * and closing always returns focus to the grid.
 */
export function TemplateGallery({ templates }: { templates: TemplateSummary[] }) {
  const t = useTranslations('templates');
  const [selected, setSelected] = useState<TemplateSummary | null>(null);
  const [tab, setTab] = useState<TemplateTabId>('all');
  const [theme, setTheme] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      templates.filter(
        (template) => matchesTab(template, tab) && (theme === null || template.themeKey === theme),
      ),
    [templates, tab, theme],
  );

  return (
    <>
      <TemplateFilters
        templates={templates}
        tab={tab}
        onTabChange={setTab}
        theme={theme}
        onThemeChange={setTheme}
      />

      {visible.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <LayoutTemplate className="h-6 w-6 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((template) => (
            <TemplateCard key={template.slug} template={template} onOpen={setSelected} />
          ))}
        </div>
      )}

      <TemplateDialog template={selected} onClose={() => setSelected(null)} />
    </>
  );
}
