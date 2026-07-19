'use client';

import { useTranslations } from 'next-intl';
import { Check, Trash2 } from 'lucide-react';
import { Button, cn } from '@adysre/ui';
import type { LocalizedComponent } from '@/data/components';
import type { PlaygroundSlot, PlaygroundSlotId } from '@/data/playground';

interface VariationPickerProps {
  slot: PlaygroundSlot;
  variations: LocalizedComponent[];
  /** Slug currently filling the slot, or `null` when the section is removed. */
  selected: string | null;
  onChange: (id: PlaygroundSlotId, slug: string | null) => void;
  /**
   * Render to fill a height-constrained parent (the builder sidebar tab): drop
   * the card chrome and let the list flex and scroll inside the tab panel
   * instead of the panel's own fixed max-height.
   */
  fill?: boolean;
}

/** Every library variation that can fill the active slot; click to apply. */
export function VariationPicker({
  slot,
  variations,
  selected,
  onChange,
  fill = false,
}: VariationPickerProps) {
  const t = useTranslations('components');
  const slotLabel = t(`playground.slots.${slot.id}`);

  return (
    <div
      data-tour="variations"
      className={cn(
        'bg-card',
        fill ? 'flex min-h-0 flex-1 flex-col' : 'rounded-xl border border-border p-1.5 shadow-sm',
      )}
    >
      <div className="flex items-center justify-between gap-2 px-2.5 pb-2 pt-2">
        <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t('playground.variations.of', { slot: slotLabel })}
        </p>
        <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
          {variations.length}
        </span>
      </div>

      {variations.length === 0 ? (
        <p className="px-2.5 pb-2 text-xs text-muted-foreground">
          {t('playground.variations.empty')}
        </p>
      ) : (
        <ul
          className={cn(
            '-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:px-0 lg:pb-0',
            fill
              ? 'lg:min-h-0 lg:flex-1 lg:overflow-y-auto'
              : 'lg:max-h-72 lg:overflow-y-auto',
          )}
        >
          {variations.map((variation) => {
            const isSelected = variation.slug === selected;
            return (
              <li key={variation.slug} className="shrink-0 lg:w-full">
                <button
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={t('playground.variations.select', { title: variation.title })}
                  onClick={() => onChange(slot.id, variation.slug)}
                  className={cn(
                    'flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
                    isSelected
                      ? 'bg-primary shadow-sm focus-visible:ring-primary-foreground/40'
                      : 'hover:bg-muted focus-visible:ring-ring',
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center gap-1.5 text-[13px] font-semibold leading-tight',
                      isSelected ? 'text-primary-foreground' : 'text-foreground',
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                    <span className="max-w-40 truncate lg:max-w-full">{variation.title}</span>
                  </span>
                  <span
                    className={cn(
                      'text-[11px] leading-tight',
                      isSelected ? 'text-primary-foreground/75' : 'text-muted-foreground',
                    )}
                  >
                    {t(`difficulty.${variation.difficulty}`)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!slot.required && selected !== null && (
        <div className="mt-1 border-t border-border px-1 pb-0.5 pt-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(slot.id, null)}
            className="h-auto w-full justify-start gap-1.5 rounded-md py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            {t('playground.rail.remove', { slot: slotLabel })}
          </Button>
        </div>
      )}
    </div>
  );
}
