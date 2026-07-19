'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import type { LocalizedComponent } from '@/data/components';
import { usePlaygroundStore } from '@/stores/playground-store';
import { localTemplateGenerator } from '@/lib/playground/template-generator';
import { localPaletteGenerator } from '@/lib/palettes/generator';

/** A minimum on-screen time so the step reads as a step, not a flash. */
const MIN_VISIBLE_MS = 1100;

/**
 * The "analyzing your reference" step. Owns the generation: it reads the
 * uploaded file from the store, runs the (swappable) generator against the
 * live component library, and reports back success or failure. The generator
 * runs entirely on-device.
 */
export function GeneratingState({ components }: { components: LocalizedComponent[] }) {
  const t = useTranslations('components');
  const file = usePlaygroundStore((s) => s.referenceFile);
  const url = usePlaygroundStore((s) => s.referenceUrl);
  const succeeded = usePlaygroundStore((s) => s.generationSucceeded);
  const failed = usePlaygroundStore((s) => s.generationFailed);
  const setPalette = usePlaygroundStore((s) => s.setPalette);

  useEffect(() => {
    if (!file) {
      failed(t('playground.generating.error'));
      return;
    }
    let cancelled = false;
    const wait = new Promise((r) => setTimeout(r, MIN_VISIBLE_MS));
    (async () => {
      try {
        // Assemble the sections and pull a matching palette from the same
        // reference in parallel - the generated project ships with both.
        const [template, palette] = await Promise.all([
          localTemplateGenerator.generate(file, components),
          localPaletteGenerator.fromImage(file).catch(() => null),
          wait,
        ]);
        if (cancelled) return;
        if (palette) {
          setPalette({
            id: `ref-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
            name: t('playground.palette.referenceName'),
            colors: palette.colors,
            tags: ['generated'],
            likes: 0,
          });
        }
        succeeded(template.selections, {
          sectionCount: template.sectionCount,
          tone: template.features.tone,
        });
      } catch {
        if (!cancelled) failed(t('playground.generating.error'));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, components]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-1 py-12 text-center sm:py-16">
      <div className="relative mb-6">
        {url ? (
          // Blob URL from the user's own upload - next/image can't optimize an
          // object URL, so a plain img is correct here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={t('playground.generating.previewAlt')}
            className="h-32 w-32 rounded-2xl border border-border object-cover opacity-70 shadow-sm sm:h-40 sm:w-40"
          />
        ) : (
          <div className="h-32 w-32 rounded-2xl border border-border bg-muted sm:h-40 sm:w-40" />
        )}
        <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/40">
          <Loader2 className="h-8 w-8 animate-spin text-primary motion-reduce:animate-none" aria-hidden />
        </span>
      </div>
      <h2 className="text-base font-semibold tracking-tight sm:text-lg" aria-live="polite">
        {t('playground.generating.title')}
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {t('playground.generating.subtitle')}
      </p>
    </div>
  );
}
