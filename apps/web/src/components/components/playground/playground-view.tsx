'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Code2, CircleHelp, Palette as PaletteIcon } from 'lucide-react';
import { Button, cn } from '@adysre/ui';
import type { LocalizedComponent } from '@/data/components';
import {
  PLAYGROUND_SLOTS,
  resolveSections,
  resolveSelections,
  slotVariations,
  type PlaygroundSlotId,
} from '@/data/playground';
import { usePlaygroundStore } from '@/stores/playground-store';
import { PREVIEW_DEVICES } from '../preview-devices';
import { BuilderSidebar } from './builder-sidebar';
import { SectionCanvas } from './section-canvas';
import { ExportDialog } from './export-dialog';
import { PlaygroundTour } from './playground-tour';
import { ReferenceStart } from './reference-start';
import { GeneratingState } from './generating-state';
import { TemplateResult } from './template-result';
import { ProjectPaletteDialog } from './project-palette-dialog';
import { PaletteGenerator } from '@/components/palettes/palette-generator';

/**
 * Playground mode. Moves through stages - start → generating → result →
 * builder - all held in the store. This component derives the render model
 * (resolved selections, sections, per-slot variations) once and feeds whichever
 * stage is showing, so the canvas, rail, picker and export can never disagree
 * about what the page is.
 */
export function PlaygroundView({ components }: { components: LocalizedComponent[] }) {
  const t = useTranslations('components');
  const stage = usePlaygroundStore((s) => s.stage);
  const exit = usePlaygroundStore((s) => s.exit);
  const device = usePlaygroundStore((s) => s.device);
  const setDevice = usePlaygroundStore((s) => s.setDevice);
  const startTour = usePlaygroundStore((s) => s.startTour);
  const selections = usePlaygroundStore((s) => s.selections);
  const activeSlotId = usePlaygroundStore((s) => s.activeSlotId);
  const setActiveSlot = usePlaygroundStore((s) => s.setActiveSlot);
  const select = usePlaygroundStore((s) => s.select);
  const palette = usePlaygroundStore((s) => s.palette);
  const setPalette = usePlaygroundStore((s) => s.setPalette);
  const contentOverrides = usePlaygroundStore((s) => s.contentOverrides);
  const [exportOpen, setExportOpen] = useState(false);
  const [paletteChooserOpen, setPaletteChooserOpen] = useState(false);
  const [paletteGeneratorOpen, setPaletteGeneratorOpen] = useState(false);

  const resolved = useMemo(
    () => resolveSelections(selections, components),
    [selections, components],
  );
  const sections = useMemo(() => resolveSections(resolved, components), [resolved, components]);
  const variationsBySlot = useMemo(() => {
    const map = new Map<PlaygroundSlotId, LocalizedComponent[]>();
    for (const slot of PLAYGROUND_SLOTS) map.set(slot.id, slotVariations(slot, components));
    return map;
  }, [components]);

  const activeSlot = PLAYGROUND_SLOTS.find((s) => s.id === activeSlotId) ?? PLAYGROUND_SLOTS[0];
  const activeComponent =
    sections.find((s) => s.slot.id === activeSlot.id)?.component ?? null;

  // The device toggle and code button only make sense once a page exists.
  const showPageControls = stage === 'result' || stage === 'builder';

  return (
    <section aria-label={t('playground.title')} className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-2 py-2 sm:px-3">
        <Button type="button" variant="ghost" size="sm" onClick={exit} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">{t('playground.exit')}</span>
        </Button>
        <div className="h-4 w-px bg-border" aria-hidden />
        <h2 className="text-sm font-semibold tracking-tight">{t('playground.title')}</h2>

        <div className="ml-auto flex items-center gap-1">
          {showPageControls && (
            <div
              role="group"
              aria-label={t('preview.device')}
              className="flex gap-1"
              data-tour="device"
            >
              {PREVIEW_DEVICES.map(({ id, icon: Icon }) => (
                <Button
                  key={id}
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t(`preview.${id}`)}
                  aria-pressed={device === id}
                  title={t(`preview.${id}`)}
                  onClick={() => setDevice(id)}
                  className={cn(
                    'h-8 w-8 text-muted-foreground hover:text-foreground',
                    device === id && 'bg-muted text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('playground.restartTour')}
            title={t('playground.restartTour')}
            onClick={startTour}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <CircleHelp className="h-4 w-4" />
          </Button>
          {showPageControls && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-tour="palette"
              aria-label={t('playground.palette.label')}
              onClick={() => setPaletteChooserOpen(true)}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              {palette ? (
                <span className="flex overflow-hidden rounded" aria-hidden>
                  {palette.colors.map((c, i) => (
                    <span key={i} className="h-4 w-2.5" style={{ backgroundColor: c }} />
                  ))}
                </span>
              ) : (
                <PaletteIcon className="h-4 w-4" aria-hidden />
              )}
              <span className="hidden sm:inline">{t('playground.palette.button')}</span>
            </Button>
          )}
          {showPageControls && (
            <Button
              type="button"
              size="sm"
              data-tour="export"
              onClick={() => setExportOpen(true)}
              className="gap-1.5"
            >
              <Code2 className="h-4 w-4" aria-hidden />
              {t('playground.openExport')}
            </Button>
          )}
        </div>
      </div>

      {stage === 'start' && <ReferenceStart />}

      {stage === 'generating' && <GeneratingState components={components} />}

      {stage === 'result' && (
        <TemplateResult
          sections={sections}
          activeSlotId={activeSlot.id}
          device={device}
          variationsBySlot={variationsBySlot}
          onSelectSlot={setActiveSlot}
          onChange={select}
          onDownload={() => setExportOpen(true)}
        />
      )}

      {stage === 'builder' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <BuilderSidebar
            resolved={resolved}
            components={components}
            variationsBySlot={variationsBySlot}
            activeSlot={activeSlot}
            activeComponent={activeComponent}
            onSelectSlot={setActiveSlot}
            onChange={select}
          />

          <SectionCanvas
            sections={sections}
            activeSlotId={activeSlot.id}
            device={device}
            variationsBySlot={variationsBySlot}
            onSelectSlot={setActiveSlot}
            onChange={select}
          />
        </div>
      )}

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        sections={sections}
        palette={palette}
        contentOverrides={contentOverrides}
      />

      <ProjectPaletteDialog
        open={paletteChooserOpen}
        onClose={() => setPaletteChooserOpen(false)}
        onOpenGenerator={() => {
          setPaletteChooserOpen(false);
          setPaletteGeneratorOpen(true);
        }}
      />
      <PaletteGenerator
        open={paletteGeneratorOpen}
        onClose={() => setPaletteGeneratorOpen(false)}
        onGenerated={(p) => {
          setPalette(p);
          setPaletteGeneratorOpen(false);
        }}
      />

      <PlaygroundTour />
    </section>
  );
}
