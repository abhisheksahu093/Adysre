'use client';

import { useTranslations } from 'next-intl';
import { Sparkles, Star, Layers } from 'lucide-react';
import { Badge } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import { availableFrameworks, isNewComponent, type LocalizedComponent } from '@/data/components';

/**
 * Index-grid card. The whole card is one link - a component's card has no
 * secondary action, so nesting buttons inside would only cost keyboard users
 * an extra stop.
 */
export function ComponentCard({ component }: { component: LocalizedComponent }) {
  const t = useTranslations('components');
  const frameworks = availableFrameworks(component);
  const fresh = isNewComponent(component);

  return (
    <Link
      href={`/components/${component.slug}`}
      className="group flex h-full flex-col rounded-lg border border-border bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
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
        {component.title}
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
    </Link>
  );
}
