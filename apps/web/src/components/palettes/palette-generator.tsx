'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Palette as PaletteIcon, Type, ImageUp, Loader2, Sparkles } from 'lucide-react';
import { Button, Input, Label, Select, Textarea, cn } from 'adysre';
import type { Palette } from '@/data/palettes';
import { readableText } from '@/lib/palettes/color';
import {
  BUSINESS_TYPES,
  localPaletteGenerator,
  type PaletteBrief,
} from '@/lib/palettes/generator';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/playground/template-generator';

type Mode = 'brief' | 'colors' | 'image';

interface GeneratorProps {
  open: boolean;
  onClose: () => void;
  /** Hand the generated palette to the parent (opens it in the editor). */
  onGenerated: (palette: Palette) => void;
}

const MODES: { id: Mode; icon: typeof Type }[] = [
  { id: 'brief', icon: Sparkles },
  { id: 'colors', icon: Type },
  { id: 'image', icon: ImageUp },
];

export function PaletteGenerator({ open, onClose, onGenerated }: GeneratorProps) {
  const t = useTranslations('palettes');
  const [mode, setMode] = useState<Mode>('brief');
  const [result, setResult] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inputs
  const [colorsText, setColorsText] = useState('');
  const [brief, setBrief] = useState<PaletteBrief>({ business: 'technology' });
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const resetResult = () => {
    setResult(null);
    setError(null);
  };

  const generate = async () => {
    setError(null);
    try {
      if (mode === 'colors') {
        setResult(localPaletteGenerator.fromColors(colorsText).colors);
      } else if (mode === 'brief') {
        setResult(localPaletteGenerator.fromBrief(brief).colors);
      }
    } catch {
      setError(t('generator.error'));
    }
  };

  const onImage = async (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return setError(t('generator.errorType'));
    if (file.size > MAX_IMAGE_BYTES) return setError(t('generator.errorSize'));
    setError(null);
    setBusy(true);
    try {
      const gen = await localPaletteGenerator.fromImage(file);
      setResult(gen.colors);
    } catch {
      setError(t('generator.error'));
    } finally {
      setBusy(false);
    }
  };

  const use = () => {
    if (!result) return;
    onGenerated({
      id: `gen-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      name: brief.name?.trim() || t('generator.defaultName'),
      colors: result,
      tags: ['generated'],
      likes: 0,
    });
  };

  const canGenerate = mode === 'image' ? false : mode === 'colors' ? colorsText.trim().length > 0 : true;

  return (
    // Reuse the shared Dialog for a11y (focus trap, escape, portal).
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('generator.title')}
        className="relative flex max-h-[92vh] w-full flex-col rounded-t-lg border border-border bg-card shadow-lg sm:max-w-lg sm:rounded-lg"
      >
        <div className="border-b border-border p-4 sm:p-5">
          <h2 className="text-base font-semibold tracking-tight sm:text-lg">{t('generator.title')}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{t('generator.subtitle')}</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          <div role="tablist" aria-label={t('generator.modeLabel')} className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
            {MODES.map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                onClick={() => {
                  setMode(id);
                  resetResult();
                }}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  mode === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {t(`generator.modes.${id}`)}
              </button>
            ))}
          </div>

          {mode === 'brief' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="pg-name">{t('generator.fields.name')}</Label>
                <Input
                  id="pg-name"
                  value={brief.name ?? ''}
                  onChange={(e) => setBrief((b) => ({ ...b, name: e.target.value }))}
                  placeholder={t('generator.fields.namePlaceholder')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pg-business">{t('generator.fields.business')}</Label>
                <Select
                  id="pg-business"
                  value={brief.business}
                  onChange={(e) => setBrief((b) => ({ ...b, business: e.target.value }))}
                >
                  {BUSINESS_TYPES.map((bt) => (
                    <option key={bt.id} value={bt.id}>
                      {t(`generator.business.${bt.id}`)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pg-colors">{t('generator.fields.colors')}</Label>
                <Input
                  id="pg-colors"
                  value={brief.colors ?? ''}
                  onChange={(e) => setBrief((b) => ({ ...b, colors: e.target.value }))}
                  placeholder={t('generator.fields.colorsPlaceholder')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pg-comments">{t('generator.fields.comments')}</Label>
                <Textarea
                  id="pg-comments"
                  rows={2}
                  value={brief.comments ?? ''}
                  onChange={(e) => setBrief((b) => ({ ...b, comments: e.target.value }))}
                  placeholder={t('generator.fields.commentsPlaceholder')}
                />
              </div>
            </div>
          )}

          {mode === 'colors' && (
            <div className="space-y-1.5">
              <Label htmlFor="pg-hexes">{t('generator.fields.hexes')}</Label>
              <Textarea
                id="pg-hexes"
                rows={3}
                value={colorsText}
                onChange={(e) => setColorsText(e.target.value)}
                placeholder="#2a9d8f, #e9c46a, #f4a261, teal, navy"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">{t('generator.fields.hexesHint')}</p>
            </div>
          )}

          {mode === 'image' && (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onImage(file);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-background p-6 text-center transition-colors hover:border-primary/50"
              >
                {busy ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary motion-reduce:animate-none" aria-hidden />
                ) : (
                  <ImageUp className="h-6 w-6 text-muted-foreground" aria-hidden />
                )}
                <span className="text-sm font-medium">{t('generator.fields.imageTitle')}</span>
                <span className="text-xs text-muted-foreground">{t('generator.fields.imageHint')}</span>
              </button>
            </div>
          )}

          {error && (
            <p role="alert" className="text-xs font-medium text-danger">
              {error}
            </p>
          )}

          {result && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('generator.preview')}
              </p>
              <div className="flex h-20 overflow-hidden rounded-lg border border-border">
                {result.map((c, i) => (
                  <span
                    key={i}
                    className="flex flex-1 items-end justify-center pb-1.5 text-[10px] font-semibold uppercase"
                    style={{ backgroundColor: c, color: readableText(c) }}
                  >
                    {c.replace('#', '')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end sm:p-5">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('generator.cancel')}
          </Button>
          {mode !== 'image' && (
            <Button type="button" variant={result ? 'outline' : 'primary'} onClick={() => void generate()} disabled={!canGenerate}>
              <PaletteIcon className="h-4 w-4" aria-hidden />
              {result ? t('generator.regenerate') : t('generator.generate')}
            </Button>
          )}
          {result && (
            <Button type="button" onClick={use}>
              {t('generator.use')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
