'use client';

import { memo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy } from 'lucide-react';
import { cn } from '@adysre/ui';
import type { Icon } from '@/data/icons';
import { useClipboard } from '@/hooks/use-clipboard';
import { buildSvgMarkup, DEFAULT_ICON_STYLE } from '@/lib/icons/svg';
import { useIconsStore } from '@/stores/icons-store';
import { IconGlyph } from './icon-glyph';

interface IconCardProps {
  icon: Icon;
  onOpen: (icon: Icon) => void;
}

/**
 * One icon in the grid: a large glyph (click to open) with a quick SVG copy.
 *
 * Memoised, and the glyph's weight rides the `--icon-stroke` CSS variable set on
 * the grid container - so dragging the global weight slider restyles all 298
 * icons with zero React re-renders. The current weight is read non-reactively at
 * copy time so the card never subscribes to it.
 */
export const IconCard = memo(function IconCard({ icon, onOpen }: IconCardProps) {
  const t = useTranslations('icons');
  const tCommon = useTranslations('common');
  const { copy } = useClipboard();
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copySvg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const stroke = useIconsStore.getState().stroke;
    void copy(buildSvgMarkup(icon.body, { ...DEFAULT_ICON_STYLE, stroke }));
    setCopied(true);
    clearTimeout(resetRef.current);
    resetRef.current = setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className="group/card relative flex flex-col items-center overflow-hidden rounded-xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
      // Off-screen cards skip layout & paint until scrolled near - keeps the
      // ~300-icon grid cheap. The reserved size avoids scrollbar jump.
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 112px' }}
    >
      <button
        type="button"
        onClick={() => onOpen(icon)}
        aria-label={t('card.open', { name: icon.title })}
        className="flex aspect-square w-full items-center justify-center rounded-lg text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring group-hover/card:text-primary"
      >
        <IconGlyph body={icon.body} size={32} strokeVar />
      </button>
      <span className="mt-2 w-full truncate text-center text-[11px] text-muted-foreground" title={icon.title}>
        {icon.title}
      </span>

      <button
        type="button"
        onClick={copySvg}
        title={t('card.copySvg')}
        aria-label={t('card.copySvg')}
        className={cn(
          'absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-card/90 text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all',
          'hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'group-hover/card:opacity-100',
          copied && 'text-primary opacity-100',
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="sr-only">{copied ? tCommon('copied') : tCommon('copy')}</span>
      </button>
    </div>
  );
});
