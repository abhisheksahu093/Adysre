'use client';

import { useTranslations } from 'next-intl';
import { Sparkles, Star, Layers } from 'lucide-react';
import { Badge } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import { availableFrameworks, isNewComponent, type LocalizedComponent } from '@/data/components';
import { ComponentCardPreview } from './component-card-preview';

/**
 * Index-grid card. The whole card is clickable, but only the TITLE is the link.
 *
 * The card cannot wrap its contents in one anchor: the thumbnail renders the
 * real component, and 175 of those contain an `<a>` of their own - nesting an
 * anchor inside an anchor is invalid HTML and React fails hydration on it. So
 * the link covers the title and stretches over the card with a pseudo-element
 * instead. The whole surface stays clickable, and the link's accessible name
 * becomes the component's name rather than every word on the card.
 *
 * Nothing after the link in DOM order may be positioned, or it would paint over
 * that overlay and swallow the click.
 */
export function ComponentCard({ component }: { component: LocalizedComponent }) {
  const t = useTranslations('components');
  const frameworks = availableFrameworks(component);
  const fresh = isNewComponent(component);

  return (
    <article
      className="group relative flex h-full flex-col rounded-lg border border-border bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
    >
      <ComponentCardPreview slug={component.slug} />

      <div className="mb-3 flex flex-wrap items-start justify-between gap-1.5">
        <div className="flex flex-wrap gap-1">
          {component.featured && (
            <Badge variant="primary">
              <Star className="h-2.5 w-2.5" aria-hidden />
              {t('featured')}
            </Badge>
          )}
          {fresh && (
            <Badge variant="success">
              <Sparkles className="h-2.5 w-2.5" aria-hidden />
              {t('new')}
            </Badge>
          )}
        </div>
        <Badge variant="outline">{t(`categories.${component.category}`)}</Badge>
      </div>

      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
        {/* The `after` pseudo-element is the card's real hit area. It is drawn
            by the link, so it needs no z-index: it is positioned and every
            element after it here is static, which already puts it on top. */}
        <Link
          href={`/components/${component.slug}`}
          className="after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none"
        >
          {component.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {component.description}
      </p>

      <div className="mt-auto space-y-2 pt-4">
        <div className="flex flex-wrap gap-1">
          {component.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
        <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Layers className="h-3 w-3 shrink-0" aria-hidden />
          {/* Count, not a list of six labels - the detail page shows which. */}
          {t('frameworkCount', { count: frameworks.length })}
          <span aria-hidden>·</span>
          {t(`difficulty.${component.difficulty}`)}
        </p>
      </div>
    </article>
  );
}
