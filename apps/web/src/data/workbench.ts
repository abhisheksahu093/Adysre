/**
 * Material samples for the home-page workbench.
 *
 * ─── Server-only ────────────────────────────────────────────────────────────
 * This module imports the full palette, gradient, pattern and texture
 * catalogues. Importing it into a Client Component would ship all four to the
 * browser. Import it from a Server Component and pass the projections below as
 * props, the same rule `@/data/library-stats` follows.
 *
 * Nothing here is a hand-picked list of hex values: every sample is drawn from
 * the published catalogue and ordered by the same `likes` figure the library
 * pages call "trending", so shipping a new palette can change what the home
 * page shows without an edit here (Rule 6 - never hardcode).
 */

import { PALETTES } from 'adysre/palettes';
import { GRADIENTS, gradientToCss } from 'adysre/gradients';
import { ICONS, type IconCategoryId } from 'adysre/icons';
import { PATTERNS, patternToStyle } from 'adysre/patterns';
import { TEXTURES, textureToStyle } from 'adysre/textures';
import type { CSSProperties } from 'react';

/** A palette, reduced to what a preview needs. */
export interface PaletteSample {
  id: string;
  name: string;
  colors: string[];
}

/** Any surface material (gradient, pattern, texture) as ready-to-apply CSS. */
export interface SurfaceSample {
  id: string;
  name: string;
  /** The material's kind, used as its caption. */
  kind: string;
  style: CSSProperties;
}

/**
 * One icon, reduced to what a preview needs.
 *
 * The authored SVG body travels rather than the component: a component cannot
 * cross into a Client Component, and `IconGlyph` renders a body at any size,
 * weight and colour. Twelve bodies are a few hundred bytes; the 448 components
 * are not.
 */
export interface IconSample {
  id: string;
  /** Human-readable title, e.g. `Arrow Up Right`. */
  title: string;
  /** The icon's authored SVG children, for `IconGlyph`. */
  body: string;
  /** Filed-under group, so a preview can caption it with a translated label. */
  category: IconCategoryId;
}

/** Most-liked first, so the samples are the catalogue's own front page. */
function trending<T extends { likes: number }>(items: T[], count: number): T[] {
  return [...items].sort((a, b) => b.likes - a.likes).slice(0, count);
}

/**
 * An even stride through a sorted list.
 *
 * Icons carry no `likes` and are sorted by category, so the first N would all be
 * interface arrows. Walking the whole set at a fixed step lands on every group,
 * which is what a sample of an icon library is supposed to show.
 */
function spread<T>(items: T[], count: number): T[] {
  if (items.length <= count) return [...items];
  const stride = items.length / count;
  return Array.from({ length: count }, (_, index) => items[Math.floor(index * stride)]!);
}

/** How many of each material the artboard and the materials panel show. */
const ARTBOARD_PALETTE_COUNT = 8;
const ARTBOARD_GRADIENT_COUNT = 6;
const ARTBOARD_SURFACE_COUNT = 6;
const ARTBOARD_ICON_COUNT = 18;
const PANEL_SAMPLE_COUNT = 12;
/**
 * Icons are small and read in a glance, so their shelf shows far more of them
 * than a shelf of palettes can: three full rows of ten, which is enough of the
 * catalogue to see its range rather than a token sample of it.
 */
const PANEL_ICON_COUNT = 30;

/** A catalogue icon, projected for a preview. */
function toIconSample({ name, title, body, category }: (typeof ICONS)[number]): IconSample {
  return { id: name, title, body, category };
}

/** Palettes the artboard object can be recoloured with. */
export const ARTBOARD_PALETTES: PaletteSample[] = trending(PALETTES, ARTBOARD_PALETTE_COUNT).map(
  ({ id, name, colors }) => ({ id, name, colors }),
);

/** Gradients the artboard tile can be repainted with. */
export const ARTBOARD_GRADIENTS: SurfaceSample[] = trending(
  GRADIENTS,
  ARTBOARD_GRADIENT_COUNT,
).map((gradient) => ({
  id: gradient.id,
  name: gradient.name,
  kind: gradient.type,
  style: { backgroundImage: gradientToCss(gradient) },
}));

/** Patterns the artboard tile can be repainted with. */
export const ARTBOARD_PATTERNS: SurfaceSample[] = trending(PATTERNS, ARTBOARD_SURFACE_COUNT).map(
  (pattern) => ({
    id: pattern.id,
    name: pattern.name,
    kind: pattern.type,
    style: patternToStyle(pattern),
  }),
);

/** Textures the artboard tile can be repainted with. */
export const ARTBOARD_TEXTURES: SurfaceSample[] = trending(TEXTURES, ARTBOARD_SURFACE_COUNT).map(
  (texture) => ({
    id: texture.id,
    name: texture.name,
    kind: texture.type,
    style: textureToStyle(texture),
  }),
);

/** The icon set on the artboard, spread across the catalogue's categories. */
export const ARTBOARD_ICONS: IconSample[] = spread(ICONS, ARTBOARD_ICON_COUNT).map(toIconSample);

/** The icon shelf in the materials panel. */
export const ICON_SAMPLES: IconSample[] = spread(ICONS, PANEL_ICON_COUNT).map(toIconSample);

/** The palette shelf in the materials panel. */
export const PALETTE_SAMPLES: PaletteSample[] = trending(PALETTES, PANEL_SAMPLE_COUNT).map(
  ({ id, name, colors }) => ({ id, name, colors }),
);

/** The gradient shelf in the materials panel. */
export const GRADIENT_SAMPLES: SurfaceSample[] = trending(GRADIENTS, PANEL_SAMPLE_COUNT).map(
  (gradient) => ({
    id: gradient.id,
    name: gradient.name,
    kind: gradient.type,
    style: { backgroundImage: gradientToCss(gradient) },
  }),
);

/** The pattern shelf. Patterns paint themselves entirely from CSS. */
export const PATTERN_SAMPLES: SurfaceSample[] = trending(PATTERNS, PANEL_SAMPLE_COUNT).map(
  (pattern) => ({
    id: pattern.id,
    name: pattern.name,
    kind: pattern.type,
    style: patternToStyle(pattern),
  }),
);

/** The texture shelf. */
export const TEXTURE_SAMPLES: SurfaceSample[] = trending(TEXTURES, PANEL_SAMPLE_COUNT).map(
  (texture) => ({
    id: texture.id,
    name: texture.name,
    kind: texture.type,
    style: textureToStyle(texture),
  }),
);
