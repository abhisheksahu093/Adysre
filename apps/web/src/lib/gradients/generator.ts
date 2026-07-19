/**
 * Generate a gradient three ways: from typed colours, from a reference image,
 * or from a written brief (name / colours / style / notes).
 *
 * Colour extraction is reused from the palette generator (on-device canvas
 * quantisation), then shaped into gradient stops. The brief path is colour
 * theory: a chosen style seeds a base hue and gradient type; any named colours
 * become the stops. `GradientGenerator` is the seam a real service can slot
 * behind later. Nothing leaves the browser.
 */

import { harmony, hexToHsl, hslToHex, type HarmonyScheme } from '@/lib/palettes/color';
import { localPaletteGenerator } from '@/lib/palettes/generator';
import type { Gradient, GradientStop, GradientType } from '@/data/gradients';

export type GradientSource = 'colors' | 'image' | 'brief';

export interface GeneratedGradient {
  gradient: Gradient;
  source: GradientSource;
}

export interface GradientBrief {
  name?: string;
  colors?: string;
  style?: string;
  comments?: string;
}

export interface GradientGenerator {
  fromColors(text: string): GeneratedGradient;
  fromImage(file: File): Promise<GeneratedGradient>;
  fromBrief(brief: GradientBrief): GeneratedGradient;
}

/** Styles offered in the brief form; each seeds hue, type and angle. */
export const GRADIENT_STYLES = [
  { id: 'vibrant', hue: 330, scheme: 'complementary' as HarmonyScheme, type: 'linear' as GradientType, angle: 135 },
  { id: 'sunset', hue: 20, scheme: 'analogous' as HarmonyScheme, type: 'linear' as GradientType, angle: 120 },
  { id: 'ocean', hue: 200, scheme: 'analogous' as HarmonyScheme, type: 'linear' as GradientType, angle: 135 },
  { id: 'forest', hue: 140, scheme: 'analogous' as HarmonyScheme, type: 'linear' as GradientType, angle: 160 },
  { id: 'pastel', hue: 280, scheme: 'analogous' as HarmonyScheme, type: 'linear' as GradientType, angle: 135 },
  { id: 'neon', hue: 300, scheme: 'complementary' as HarmonyScheme, type: 'linear' as GradientType, angle: 90 },
  { id: 'dark', hue: 230, scheme: 'analogous' as HarmonyScheme, type: 'radial' as GradientType, angle: 0 },
  { id: 'warm', hue: 35, scheme: 'analogous' as HarmonyScheme, type: 'linear' as GradientType, angle: 120 },
  { id: 'cool', hue: 210, scheme: 'analogous' as HarmonyScheme, type: 'linear' as GradientType, angle: 135 },
  { id: 'monochrome', hue: 220, scheme: 'monochrome' as HarmonyScheme, type: 'linear' as GradientType, angle: 135 },
] as const;

const FALLBACK_STYLE = GRADIENT_STYLES[0];

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Even positions 0…100 across `n` stops. */
function evenStops(colors: string[]): GradientStop[] {
  const n = colors.length;
  return colors.map((color, i) => ({
    color,
    position: n <= 1 ? 0 : Math.round((i * 100) / (n - 1)),
  }));
}

function nudgeForStyle(colors: string[], style: string): string[] {
  if (style === 'pastel') {
    return colors.map((c) => {
      const { h, s, l } = hexToHsl(c);
      return hslToHex({ h, s: Math.min(s, 55), l: Math.max(l, 78) });
    });
  }
  if (style === 'dark') {
    return colors.map((c) => {
      const { h, s, l } = hexToHsl(c);
      return hslToHex({ h, s, l: Math.max(12, Math.min(l, 32)) });
    });
  }
  if (style === 'neon' || style === 'vibrant') {
    return colors.map((c) => {
      const { h, s, l } = hexToHsl(c);
      return hslToHex({ h, s: Math.min(100, s + 20), l: Math.min(Math.max(l, 48), 60) });
    });
  }
  return colors;
}

function makeGradient(
  name: string,
  colors: string[],
  type: GradientType,
  angle: number,
): Gradient {
  const stops = evenStops(colors.length ? colors.slice(0, 4) : ['#4361ee', '#7209b7']);
  return {
    id: `gen-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    name,
    type,
    angle,
    stops,
    tags: ['generated'],
    likes: 0,
  };
}

export const localGradientGenerator: GradientGenerator = {
  fromColors(text) {
    // Two or three stops read best; reuse the palette parser for tokenising.
    const colors = localPaletteGenerator.fromColors(text).colors.slice(0, 3);
    return {
      gradient: makeGradient('Custom gradient', colors, 'linear', 135),
      source: 'colors',
    };
  },

  async fromImage(file) {
    const palette = await localPaletteGenerator.fromImage(file);
    // Pick spaced colours (dark→light) for a gradient with contrast.
    const sorted = [...palette.colors].sort((a, b) => hexToHsl(a).l - hexToHsl(b).l);
    const picks = sorted.length >= 3 ? [sorted[0], sorted[Math.floor(sorted.length / 2)], sorted[sorted.length - 1]] : sorted;
    return {
      gradient: makeGradient('Reference gradient', picks.filter(Boolean) as string[], 'linear', 135),
      source: 'image',
    };
  },

  fromBrief(brief) {
    const style = GRADIENT_STYLES.find((s) => s.id === brief.style) ?? FALLBACK_STYLE;
    const anchors = brief.colors ? localPaletteGenerator.fromColors(brief.colors).colors : [];
    const seed = hashString(`${brief.name ?? ''}|${brief.style ?? ''}|${brief.comments ?? ''}|${brief.colors ?? ''}`);

    const baseHex = anchors[0] ?? hslToHex({ h: (style.hue + (seed % 30) - 15 + 360) % 360, s: 72, l: 55 });
    const count = anchors.length >= 2 ? Math.min(anchors.length, 3) : ((seed >> 3) % 2) + 2;

    let colors = anchors.length >= 2 ? anchors.slice(0, 3) : harmony(baseHex, style.scheme, count);
    colors = nudgeForStyle(colors, style.id);

    // A little angle variety, seeded so the same brief is stable.
    const angle = style.type === 'linear' ? [90, 120, 135, 160][seed % 4] ?? 135 : style.angle;
    return {
      gradient: makeGradient(brief.name?.trim() || 'My gradient', colors, style.type, angle),
      source: 'brief',
    };
  },
};
