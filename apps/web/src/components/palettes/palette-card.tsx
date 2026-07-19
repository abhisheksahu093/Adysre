'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy, Maximize2 } from 'lucide-react';
import { cn } from '@adysre/ui';
import type { Palette } from '@/data/palettes';
import { readableText } from '@/lib/palettes/color';
import { useClipboard } from '@/hooks/use-clipboard';
import { LikeButton } from '@/components/like-button';

interface PaletteCardProps {
  palette: Palette;
  onOpen: (palette: Palette) => void;
}

/**
 * A palette in the grid: a strip of colours (click any to copy its hex) with a
 * footer to open the quick view or copy the whole set.
 */
export function PaletteCard({ palette, onOpen }: PaletteCardProps) {
  const t = useTranslations('palettes');
  const tCommon = useTranslations('common');
  const { copy } = useClipboard();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copyOne = (hex: string, index: number) => {
    void copy(hex);
    setCopiedIndex(index);
    clearTimeout(resetRef.current);
    resetRef.current = setTimeout(() => setCopiedIndex(null), 1200);
  };

  const copyAll = () => {
    void copy(palette.colors.join(', '));
    setCopiedAll(true);
    clearTimeout(resetRef.current);
    resetRef.current = setTimeout(() => setCopiedAll(false), 1200);
  };

  return (
    <div className="group/card overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-28 sm:h-32" role="group" aria-label={t('card.swatches', { name: palette.name })}>
        {palette.colors.map((hex, i) => {
          const copied = copiedIndex === i;
          return (
            <button
              key={`${hex}-${i}`}
              type="button"
              onClick={() => copyOne(hex, i)}
              title={t('card.copyColor', { hex })}
              aria-label={t('card.copyColor', { hex })}
              className="group/swatch relative flex-1 transition-[flex] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              style={{ backgroundColor: hex }}
            >
              <span
                className={cn(
                  'absolute inset-x-0 bottom-1.5 flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide transition-opacity',
                  copied
                    ? 'opacity-100'
                    : 'opacity-0 group-hover/swatch:opacity-100 group-focus-visible/swatch:opacity-100',
                )}
                style={{ color: readableText(hex) }}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? tCommon('copied') : hex.replace('#', '')}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={() => onOpen(palette)}
          className="min-w-0 flex-1 truncate text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {palette.name}
        </button>
        <LikeButton
          id={palette.id}
          baseLikes={palette.likes}
          label={t('card.like', { name: palette.name })}
        />
        <button
          type="button"
          onClick={copyAll}
          title={t('card.copyAll')}
          aria-label={t('card.copyAll')}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => onOpen(palette)}
          title={t('card.open')}
          aria-label={t('card.open', { name: palette.name })}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
