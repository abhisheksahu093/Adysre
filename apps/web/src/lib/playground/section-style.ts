/**
 * Per-section styling for the playground: background, text colour and border.
 *
 * A section's style is plain, serializable data - a background that is either a
 * flat colour or a whole gradient / pattern / texture picked from those
 * libraries, plus an optional text colour and border. Keeping the picked asset
 * itself (not just an id) means a saved page keeps rendering even if the
 * curated set changes, and the exporters can rebuild its CSS with no lookups.
 *
 * One module owns every representation of that data:
 *  - `sectionStyleToInline` for the live preview (React style object),
 *  - `sectionStyleCss` for the exported stylesheet (real CSS text),
 * so the canvas and the downloaded code can never drift apart.
 *
 * Everything here is resolution-independent - colours, gradients with percent
 * stops, repeating tiles - so a styled section stays correct at every width.
 */

import type { CSSProperties } from 'react';
import type { Gradient } from '@/data/gradients';
import type { Pattern } from '@/data/patterns';
import type { Texture } from '@/data/textures';
import { gradientToCss } from '@/lib/gradients/css';
import { patternToStyle } from '@/lib/patterns/css';
import { textureToStyle } from '@/lib/textures/css';

export type SectionBackgroundKind = 'none' | 'color' | 'gradient' | 'pattern' | 'texture';

export type SectionBackground =
  | { kind: 'none' }
  | { kind: 'color'; color: string }
  | { kind: 'gradient'; gradient: Gradient }
  | { kind: 'pattern'; pattern: Pattern }
  | { kind: 'texture'; texture: Texture };

export type SectionBorderStyle = 'solid' | 'dashed' | 'dotted';

export interface SectionBorder {
  /** Border width in px; `0` means no border. */
  width: number;
  style: SectionBorderStyle;
  color: string;
  /** Corner radius in px. */
  radius: number;
}

/** Every customization one section can carry. All parts are optional. */
export interface SectionStyle {
  background?: SectionBackground;
  /** Applied to the section's copy - headings, paragraphs, list items, labels. */
  textColor?: string;
  border?: SectionBorder;
}

/**
 * A change to a style. Unlike `Partial<SectionStyle>`, an explicit `undefined`
 * is meaningful here - it clears that part of the styling - which the project's
 * `exactOptionalPropertyTypes` would otherwise reject.
 */
export type SectionStylePatch = { [K in keyof SectionStyle]?: SectionStyle[K] | undefined };

export const DEFAULT_BORDER: SectionBorder = {
  width: 0,
  style: 'solid',
  color: '#e5e7eb',
  radius: 0,
};

export const BORDER_STYLES: SectionBorderStyle[] = ['solid', 'dashed', 'dotted'];

/** The elements a section's text colour is applied to, as a CSS selector list. */
const TEXT_ELEMENTS =
  'h1,h2,h3,h4,h5,h6,p,li,span,label,dt,dd,blockquote,figcaption,strong,em,small,td,th';

/**
 * Links and buttons keep their own colours: they usually sit on their own
 * background (a filled CTA), where forcing the section's text colour would
 * destroy the contrast the component was designed with.
 */
const TEXT_EXCLUSIONS = ':not(a):not(button):not(a *):not(button *)';

/** The attribute the preview and the exported page both mark a section with. */
export const SECTION_ATTR = 'data-adysre-section';

/** Raw background declarations, as camelCase React style properties. */
function backgroundStyle(background: SectionBackground | undefined): CSSProperties {
  if (!background || background.kind === 'none') return {};
  switch (background.kind) {
    case 'color':
      return { backgroundColor: background.color };
    case 'gradient':
      return {
        backgroundColor: background.gradient.stops[0]?.color,
        backgroundImage: gradientToCss(background.gradient),
      };
    case 'pattern':
      return patternToStyle(background.pattern);
    case 'texture':
      return textureToStyle(background.texture);
  }
}

/** Border + radius declarations, skipped entirely when the width is zero. */
function borderStyle(border: SectionBorder | undefined): CSSProperties {
  if (!border) return {};
  const out: CSSProperties = {};
  if (border.width > 0) {
    out.borderWidth = `${border.width}px`;
    out.borderStyle = border.style;
    out.borderColor = border.color;
  }
  if (border.radius > 0) {
    out.borderRadius = `${border.radius}px`;
    // A radius only reads as a rounded card if the background is clipped to it.
    out.overflow = 'hidden';
  }
  return out;
}

/** The whole style as one React style object, for the live preview wrapper. */
export function sectionStyleToInline(style: SectionStyle | undefined): CSSProperties {
  if (!style) return {};
  return {
    ...backgroundStyle(style.background),
    ...borderStyle(style.border),
    ...(style.textColor ? { color: style.textColor } : {}),
  };
}

/** True when this style changes anything at all (drives badges and wrappers). */
export function hasSectionStyle(style: SectionStyle | undefined): boolean {
  return sectionStyleEditCount(style) > 0;
}

/** How many of the three groups - background, text, border - are customized. */
export function sectionStyleEditCount(style: SectionStyle | undefined): number {
  if (!style) return 0;
  let n = 0;
  if (style.background && style.background.kind !== 'none') n++;
  if (style.textColor) n++;
  if (style.border && (style.border.width > 0 || style.border.radius > 0)) n++;
  return n;
}

/** camelCase → kebab-case, for turning a style object into CSS text. */
function kebab(property: string): string {
  return property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

/**
 * One section's rules as CSS text, scoped to `selector`.
 *
 * Emits the box rules (background / border / colour) plus a second rule that
 * paints the section's copy, so the text colour beats the utility classes the
 * library sections ship with. Returns `''` when nothing is customized.
 */
export function sectionStyleCss(selector: string, style: SectionStyle | undefined): string {
  if (!hasSectionStyle(style)) return '';
  const declarations = Object.entries(sectionStyleToInline(style))
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([property, value]) => `  ${kebab(property)}: ${String(value)};`);

  const rules = [`${selector} {\n${declarations.join('\n')}\n}`];

  // Sections paint their own background (`bg-white`, a hero gradient, …), which
  // would sit on top of the chosen one. Clear it on the section's ROOT only, so
  // the new background shows through while nested cards, badges and filled
  // buttons keep theirs.
  if (style?.background && style.background.kind !== 'none') {
    rules.push(
      `${selector} > * {\n  background-color: transparent !important;\n  background-image: none !important;\n}`,
    );
  }

  if (style?.textColor) {
    const targets = TEXT_ELEMENTS.split(',')
      .map((tag) => `${selector} ${tag.trim()}${TEXT_EXCLUSIONS}`)
      .join(',\n');
    rules.push(`${targets} {\n  color: ${style.textColor} !important;\n}`);
  }

  return rules.join('\n\n');
}

/**
 * The stylesheet for a whole page: one block per styled section, keyed by the
 * slot id the exported markup tags each wrapper with.
 */
export function pageSectionStylesCss(
  entries: { slotId: string; title: string; style: SectionStyle | undefined }[],
): string {
  const blocks = entries
    .filter(({ style }) => hasSectionStyle(style))
    .map(({ slotId, title, style }) =>
      `/* ${title} */\n${sectionStyleCss(`[${SECTION_ATTR}="${slotId}"]`, style)}`,
    );
  if (blocks.length === 0) return '';
  return [
    '/* Section styling exported from the ADYSRE playground. */',
    '',
    ...blocks,
  ].join('\n\n').concat('\n');
}

/** postMessage shape carrying a section's style into its preview iframe. */
export interface PreviewStyleMessage {
  type: 'adysre:preview-style';
  slug: string;
  style: SectionStyle | null;
}
