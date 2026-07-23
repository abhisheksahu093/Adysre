'use client';

import { useTranslations } from 'next-intl';
import { Search, X, Star, Flame, Sparkles, LayoutGrid } from 'lucide-react';
import { Button, Input, Select, cn } from 'adysre';
import {
  ASPECT_RATIOS,
  PROMPT_MODELS,
  PROMPT_TIERS,
  type AspectRatio,
  type PromptCategory,
  type PromptModel,
  type PromptTier,
} from '@/data/prompts';

/** Curated views. `new` is derived from createdAt, not a stored flag. */
export const COLLECTIONS = [
  { id: 'all', icon: LayoutGrid },
  { id: 'featured', icon: Star },
  { id: 'trending', icon: Flame },
  { id: 'new', icon: Sparkles },
] as const;

export type Collection = (typeof COLLECTIONS)[number]['id'];

export interface PromptFilterState {
  search: string;
  collection: Collection;
  category: PromptCategory | 'all';
  tier: PromptTier | 'all';
  model: PromptModel | 'all';
  aspectRatio: AspectRatio | 'all';
}

export const INITIAL_FILTERS: PromptFilterState = {
  search: '',
  collection: 'all',
  category: 'all',
  tier: 'all',
  model: 'all',
  aspectRatio: 'all',
};

export function isFiltered(f: PromptFilterState): boolean {
  return (
    f.search !== '' ||
    f.collection !== 'all' ||
    f.category !== 'all' ||
    f.tier !== 'all' ||
    f.model !== 'all' ||
    f.aspectRatio !== 'all'
  );
}

interface PromptFiltersProps {
  value: PromptFilterState;
  onChange: (next: PromptFilterState) => void;
  resultCount: number;
  totalCount: number;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

export function PromptFilters({
  value,
  onChange,
  resultCount,
  totalCount,
}: PromptFiltersProps) {
  const t = useTranslations('promptLibrary');
  const tCommon = useTranslations('common');

  const set = <K extends keyof PromptFilterState>(key: K, v: PromptFilterState[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={value.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchLabel')}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label={t('filters.collection')}>
        {COLLECTIONS.map(({ id, icon: Icon }) => (
          <Chip key={id} active={value.collection === id} onClick={() => set('collection', id)}>
            <Icon className="h-3 w-3" aria-hidden />
            {t(`collections.${id}`)}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:max-w-xl sm:grid-cols-3">
        <Select
          value={value.tier}
          onChange={(e) => set('tier', e.target.value as PromptTier | 'all')}
          aria-label={t('filters.byTier')}
        >
          <option value="all">{t('filters.allTiers')}</option>
          {PROMPT_TIERS.map((tier) => (
            <option key={tier.id} value={tier.id}>
              {t(`tiers.${tier.id}`)}
            </option>
          ))}
        </Select>

        <Select
          value={value.model}
          onChange={(e) => set('model', e.target.value as PromptModel | 'all')}
          aria-label={t('filters.byModel')}
        >
          <option value="all">{t('filters.allModels')}</option>
          {/* Model names are brands - never translated. */}
          {PROMPT_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </Select>

        <Select
          value={value.aspectRatio}
          onChange={(e) => set('aspectRatio', e.target.value as AspectRatio | 'all')}
          aria-label={t('filters.byRatio')}
        >
          <option value="all">{t('filters.allRatios')}</option>
          {ASPECT_RATIOS.map((r) => (
            <option key={r.id} value={r.id}>
              {t(`ratios.${r.id}`)}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {resultCount === totalCount
            ? t('count', { count: totalCount })
            : t('countFiltered', { count: resultCount, total: totalCount })}
        </p>
        {isFiltered(value) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto gap-1 py-1 text-xs"
            onClick={() => onChange(INITIAL_FILTERS)}
          >
            <X className="h-3 w-3" />
            {tCommon('clearFilters')}
          </Button>
        )}
      </div>
    </div>
  );
}
