'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy, Lock, LockOpen, Shuffle, RotateCcw, ImageDown, BookmarkPlus } from 'lucide-react';
import { Button } from 'adysre';
import { PALETTES, similarPalettes, type Palette } from '@/data/palettes';
import { harmony, hslToHex, readableText } from '@/lib/palettes/color';
import { downloadPalettePng } from '@/lib/palettes/export';
import { usePalettesStore } from '@/stores/palettes-store';
import { useClipboard } from '@/hooks/use-clipboard';
import { PaletteCodeDialog } from './palette-code-dialog';

interface QuickViewProps {
  palette: Palette | null;
  onClose: () => void;
  onOpenPalette: (palette: Palette) => void;
}

/** Random-but-pleasant seed colour for shuffling unlocked swatches. */
function randomHarmony(count: number): string[] {
  const base = hslToHex({ h: Math.random() * 360, s: 52 + Math.random() * 30, l: 46 + Math.random() * 14 });
  const schemes = ['analogous', 'complementary', 'triadic'] as const;
  const scheme = schemes[Math.floor(Math.random() * schemes.length)] ?? 'analogous';
  return harmony(base, scheme, count);
}

export function PaletteQuickView({ palette, onClose, onOpenPalette }: QuickViewProps) {
  const t = useTranslations('palettes');
  const tCommon = useTranslations('common');
  const savePalette = usePalettesStore((s) => s.savePalette);
  const { copy } = useClipboard();

  const [colors, setColors] = useState<string[]>([]);
  const [locked, setLocked] = useState<boolean[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!palette) return;
    setColors(palette.colors);
    setLocked(palette.colors.map(() => false));
    setSaved(false);
  }, [palette]);

  if (!palette) return null;

  const setColor = (i: number, hex: string) => setColors((cs) => cs.map((c, idx) => (idx === i ? hex : c)));
  const toggleLock = (i: number) => setLocked((ls) => ls.map((l, idx) => (idx === i ? !l : l)));
  const shuffle = () => {
    const fresh = randomHarmony(colors.length);
    setColors((cs) => cs.map((c, i) => (locked[i] ? c : (fresh[i] ?? c))));
  };
  const reset = () => {
    setColors(palette.colors);
    setLocked(palette.colors.map(() => false));
  };
  const copyOne = (hex: string, i: number) => {
    void copy(hex);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex((v) => (v === i ? null : v)), 1200);
  };
  const save = () => {
    savePalette({
      id: `user-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      name: palette.name,
      colors,
      tags: palette.tags,
      likes: 0,
    });
    setSaved(true);
  };

  const similar = similarPalettes(palette, [...PALETTES], 6);

  return (
    <PaletteCodeDialog
      open={palette !== null}
      onClose={onClose}
      title={palette.name}
      colors={colors}
      name={palette.name}
    >
      {/* Editable swatches */}
      <div data-tour="quickview-swatches" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {colors.map((hex, i) => {
          const ink = readableText(hex);
          const copied = copiedIndex === i;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg border border-border"
              style={{ backgroundColor: hex }}
            >
              <input
                type="color"
                value={hex}
                onChange={(e) => setColor(i, e.target.value)}
                aria-label={t('quickView.editColor', { index: i + 1 })}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <div className="pointer-events-none relative flex h-24 flex-col justify-between p-2" style={{ color: ink }}>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => toggleLock(i)}
                    aria-pressed={locked[i]}
                    aria-label={locked[i] ? t('quickView.unlock') : t('quickView.lock')}
                    title={locked[i] ? t('quickView.unlock') : t('quickView.lock')}
                    className="pointer-events-auto rounded-md p-1 hover:bg-black/10"
                    style={{ color: ink }}
                  >
                    {locked[i] ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => copyOne(hex, i)}
                  aria-label={t('card.copyColor', { hex })}
                  className="pointer-events-auto flex items-center gap-1 self-start rounded-md px-1 py-0.5 text-xs font-semibold uppercase tracking-wide hover:bg-black/10"
                  style={{ color: ink }}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? tCommon('copied') : hex.replace('#', '')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => downloadPalettePng(colors, palette.name)}
            className="gap-1.5"
          >
            <ImageDown className="h-4 w-4" aria-hidden />
            {t('quickView.downloadImage')}
          </Button>
          <Button type="button" size="sm" onClick={save} className="gap-1.5">
            {saved ? <Check className="h-4 w-4" aria-hidden /> : <BookmarkPlus className="h-4 w-4" aria-hidden />}
            {saved ? t('quickView.saved') : t('quickView.save')}
          </Button>
        </div>
      </div>

      {/* Explore similar */}
      {similar.length > 0 && (
        <div data-tour="quickview-similar" className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('quickView.similar')}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {similar.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenPalette(p)}
                title={p.name}
                className="group overflow-hidden rounded-lg border border-border text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex h-8">
                  {p.colors.map((c, i) => (
                    <span key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span className="block truncate px-2 py-1 text-xs">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </PaletteCodeDialog>
  );
}
