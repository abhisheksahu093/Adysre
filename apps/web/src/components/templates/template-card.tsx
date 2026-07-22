'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Files, Lock, Sparkles } from 'lucide-react';
import { Badge } from '@adysre/ui';
import type { TemplateSummary } from '@/data/templates/types';

/**
 * Gallery card: a live thumbnail on top, the template's name below.
 *
 * The thumbnail is a real iframe of the template's own preview route, scaled
 * down - not a screenshot. A template is judged on its layout, and a stale PNG
 * would start lying the first time a section changed. It only mounts once the
 * card nears the viewport, so a long gallery does not open twenty documents at
 * once, and it is inert (`pointer-events-none`) because the card itself is the
 * click target.
 */
export function TemplateCard({
  template,
  onOpen,
}: {
  template: TemplateSummary;
  onOpen: (template: TemplateSummary) => void;
}) {
  const t = useTranslations('templates');
  const ref = useRef<HTMLButtonElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: '300px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);

  const premium = template.tier === 'premium';
  const { locked } = template;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(template)}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card/60 text-left transition-colors hover:border-primary/40 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative h-48 w-full overflow-hidden border-b border-border bg-muted/40">
        {near ? (
          <div className="pointer-events-none absolute left-0 top-0 h-[1000px] w-[1440px] origin-top-left scale-[0.32] sm:scale-[0.28]">
            <iframe
              src={`/template-preview/${template.slug}`}
              title={template.name}
              tabIndex={-1}
              aria-hidden
              loading="lazy"
              className="h-full w-full border-0"
            />
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/80 to-transparent" aria-hidden />

        <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1.5">
          {template.isNew && (
            <Badge variant="accent">
              <Sparkles className="h-2.5 w-2.5" aria-hidden />
              {t('filters.tabs.new')}
            </Badge>
          )}
          {template.pages.length > 1 && (
            <Badge variant="primary">
              <Files className="h-2.5 w-2.5" aria-hidden />
              {t('pagesCount', { count: template.pages.length })}
            </Badge>
          )}
          <Badge variant={premium ? 'primary' : 'success'}>
            {/* The lock only appears when this visitor actually cannot take it -
                a premium template they own should not look fenced off. */}
            {locked && <Lock className="h-2.5 w-2.5" aria-hidden />}
            {t(`tiers.${template.tier}`)}
          </Badge>
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
