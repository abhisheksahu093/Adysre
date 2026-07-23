'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import type { LocalizedComponent } from '@/data/components';

interface CategorySidebarProps {
  /** Every component in this category, including the current one. */
  siblings: LocalizedComponent[];
  currentSlug: string;
  category: string;
}

/**
 * Jump-list of the other components in this category.
 *
 * Sticky rather than `fixed`: fixed would leave the viewport on a short screen
 * and strand the tail of a long list with no way to reach it. Sticky pins it
 * while the article scrolls, and lets it scroll internally once it runs out of
 * room (`max-h` + `overflow-y-auto`).
 */
export function CategorySidebar({ siblings, currentSlug, category }: CategorySidebarProps) {
  const t = useTranslations('components');
  const categoryLabel = t(`categories.${category}`);

  return (
    // Hidden below `lg`: a 16rem rail plus the app's own sidebar leaves no room
    // for the code. On mobile the Related grid at the foot of the page serves
    // the same purpose.
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-2 overflow-y-auto pb-6 pr-1">
        <Link
          href="/components"
          className={cn(
            'group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
            'text-muted-foreground hover:bg-muted hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-background group-hover:text-foreground"
            aria-hidden
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          </span>
          {t('allComponents')}
        </Link>

        <div className="rounded-xl border border-border bg-card p-1.5 shadow-sm">
          <div className="flex items-center justify-between gap-2 px-2.5 pb-1.5 pt-2">
            <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {categoryLabel}
            </p>
            <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
              {siblings.length}
            </span>
          </div>

          <nav aria-label={categoryLabel}>
            <ul className="space-y-0.5">
              {siblings.map((c) => {
                const active = c.slug === currentSlug;
                return (
                  <li key={c.slug}>
                    <Link
                      href={`/components/${c.slug}`}
                      // Marks the current page for screen readers, not just visually.
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] leading-snug transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
                        active
                          ? 'bg-primary font-semibold text-primary-foreground shadow-sm focus-visible:ring-primary-foreground/40'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring',
                      )}
                    >
                      <span className="min-w-0 flex-1">{c.title}</span>
                      <ChevronRight
                        className={cn(
                          'h-3.5 w-3.5 shrink-0 transition-all',
                          active
                            ? 'opacity-90'
                            : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50',
                        )}
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}
