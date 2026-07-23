'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LayoutTemplate, Paintbrush, Pencil } from 'lucide-react';
import { cn } from '@adysre/ui';
import type { LocalizedComponent } from '@/data/components';
import type { PlaygroundSlot, PlaygroundSlotId } from '@/data/playground';
import { tourStepsForStage } from '@/data/playground/tour';
import { sectionStyleOf, usePlaygroundStore } from '@/stores/playground-store';
import { overrideCount } from '@/lib/playground/content';
import { sectionStyleEditCount } from '@/lib/playground/section-style';
import { SlotRail } from './slot-rail';
import { PageTabs } from './page-tabs';
import { VariationPicker } from './variation-picker';
import { ContentEditor } from './content-editor';
import { SectionStyleEditor } from './section-style-editor';

interface BuilderSidebarProps {
  resolved: Record<PlaygroundSlotId, string | null>;
  components: LocalizedComponent[];
  variationsBySlot: Map<PlaygroundSlotId, LocalizedComponent[]>;
  activeSlot: PlaygroundSlot;
  /** The component filling the active slot, or `null` when the slot is empty. */
  activeComponent: LocalizedComponent | null;
  onSelectSlot: (id: PlaygroundSlotId) => void;
  onChange: (id: PlaygroundSlotId, slug: string | null) => void;
}

type BuilderTab = 'layout' | 'content' | 'style';

/**
 * The builder's control column. The section rail stays pinned at the top as the
 * page navigator; below it a two-tab panel swaps between choosing a section's
 * layout and editing its copy. Both used to stack full-height, which pushed the
 * content editor far below the fold - here it is one always-visible tab click
 * away. The whole column is capped to the viewport and scrolls per-panel, so
 * nothing is ever off screen.
 *
 * The active tab follows the quick tour: its `variations`/`content` steps
 * spotlight elements that only exist in their own tab, so we switch to whichever
 * tab the current step needs before it measures.
 */
export function BuilderSidebar({
  resolved,
  components,
  variationsBySlot,
  activeSlot,
  activeComponent,
  onSelectSlot,
  onChange,
}: BuilderSidebarProps) {
  const t = useTranslations('components');
  const [tab, setTab] = useState<BuilderTab>('layout');

  const stage = usePlaygroundStore((s) => s.stage);
  const tourStep = usePlaygroundStore((s) => s.tourStep);
  const overrides = usePlaygroundStore((s) =>
    activeComponent ? s.contentOverrides[activeComponent.slug] : undefined,
  );
  const editedCount = overrideCount(overrides);
  const styledCount = usePlaygroundStore((s) =>
    sectionStyleEditCount(sectionStyleOf(s, activeSlot.id)),
  );

  // Keep the tour's spotlight target mounted by opening the tab it lives in.
  useEffect(() => {
    if (tourStep < 0) return;
    const target = tourStepsForStage(stage)[tourStep]?.target;
    if (target === 'content') setTab('content');
    else if (target === 'variations') setTab('layout');
  }, [tourStep, stage]);

  const tabs: { id: BuilderTab; label: string; icon: typeof LayoutTemplate; badge?: number }[] = [
    { id: 'layout', label: t('playground.builder.layout'), icon: LayoutTemplate },
    { id: 'content', label: t('playground.builder.content'), icon: Pencil, badge: editedCount },
    { id: 'style', label: t('playground.builder.style'), icon: Paintbrush, badge: styledCount },
  ];

  return (
    <div className="min-w-0 space-y-3 lg:sticky lg:top-4 lg:flex lg:h-[calc(100dvh-10.5rem)] lg:flex-col lg:space-y-3">
      <div className="lg:shrink-0">
        <PageTabs />
      </div>

      <div className="lg:shrink-0">
        <SlotRail
          resolved={resolved}
          components={components}
          variationsBySlot={variationsBySlot}
          activeSlotId={activeSlot.id}
          onSelectSlot={onSelectSlot}
          onChange={onChange}
          fill
        />
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:flex-1">
        <div role="tablist" aria-label={t('playground.builder.tabsLabel')} className="flex gap-1 p-1.5">
          {tabs.map(({ id, label, icon: Icon, badge }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
                {badge && badge > 0 ? (
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-[10px] font-semibold tabular-nums',
                      active ? 'bg-primary-foreground/20' : 'bg-primary/10 text-primary',
                    )}
                  >
                    {badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 border-t border-border">
          {/* Both mount so the store-driven tour can find either target; the
              hidden one is display:none, keeping the DOM node measurable when
              its tab is opened. */}
          <div className={cn('flex h-full min-h-0 flex-col', tab !== 'layout' && 'hidden')}>
            <VariationPicker
              slot={activeSlot}
              variations={variationsBySlot.get(activeSlot.id) ?? []}
              selected={resolved[activeSlot.id]}
              onChange={onChange}
              fill
            />
          </div>
          <div className={cn('flex h-full min-h-0 flex-col', tab !== 'content' && 'hidden')}>
            <ContentEditor
              component={activeComponent}
              slotLabel={t(`playground.slots.${activeSlot.id}`)}
              fill
            />
          </div>
          <div className={cn('flex h-full min-h-0 flex-col', tab !== 'style' && 'hidden')}>
            <SectionStyleEditor
              slot={activeSlot}
              slotLabel={t(`playground.slots.${activeSlot.id}`)}
              hasSection={activeComponent !== null}
              fill
            />
          </div>
        </div>
      </div>
    </div>
  );
}
