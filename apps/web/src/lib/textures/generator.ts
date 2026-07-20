/**
 * Generate a texture three ways: from typed colours, from a reference image, or
 * from a written brief. Colour extraction is reused from the palette generator;
 * a chosen style seeds the surface type, strength and scale. Nothing leaves the
 * browser.
 */

import { hexToHsl, hslToHex } from '@/lib/palettes/color';
import { localPaletteGenerator } from '@/lib/palettes/generator';
import type { Texture, TextureType } from '@/data/textures';

export type TextureSource = 'colors' | 'image' | 'brief';

export interface GeneratedTexture {
  texture: Texture;
  source: TextureSource;
}

export interface TextureBrief {
  name?: string;
  colors?: string;
  style?: string;
  comments?: string;
}

export interface TextureGenerator {
  fromColors(text: string): GeneratedTexture;
  fromImage(file: File): Promise<GeneratedTexture>;
  fromBrief(brief: TextureBrief): GeneratedTexture;
}

/** Styles offered in the brief form; each seeds a surface type, mood and knobs. */
export const TEXTURE_STYLES = [
  { id: 'noise', type: 'noise' as TextureType, hue: 220, dark: false, opacity: 40, scale: 120 },
  { id: 'grain', type: 'grain' as TextureType, hue: 220, dark: true, opacity: 35, scale: 90 },
  { id: 'film', type: 'grain' as TextureType, hue: 30, dark: true, opacity: 40, scale: 90 },
  { id: 'paper', type: 'paper' as TextureType, hue: 40, dark: false, opacity: 22, scale: 170 },
  { id: 'craft', type: 'paper' as TextureType, hue: 30, dark: false, opacity: 24, scale: 160 },
  { id: 'carbon', type: 'carbon' as TextureType, hue: 220, dark: true, opacity: 55, scale: 24 },
  { id: 'tech', type: 'carbon' as TextureType, hue: 210, dark: true, opacity: 55, scale: 22 },
  { id: 'fabric', type: 'fabric' as TextureType, hue: 30, dark: false, opacity: 30, scale: 22 },
  { id: 'denim', type: 'fabric' as TextureType, hue: 220, dark: true, opacity: 40, scale: 20 },
  { id: 'linen', type: 'fabric' as TextureType, hue: 40, dark: false, opacity: 26, scale: 24 },
] as const;

const FALLBACK_STYLE = TEXTURE_STYLES[0];
const TYPES: TextureType[] = ['noise', 'grain', 'paper', 'carbon', 'fabric'];

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function fieldColor(fgHex: string, dark: boolean): string {
  const { h, s } = hexToHsl(fgHex);
  return dark ? hslToHex({ h, s: Math.min(s, 40), l: 8 }) : hslToHex({ h, s: Math.min(s, 20), l: 97 });
}

function makeTexture(name: string, fg: string, bg: string, type: TextureType, opacity: number, scale: number): Texture {
  return {
    id: `gen-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    name,
    type,
    fg,
    bg,
    opacity,
    scale,
    tags: ['generated'],
    likes: 0,
  };
}

export const localTextureGenerator: TextureGenerator = {
  fromColors(text) {
    const colors = localPaletteGenerator.fromColors(text).colors;
    const fg = [...colors].sort((a, b) => hexToHsl(b).s - hexToHsl(a).s)[0] ?? '#0f172a';
    const type = TYPES[hashString(text) % TYPES.length] ?? 'noise';
    const scale = type === 'carbon' || type === 'fabric' ? 24 : 120;
    return { texture: makeTexture('Custom texture', fg, fieldColor(fg, false), type, 40, scale), source: 'colors' };
  },

  async fromImage(file) {
    const palette = await localPaletteGenerator.fromImage(file);
    const fg = [...palette.colors].sort((a, b) => hexToHsl(b).s - hexToHsl(a).s)[0] ?? '#0f172a';
    const type = TYPES[hashString(file.name) % TYPES.length] ?? 'noise';
    const scale = type === 'carbon' || type === 'fabric' ? 24 : 120;
    return { texture: makeTexture('Reference texture', fg, fieldColor(fg, false), type, 40, scale), source: 'image' };
  },

  fromBrief(brief) {
    const style = TEXTURE_STYLES.find((s) => s.id === brief.style) ?? FALLBACK_STYLE;
    const anchors = brief.colors ? localPaletteGenerator.fromColors(brief.colors).colors : [];
    const seed = hashString(`${brief.name ?? ''}|${brief.style ?? ''}|${brief.comments ?? ''}|${brief.colors ?? ''}`);
    const fg = anchors[0] ?? hslToHex({ h: (style.hue + (seed % 30) - 15 + 360) % 360, s: style.dark ? 55 : 45, l: style.dark ? 55 : 40 });
    return {
      texture: makeTexture(brief.name?.trim() || 'My texture', fg, fieldColor(fg, style.dark), style.type, style.opacity, style.scale),
      source: 'brief',
    };
  },
};
