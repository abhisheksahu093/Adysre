'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, LayoutTemplate } from 'lucide-react';
import { cn } from 'adysre';
import type { LocalizedComponent } from '@/data/components';
import {
  adjacentVariation,
  type PlaygroundSection,
  type PlaygroundSlotId,
} from '@/data/playground';
import { usePreviewHeight } from '@/hooks/use-preview-height';
import { sectionStyleOf, usePlaygroundStore } from '@/stores/playground-store';
import { encodePaletteParam } from '@/lib/palettes/apply-to-preview';
import type { PreviewContentMessage, PreviewFieldsMessage } from '@/lib/playground/content';
import type { PreviewStyleMessage } from '@/lib/playground/section-style';
import { deviceWidth, type PreviewDeviceId } from '../preview-devices';

interface SectionCanvasProps {
  sections: PlaygroundSection[];
  activeSlotId: PlaygroundSlotId;
  device: PreviewDeviceId;
  variationsBySlot: Map<PlaygroundSlotId, LocalizedComponent[]>;
  onSelectSlot: (id: PlaygroundSlotId) => void;
  onChange: (id: PlaygroundSlotId, slug: string | null) => void;
}

/**
 * The assembled page, live. Each section is the same `/preview/[slug]` iframe
 * the detail pages use - an iframe rather than an inline render because the
 * tablet/phone widths must drive the sections' own media queries, and only a
 * frame gives a section a viewport of that width.
 */
export function SectionCanvas({
  sections,
  activeSlotId,
  device,
  variationsBySlot,
  onSelectSlot,
  onChange,
}: SectionCanvasProps) {
  const t = useTranslations('components');
  const { resolvedTheme } = useTheme();
  // next-themes is undefined during SSR; hold the frames back until mount so
  // the documents load once, in the right theme (same trick as the detail page).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const theme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light';

  // The project palette recolours every section's accents; empty string when
  // none is set, which the iframe treats as "keep the component's own colours".
  const palette = usePlaygroundStore((s) => s.palette);
  const paletteParam = palette ? encodePaletteParam(palette.colors) : '';

  const width = deviceWidth(device);

  return (
    <div data-tour="canvas" className="min-w-0 overflow-x-auto rounded-lg border border-border bg-muted/30 p-3 sm:p-6">
      <div
        className="mx-auto overflow-hidden rounded-md border border-border bg-background shadow-sm transition-[width] duration-200"
        style={{ width: width ? `${width}px` : '100%', maxWidth: '100%' }}
      >
        {sections.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <LayoutTemplate className="h-8 w-8 text-muted-foreground" aria-hidden />
            <div className="space-y-1 px-4">
              <p className="text-sm font-medium">{t('playground.canvas.empty.title')}</p>
              <p className="text-sm text-muted-foreground">
                {t('playground.canvas.empty.description')}
              </p>
            </div>
          </div>
        ) : (
          sections.map((section) => (
            <CanvasSection
              key={section.slot.id}
              section={section}
              active={section.slot.id === activeSlotId}
              theme={theme}
              paletteParam={paletteParam}
              mounted={mounted}
              variations={variationsBySlot.get(section.slot.id) ?? []}
              onSelectSlot={onSelectSlot}
              onChange={onChange}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CanvasSection({
  section,
  active,
  theme,
  paletteParam,
  mounted,
  variations,
  onSelectSlot,
  onChange,
}: {
  section: PlaygroundSection;
  active: boolean;
  theme: 'light' | 'dark';
  paletteParam: string;
  mounted: boolean;
  variations: LocalizedComponent[];
  onSelectSlot: (id: PlaygroundSlotId) => void;
  onChange: (id: PlaygroundSlotId, slug: string | null) => void;
}) {
  const t = useTranslations('components');
  const { slot, component } = section;
  const height = usePreviewHeight(component.slug);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const setSectionFields = usePlaygroundStore((s) => s.setSectionFields);
  const overrides = usePlaygroundStore((s) => s.contentOverrides[component.slug]);
  // Styling belongs to the slot, so it survives a variation swap.
  const sectionStyle = usePlaygroundStore((s) => sectionStyleOf(s, slot.id));

  /** Push the current edits into this section's frame (once it can receive). */
  function postOverrides(target: Window | null): void {
    if (!target) return;
    const message: PreviewContentMessage = {
      type: 'adysre:preview-content',
      slug: component.slug,
      overrides: overrides ?? {},
    };
    target.postMessage(message, window.location.origin);
  }

  /** Push the slot's background / text / border styling into the frame. */
  function postStyle(target: Window | null): void {
    if (!target) return;
    const message: PreviewStyleMessage = {
      type: 'adysre:preview-style',
      slug: component.slug,
      style: sectionStyle ?? null,
    };
    target.postMessage(message, window.location.origin);
  }

  // Capture the strings this frame reports as editable, and answer with the
  // edits already on file so a reload / variation switch repaints customised.
  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as PreviewFieldsMessage | undefined;
      if (!data || data.type !== 'adysre:preview-fields' || data.slug !== component.slug) return;
      setSectionFields(component.slug, data.fields);
      postOverrides(event.source as Window | null);
      postStyle(event.source as Window | null);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
    // postOverrides closes over the latest `overrides` via the render; the
    // handshake reply also fires the change-effect below, so this is complete.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component.slug, setSectionFields]);

  // Live-apply edits as the user types, without reloading the frame.
  useEffect(() => {
    postOverrides(iframeRef.current?.contentWindow ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides]);

  // Same for styling: repaint the frame as the user drags a colour or picks a
  // pattern, with no reload and no flash of the section's original design.
  useEffect(() => {
    postStyle(iframeRef.current?.contentWindow ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionStyle]);

  const position = variations.findIndex((c) => c.slug === component.slug) + 1;
  const previous = adjacentVariation(component.slug, variations, -1);
  const next = adjacentVariation(component.slug, variations, 1);
  const slotLabel = t(`playground.slots.${slot.id}`);

  return (
    <div className="group relative border-b border-border last:border-b-0">
      {/* Selection ring drawn over the frame; inset so adjacent sections don't
          overlap each other's rings. */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 z-10 ring-inset transition',
          active
            ? 'ring-2 ring-primary/70'
            : 'group-hover:ring-2 group-hover:ring-primary/30 group-focus-within:ring-2 group-focus-within:ring-primary/30',
        )}
      />

      <div
        className={cn(
          'absolute right-2 top-2 z-20 flex items-center gap-0.5 rounded-full border border-border bg-card/95 py-0.5 pl-2.5 pr-0.5 shadow-sm backdrop-blur transition-opacity',
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
        )}
      >
        <button
          type="button"
          onClick={() => onSelectSlot(slot.id)}
          className="rounded-full text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {slotLabel}
        </button>
        <span className="px-1 text-[11px] tabular-nums text-muted-foreground">
          {t('playground.variations.count', { current: position, total: variations.length })}
        </span>
        <button
          type="button"
          aria-label={t('playground.variations.prev')}
          title={t('playground.variations.prev')}
          disabled={!previous}
          onClick={() => previous && onChange(slot.id, previous.slug)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={t('playground.variations.next')}
          title={t('playground.variations.next')}
          disabled={!next}
          onClick={() => next && onChange(slot.id, next.slug)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {mounted ? (
        <iframe
          key={component.slug}
          ref={iframeRef}
          src={`/preview/${component.slug}?theme=${theme}&edit=1${paletteParam ? `&palette=${paletteParam}` : ''}`}
          title={`${slotLabel} - ${component.title}`}
          loading="lazy"
          // Same isolation contract as the detail page previews: real
          // components, real scripts, viewport-true media queries.
          sandbox="allow-scripts allow-same-origin"
          className="block w-full border-0 bg-background"
          style={{ height: `${height}px` }}
        />
      ) : (
        <div className="w-full bg-background" style={{ height: `${height}px` }} aria-hidden />
      )}
    </div>
  );
}
