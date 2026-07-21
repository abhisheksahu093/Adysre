'use client';

import { useTranslations } from 'next-intl';
import { LayoutTemplate } from 'lucide-react';
import { SECTION_TEMPLATES } from '@/data/design-playground/section-templates';
import { CatalogueBrowser } from './components-panel';

/**
 * The sections panel: whole page sections - navbar, hero, pricing, footer.
 *
 * Identical interaction to the components panel, so it reuses that panel's
 * browser instead of owning a second copy of search, grouping and insertion.
 * Only the catalogue and the labels differ (PRD §7.3).
 */
export function SectionsPanel() {
  const t = useTranslations('designPlayground');

  return (
    <CatalogueBrowser
      entries={SECTION_TEMPLATES}
      // The same glyph the rail uses for this panel, so tile and tab agree.
      icon={LayoutTemplate}
      searchLabel={t('panels.sections.search')}
      emptyLabel={t('panels.sections.empty')}
      insertLabel={(name) => t('panels.sections.insert', { name })}
    />
  );
}
