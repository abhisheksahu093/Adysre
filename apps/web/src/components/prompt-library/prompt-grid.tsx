'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { SearchX } from 'lucide-react';
import { Button } from 'adysre';
import {
  isNew,
  PROMPT_CATEGORIES,
  type LocalizedPrompt,
  type Prompt,
  type PromptCategory,
} from '@/data/prompts';
import { PromptCard } from './prompt-card';
import { PromptEditorDialog } from './prompt-editor-dialog';
import { PremiumGateDialog, type GateAction } from './premium-gate-dialog';
import {
  INITIAL_FILTERS,
  PromptFilters,
  isFiltered,
  type Collection,
  type PromptFilterState,
} from './prompt-filters';

/** Free-text match across title, description, tags and body. */
function matchesSearch(prompt: Prompt, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return (
    prompt.title.toLowerCase().includes(q) ||
    prompt.description.toLowerCase().includes(q) ||
    prompt.tags.some((t) => t.includes(q)) ||
    prompt.body.toLowerCase().includes(q)
  );
}

function matchesCollection(prompt: Prompt, collection: Collection, now: number): boolean {
  switch (collection) {
    case 'featured':
      return prompt.featured === true;
    case 'trending':
      return prompt.trending === true;
    case 'new':
      return isNew(prompt, now);
    default:
      return true;
  }
}

/**
 * `prompts` is passed in rather than imported so the server can hand down the
 * active locale's text - importing all four catalogues here would ship every
 * language to every visitor.
 */
export function PromptGrid({ prompts }: { prompts: LocalizedPrompt[] }) {
  const [filters, setFilters] = useState<PromptFilterState>(INITIAL_FILTERS);
  const [editing, setEditing] = useState<LocalizedPrompt | null>(null);
  const [gate, setGate] = useState<{ prompt: LocalizedPrompt; action: GateAction } | null>(null);
  const t = useTranslations('promptLibrary');
  const tCommon = useTranslations('common');

  // Category is chosen from the sidebar submenu, which navigates here with
  // `?category=`; sync it into the filter state.
  const searchParams = useSearchParams();
  useEffect(() => {
    const c = searchParams.get('category');
    const valid = c !== null && PROMPT_CATEGORIES.some((x) => x.id === c);
    setFilters((f) => ({ ...f, category: valid ? (c as PromptCategory) : 'all' }));
  }, [searchParams]);

  const visible = useMemo(() => {
    // Pinned once per filter change so every card in a pass is judged against
    // the same instant - and so `new` can't shift mid-render.
    const now = Date.now();
    return prompts.filter(
      (p) =>
        matchesCollection(p, filters.collection, now) &&
        (filters.category === 'all' || p.category === filters.category) &&
        (filters.tier === 'all' || p.tier === filters.tier) &&
        (filters.model === 'all' || (p.model ?? []).includes(filters.model)) &&
        (filters.aspectRatio === 'all' || (p.aspectRatio ?? []).includes(filters.aspectRatio)) &&
        matchesSearch(p, filters.search),
    );
  }, [filters, prompts]);

  return (
    <div className="space-y-6">
      <PromptFilters
        value={filters}
        onChange={setFilters}
        resultCount={visible.length}
        totalCount={prompts.length}
      />

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((prompt, i) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={setEditing}
              onLocked={(p, action) => setGate({ prompt: p, action })}
              onTagClick={(tag) => setFilters({ ...filters, search: tag })}
              priority={i < 4}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-medium">{t('empty.title')}</p>
            <p className="text-sm text-muted-foreground">{t('empty.description')}</p>
          </div>
          {isFiltered(filters) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFilters(INITIAL_FILTERS)}
            >
              {tCommon('clearFilters')}
            </Button>
          )}
        </div>
      )}

      <PromptEditorDialog prompt={editing} onClose={() => setEditing(null)} />

      <PremiumGateDialog
        promptTitle={gate?.prompt.title ?? null}
        action={gate?.action ?? 'copy'}
        onClose={() => setGate(null)}
      />
    </div>
  );
}
