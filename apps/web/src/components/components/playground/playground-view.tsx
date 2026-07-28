'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Code2, CircleHelp, Palette as PaletteIcon } from 'lucide-react';
import { Button, cn } from 'adysre';
import type { LocalizedComponent } from '@/data/components';
import {
  PLAYGROUND_SLOTS,
  resolveSections,
  resolveSelections,
  slotVariations,
  type PlaygroundSlotId,
} from '@/data/playground';
import {
  useActiveOrder,
  useActiveSectionStyles,
  useActiveSelections,
  usePlaygroundStore,
} from '@/stores/playground-store';
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
import { PremiumModal } from '@/components/entitlements/premium-modal';
import { useEntitlement } from '@/hooks/use-entitlement';
import { useRouter } from '@/i18n/navigation';

/**
 * Playground mode. Moves through stages - start → generating → result →
 * builder - all held in the store. This component derives the render model
 * (resolved selections, sections, per-slot variations) once and feeds whichever
 * stage is showing, so the canvas, rail, picker and export can never disagree
 * about what the page is.
 */
export function PlaygroundView({ components }: { components: LocalizedComponent[] }) {
  const t = useTranslations('components');
  const router = useRouter();
  const stage = usePlaygroundStore((s) => s.stage);
  const exit = usePlaygroundStore((s) => s.exit);
  const device = usePlaygroundStore((s) => s.device);
  const setDevice = usePlaygroundStore((s) => s.setDevice);
  const startTour = usePlaygroundStore((s) => s.startTour);
  const activeSlotId = usePlaygroundStore((s) => s.activeSlotId);
  const setActiveSlot = usePlaygroundStore((s) => s.setActiveSlot);
  const select = usePlaygroundStore((s) => s.select);
  const palette = usePlaygroundStore((s) => s.palette);
  const setPalette = usePlaygroundStore((s) => s.setPalette);
  const contentOverrides = usePlaygroundStore((s) => s.contentOverrides);
  // Merged views: the site's shared chrome plus the page being edited. Reading
  // `s.selections` directly here would render every page without its body.
  const selectionsForPage = useActiveSelections();
  const sectionStyles = useActiveSectionStyles();
  const order = useActiveOrder();
  const [exportOpen, setExportOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [paletteChooserOpen, setPaletteChooserOpen] = useState(false);
  const [paletteGeneratorOpen, setPaletteGeneratorOpen] = useState(false);

  /**
   * Taking the code is the premium capability, so the door is where it is
   * asked for.
   *
   * The export dialog shows the assembled source and hands out per-file
   * downloads, so opening it IS the paid thing - gating only the zipped project
   * inside it (which `ExportDialog` still does, because that is where a unit is
   * actually consumed) would leave the same code a copy button away. Nothing
   * here knows what the limit is; the server's answer decides.
   */
  const codeExport = useEntitlement('builder.generate-code');

  function requestCode(): void {
    if (codeExport.allowed) {
      setExportOpen(true);
      return;
    }
    // No feature record means nobody is signed in (usage answers 401) or the
    // key is unknown - either way we cannot describe a limit we were never
    // told, so send them to the page that owns the comparison rather than
    // opening a modal with nothing in it.
    if (!codeExport.feature) {
      router.push('/pricing');
      return;
    }
    setUpgradeOpen(true);
  }

  const resolved = useMemo(
    () => resolveSelections(selectionsForPage, components),
    [selectionsForPage, components],
  );
  const sections = useMemo(
    () => resolveSections(resolved, components, order),
    [resolved, components, order],
  );
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
              // Disabled only while the answer is in flight: a button that
              // opens the dialog and then takes it back reads as a bug.
              disabled={codeExport.isLoading}
              onClick={requestCode}
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
          onDownload={requestCode}
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
        sectionStyles={sectionStyles}
      />

      {/* Opened before anything is consumed, from the feature's own state: the
          click asked for code, and this is the answer to that question. */}
      <PremiumModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        denial={codeExport.feature}
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
