'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy, Maximize2 } from 'lucide-react';
import { cn } from '@adysre/ui';
import type { Texture } from '@/data/textures';
import { textureToStyle, formatTexture } from '@/lib/textures/css';
import { useClipboard } from '@/hooks/use-clipboard';
import { LikeButton } from '@/components/like-button';

interface TextureCardProps {
  texture: Texture;
  onOpen: (texture: Texture) => void;
}

/** A texture in the grid: a large surface swatch (click to open) with copy in the footer. */
export function TextureCard({ texture, onOpen }: TextureCardProps) {
  const t = useTranslations('textures');
  const tCommon = useTranslations('common');
  const { copy } = useClipboard();
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copyCss = () => {
    void copy(formatTexture(texture, 'css'));
    setCopied(true);
    clearTimeout(resetRef.current);
    resetRef.current = setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="group/card overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => onOpen(texture)}
        aria-label={t('card.open', { name: texture.name })}
        className="relative block h-36 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:h-40"
        style={textureToStyle(texture)}
      >
        <span
          className={cn(
            'pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity',
            'group-hover/card:opacity-100',
          )}
        >
          <Maximize2 className="h-3 w-3" aria-hidden />
          {t('card.edit')}
        </span>
      </button>

      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={() => onOpen(texture)}
          className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="block truncate text-sm font-semibold">{texture.name}</span>
          <span className="block text-[11px] capitalize text-muted-foreground">{texture.type}</span>
        </button>
        <LikeButton id={texture.id} baseLikes={texture.likes} label={t('card.like', { name: texture.name })} />
        <button
          type="button"
          onClick={copyCss}
          title={t('card.copyCss')}
          aria-label={t('card.copyCss')}
          className="flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? tCommon('copied') : 'CSS'}
        </button>
      </div>
    </div>
  );
}
