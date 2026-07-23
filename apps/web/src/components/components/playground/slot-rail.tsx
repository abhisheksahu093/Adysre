'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { GripVertical, Plus, Minus } from 'lucide-react';
import { Button, cn } from 'adysre';
import type { LocalizedComponent } from '@/data/components';
import {
  PLAYGROUND_SLOTS,
  isSiteSlot,
  type PlaygroundSlot,
  type PlaygroundSlotId,
} from '@/data/playground';
import { useActiveOrder, usePlaygroundStore } from '@/stores/playground-store';

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
 *
 * Body sections are draggable: this rail IS the page's running order, so
 * rearranging here is the most direct way to say "put the pricing above the
 * about". Reordering is also on the keyboard (Ctrl/⌘ + arrows) - drag-and-drop
 * alone would put page structure out of reach for anyone not using a mouse.
 *
 * Header and footer are the SITE's, shared by every page, so they are pinned
 * top and bottom and cannot be dragged into the middle of one page's body.
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

  const order = useActiveOrder();
  const moveSection = usePlaygroundStore((s) => s.moveSection);
  /** Index being dragged, and the gap it is hovering over. */
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const bySlot = useMemo(() => new Map(PLAYGROUND_SLOTS.map((slot) => [slot.id, slot])), []);
  const header = PLAYGROUND_SLOTS.find((slot) => slot.id === 'header');
  const footer = PLAYGROUND_SLOTS.find((slot) => slot.id === 'footer');
  const body = order
    .map((id) => bySlot.get(id))
    .filter((slot): slot is PlaygroundSlot => slot !== undefined);

  // Sections currently included in the page (a non-null resolved slug).
  const includedCount = PLAYGROUND_SLOTS.filter((slot) => resolved[slot.id] !== null).length;

  const endDrag = (): void => {
    setDragFrom(null);
    setDragOver(null);
  };

  const drop = (to: number): void => {
    if (dragFrom !== null) moveSection(dragFrom, to);
    endDrag();
  };

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
        {[header, ...body, footer]
          .filter((slot): slot is PlaygroundSlot => slot !== undefined)
          .map((slot) => {
          const slug = resolved[slot.id];
          const selection = slug !== null ? bySlug.get(slug) : undefined;
          const firstAvailable = variationsBySlot.get(slot.id)?.[0]?.slug;
          const active = slot.id === activeSlotId;
          const slotLabel = t(`playground.slots.${slot.id}`);
          // Only body sections move; the shared chrome is pinned.
          const index = isSiteSlot(slot.id) ? -1 : body.indexOf(slot);
          const movable = index !== -1;

          return (
            <li
              key={slot.id}
              draggable={movable}
              onDragStart={movable ? () => setDragFrom(index) : undefined}
              onDragEnd={endDrag}
              onDragOver={
                movable
                  ? (event) => {
                      // Without preventDefault the browser refuses the drop.
                      event.preventDefault();
                      setDragOver(index);
                    }
                  : undefined
              }
              onDrop={movable ? () => drop(index) : undefined}
              className={cn(
                'group/slot flex shrink-0 items-stretch gap-0.5 rounded-lg transition-colors lg:w-full',
                active ? 'bg-primary shadow-sm' : 'hover:bg-muted',
                movable && dragFrom === index && 'opacity-40',
                movable &&
                  dragOver === index &&
                  dragFrom !== index &&
                  'ring-2 ring-inset ring-primary/60',
              )}
            >
              {movable && (
                <span
                  aria-hidden
                  title={t('playground.rail.reorder')}
                  className={cn(
                    'flex w-4 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing',
                    active ? 'text-primary-foreground/50' : 'text-muted-foreground/40',
                  )}
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
              )}
              <button
                type="button"
                onClick={() => onSelectSlot(slot.id)}
                aria-current={active ? 'true' : undefined}
                onKeyDown={(event) => {
                  // Ctrl/Cmd + arrows reorder; bare arrows stay with the browser
                  // so the list can still be read through.
                  if (!movable || !(event.metaKey || event.ctrlKey)) return;
                  const delta =
                    event.key === 'ArrowUp' || event.key === 'ArrowLeft'
                      ? -1
                      : event.key === 'ArrowDown' || event.key === 'ArrowRight'
                        ? 1
                        : 0;
                  if (delta === 0) return;
                  event.preventDefault();
                  moveSection(index, index + delta);
                }}
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
