'use client';

import { useState, type CSSProperties } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { cn } from 'adysre';
import type { IconSample, PaletteSample, SurfaceSample } from '@/data/workbench';
import { IconGlyph } from '@/components/icons/icon-glyph';
import { Hud } from './panel';

/**
 * The five things on the canvas. Each one is a real family from the library
 * rather than a drawing of one: a block wearing a palette, a gradient, a
 * pattern, a texture, and a set of icons. Between them the board shows every
 * material the library ships.
 */
type ObjectId = 'block' | 'surface' | 'pattern' | 'texture' | 'icons';

/** Corner handles, drawn on whichever object is selected. */
function Handles() {
  return (
    <span aria-hidden>
      {['-left-1 -top-1', '-right-1 -top-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((at) => (
        <span
          key={at}
          className={cn('absolute h-2 w-2 rounded-[1px] border border-signal bg-canvas', at)}
        />
      ))}
    </span>
  );
}

/**
 * The artboard: the home page's opening statement.
 *
 * Rather than a screenshot of the product, this is a working piece of it. Three
 * objects sit on a grid; selecting one in the layers list moves the handles and
 * repoints the properties panel at it, and the two swap controls recolour the
 * block and repaint the surface from the real catalogues. Everything shown is a
 * published material: the palettes, the gradient and the icons are the same
 * records the library pages serve.
 *
 * Client Component for the selection and swap state. The catalogues stay on the
 * server: it receives only the handful of samples it can show
 * (`@/data/workbench`), never the full arrays.
 */
export function Artboard({
  palettes,
  gradients,
  patterns,
  textures,
  icons,
  iconCount,
}: {
  palettes: PaletteSample[];
  gradients: SurfaceSample[];
  patterns: SurfaceSample[];
  textures: SurfaceSample[];
  icons: IconSample[];
  iconCount: number;
}) {
  const t = useTranslations('landing.workbench');
  // The block on the board is the real Team plan card, wearing whichever
  // palette is selected. Its words come from the pricing namespace rather than
  // being written for the demo, so the board cannot show a product that does
  // not exist.
  const tPricing = useTranslations('pricing');
  const format = useFormatter();

  const [selected, setSelected] = useState<ObjectId>('block');
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [gradientIndex, setGradientIndex] = useState(0);
  const [patternIndex, setPatternIndex] = useState(0);
  const [textureIndex, setTextureIndex] = useState(0);

  // The samples are catalogue-derived and never empty in practice; the fallback
  // keeps this component honest for a caller that passes a short list.
  const palette = palettes[paletteIndex % Math.max(palettes.length, 1)];
  const gradient = gradients[gradientIndex % Math.max(gradients.length, 1)];
  const pattern = patterns[patternIndex % Math.max(patterns.length, 1)];
  const texture = textures[textureIndex % Math.max(textures.length, 1)];

  const objects: { id: ObjectId; name: string; count: number }[] = [
    { id: 'block', name: t('objects.block'), count: palette?.colors.length ?? 0 },
    { id: 'surface', name: t('objects.surface'), count: 1 },
    { id: 'pattern', name: t('objects.pattern'), count: 1 },
    { id: 'texture', name: t('objects.texture'), count: 1 },
    { id: 'icons', name: t('objects.icons'), count: icons.length },
  ];

  /** A surface object reports the same four things whichever family it is from. */
  const surfaceProperties = (surface: SurfaceSample | undefined, source: string) => [
    { label: t('props.type'), value: surface?.kind ?? '' },
    { label: t('props.name'), value: surface?.name ?? '' },
    { label: t('props.radius'), value: '12' },
    { label: t('props.source'), value: source },
  ];

  /** Properties for whatever is selected, read off the material itself. */
  const propertiesByObject: Record<ObjectId, { label: string; value: string }[]> = {
    block: [
      { label: t('props.width'), value: '288' },
      { label: t('props.radius'), value: '12' },
      { label: t('props.fill'), value: palette?.colors[0] ?? '' },
      { label: t('props.source'), value: 'adysre/blocks' },
    ],
    surface: surfaceProperties(gradient, 'adysre/gradients'),
    pattern: surfaceProperties(pattern, 'adysre/patterns'),
    texture: surfaceProperties(texture, 'adysre/textures'),
    icons: [
      { label: t('props.size'), value: '24' },
      { label: t('props.stroke'), value: '1.5' },
      { label: t('props.available'), value: format.number(iconCount) },
      { label: t('props.source'), value: 'adysre/icons' },
    ],
  };

  const properties = propertiesByObject[selected];

  /**
   * The controls that change what the board is showing. One per material family
   * that has more than one sample to walk through, each naming the record it is
   * currently wearing - the only place on the page where a click changes the
   * page rather than navigating away from it.
   */
  const cycle = (setIndex: (next: (index: number) => number) => void, length: number) => () =>
    setIndex((index) => (index + 1) % Math.max(length, 1));

  const swaps = [
    {
      id: 'palette',
      label: t('swapPalette'),
      value: palette?.name ?? '',
      onSwap: cycle(setPaletteIndex, palettes.length),
    },
    {
      id: 'gradient',
      label: t('swapGradient'),
      value: gradient?.name ?? '',
      onSwap: cycle(setGradientIndex, gradients.length),
    },
    {
      id: 'pattern',
      label: t('swapPattern'),
      value: pattern?.name ?? '',
      onSwap: cycle(setPatternIndex, patterns.length),
    },
    {
      id: 'texture',
      label: t('swapTexture'),
      value: texture?.name ?? '',
      onSwap: cycle(setTextureIndex, textures.length),
    },
  ];

  const selectionRing = (id: ObjectId) =>
    cn(
      'relative rounded-xl border transition-colors',
      selected === id ? 'border-signal/60' : 'border-line hover:border-line-strong',
    );

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem]">
      {/* ---- the board ---- */}
      <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_60px_-40px_rgb(0_0_0/0.6)]">
        <div className="flex items-center gap-3 border-b border-line bg-panel-raised px-4 py-2.5">
          <Hud strong>{t('artboard')}</Hud>
          <Hud className="truncate">{objects.find((o) => o.id === selected)?.name}</Hud>
          <span className="ml-auto flex items-center gap-3">
            <Hud>1440 × 900</Hud>
            <Hud>100%</Hud>
          </span>
        </div>

        <div className="canvas-grid flex flex-wrap items-start gap-5 bg-panel p-5 sm:gap-7 sm:p-8">
          {/* The same dot field the page rests on, drawn on its own layer. Out
              of flow, so it sits under the board without joining the flex row.
              Absolute rather than fixed: this board is a few hundred pixels
              tall, so its field is small enough to scroll with it. */}
          <div aria-hidden className="canvas-field">
            <div className="canvas-field-drift" />
          </div>

          {/* A block from the library, wearing the selected palette. */}
          <div className={cn(selectionRing('block'), 'w-full bg-panel-raised p-4 sm:w-72')}>
            {selected === 'block' && <Handles />}
            <p className="text-sm font-semibold tracking-tight">{tPricing('plans.team.name')}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {tPricing('features.sharedWorkspace')}
            </p>
            <div className="mt-3.5 flex h-7 overflow-hidden rounded-md" aria-hidden>
              {palette?.colors.map((color) => (
                <span key={color} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span className="mt-3.5 block rounded-md bg-foreground py-2 text-center text-xs font-medium text-background">
              {tPricing('plans.team.cta')}
            </span>
          </div>

          {/* A gradient, painted from its record. It never sits still: the fill
              is oversized and pans, which is the material doing the only thing a
              gradient can do on its own. */}
          <div className={cn(selectionRing('surface'), 'h-36 w-36 overflow-hidden')}>
            {selected === 'surface' && <Handles />}
            {/* Sized and clipped by the frame around it, which is already
                rounded and `overflow-hidden`: this layer is deliberately larger
                than what you can see of it, because it moves. */}
            <span aria-hidden className="artboard-gradient" style={gradient?.style} />
          </div>

          {/* A pattern and a texture, both painted entirely by their own CSS and
              both drifting, since a tiling material can move without a seam. */}
          <div className={cn(selectionRing('pattern'), 'h-36 w-36 overflow-hidden')}>
            {selected === 'pattern' && <Handles />}
            <span aria-hidden className="artboard-tile" style={pattern?.style} />
          </div>

          <div className={cn(selectionRing('texture'), 'h-36 w-36 overflow-hidden')}>
            {selected === 'texture' && <Handles />}
            <span aria-hidden className="artboard-tile" style={texture?.style} />
          </div>

          {/* The icon set, at its real 24px and stroke, lighting in a wave so the
              set reads as a set rather than a screenshot of one. */}
          <div className={cn(selectionRing('icons'), 'grid grid-cols-6 gap-3 bg-panel-raised p-4')}>
            {selected === 'icons' && <Handles />}
            {icons.map((icon, index) => (
              <span
                key={icon.id}
                className="glyph-wave text-muted-foreground"
                // The wave runs across the grid rather than lighting all at
                // once, so each glyph starts a beat after the one before it.
                // An index, not a design value: the timing lives in the CSS.
                style={{ '--glyph-index': index } as CSSProperties}
              >
                <IconGlyph body={icon.body} size={20} />
              </span>
            ))}
          </div>
        </div>

        {/* Swap controls: the only two things on this page that change what you
            are looking at, so they sit on the board itself. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line bg-panel-raised px-4 py-2.5">
          {swaps.map((swap) => (
            <button
              key={swap.id}
              type="button"
              onClick={swap.onSwap}
              // The label is instrument type at 10.5px, which left the control
              // itself 16px tall: under the 24px a finger needs. The padding is
              // what makes it a target rather than just a word you can tap.
              className="group flex min-h-6 items-center gap-2 rounded px-1.5 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Hud>{swap.label}</Hud>
              <Hud strong className="group-hover:text-signal">
                {swap.value}
              </Hud>
            </button>
          ))}
          <span className="ml-auto">
            <Hud>{t('autosaved')}</Hud>
          </span>
        </div>
      </div>

      {/* ---- rails ---- */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
        <div className="overflow-hidden rounded-xl border border-line bg-panel">
          <div className="border-b border-line px-3 py-2.5">
            <Hud>{t('layers')}</Hud>
          </div>
          <ul>
            {objects.map((object) => (
              <li key={object.id}>
                <button
                  type="button"
                  onClick={() => setSelected(object.id)}
                  aria-pressed={selected === object.id}
                  className={cn(
                    'flex w-full items-center gap-2.5 border-b border-line px-3 py-2.5 text-left text-[13px] transition-colors last:border-b-0',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                    selected === object.id
                      ? 'bg-panel-raised text-foreground'
                      : 'text-muted-foreground hover:bg-panel-raised hover:text-foreground',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      selected === object.id ? 'bg-signal' : 'bg-muted-foreground/50',
                    )}
                  />
                  <span className="truncate">{object.name}</span>
                  <span className="ml-auto">
                    <Hud>{format.number(object.count)}</Hud>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border border-line bg-panel">
          <div className="border-b border-line px-3 py-2.5">
            <Hud>{t('properties')}</Hud>
          </div>
          <dl className="grid gap-2 px-3 py-3">
            {properties.map((property) => (
              <div key={property.label} className="flex items-baseline justify-between gap-3">
                <dt>
                  <Hud>{property.label}</Hud>
                </dt>
                <dd className="truncate">
                  <Hud strong>{property.value}</Hud>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
