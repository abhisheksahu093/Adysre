'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Shuffle, RotateCcw, ImageDown, BookmarkPlus, Check } from 'lucide-react';
import { Button, Dialog, cn } from 'adysre';
import { PATTERNS, similarPatterns, type Pattern, type PatternType } from '@/data/patterns';
import { patternToStyle, downloadPatternPng, PATTERN_TYPES } from '@/lib/patterns/css';
import { hslToHex } from '@/lib/palettes/color';
import { usePatternsStore } from '@/stores/patterns-store';
import { PatternCode } from './pattern-code';

interface QuickViewProps {
  pattern: Pattern | null;
  onClose: () => void;
  onOpenPattern: (pattern: Pattern) => void;
}

export function PatternQuickView({ pattern, onClose, onOpenPattern }: QuickViewProps) {
  const t = useTranslations('patterns');
  const tCommon = useTranslations('common');
  const savePattern = usePatternsStore((s) => s.savePattern);

  const [type, setType] = useState<PatternType>('dots');
  const [fg, setFg] = useState('#0f172a');
  const [bg, setBg] = useState('#f8fafc');
  const [size, setSize] = useState(22);
  const [angle, setAngle] = useState(45);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!pattern) return;
    setType(pattern.type);
    setFg(pattern.fg);
    setBg(pattern.bg);
    setSize(pattern.size);
    setAngle(pattern.angle);
    setSaved(false);
  }, [pattern]);

  if (!pattern) return null;

  const current: Pattern = { ...pattern, type, fg, bg, size, angle };

  const shuffle = () =>
    setFg(hslToHex({ h: Math.random() * 360, s: 55 + Math.random() * 35, l: 40 + Math.random() * 15 }));
  const reset = () => {
    setType(pattern.type);
    setFg(pattern.fg);
    setBg(pattern.bg);
    setSize(pattern.size);
    setAngle(pattern.angle);
  };
  const save = () => {
    savePattern({ ...current, id: `user-${Date.now()}-${Math.floor(Math.random() * 1e6)}`, likes: 0 });
    setSaved(true);
  };

  const similar = similarPatterns(pattern, [...PATTERNS], 6);

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
    <Dialog open={pattern !== null} onClose={onClose} title={pattern.name} className="sm:max-w-2xl">
      <div className="space-y-5">
        {/* Live preview */}
        <div
          data-tour="quickview-preview"
          className="h-40 w-full rounded-lg border border-border sm:h-48"
          style={patternToStyle(current)}
          aria-label={t('quickView.preview')}
          role="img"
        />

        {/* Type toggle */}
        <div data-tour="quickview-controls" className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label={t('quickView.type')} className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            {PATTERN_TYPES.map((ty) => (
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

        {/* Colours */}
        <div className="flex flex-wrap items-center gap-4">
          {swatch(fg, setFg, t('quickView.foreground'))}
          {swatch(bg, setBg, t('quickView.background'))}
        </div>

        {/* Size + angle */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex min-w-40 flex-1 items-center gap-2 text-xs text-muted-foreground">
            {t('quickView.size')}
            <input
              type="range"
              min={8}
              max={48}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="h-1.5 flex-1 accent-primary"
              aria-label={t('quickView.size')}
            />
            <span className="w-10 tabular-nums text-foreground">{size}px</span>
          </label>
          {type === 'lines' && (
            <label className="flex min-w-40 flex-1 items-center gap-2 text-xs text-muted-foreground">
              {t('quickView.angle')}
              <input
                type="range"
                min={0}
                max={180}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="h-1.5 flex-1 accent-primary"
                aria-label={t('quickView.angle')}
              />
              <span className="w-9 tabular-nums text-foreground">{angle}°</span>
            </label>
          )}
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
            <Button type="button" variant="outline" size="sm" onClick={() => downloadPatternPng(current)} className="gap-1.5">
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
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('code.title')}</p>
          <PatternCode pattern={current} />
        </div>

        {/* Similar */}
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
                  onClick={() => onOpenPattern(p)}
                  title={p.name}
                  className="group overflow-hidden rounded-lg border border-border text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="block h-10" style={patternToStyle(p)} aria-hidden />
                  <span className="block truncate px-2 py-1 text-xs">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
