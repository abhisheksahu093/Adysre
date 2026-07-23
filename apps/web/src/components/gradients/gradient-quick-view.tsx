'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Shuffle, RotateCcw, ImageDown, BookmarkPlus, Check, Plus, Trash2 } from 'lucide-react';
import { Button, Dialog, cn } from 'adysre';
import { GRADIENTS, similarGradients, type Gradient, type GradientStop, type GradientType } from '@/data/gradients';
import { gradientToCss, downloadGradientPng } from '@/lib/gradients/css';
import { harmony, hslToHex } from '@/lib/palettes/color';
import { useGradientsStore } from '@/stores/gradients-store';
import { GradientCode } from './gradient-code';

interface QuickViewProps {
  gradient: Gradient | null;
  onClose: () => void;
  onOpenGradient: (gradient: Gradient) => void;
}

const TYPES: GradientType[] = ['linear', 'radial', 'conic'];

function evenStops(colors: string[]): GradientStop[] {
  const n = colors.length;
  return colors.map((color, i) => ({ color, position: n <= 1 ? 0 : Math.round((i * 100) / (n - 1)) }));
}

function randomStops(count: number): GradientStop[] {
  const base = hslToHex({ h: Math.random() * 360, s: 62 + Math.random() * 28, l: 52 + Math.random() * 12 });
  const schemes = ['analogous', 'complementary', 'triadic'] as const;
  const scheme = schemes[Math.floor(Math.random() * schemes.length)] ?? 'analogous';
  return evenStops(harmony(base, scheme, count));
}

export function GradientQuickView({ gradient, onClose, onOpenGradient }: QuickViewProps) {
  const t = useTranslations('gradients');
  const tCommon = useTranslations('common');
  const saveGradient = useGradientsStore((s) => s.saveGradient);

  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<GradientStop[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!gradient) return;
    setType(gradient.type);
    setAngle(gradient.angle);
    setStops(gradient.stops);
    setSaved(false);
  }, [gradient]);

  if (!gradient) return null;

  const current: Gradient = { ...gradient, type, angle, stops };
  const css = gradientToCss(current);

  const setStopColor = (i: number, color: string) =>
    setStops((ss) => ss.map((s, idx) => (idx === i ? { ...s, color } : s)));
  const setStopPos = (i: number, position: number) =>
    setStops((ss) => ss.map((s, idx) => (idx === i ? { ...s, position } : s)));
  const addStop = () => setStops((ss) => evenStops([...ss.map((s) => s.color), ss[ss.length - 1]?.color ?? '#ffffff']));
  const removeStop = (i: number) =>
    setStops((ss) => (ss.length <= 2 ? ss : evenStops(ss.filter((_, idx) => idx !== i).map((s) => s.color))));
  const shuffle = () => setStops(randomStops(stops.length));
  const reset = () => {
    setType(gradient.type);
    setAngle(gradient.angle);
    setStops(gradient.stops);
  };
  const save = () => {
    saveGradient({
      ...current,
      id: `user-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      likes: 0,
    });
    setSaved(true);
  };

  const similar = similarGradients(gradient, [...GRADIENTS], 6);

  return (
    <Dialog open={gradient !== null} onClose={onClose} title={gradient.name} className="sm:max-w-2xl">
      <div className="space-y-5">
        {/* Live preview */}
        <div
          data-tour="quickview-preview"
          className="h-40 w-full rounded-lg border border-border sm:h-48"
          style={{ backgroundImage: css }}
          aria-label={t('quickView.preview')}
          role="img"
        />

        {/* Type + angle */}
        <div data-tour="quickview-controls" className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label={t('quickView.type')} className="flex gap-1 rounded-lg bg-muted p-1">
            {TYPES.map((ty) => (
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
          {type !== 'radial' && (
            <label className="flex min-w-40 flex-1 items-center gap-2 text-xs text-muted-foreground">
              {t('quickView.angle')}
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="h-1.5 flex-1 accent-primary"
                aria-label={t('quickView.angle')}
              />
              <span className="w-9 tabular-nums text-foreground">{angle}°</span>
            </label>
          )}
        </div>

        {/* Stops */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('quickView.stops')}
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={addStop} className="h-auto gap-1 py-1 text-xs">
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {t('quickView.addStop')}
            </Button>
          </div>
          <ul className="space-y-2">
            {stops.map((s, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-border">
                  <input
                    type="color"
                    value={s.color}
                    onChange={(e) => setStopColor(i, e.target.value)}
                    aria-label={t('quickView.editStop', { index: i + 1 })}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <span className="block h-full w-full" style={{ backgroundColor: s.color }} aria-hidden />
                </span>
                <span className="w-16 shrink-0 font-mono text-xs uppercase text-muted-foreground">
                  {s.color.replace('#', '')}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={s.position}
                  onChange={(e) => setStopPos(i, Number(e.target.value))}
                  className="h-1.5 flex-1 accent-primary"
                  aria-label={t('quickView.stopPosition', { index: i + 1 })}
                />
                <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {s.position}%
                </span>
                <button
                  type="button"
                  onClick={() => removeStop(i)}
                  disabled={stops.length <= 2}
                  aria-label={t('quickView.removeStop', { index: i + 1 })}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
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
            <Button type="button" variant="outline" size="sm" onClick={() => downloadGradientPng(current)} className="gap-1.5">
              <ImageDown className="h-4 w-4" aria-hidden />
              {t('quickView.downloadImage')}
            </Button>
            <Button type="button" size="sm" onClick={save} className="gap-1.5">
              {saved ? <Check className="h-4 w-4" aria-hidden /> : <BookmarkPlus className="h-4 w-4" aria-hidden />}
              {saved ? t('quickView.saved') : t('quickView.save')}
            </Button>
          </div>
        </div>

        {/* Code */}
        <div data-tour="quickview-code" className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('code.title')}
          </p>
          <GradientCode gradient={current} />
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div data-tour="quickview-similar" className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('quickView.similar')}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {similar.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onOpenGradient(g)}
                  title={g.name}
                  className="group overflow-hidden rounded-lg border border-border text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="block h-10" style={{ backgroundImage: gradientToCss(g) }} aria-hidden />
                  <span className="block truncate px-2 py-1 text-xs">{g.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
