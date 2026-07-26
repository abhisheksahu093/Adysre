'use client';

import { useTranslations } from 'next-intl';
import { Files, Lock, Sparkles } from 'lucide-react';
import { cn } from 'adysre';
import type { TemplateSummary } from '@/data/templates/types';
import { TemplateThumbnail } from './template-thumbnail';

// An opaque, frosted chip so overlay badges stay legible over any thumbnail
// (light, dark or busy). The semantic colour lives on the icon and label; the
// card-token surface guarantees the preview never bleeds through.
const CHIP =
  'inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-semibold shadow-sm ring-1 ring-border backdrop-blur-sm';

/**
 * Gallery card: a live thumbnail on top, the template's name below.
 *
 * The thumbnail itself lives in `TemplateThumbnail` — the landing showcase
 * renders the same frame at a different scale, and one lazy-mount rule beats
 * two.
 */
export function TemplateCard({
  template,
  onOpen,
}: {
  template: TemplateSummary;
  onOpen: (template: TemplateSummary) => void;
}) {
  const t = useTranslations('templates');

  const premium = template.tier === 'premium';
  const { locked } = template;

  return (
    <button
      type="button"
      onClick={() => onOpen(template)}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card/60 text-left transition-colors hover:border-primary/40 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative h-48 w-full overflow-hidden border-b border-border bg-muted/40">
        <TemplateThumbnail slug={template.slug} name={template.name} />

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/80 to-transparent" aria-hidden />

        <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1.5">
          {template.isNew && (
            <span className={cn(CHIP, 'text-foreground')}>
              <Sparkles className="h-3 w-3 text-accent" aria-hidden />
              {t('filters.tabs.new')}
            </span>
          )}
          {template.pages.length > 1 && (
            <span className={cn(CHIP, 'text-foreground')}>
              <Files className="h-3 w-3 text-muted-foreground" aria-hidden />
              {t('pagesCount', { count: template.pages.length })}
            </span>
          )}
          <span className={cn(CHIP, premium ? 'text-primary' : 'text-success')}>
            {/* The lock only appears when this visitor actually cannot take it -
                a premium template they own should not look fenced off. */}
            {locked && <Lock className="h-3 w-3" aria-hidden />}
            {t(`tiers.${template.tier}`)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight">{template.name}</h2>
          <span className="text-[11px] text-muted-foreground">{t(`themes.${template.themeKey}`)}</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{t(`taglines.${template.taglineKey}`)}</p>
      </div>
    </button>
  );
}
