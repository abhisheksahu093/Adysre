'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, ImageDown, Trash2, Check, Loader2 } from 'lucide-react';
import { Button, Dialog, cn } from '@adysre/ui';
import { PALETTES } from '@/data/palettes';
import { readableText } from '@/lib/palettes/color';
import { localPaletteGenerator } from '@/lib/palettes/generator';
import { usePlaygroundStore } from '@/stores/playground-store';

/**
 * Choose the project's colour palette: keep the one generated from a reference,
 * pull colours from that reference, pick a curated palette, or open the
 * generator to make a new one.
 */
export function ProjectPaletteDialog({
  open,
  onClose,
  onOpenGenerator,
}: {
  open: boolean;
  onClose: () => void;
  onOpenGenerator: () => void;
}) {
  const t = useTranslations('components');
  const palette = usePlaygroundStore((s) => s.palette);
  const setPalette = usePlaygroundStore((s) => s.setPalette);
  const referenceFile = usePlaygroundStore((s) => s.referenceFile);
  const [busy, setBusy] = useState(false);

  const useReference = async () => {
    if (!referenceFile) return;
    setBusy(true);
    try {
      const gen = await localPaletteGenerator.fromImage(referenceFile);
      setPalette({
        id: `ref-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
        name: t('playground.palette.referenceName'),
        colors: gen.colors,
        tags: ['generated'],
        likes: 0,
      });
    } catch {
      /* ignore - the picker stays open for another choice */
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('playground.palette.title')}
      description={t('playground.palette.description')}
      className="sm:max-w-2xl"
    >
      <div className="space-y-5">
        {palette && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('playground.palette.current')}
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="flex h-14">
                {palette.colors.map((c, i) => (
                  <span
                    key={i}
                    className="flex flex-1 items-end justify-center pb-1 text-[10px] font-semibold uppercase"
                    style={{ backgroundColor: c, color: readableText(c) }}
                  >
                    {c.replace('#', '')}
                  </span>
                ))}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPalette(null)}
              className="h-auto gap-1.5 py-1 text-xs text-muted-foreground hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              {t('playground.palette.remove')}
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onOpenGenerator} className="gap-1.5">
            <Sparkles className="h-4 w-4" aria-hidden />
            {t('playground.palette.generateOwn')}
          </Button>
          {referenceFile && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void useReference()}
              disabled={busy}
              className="gap-1.5"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />
              ) : (
                <ImageDown className="h-4 w-4" aria-hidden />
              )}
              {t('playground.palette.useReference')}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('playground.palette.chooseLibrary')}
          </p>
          <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
            {PALETTES.map((p) => {
              const selected = palette?.colors.join() === p.colors.join();
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPalette(p)}
                  title={p.name}
                  className={cn(
                    'group overflow-hidden rounded-lg border text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    selected ? 'border-primary ring-2 ring-primary/40' : 'border-border',
                  )}
                >
                  <span className="flex h-8">
                    {p.colors.map((c, i) => (
                      <span key={i} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </span>
                  <span className="flex items-center justify-between gap-1 px-2 py-1">
                    <span className="truncate text-xs">{p.name}</span>
                    {selected && <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
