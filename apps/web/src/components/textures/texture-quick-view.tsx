'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Shuffle, RotateCcw, ImageDown, BookmarkPlus, Check } from 'lucide-react';
import { Button, Dialog, cn } from 'adysre';
import { TEXTURES, similarTextures, type Texture, type TextureType } from '@/data/textures';
import { textureToStyle, downloadTexturePng, TEXTURE_TYPES } from '@/lib/textures/css';
import { hslToHex } from '@/lib/palettes/color';
import { useTexturesStore } from '@/stores/textures-store';
import { TextureCode } from './texture-code';

interface QuickViewProps {
  texture: Texture | null;
  onClose: () => void;
  onOpenTexture: (texture: Texture) => void;
}

export function TextureQuickView({ texture, onClose, onOpenTexture }: QuickViewProps) {
  const t = useTranslations('textures');
  const tCommon = useTranslations('common');
  const saveTexture = useTexturesStore((s) => s.saveTexture);

  const [type, setType] = useState<TextureType>('noise');
  const [fg, setFg] = useState('#0f172a');
  const [bg, setBg] = useState('#f8fafc');
  const [opacity, setOpacity] = useState(40);
  const [scale, setScale] = useState(120);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!texture) return;
    setType(texture.type);
    setFg(texture.fg);
    setBg(texture.bg);
    setOpacity(texture.opacity);
    setScale(texture.scale);
    setSaved(false);
  }, [texture]);

  if (!texture) return null;

  const current: Texture = { ...texture, type, fg, bg, opacity, scale };

  const shuffle = () =>
    setFg(hslToHex({ h: Math.random() * 360, s: 45 + Math.random() * 35, l: 38 + Math.random() * 18 }));
  const reset = () => {
    setType(texture.type);
    setFg(texture.fg);
    setBg(texture.bg);
    setOpacity(texture.opacity);
    setScale(texture.scale);
  };
  const save = () => {
    saveTexture({ ...current, id: `user-${Date.now()}-${Math.floor(Math.random() * 1e6)}`, likes: 0 });
    setSaved(true);
  };

  const similar = similarTextures(texture, [...TEXTURES], 6);

  const swatch = (hex: string, onChange: (v: string) => void, label: string) => (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      {label}
      <span className="relative h-8 w-8 overflow-hidden rounded-md border border-border">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <span className="block h-full w-full" style={{ backgroundColor: hex }} aria-hidden />
      </span>
      <span className="w-14 font-mono uppercase text-foreground">{hex.replace('#', '')}</span>
    </label>
  );

  return (
    <Dialog open={texture !== null} onClose={onClose} title={texture.name} className="sm:max-w-2xl">
      <div className="space-y-5">
        <div
          data-tour="quickview-preview"
          className="h-40 w-full rounded-lg border border-border sm:h-48"
          style={textureToStyle(current)}
          aria-label={t('quickView.preview')}
          role="img"
        />

        <div data-tour="quickview-controls" className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label={t('quickView.type')} className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            {TEXTURE_TYPES.map((ty) => (
              <button
                key={ty}
                type="button"
                aria-pressed={type === ty}
                onClick={() => setType(ty)}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  type === ty ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t(`quickView.types.${ty}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {swatch(fg, setFg, t('quickView.foreground'))}
          {swatch(bg, setBg, t('quickView.background'))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex min-w-40 flex-1 items-center gap-2 text-xs text-muted-foreground">
            {t('quickView.opacity')}
            <input
              type="range"
              min={5}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="h-1.5 flex-1 accent-primary"
              aria-label={t('quickView.opacity')}
            />
            <span className="w-9 tabular-nums text-foreground">{opacity}%</span>
          </label>
          <label className="flex min-w-40 flex-1 items-center gap-2 text-xs text-muted-foreground">
            {t('quickView.scale')}
            <input
              type="range"
              min={16}
              max={200}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="h-1.5 flex-1 accent-primary"
              aria-label={t('quickView.scale')}
            />
            <span className="w-11 tabular-nums text-foreground">{scale}px</span>
          </label>
        </div>

        <div data-tour="quickview-actions" className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={shuffle} className="gap-1.5">
            <Shuffle className="h-4 w-4" aria-hidden />
            {t('quickView.shuffle')}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-muted-foreground">
            <RotateCcw className="h-4 w-4" aria-hidden />
            {tCommon('reset')}
          </Button>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => downloadTexturePng(current)} className="gap-1.5">
              <ImageDown className="h-4 w-4" aria-hidden />
              {t('quickView.downloadImage')}
            </Button>
            <Button type="button" size="sm" onClick={save} className="gap-1.5">
              {saved ? <Check className="h-4 w-4" aria-hidden /> : <BookmarkPlus className="h-4 w-4" aria-hidden />}
              {saved ? t('quickView.saved') : t('quickView.save')}
            </Button>
          </div>
        </div>

        <div data-tour="quickview-code" className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('code.title')}</p>
          <TextureCode texture={current} />
        </div>

        {similar.length > 0 && (
          <div data-tour="quickview-similar" className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('quickView.similar')}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {similar.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => onOpenTexture(x)}
                  title={x.name}
                  className="group overflow-hidden rounded-lg border border-border text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="block h-10" style={textureToStyle(x)} aria-hidden />
                  <span className="block truncate px-2 py-1 text-xs">{x.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
