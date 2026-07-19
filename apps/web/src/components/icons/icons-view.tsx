'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Search, CircleHelp, SearchX } from 'lucide-react';
import { Button, Input } from '@adysre/ui';
import {
  ICONS,
  ICON_CATEGORIES,
  ICON_COUNT,
  getIcon,
  type Icon,
  type IconCategoryId,
} from '@/data/icons';
import { useIconsStore } from '@/stores/icons-store';
import { SpotlightTour, type SpotlightStep } from '@/components/ui/spotlight-tour';
import { IconCard } from './icon-card';
import { IconQuickView } from './icon-quick-view';

const TOUR_STEPS: { id: string; target: string | null }[] = [
  { id: 'welcome', target: null },
  { id: 'customize', target: 'stroke' },
  { id: 'browse', target: 'grid' },
  { id: 'edit', target: 'quickview-controls' },
  { id: 'export', target: 'quickview-code' },
  { id: 'download', target: 'quickview-download' },
];
const TOUR_QV_START = 3;

export function IconsView() {
  const t = useTranslations('icons');
  const tCommon = useTranslations('common');
  const savedIcons = useIconsStore((s) => s.savedIcons);
  const stroke = useIconsStore((s) => s.stroke);
  const setStroke = useIconsStore((s) => s.setStroke);
  const tourStep = useIconsStore((s) => s.tourStep);
  const tourDone = useIconsStore((s) => s.tourDone);
  const startTour = useIconsStore((s) => s.startTour);
  const setTourStep = useIconsStore((s) => s.setTourStep);
  const endTour = useIconsStore((s) => s.endTour);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<IconCategoryId | 'all'>('all');
  const [active, setActive] = useState<Icon | null>(null);
  const tourOpenedQv = useRef(false);

  // Category is chosen from the sidebar submenu, which navigates here with
  // `?category=`; sync it in so the grid follows the URL.
  const searchParams = useSearchParams();
  useEffect(() => {
    const c = searchParams.get('category');
    const valid = c !== null && ICON_CATEGORIES.some((x) => x.id === c);
    setCategory(valid ? (c as IconCategoryId) : 'all');
  }, [searchParams]);

  useEffect(() => {
    if (!tourDone) startTour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tourStep >= TOUR_QV_START && !active) {
      setActive(ICONS[0] ?? null);
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

  const saved = useMemo(
    () => savedIcons.map((n) => getIcon(n)).filter((i): i is Icon => Boolean(i)),
    [savedIcons],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ICONS.filter(
      (icon) =>
        (category === 'all' || icon.category === category) &&
        (!q ||
          icon.name.includes(q) ||
          icon.title.toLowerCase().includes(q) ||
          icon.category.includes(q) ||
          icon.tags.some((tg) => tg.includes(q))),
    );
  }, [search, category]);

  const steps: SpotlightStep[] = TOUR_STEPS.map((s) => ({
    target: s.target,
    title: t(`tour.steps.${s.id}.title`),
    body: t(`tour.steps.${s.id}.body`),
  }));

  const gridClass =
    'grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10';

  return (
    <div className="space-y-6" style={{ '--icon-stroke': stroke } as React.CSSProperties}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {t('subtitle', { count: ICON_COUNT })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Global weight control - reshapes the whole grid live. */}
          <label
            data-tour="stroke"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
          >
            <span className="whitespace-nowrap font-medium">{t('weight')}</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.25}
              value={stroke}
              onChange={(e) => setStroke(Number(e.target.value))}
              className="h-1.5 w-20 accent-primary sm:w-24"
              aria-label={t('weight')}
            />
            <span className="w-8 tabular-nums text-foreground">{stroke.toFixed(2)}</span>
          </label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('tour.restart')}
            title={t('tour.restart')}
            onClick={startTour}
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <CircleHelp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="pl-9"
          />
        </div>
      </div>

      {saved.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t('savedTitle')}
          </h2>
          <div className={gridClass}>
            {saved.map((icon) => (
              <IconCard key={icon.name} icon={icon} onOpen={setActive} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {category === 'all' ? t('allCategories') : t(`categories.${category}`)}
          </h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            {t('resultCount', { count: visible.length })}
          </span>
        </div>
        {visible.length > 0 ? (
          <div data-tour="grid" className={gridClass}>
            {visible.map((icon) => (
              <IconCard key={icon.name} icon={icon} onOpen={setActive} />
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
                setCategory('all');
              }}
            >
              {tCommon('clearFilters')}
            </Button>
          </div>
        )}
      </section>

      <IconQuickView
        icon={active}
        onClose={() => {
          setActive(null);
          if (tourOpenedQv.current) {
            tourOpenedQv.current = false;
            endTour();
          }
        }}
        onOpenIcon={setActive}
      />

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

