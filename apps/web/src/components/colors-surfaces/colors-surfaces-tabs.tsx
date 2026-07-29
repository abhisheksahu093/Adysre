'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Palette, Blend, Grid2x2, Waves, Shapes } from 'lucide-react';
import { cn } from 'adysre';
import { useRouter } from '@/i18n/navigation';
import { PalettesView } from '@/components/palettes/palettes-view';
import { GradientsView } from '@/components/gradients/gradients-view';
import { PatternsView } from '@/components/patterns/patterns-view';
import { TexturesView } from '@/components/textures/textures-view';
import { IconsView } from '@/components/icons/icons-view';

/**
 * Colours & Surfaces - one page, five tabs. Each tab renders the existing family
 * view (palettes / gradients / patterns / textures / icons) unchanged, with all
 * its own filters, generator and tour.
 *
 * The active tab lives in the URL (`?tab=`), so the sidebar's deep links
 * (`?tab=&tag=`, or `?tab=icons&category=`) land on the right tab and the server
 * page can pick the matching npm-usage panel. Only the active view mounts, so
 * the shared `?tag=` filter never bleeds from one family into another.
 */
const TABS = [
  { id: 'palettes', icon: Palette, View: PalettesView },
  { id: 'gradients', icon: Blend, View: GradientsView },
  { id: 'patterns', icon: Grid2x2, View: PatternsView },
  { id: 'textures', icon: Waves, View: TexturesView },
  // Icons joined the family last and sits last. It filters on `?category=`
  // rather than `?tag=`, which costs nothing here: switching tabs rebuilds the
  // query from scratch, so neither param survives into a tab that ignores it.
  { id: 'icons', icon: Shapes, View: IconsView },
] as const;

type TabId = (typeof TABS)[number]['id'];
const TAB_IDS: readonly string[] = TABS.map((tab) => tab.id);

export function ColorsSurfacesTabs() {
  const t = useTranslations('nav');
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get('tab');
  const active: TabId = TAB_IDS.includes(raw ?? '') ? (raw as TabId) : 'palettes';
  const ActiveView = TABS.find((tab) => tab.id === active)!.View;

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label={t('colorsSurfaces')}
        className="flex gap-1 overflow-x-auto border-b border-border"
      >
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            // Replace (not push) so tab hopping doesn't stack history, and drop
            // the previous tag so each family starts unfiltered.
            onClick={() => router.replace(`/colors-surfaces?tab=${id}`)}
            className={cn(
              'flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
              active === id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {t(id)}
          </button>
        ))}
      </div>
      <ActiveView />
    </div>
  );
}
