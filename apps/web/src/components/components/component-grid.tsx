'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Search, X, SearchX } from 'lucide-react';
import { Button, Input, Select } from 'adysre';
import { useRouter } from '@/i18n/navigation';
import { JumpToCombobox, type JumpToItem } from '@/components/jump-to-combobox';
import {
  COMPONENT_CATEGORIES,
  DIFFICULTIES,
  FRAMEWORKS,
  SORT_ORDERS,
  type ComponentCategory,
  type Difficulty,
  type Framework,
  type LocalizedComponent,
  type SortOrder,
} from '@/data/components';
import { ComponentCard } from './component-card';

interface Filters {
  search: string;
  category: ComponentCategory | 'all';
  framework: Framework | 'all';
  difficulty: Difficulty | 'all';
  sort: SortOrder;
}

const INITIAL: Filters = {
  search: '',
  category: 'all',
  framework: 'all',
  difficulty: 'all',
  sort: 'newest',
};

function isFiltered(f: Filters): boolean {
  return (
    f.search !== '' || f.category !== 'all' || f.framework !== 'all' || f.difficulty !== 'all'
  );
}

function matchesSearch(c: LocalizedComponent, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return (
    c.title.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.tags.some((t) => t.includes(q)) ||
    c.category.includes(q)
  );
}

/** Sort orders backed by stats degrade to `newest` until analytics exist. */
function compare(a: LocalizedComponent, b: LocalizedComponent, sort: SortOrder): number {
  switch (sort) {
    case 'alphabetical':
      return a.title.localeCompare(b.title);
    case 'updated':
      return b.updatedAt.localeCompare(a.updatedAt);
    case 'popular':
      return (b.stats?.views ?? 0) - (a.stats?.views ?? 0);
    case 'downloads':
      return (b.stats?.downloads ?? 0) - (a.stats?.downloads ?? 0);
    case 'copied':
      return (b.stats?.copies ?? 0) - (a.stats?.copies ?? 0);
    case 'trending':
      // No time-series yet, so "trending" is copies among recent entries.
      return (b.stats?.copies ?? 0) - (a.stats?.copies ?? 0);
    case 'newest':
    default:
      return b.createdAt.localeCompare(a.createdAt);
  }
}

/**
 * `components` is passed in rather than imported so the server can hand down
 * the active locale's prose - importing every catalogue here would ship all
 * four languages to every visitor.
 */
export function ComponentGrid({ components }: { components: LocalizedComponent[] }) {
  const [filters, setFilters] = useState<Filters>(INITIAL);
  const t = useTranslations('components');
  const tCommon = useTranslations('common');
  const router = useRouter();

  // Every component as a "jump to" target: type a name, land on its page.
  const jumpItems = useMemo<JumpToItem[]>(
    () =>
      components.map((c) => ({
        id: c.slug,
        label: c.title,
        sublabel: t(`categories.${c.category}`),
        keywords: `${c.category} ${c.tags.join(' ')}`,
      })),
    [components, t],
  );

  // The category is chosen from the sidebar submenu, which navigates here with
  // `?category=`. Sync it into the filter so the grid reflects the URL; the
  // other filters stay page-local.
  const searchParams = useSearchParams();
  useEffect(() => {
    const c = searchParams.get('category');
    const valid = c !== null && COMPONENT_CATEGORIES.some((x) => x.id === c);
    setFilters((f) => ({ ...f, category: valid ? (c as ComponentCategory) : 'all' }));
  }, [searchParams]);

  const visible = useMemo(() => {
    const out = components.filter(
      (c) =>
        (filters.category === 'all' || c.category === filters.category) &&
        (filters.difficulty === 'all' || c.difficulty === filters.difficulty) &&
        (filters.framework === 'all' || c.code[filters.framework] !== undefined) &&
        matchesSearch(c, filters.search),
    );
    // Copy before sorting - sort mutates, and `components` is a prop.
    return [...out].sort((a, b) => compare(a, b, filters.sort));
  }, [components, filters]);

  const set = <K extends keyof Filters>(key: K, v: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: v }));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchLabel')}
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:max-w-3xl sm:grid-cols-4">
          <JumpToCombobox
            items={jumpItems}
            onSelect={(slug) => router.push(`/components/${slug}`)}
            label={t('searchLabel')}
          />

          <Select
            value={filters.framework}
            onChange={(e) => set('framework', e.target.value as Framework | 'all')}
            aria-label={t('filters.byFramework')}
          >
            <option value="all">{t('filters.allFrameworks')}</option>
            {/* Framework names are proper nouns - never translated. */}
            {FRAMEWORKS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </Select>

          <Select
            value={filters.difficulty}
            onChange={(e) => set('difficulty', e.target.value as Difficulty | 'all')}
            aria-label={t('filters.byDifficulty')}
          >
            <option value="all">{t('filters.allDifficulties')}</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {t(`difficulty.${d}`)}
              </option>
            ))}
          </Select>

          <Select
            value={filters.sort}
            onChange={(e) => set('sort', e.target.value as SortOrder)}
            aria-label={t('filters.sortBy')}
          >
            {SORT_ORDERS.map((s) => (
              <option key={s} value={s}>
                {t(`sort.${s}`)}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {visible.length === components.length
              ? t('count', { count: components.length })
              : t('countFiltered', { count: visible.length, total: components.length })}
          </p>
          {isFiltered(filters) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto gap-1 py-1 text-xs"
              onClick={() => setFilters(INITIAL)}
            >
              <X className="h-3 w-3" />
              {tCommon('clearFilters')}
            </Button>
          )}
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((c) => (
            <ComponentCard key={c.slug} component={c} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-medium">{t('empty.title')}</p>
            <p className="text-sm text-muted-foreground">{t('empty.description')}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setFilters(INITIAL)}>
            {tCommon('clearFilters')}
          </Button>
        </div>
      )}
    </div>
  );
}
