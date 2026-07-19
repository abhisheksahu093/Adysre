/**
 * Apply a palette to a live preview by overriding Tailwind's colour variables.
 *
 * Tailwind v4 emits every palette colour as a CSS variable (`--color-blue-600`)
 * and utilities reference it, so re-defining those variables on the preview
 * document recolours `bg-blue-600`, `text-indigo-500`, `ring-emerald-600` and
 * the rest - no per-component rework. We map the library's accent families onto
 * tonal scales derived from the palette, and leave the neutral greys alone so
 * layout and text contrast survive.
 */

import { hexToHsl, hslToHex, normalizeHex } from './color';

/** Shade → target lightness (%), matching Tailwind's rough tonal spacing. */
const SHADES: readonly [number, number][] = [
  [50, 97],
  [100, 94],
  [200, 87],
  [300, 78],
  [400, 67],
  [500, 57],
  [600, 49],
  [700, 41],
  [800, 33],
  [900, 26],
  [950, 17],
];

// Accent families, grouped so a multi-hue palette spreads across them while a
// monochrome palette simply tints them all the same way.
const PRIMARY_FAMILIES = ['blue', 'indigo', 'sky', 'violet', 'purple', 'cyan', 'fuchsia'];
const SECONDARY_FAMILIES = ['emerald', 'teal', 'green', 'lime'];
const TERTIARY_FAMILIES = ['rose', 'pink', 'red', 'orange', 'amber'];

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** A base colour expanded into a 50…950 tonal scale on its own hue. */
function tonalScale(baseHex: string): Record<number, string> {
  const { h, s } = hexToHsl(baseHex);
  const out: Record<number, string> = {};
  for (const [shade, l] of SHADES) {
    // Ease saturation off at the extremes so tints/shades read natural.
    const sat = shade <= 100 ? clamp(s, 0, 42) : shade >= 900 ? clamp(s, 0, 58) : s;
    out[shade] = hslToHex({ h, s: sat, l });
  }
  return out;
}

/** How usable a colour is as an accent: saturated and mid-toned wins. */
function vividness(hex: string): number {
  const { s, l } = hexToHsl(hex);
  return s * (1 - Math.abs(l - 55) / 70);
}

/** Pick three accent bases from the palette, reusing when it has fewer hues. */
function pickAccents(colors: string[]): [string, string, string] {
  const valid = colors.map((c) => normalizeHex(c)).filter((c): c is string => c !== null);
  const ranked = [...valid].sort((a, b) => vividness(b) - vividness(a));
  const primary = ranked[0] ?? '#3b82f6';
  const secondary = ranked[1] ?? primary;
  const tertiary = ranked[2] ?? secondary;
  return [primary, secondary, tertiary];
}

/**
 * The `--color-*` overrides for a palette, ready to set on a document root.
 * Empty when the palette has no usable colours.
 */
export function paletteToCssVars(colors: string[]): Record<string, string> {
  if (colors.length === 0) return {};
  const [primary, secondary, tertiary] = pickAccents(colors);
  const vars: Record<string, string> = {};
  const assign = (families: readonly string[], base: string) => {
    const scale = tonalScale(base);
    for (const family of families) {
      for (const [shade, hex] of Object.entries(scale)) {
        vars[`--color-${family}-${shade}`] = hex;
      }
    }
  };
  assign(PRIMARY_FAMILIES, primary);
  assign(SECONDARY_FAMILIES, secondary);
  assign(TERTIARY_FAMILIES, tertiary);
  return vars;
}

/** Serialize a palette for a preview URL: `#03045e,#0077b6` → `03045e,0077b6`. */
export function encodePaletteParam(colors: string[]): string {
  return colors.map((c) => c.replace('#', '')).join(',');
}

/** Parse the `?palette=` param back into `#`-prefixed hex colours. */
export function decodePaletteParam(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => (c.startsWith('#') ? c : `#${c}`));
}
