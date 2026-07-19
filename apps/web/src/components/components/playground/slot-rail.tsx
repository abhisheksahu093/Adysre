'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';
import { Button, cn } from '@adysre/ui';
import type { LocalizedComponent } from '@/data/components';
import { PLAYGROUND_SLOTS, type PlaygroundSlotId } from '@/data/playground';

interface SlotRailProps {
  resolved: Record<PlaygroundSlotId, string | null>;
  components: LocalizedComponent[];
  variationsBySlot: Map<PlaygroundSlotId, LocalizedComponent[]>;
  activeSlotId: PlaygroundSlotId;
  onSelectSlot: (id: PlaygroundSlotId) => void;
  onChange: (id: PlaygroundSlotId, slug: string | null) => void;
  /**
   * Cap the vertical list and scroll it, so the rail never grows tall enough to
   * push the sidebar's tab panel below the fold (builder sidebar).
   */
  fill?: boolean;
}

/**
 * The page's sections in render order. Horizontal scroller on small screens,
 * vertical list beside the canvas from `lg` up - one component, two layouts,
 * so the two can't drift apart.
 */
export function SlotRail({
  resolved,
  components,
  variationsBySlot,
  activeSlotId,
  onSelectSlot,
  onChange,
  fill = false,
}: SlotRailProps) {
  const t = useTranslations('components');
  const bySlug = useMemo(() => new Map(components.map((c) => [c.slug, c])), [components]);

  // Sections currently included in the page (a non-null resolved slug).
  const includedCount = PLAYGROUND_SLOTS.filter((slot) => resolved[slot.id] !== null).length;

  return (
    <div
      data-tour="slots"
      className="rounded-xl border border-border bg-card p-1.5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2 px-2.5 pb-2 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t('playground.rail.title')}
        </p>
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
          {includedCount}
        </span>
      </div>
      <ul
        className={cn(
          '-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:px-0 lg:pb-0',
          fill ? 'lg:max-h-[15rem] lg:overflow-y-auto' : 'lg:overflow-visible',
        )}
      >
        {PLAYGROUND_SLOTS.map((slot) => {
          const slug = resolved[slot.id];
          const selection = slug !== null ? bySlug.get(slug) : undefined;
          const firstAvailable = variationsBySlot.get(slot.id)?.[0]?.slug;
          const active = slot.id === activeSlotId;
          const slotLabel = t(`playground.slots.${slot.id}`);

          return (
            <li
              key={slot.id}
              className={cn(
                'group/slot flex shrink-0 items-stretch gap-0.5 rounded-lg transition-colors lg:w-full',
                active ? 'bg-primary shadow-sm' : 'hover:bg-muted',
              )}
            >
              <button
                type="button"
                onClick={() => onSelectSlot(slot.id)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
                  active ? 'focus-visible:ring-primary-foreground/40' : 'focus-visible:ring-ring',
                )}
              >
                <span
                  className={cn(
                    'text-[13px] font-semibold leading-tight',
                    active ? 'text-primary-foreground' : 'text-foreground',
                  )}
                >
                  {slotLabel}
                </span>
                <span
                  className={cn(
                    'max-w-36 truncate text-[11px] leading-tight lg:max-w-full',
                    active
                      ? cn('text-primary-foreground/75', !selection && 'italic')
                      : selection
                        ? 'text-muted-foreground'
                        : 'italic text-muted-foreground/60',
                  )}
                >
                  {selection?.title ?? t('playground.rail.empty')}
                </span>
              </button>

              {!slot.required &&
                (selection ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t('playground.rail.remove', { slot: slotLabel })}
                    title={t('playground.rail.remove', { slot: slotLabel })}
                    onClick={() => onChange(slot.id, null)}
                    className={cn(
                      'my-1 mr-1 h-7 w-7 shrink-0 self-center rounded-md',
                      active
                        ? 'text-primary-foreground/70 hover:bg-primary-foreground/15 hover:text-primary-foreground'
                        : 'text-muted-foreground opacity-60 hover:bg-background hover:text-foreground group-hover/slot:opacity-100',
                    )}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t('playground.rail.add', { slot: slotLabel })}
                    title={t('playground.rail.add', { slot: slotLabel })}
                    onClick={() => firstAvailable && onChange(slot.id, firstAvailable)}
                    disabled={!firstAvailable}
                    className={cn(
                      'my-1 mr-1 h-7 w-7 shrink-0 self-center rounded-md',
                      active
                        ? 'text-primary-foreground/70 hover:bg-primary-foreground/15 hover:text-primary-foreground'
                        : 'text-muted-foreground opacity-60 hover:bg-background hover:text-foreground group-hover/slot:opacity-100',
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
