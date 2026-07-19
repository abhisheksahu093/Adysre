'use client';

import { useTranslations } from 'next-intl';
import { Check, Code2, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from '@adysre/ui';
import type { LocalizedComponent } from '@/data/components';
import type { PlaygroundSection, PlaygroundSlotId } from '@/data/playground';
import { usePlaygroundStore } from '@/stores/playground-store';
import type { PreviewDeviceId } from '../preview-devices';
import { SectionCanvas } from './section-canvas';

interface TemplateResultProps {
  sections: PlaygroundSection[];
  activeSlotId: PlaygroundSlotId;
  device: PreviewDeviceId;
  variationsBySlot: Map<PlaygroundSlotId, LocalizedComponent[]>;
  onSelectSlot: (id: PlaygroundSlotId) => void;
  onChange: (id: PlaygroundSlotId, slug: string | null) => void;
  onDownload: () => void;
}

/**
 * The generated template: a ready banner with the three next steps (take the
 * code, customize, or start over) above a live render of the assembled page.
 */
export function TemplateResult({
  sections,
  activeSlotId,
  device,
  variationsBySlot,
  onSelectSlot,
  onChange,
  onDownload,
}: TemplateResultProps) {
  const t = useTranslations('components');
  const generated = usePlaygroundStore((s) => s.generated);
  const customize = usePlaygroundStore((s) => s.customizeGenerated);
  const startOver = usePlaygroundStore((s) => s.startOver);
  const count = generated?.sectionCount ?? sections.length;

  return (
    <div className="space-y-4">
      <div
        data-tour="result-actions"
        className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
            aria-hidden
          >
            <Check className="h-5 w-5" />
          </span>
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold tracking-tight sm:text-base">
              {t('playground.result.title')}
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t('playground.result.subtitle', { count })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={startOver}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            {t('playground.result.startOver')}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={customize} className="gap-1.5">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            {t('playground.result.customize')}
          </Button>
          <Button type="button" size="sm" onClick={onDownload} className="gap-1.5">
            <Code2 className="h-4 w-4" aria-hidden />
            {t('playground.result.getCode')}
          </Button>
        </div>
      </div>

      <SectionCanvas
        sections={sections}
        activeSlotId={activeSlotId}
        device={device}
        variationsBySlot={variationsBySlot}
        onSelectSlot={onSelectSlot}
        onChange={onChange}
      />
    </div>
  );
}
