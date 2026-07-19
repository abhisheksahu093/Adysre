'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw, BookmarkPlus, BookmarkCheck, Download, ImageDown } from 'lucide-react';
import { Button, Dialog, cn } from '@adysre/ui';
import { type Icon, similarIcons } from '@/data/icons';
import { useIconsStore } from '@/stores/icons-store';
import { downloadIconSvg, downloadIconPng } from '@/lib/icons/download';
import { ICON_SIZES, DEFAULT_ICON_STYLE, type IconStyle } from '@/lib/icons/svg';
import { IconGlyph } from './icon-glyph';
import { IconCode } from './icon-code';

interface IconQuickViewProps {
  icon: Icon | null;
  onClose: () => void;
  onOpenIcon: (icon: Icon) => void;
}

/**
 * The icon editor: a live preview with colour, weight, size and fill controls,
 * every copy format, SVG + multi-size PNG download, and a similar-icons grid to
 * keep browsing. Every knob feeds the same preview and the exported code.
 */
export function IconQuickView({ icon, onClose, onOpenIcon }: IconQuickViewProps) {
  const t = useTranslations('icons');
  const tCommon = useTranslations('common');
  const savedIcons = useIconsStore((s) => s.savedIcons);
  const toggleSave = useIconsStore((s) => s.toggleSave);
  const globalStroke = useIconsStore((s) => s.stroke);

  const [style, setStyle] = useState<IconStyle>(DEFAULT_ICON_STYLE);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!icon) return;
    setStyle({ ...DEFAULT_ICON_STYLE, stroke: globalStroke });
  }, [icon, globalStroke]);

  if (!icon) return null;

  const saved = savedIcons.includes(icon.name);
  const usesThemeColor = style.color === 'currentColor';
  const similar = similarIcons(icon, 12);

  const set = (patch: Partial<IconStyle>) => setStyle((s) => ({ ...s, ...patch }));
  const reset = () => setStyle({ ...DEFAULT_ICON_STYLE, stroke: globalStroke });

  /** A concrete colour for raster export: what the eye sees in the preview. */
  const resolvedColor = () => {
    if (!usesThemeColor) return style.color;
    const el = previewRef.current?.querySelector('svg');
    return el ? getComputedStyle(el).color : '#0f172a';
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={icon.title}
      description={t(`categories.${icon.category}`)}
      className="sm:max-w-2xl"
    >
      <div className="space-y-5">
        {/* Live preview */}
        <div
          ref={previewRef}
          data-tour="quickview-preview"
          className="icon-checker flex items-center justify-center rounded-lg border border-border py-10"
        >
          <IconGlyph
            body={icon.body}
            size={Math.min(96, Math.max(48, style.size * 2))}
            color={style.color}
            stroke={style.stroke}
            filled={style.filled}
            label={icon.title}
          />
        </div>

        {/* Style controls */}
        <div data-tour="quickview-controls" className="grid gap-4 sm:grid-cols-2">
          {/* Colour */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('quickView.colour')}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={usesThemeColor}
                onClick={() => set({ color: 'currentColor' })}
                className={cn(
                  'rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  usesThemeColor
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {t('quickView.themeColour')}
              </button>
              <label className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-border">
                <input
                  type="color"
                  value={usesThemeColor ? '#38bdf8' : style.color}
                  onChange={(e) => set({ color: e.target.value })}
                  aria-label={t('quickView.customColour')}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <span
                  className="block h-full w-full"
                  style={{ backgroundColor: usesThemeColor ? 'transparent' : style.color }}
                  aria-hidden
                />
              </label>
              {!usesThemeColor && (
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  {style.color.replace('#', '')}
                </span>
              )}
            </div>
          </div>

          {/* Fill */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('quickView.style')}
            </p>
            <div role="group" className="flex gap-1 rounded-lg bg-muted p-1">
              {([false, true] as const).map((filled) => (
                <button
                  key={String(filled)}
                  type="button"
                  aria-pressed={style.filled === filled}
                  onClick={() => set({ filled })}
                  className={cn(
                    'flex-1 rounded-md px-3 py-1 text-xs font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    style.filled === filled
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t(filled ? 'quickView.filled' : 'quickView.outline')}
                </button>
              ))}
            </div>
          </div>

          {/* Stroke */}
          <label className={cn('space-y-1.5', style.filled && 'pointer-events-none opacity-40')}>
            <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('quickView.weight')}
              <span className="tabular-nums text-foreground">{style.stroke.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.25}
              value={style.stroke}
              disabled={style.filled}
              onChange={(e) => set({ stroke: Number(e.target.value) })}
              className="h-1.5 w-full accent-primary"
              aria-label={t('quickView.weight')}
            />
          </label>

          {/* Size */}
          <label className="space-y-1.5">
            <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('quickView.size')}
              <span className="tabular-nums text-foreground">{style.size}px</span>
            </span>
            <input
              type="range"
              min={16}
              max={128}
              step={4}
              value={style.size}
              onChange={(e) => set({ size: Number(e.target.value) })}
              className="h-1.5 w-full accent-primary"
              aria-label={t('quickView.size')}
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-muted-foreground">
            <RotateCcw className="h-4 w-4" aria-hidden />
            {tCommon('reset')}
          </Button>
          <Button
            type="button"
            variant={saved ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => toggleSave(icon.name)}
            className="gap-1.5"
          >
            {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden /> : <BookmarkPlus className="h-4 w-4" aria-hidden />}
            {saved ? t('quickView.saved') : t('quickView.save')}
          </Button>
          <div className="ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => downloadIconSvg(icon.name, icon.body, style)}
              className="gap-1.5"
            >
              <Download className="h-4 w-4" aria-hidden />
              {t('quickView.downloadSvg')}
            </Button>
          </div>
        </div>

        {/* PNG sizes */}
        <div data-tour="quickview-download" className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ImageDown className="h-3.5 w-3.5" aria-hidden />
            {t('quickView.downloadPng')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ICON_SIZES.map((px) => (
              <button
                key={px}
                type="button"
                onClick={() => void downloadIconPng(icon.name, icon.body, { ...style, color: resolvedColor() }, px)}
                className="rounded-md border border-border px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {px}
              </button>
            ))}
          </div>
        </div>

        {/* Code */}
        <div data-tour="quickview-code" className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('code.title')}
          </p>
          <IconCode icon={icon} style={style} />
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div data-tour="quickview-similar" className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('quickView.similar')}
            </p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {similar.map((i) => (
                <button
                  key={i.name}
                  type="button"
                  onClick={() => onOpenIcon(i)}
                  title={i.title}
                  aria-label={i.title}
                  className="flex aspect-square items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <IconGlyph body={i.body} size={22} stroke={globalStroke} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
