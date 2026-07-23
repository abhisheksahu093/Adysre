/**
 * Small, dependency-free colour maths for the palette tools.
 *
 * Everything works in sRGB hex (`#rrggbb`). HSL is used for harmony and
 * sorting, relative luminance for choosing legible text over a swatch.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}
export interface Hsl {
  h: number; // 0..360
  s: number; // 0..100
  l: number; // 0..100
}

const HEX_RE = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isHex(value: string): boolean {
  return HEX_RE.test(value.trim());
}

/** Normalise any accepted hex (`#abc`, `abc`, `#aabbcc`) to `#aabbcc` lower-case. */
export function normalizeHex(value: string): string | null {
  const m = value.trim().match(HEX_RE);
  if (!m) return null;
  let hex = m[1] ?? '';
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${hex.toLowerCase()}`;
}

export function hexToRgb(hex: string): Rgb {
  const norm = normalizeHex(hex) ?? '#000000';
  const int = parseInt(norm.slice(1), 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = ln - c / 2;
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

export function hexToHsl(hex: string): Hsl {
  return rgbToHsl(hexToRgb(hex));
}
export function hslToHex(hsl: Hsl): string {
  return rgbToHex(hslToRgb(hsl));
}

/** WCAG relative luminance, 0 (black) … 1 (white). */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio between two colours, 1 … 21. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Black or white - whichever is more legible on this background. */
export function readableText(bg: string): '#000000' | '#ffffff' {
  return luminance(bg) > 0.45 ? '#000000' : '#ffffff';
}

/** Perceptual-ish distance between two colours (weighted RGB). */
export function colorDistance(a: string, b: string): number {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const rMean = (ca.r + cb.r) / 2;
  const dr = ca.r - cb.r;
  const dg = ca.g - cb.g;
  const db = ca.b - cb.b;
  return Math.sqrt(
    (2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db,
  );
}

/** A short human tag for a colour family, used for search and labels. */
export function hueName(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  if (l < 8) return 'black';
  if (l > 92 && s < 12) return 'white';
  if (s < 12) return 'gray';
  const names: [number, string][] = [
    [15, 'red'],
    [45, 'orange'],
    [65, 'yellow'],
    [160, 'green'],
    [200, 'teal'],
    [255, 'blue'],
    [290, 'purple'],
    [330, 'pink'],
    [360, 'red'],
  ];
  for (const [max, name] of names) if (h <= max) return name;
  return 'red';
}

/**
 * Generate a harmonious set of `count` colours from a base, using classic
 * schemes. Deterministic given (base, scheme, count).
 */
export type HarmonyScheme =
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'tetradic'
  | 'monochrome';

export function harmony(baseHex: string, scheme: HarmonyScheme, count: number): string[] {
  const base = hexToHsl(baseHex);
  const out: string[] = [];
  const push = (h: number, s: number, l: number) =>
    out.push(hslToHex({ h: ((h % 360) + 360) % 360, s: clamp(s, 0, 100), l: clamp(l, 0, 100) }));

  const offsets: Record<Exclude<HarmonyScheme, 'monochrome'>, number[]> = {
    analogous: [-40, -20, 0, 20, 40],
    complementary: [0, 20, 180, 200, 160],
    triadic: [0, 120, 240, 30, 150],
    tetradic: [0, 90, 180, 270, 45],
  };

  if (scheme === 'monochrome') {
    for (let i = 0; i < count; i++) {
      const l = 92 - (i * 78) / Math.max(1, count - 1);
      push(base.h, base.s, l);
    }
    return out;
  }

  const list = offsets[scheme];
  for (let i = 0; i < count; i++) {
    const off = list[i % list.length] ?? 0;
    const lTweak = i >= list.length ? (i - list.length + 1) * -12 : 0;
    push(base.h + off, base.s, clamp(base.l + lTweak, 22, 82));
  }
  return out;
}

/** Sort colours by hue then lightness - a pleasant left-to-right order. */
export function sortByHue(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const ha = hexToHsl(a);
    const hb = hexToHsl(b);
    return ha.h - hb.h || hb.l - ha.l;
  });
}
