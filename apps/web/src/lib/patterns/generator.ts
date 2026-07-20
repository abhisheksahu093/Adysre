/**
 * Generate a pattern three ways: from typed colours, from a reference image, or
 * from a written brief (name / colours / style / notes).
 *
 * Colour extraction is reused from the palette generator (on-device canvas
 * quantisation), then shaped into a foreground/background pair. The brief path
 * is colour theory: a chosen style seeds a hue, repeat type and tile size.
 * `PatternGenerator` is the seam a real service can slot behind later. Nothing
 * leaves the browser.
 */

import { hexToHsl, hslToHex } from '@/lib/palettes/color';
import { localPaletteGenerator } from '@/lib/palettes/generator';
import type { Pattern, PatternType } from '@/data/patterns';

export type PatternSource = 'colors' | 'image' | 'brief';

export interface GeneratedPattern {
  pattern: Pattern;
  source: PatternSource;
}

export interface PatternBrief {
  name?: string;
  colors?: string;
  style?: string;
  comments?: string;
}

export interface PatternGenerator {
  fromColors(text: string): GeneratedPattern;
  fromImage(file: File): Promise<GeneratedPattern>;
  fromBrief(brief: PatternBrief): GeneratedPattern;
}

/** Styles offered in the brief form; each seeds a type, hue, tile and mood. */
export const PATTERN_STYLES = [
  { id: 'dots', type: 'dots' as PatternType, hue: 220, dark: false, size: 22, angle: 0 },
  { id: 'grid', type: 'grid' as PatternType, hue: 210, dark: false, size: 24, angle: 0 },
  { id: 'blueprint', type: 'grid' as PatternType, hue: 220, dark: true, size: 24, angle: 0 },
  { id: 'stripes', type: 'lines' as PatternType, hue: 20, dark: false, size: 14, angle: 45 },
  { id: 'diagonal', type: 'lines' as PatternType, hue: 260, dark: true, size: 14, angle: 45 },
  { id: 'checker', type: 'checkerboard' as PatternType, hue: 200, dark: false, size: 28, angle: 0 },
  { id: 'hatch', type: 'crosshatch' as PatternType, hue: 150, dark: false, size: 16, angle: 0 },
  { id: 'neon', type: 'dots' as PatternType, hue: 300, dark: true, size: 20, angle: 0 },
  { id: 'pastel', type: 'dots' as PatternType, hue: 280, dark: false, size: 24, angle: 0 },
  { id: 'mono', type: 'grid' as PatternType, hue: 220, dark: false, size: 22, angle: 0 },
] as const;

const FALLBACK_STYLE = PATTERN_STYLES[0];
const TYPES: PatternType[] = ['dots', 'grid', 'lines', 'checkerboard', 'crosshatch'];

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A field colour derived from the mark colour - near-white or near-black. */
function fieldColor(fgHex: string, dark: boolean): string {
  const { h, s } = hexToHsl(fgHex);
  return dark ? hslToHex({ h, s: Math.min(s, 40), l: 8 }) : hslToHex({ h, s: Math.min(s, 22), l: 97 });
}

function makePattern(name: string, fg: string, bg: string, type: PatternType, size: number, angle: number): Pattern {
  return {
    id: `gen-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    name,
    type,
    fg,
    bg,
    size,
    angle,
    tags: ['generated'],
    likes: 0,
  };
}

export const localPatternGenerator: PatternGenerator = {
  fromColors(text) {
    const colors = localPaletteGenerator.fromColors(text).colors;
    // The most saturated colour reads best as the mark.
    const fg = [...colors].sort((a, b) => hexToHsl(b).s - hexToHsl(a).s)[0] ?? '#4361ee';
    const type = TYPES[hashString(text) % TYPES.length] ?? 'dots';
    return { pattern: makePattern('Custom pattern', fg, fieldColor(fg, false), type, 22, 45), source: 'colors' };
  },

  async fromImage(file) {
    const palette = await localPaletteGenerator.fromImage(file);
    const fg = [...palette.colors].sort((a, b) => hexToHsl(b).s - hexToHsl(a).s)[0] ?? '#4361ee';
    const type = TYPES[hashString(file.name) % TYPES.length] ?? 'dots';
    return { pattern: makePattern('Reference pattern', fg, fieldColor(fg, false), type, 22, 45), source: 'image' };
  },

  fromBrief(brief) {
    const style = PATTERN_STYLES.find((s) => s.id === brief.style) ?? FALLBACK_STYLE;
    const anchors = brief.colors ? localPaletteGenerator.fromColors(brief.colors).colors : [];
    const seed = hashString(`${brief.name ?? ''}|${brief.style ?? ''}|${brief.comments ?? ''}|${brief.colors ?? ''}`);
    const fg = anchors[0] ?? hslToHex({ h: (style.hue + (seed % 30) - 15 + 360) % 360, s: style.dark ? 65 : 60, l: style.dark ? 60 : 42 });
    return {
      pattern: makePattern(brief.name?.trim() || 'My pattern', fg, fieldColor(fg, style.dark), style.type, style.size, style.angle),
      source: 'brief',
    };
  },
};
