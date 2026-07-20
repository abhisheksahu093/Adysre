'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Search, Sparkles, CircleHelp, SearchX, X } from 'lucide-react';
import { Button, Input, Select } from '@adysre/ui';
import { PALETTES, type Palette } from '@/data/palettes';
import { hueName } from '@/lib/palettes/color';
import { usePalettesStore } from '@/stores/palettes-store';
import { SpotlightTour, type SpotlightStep } from '@/components/ui/spotlight-tour';
import { JumpToCombobox, type JumpToItem } from '@/components/jump-to-combobox';
import { PaletteCard } from './palette-card';
import { PaletteQuickView } from './palette-quick-view';

// Split the generator (and its colour-extraction deps) into its own chunk,
// loaded only when the user opens it.
const PaletteGenerator = dynamic(() => import('./palette-generator').then((m) => m.PaletteGenerator));

type SortId = 'trending' | 'name';
const SORTS: SortId[] = ['trending', 'name'];

/** Tour steps: page first, then a sample quick view opens for the editor steps. */
const TOUR_STEPS: { id: string; target: string | null }[] = [
  { id: 'welcome', target: null },
  { id: 'generate', target: 'generate' },
  { id: 'browse', target: 'grid' },
  { id: 'edit', target: 'quickview-swatches' },
  { id: 'export', target: 'quickview-code' },
  { id: 'similar', target: 'quickview-similar' },
];
/** From this step on, the tour needs the quick view open. */
const TOUR_QV_START = 3;

export function PalettesView() {
  const t = useTranslations('palettes');
  const tCommon = useTranslations('common');
  const saved = usePalettesStore((s) => s.savedPalettes);
  const removePalette = usePalettesStore((s) => s.removePalette);
  const tourStep = usePalettesStore((s) => s.tourStep);
  const tourDone = usePalettesStore((s) => s.tourDone);
  const startTour = usePalettesStore((s) => s.startTour);
  const setTourStep = usePalettesStore((s) => s.setTourStep);
  const endTour = usePalettesStore((s) => s.endTour);

  const [search, setSearch] = useState('');
  const [tag, setTag] = useState<string | 'all'>('all');
  const [sort, setSort] = useState<SortId>('trending');

  // Tag is chosen from the sidebar submenu, which navigates here with `?tag=`.
  const searchParams = useSearchParams();
  useEffect(() => {
    const tg = searchParams.get('tag');
    setTag(tg ?? 'all');
  }, [searchParams]);
  const [active, setActive] = useState<Palette | null>(null);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const tourOpenedQv = useRef(false);

  // Auto-run the tour once.
  useEffect(() => {
    if (!tourDone) startTour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open a sample palette for the quick-view tour steps; close it again if the
  // tour steps back out or finishes.
  useEffect(() => {
    if (tourStep >= TOUR_QV_START && !active) {
      setActive(PALETTES[0] ?? null);
      tourOpenedQv.current = true;
    } else if (tourStep >= 0 && tourStep < TOUR_QV_START && tourOpenedQv.current) {
      setActive(null);
      tourOpenedQv.current = false;
    } else if (tourStep < 0 && tourOpenedQv.current) {
      setActive(null);
      tourOpenedQv.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourStep]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const match = (p: Palette) =>
      (tag === 'all' || p.tags.includes(tag)) &&
      (!q ||
        p.name.toLowerCase().includes(q) ||
        p.tags.some((tg) => tg.includes(q)) ||
        p.colors.some((c) => c.toLowerCase().includes(q) || hueName(c).includes(q)));
    const list = PALETTES.filter(match);
    return [...list].sort((a, b) =>
      sort === 'name' ? a.name.localeCompare(b.name) : b.likes - a.likes,
    );
  }, [search, tag, sort]);

  const steps: SpotlightStep[] = TOUR_STEPS.map((s) => ({
    target: s.target,
    title: t(`tour.steps.${s.id}.title`),
    body: t(`tour.steps.${s.id}.body`),
  }));

  // Every palette as a "jump to" target: pick one to open its quick view.
  const jumpItems = useMemo<JumpToItem[]>(
    () => PALETTES.map((p) => ({ id: p.id, label: p.name, keywords: p.tags.join(' ') })),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('tour.restart')}
            title={t('tour.restart')}
            onClick={startTour}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <CircleHelp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            data-tour="generate"
            onClick={() => setGeneratorOpen(true)}
            className="gap-1.5"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            {t('generateCta')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="pl-9"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:w-64">
            <JumpToCombobox
              items={jumpItems}
              onSelect={(id) => setActive(PALETTES.find((p) => p.id === id) ?? null)}
              label={t('searchPlaceholder')}
            />
          </div>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            aria-label={t('sortBy')}
            className="sm:w-40"
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {t(`sort.${s}`)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Saved palettes */}
      {saved.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t('savedTitle')}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {saved.map((p) => (
              <div key={p.id} className="relative">
                <PaletteCard palette={p} onOpen={setActive} />
                <button
                  type="button"
                  onClick={() => removePalette(p.id)}
                  aria-label={t('removeSaved', { name: p.name })}
                  title={t('removeSaved', { name: p.name })}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-danger"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Curated grid */}
      <section className="space-y-3">
        {saved.length > 0 && (
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t('trendingTitle')}
          </h2>
        )}
        {visible.length > 0 ? (
          <div data-tour="grid" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <PaletteCard key={p.id} palette={p} onOpen={setActive} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
            <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">{t('empty')}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setTag('all');
              }}
            >
              {tCommon('clearFilters')}
            </Button>
          </div>
        )}
      </section>

      <PaletteQuickView
        palette={active}
        onClose={() => {
          setActive(null);
          if (tourOpenedQv.current) {
            tourOpenedQv.current = false;
            endTour();
          }
        }}
        onOpenPalette={setActive}
      />

      {generatorOpen && (
        <PaletteGenerator
          open
          onClose={() => setGeneratorOpen(false)}
          onGenerated={(p) => {
            setGeneratorOpen(false);
            setActive(p);
          }}
        />
      )}

      <SpotlightTour
        steps={steps}
        index={tourStep}
        onIndex={(i) => setTourStep(i, steps.length)}
        onClose={endTour}
        labels={{
          stepOf: (c, total) => t('tour.stepOf', { current: c, total }),
          back: t('tour.back'),
          next: t('tour.next'),
          done: t('tour.done'),
          skip: t('tour.skip'),
        }}
      />
    </div>
  );
}

