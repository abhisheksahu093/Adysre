/**
 * Generate a palette three ways: from typed hex codes, from a reference image,
 * or from a written brief (name / wanted colours / business / notes).
 *
 * As with the template generator, there is no model behind the brief path - it
 * is colour theory: the business type seeds a base hue, any colours the user
 * names become anchors, and a harmony scheme fills the rest. The image path
 * quantises pixels on-device. Both are deterministic and never leave the
 * browser. `PaletteGenerator` is the seam a real service can slot behind later.
 */

import {
  harmony,
  hexToHsl,
  hslToHex,
  isHex,
  normalizeHex,
  colorDistance,
  sortByHue,
  type HarmonyScheme,
} from './color';

export type PaletteSource = 'colors' | 'image' | 'brief';

export interface GeneratedPalette {
  colors: string[];
  source: PaletteSource;
}

export interface PaletteBrief {
  name?: string;
  /** Free text of colours the user wants (names or hex). */
  colors?: string;
  business?: string;
  comments?: string;
}

export interface PaletteGenerator {
  fromColors(text: string): GeneratedPalette;
  fromImage(file: File): Promise<GeneratedPalette>;
  fromBrief(brief: PaletteBrief): GeneratedPalette;
}

/** Business types offered in the brief form; each seeds a base hue and mood. */
export const BUSINESS_TYPES = [
  { id: 'technology', hue: 232, scheme: 'complementary' as HarmonyScheme },
  { id: 'finance', hue: 210, scheme: 'analogous' as HarmonyScheme },
  { id: 'health', hue: 162, scheme: 'analogous' as HarmonyScheme },
  { id: 'food', hue: 22, scheme: 'triadic' as HarmonyScheme },
  { id: 'fashion', hue: 330, scheme: 'complementary' as HarmonyScheme },
  { id: 'education', hue: 45, scheme: 'triadic' as HarmonyScheme },
  { id: 'realEstate', hue: 205, scheme: 'analogous' as HarmonyScheme },
  { id: 'travel', hue: 190, scheme: 'analogous' as HarmonyScheme },
  { id: 'creative', hue: 284, scheme: 'triadic' as HarmonyScheme },
  { id: 'eco', hue: 128, scheme: 'analogous' as HarmonyScheme },
  { id: 'fitness', hue: 8, scheme: 'complementary' as HarmonyScheme },
  { id: 'beauty', hue: 322, scheme: 'analogous' as HarmonyScheme },
  { id: 'luxury', hue: 44, scheme: 'monochrome' as HarmonyScheme },
  { id: 'other', hue: 222, scheme: 'analogous' as HarmonyScheme },
] as const;

export type BusinessTypeId = (typeof BUSINESS_TYPES)[number]['id'];

/** Guaranteed fallback so lookups never yield undefined under strict indexing. */
const FALLBACK_TYPE = { id: 'other' as const, hue: 222, scheme: 'analogous' as HarmonyScheme };

const DEFAULT_COUNT = 5;

/** Named colours the brief text can reference, mapped to a representative hex. */
const COLOR_WORDS: Record<string, string> = {
  red: '#e63946', orange: '#f77f00', yellow: '#ffd60a', gold: '#d4af37',
  green: '#2a9d8f', teal: '#0891b2', cyan: '#06b6d4', blue: '#1d4ed8',
  navy: '#03045e', indigo: '#4338ca', purple: '#7b2cbf', violet: '#8b5cf6',
  pink: '#ec4899', magenta: '#d6336c', brown: '#7f4f24', beige: '#e0c9a6',
  black: '#111111', white: '#f8f9fa', gray: '#6b7280', grey: '#6b7280',
};

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Pull every hex and known colour word out of free text, in order. */
function parseColorTokens(text: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (hex: string | null) => {
    if (hex && !seen.has(hex)) {
      seen.add(hex);
      out.push(hex);
    }
  };
  for (const raw of text.split(/[\s,;/|]+/)) {
    const token = raw.trim().toLowerCase();
    if (!token) continue;
    if (isHex(token)) push(normalizeHex(token));
    else if (COLOR_WORDS[token]) push(COLOR_WORDS[token]);
  }
  return out;
}

/** Nudge saturation/lightness from mood words found in free text. */
function moodAdjust(colors: string[], text: string): string[] {
  const t = text.toLowerCase();
  const pastel = /\bpastel|soft|light|calm\b/.test(t);
  const vibrant = /\bvibrant|bold|bright|energetic|neon\b/.test(t);
  const dark = /\bdark|moody|luxur|premium|elegant\b/.test(t);
  const muted = /\bmuted|earthy|natural|minimal\b/.test(t);
  if (!(pastel || vibrant || dark || muted)) return colors;
  return colors.map((c) => {
    const { h, s, l } = hexToHsl(c);
    let ns = s;
    let nl = l;
    // Apply darkening/muting first so an explicit light/pastel intent, applied
    // last, wins when the brief mixes signals (e.g. "premium but light").
    if (dark) { nl = Math.max(14, l - 22); }
    if (muted) { ns = Math.max(12, s - 28); }
    if (vibrant) { ns = Math.min(100, s + 22); nl = Math.min(Math.max(nl, 45), 60); }
    if (pastel) { ns = Math.min(ns, 55); nl = Math.max(nl, 78); }
    return hslToHex({ h, s: ns, l: nl });
  });
}

/** Fill/trim a colour list to `count`, extending from harmony off the first. */
function ensureCount(colors: string[], count: number, scheme: HarmonyScheme): string[] {
  const unique: string[] = [];
  for (const c of colors) {
    if (!unique.some((u) => colorDistance(u, c) < 18)) unique.push(c);
  }
  if (unique.length >= count) return unique.slice(0, count);
  const base = unique[0] ?? '#4361ee';
  for (const extra of harmony(base, scheme, count)) {
    if (unique.length >= count) break;
    if (!unique.some((u) => colorDistance(u, extra) < 18)) unique.push(extra);
  }
  return unique.slice(0, count);
}

async function decodeToCanvasData(file: File): Promise<Uint8ClampedArray> {
  const MAX = 120;
  let source: CanvasImageSource;
  let w0: number;
  let h0: number;
  let cleanup = () => {};
  if (typeof createImageBitmap === 'function') {
    const bmp = await createImageBitmap(file);
    source = bmp;
    w0 = bmp.width;
    h0 = bmp.height;
    cleanup = () => bmp.close();
  } else {
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const el = new Image();
      el.onload = () => res(el);
      el.onerror = () => rej(new Error('decode'));
      el.src = url;
    });
    source = img;
    w0 = img.naturalWidth || 1;
    h0 = img.naturalHeight || 1;
    cleanup = () => URL.revokeObjectURL(url);
  }
  try {
    const scale = Math.min(1, MAX / Math.max(w0, h0));
    const w = Math.max(1, Math.round(w0 * scale));
    const h = Math.max(1, Math.round(h0 * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('no-2d-context');
    ctx.drawImage(source, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h).data;
  } finally {
    cleanup();
  }
}

/** Quantise pixels and return the most-used, well-separated colours. */
function quantize(data: Uint8ClampedArray, count: number): string[] {
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] ?? 255;
    if (a < 128) continue;
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    // 4 bits per channel keeps buckets coarse enough to group similar pixels.
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const cur = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
    cur.r += r;
    cur.g += g;
    cur.b += b;
    cur.n += 1;
    buckets.set(key, cur);
  }
  const ranked = [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .map((c) => `#${[c.r, c.g, c.b].map((v) => Math.round(v / c.n).toString(16).padStart(2, '0')).join('')}`);

  const chosen: string[] = [];
  for (const c of ranked) {
    if (chosen.length >= count) break;
    if (!chosen.some((x) => colorDistance(x, c) < 40)) chosen.push(c);
  }
  // If the image was near-monochrome, top up from what's ranked.
  for (const c of ranked) {
    if (chosen.length >= count) break;
    if (!chosen.includes(c)) chosen.push(c);
  }
  return chosen.length ? chosen : ['#4361ee'];
}

export const localPaletteGenerator: PaletteGenerator = {
  fromColors(text) {
    const parsed = parseColorTokens(text);
    const base = parsed[0] ?? '#4361ee';
    const scheme: HarmonyScheme = 'analogous';
    return { colors: sortByHue(ensureCount(parsed.length ? parsed : [base], DEFAULT_COUNT, scheme)), source: 'colors' };
  },

  async fromImage(file) {
    const data = await decodeToCanvasData(file);
    return { colors: sortByHue(quantize(data, DEFAULT_COUNT)), source: 'image' };
  },

  fromBrief(brief) {
    const type = BUSINESS_TYPES.find((b) => b.id === brief.business) ?? FALLBACK_TYPE;
    const anchors = parseColorTokens(brief.colors ?? '');
    const seed = hashString(`${brief.name ?? ''}|${brief.business ?? ''}|${brief.comments ?? ''}|${brief.colors ?? ''}`);

    // Base hue: an anchor colour wins; otherwise the business hue with jitter.
    const baseHex = anchors[0] ?? hslToHex({ h: (type.hue + (seed % 24) - 12 + 360) % 360, s: 68, l: 52 });

    const schemes: HarmonyScheme[] = ['analogous', 'complementary', 'triadic'];
    const scheme = anchors.length >= 2 ? 'analogous' : type.scheme === 'monochrome' ? 'monochrome' : schemes[seed % schemes.length] ?? type.scheme;

    let colors = [...anchors, ...harmony(baseHex, scheme, DEFAULT_COUNT)];
    colors = ensureCount(colors, DEFAULT_COUNT, scheme);
    colors = moodAdjust(colors, `${brief.comments ?? ''} ${brief.name ?? ''}`);
    return { colors: sortByHue(colors), source: 'brief' };
  },
};
