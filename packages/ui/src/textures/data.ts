/**
 * Curated CSS surface textures - the "trending" seed set the page opens on.
 *
 * A texture is plain data: an id, a display name, a surface type, a foreground
 * (grain/weave) colour, a background (field) colour, an opacity and a scale.
 * Noise-family textures are generated with an inline SVG turbulence filter;
 * carbon/fabric are layered CSS gradients - so a texture renders anywhere with
 * no image files, and adding one is a single entry here.
 */

import { colorDistance, hexToHsl } from '../lib/color.ts';

/** The surface recipe. Each maps to a builder in `@/lib/textures/css`. */
export type TextureType = 'noise' | 'grain' | 'paper' | 'carbon' | 'fabric';

export interface Texture {
  id: string;
  name: string;
  type: TextureType;
  /** Grain / weave colour. */
  fg: string;
  /** Field colour behind the texture. */
  bg: string;
  /** Texture strength, 0-100. */
  opacity: number;
  /** Grain coarseness (noise family) or weave spacing (carbon/fabric), in px. */
  scale: number;
  tags: string[];
  likes: number;
}

export const TEXTURES: Texture[] = [
  { id: 'ink-noise', name: 'Ink Noise', type: 'noise', fg: '#0f172a', bg: '#f8fafc', opacity: 40, scale: 120, tags: ['noise', 'light', 'mono', 'grain'], likes: 88 },
  { id: 'night-noise', name: 'Night Noise', type: 'noise', fg: '#94a3b8', bg: '#0b1120', opacity: 35, scale: 130, tags: ['noise', 'dark', 'mono', 'grain'], likes: 82 },
  { id: 'indigo-noise', name: 'Indigo Noise', type: 'noise', fg: '#6366f1', bg: '#0b0b1a', opacity: 45, scale: 120, tags: ['noise', 'dark', 'purple', 'colorful'], likes: 74 },
  { id: 'emerald-noise', name: 'Emerald Noise', type: 'noise', fg: '#10b981', bg: '#022c22', opacity: 42, scale: 120, tags: ['noise', 'dark', 'green', 'colorful'], likes: 66 },
  { id: 'sand-noise', name: 'Sand Noise', type: 'noise', fg: '#b45309', bg: '#fef3c7', opacity: 30, scale: 140, tags: ['noise', 'light', 'orange', 'warm'], likes: 61 },
  { id: 'rose-noise', name: 'Rose Noise', type: 'noise', fg: '#e11d48', bg: '#fff1f2', opacity: 28, scale: 130, tags: ['noise', 'light', 'pink', 'soft'], likes: 57 },

  { id: 'fine-grain', name: 'Fine Grain', type: 'grain', fg: '#111827', bg: '#ffffff', opacity: 30, scale: 90, tags: ['grain', 'light', 'mono', 'subtle'], likes: 79 },
  { id: 'dark-grain', name: 'Dark Grain', type: 'grain', fg: '#64748b', bg: '#0a0a0a', opacity: 35, scale: 90, tags: ['grain', 'dark', 'mono', 'film'], likes: 76 },
  { id: 'sky-grain', name: 'Sky Grain', type: 'grain', fg: '#0ea5e9', bg: '#082f49', opacity: 40, scale: 100, tags: ['grain', 'dark', 'blue', 'colorful'], likes: 63 },
  { id: 'amber-grain', name: 'Amber Grain', type: 'grain', fg: '#f59e0b', bg: '#1c1917', opacity: 38, scale: 90, tags: ['grain', 'dark', 'orange', 'bold'], likes: 60 },
  { id: 'violet-grain', name: 'Violet Grain', type: 'grain', fg: '#a78bfa', bg: '#1e1b4b', opacity: 42, scale: 100, tags: ['grain', 'dark', 'purple', 'neon'], likes: 58 },

  { id: 'kraft-paper', name: 'Kraft Paper', type: 'paper', fg: '#a16207', bg: '#fef9c3', opacity: 22, scale: 160, tags: ['paper', 'light', 'brown', 'craft'], likes: 84 },
  { id: 'cotton-paper', name: 'Cotton Paper', type: 'paper', fg: '#94a3b8', bg: '#ffffff', opacity: 18, scale: 180, tags: ['paper', 'light', 'neutral', 'subtle'], likes: 80 },
  { id: 'recycled-paper', name: 'Recycled Paper', type: 'paper', fg: '#57534e', bg: '#f5f5f4', opacity: 24, scale: 170, tags: ['paper', 'light', 'neutral', 'craft'], likes: 68 },
  { id: 'slate-paper', name: 'Slate Paper', type: 'paper', fg: '#475569', bg: '#0f172a', opacity: 26, scale: 170, tags: ['paper', 'dark', 'mono', 'subtle'], likes: 62 },
  { id: 'blush-paper', name: 'Blush Paper', type: 'paper', fg: '#be185d', bg: '#fce7f3', opacity: 20, scale: 180, tags: ['paper', 'light', 'pink', 'soft'], likes: 55 },

  { id: 'carbon-fiber', name: 'Carbon Fiber', type: 'carbon', fg: '#0f172a', bg: '#1e293b', opacity: 55, scale: 24, tags: ['carbon', 'dark', 'mono', 'tech'], likes: 90 },
  { id: 'graphite-weave', name: 'Graphite Weave', type: 'carbon', fg: '#111827', bg: '#0a0a0a', opacity: 60, scale: 20, tags: ['carbon', 'dark', 'mono', 'tech'], likes: 78 },
  { id: 'navy-carbon', name: 'Navy Carbon', type: 'carbon', fg: '#1e3a8a', bg: '#0b1220', opacity: 55, scale: 26, tags: ['carbon', 'dark', 'blue', 'tech'], likes: 67 },
  { id: 'bronze-weave', name: 'Bronze Weave', type: 'carbon', fg: '#92400e', bg: '#1c1917', opacity: 50, scale: 28, tags: ['carbon', 'dark', 'orange', 'luxury'], likes: 59 },

  { id: 'linen-fabric', name: 'Linen Fabric', type: 'fabric', fg: '#78716c', bg: '#faf9f7', opacity: 30, scale: 22, tags: ['fabric', 'light', 'neutral', 'craft'], likes: 81 },
  { id: 'denim-fabric', name: 'Denim Fabric', type: 'fabric', fg: '#1e40af', bg: '#1e3a8a', opacity: 40, scale: 20, tags: ['fabric', 'dark', 'blue', 'craft'], likes: 72 },
  { id: 'canvas-fabric', name: 'Canvas Fabric', type: 'fabric', fg: '#a8a29e', bg: '#ffffff', opacity: 26, scale: 24, tags: ['fabric', 'light', 'neutral', 'subtle'], likes: 64 },
  { id: 'noir-fabric', name: 'Noir Fabric', type: 'fabric', fg: '#334155', bg: '#0b1120', opacity: 34, scale: 22, tags: ['fabric', 'dark', 'mono', 'craft'], likes: 60 },
  { id: 'sage-fabric', name: 'Sage Fabric', type: 'fabric', fg: '#4d7c0f', bg: '#f7fee7', opacity: 28, scale: 24, tags: ['fabric', 'light', 'green', 'fresh'], likes: 53 },

  { id: 'teal-noise', name: 'Teal Noise', type: 'noise', fg: '#14b8a6', bg: '#042f2e', opacity: 42, scale: 120, tags: ['noise', 'dark', 'teal', 'colorful'], likes: 56 },
  { id: 'mono-grain-light', name: 'Mono Grain', type: 'grain', fg: '#cbd5e1', bg: '#f1f5f9', opacity: 40, scale: 90, tags: ['grain', 'light', 'mono', 'subtle'], likes: 50 },
  { id: 'gold-carbon', name: 'Gold Carbon', type: 'carbon', fg: '#a16207', bg: '#1c1917', opacity: 45, scale: 26, tags: ['carbon', 'dark', 'gold', 'luxury'], likes: 61 },
];

/** Total number of curated textures - the single source of truth for counts. */
export const TEXTURE_COUNT = TEXTURES.length;

/** Textures closest in foreground hue to `texture`, for "explore similar". */
export function similarTextures(texture: Texture, all: Texture[], limit = 6): Texture[] {
  const targetHue = hexToHsl(texture.fg).h;
  const score = (x: Texture): number => {
    const dh = Math.abs(
      Math.atan2(
        Math.sin(((hexToHsl(x.fg).h - targetHue) * Math.PI) / 180),
        Math.cos(((hexToHsl(x.fg).h - targetHue) * Math.PI) / 180),
      ),
    );
    return dh * 300 + colorDistance(texture.fg, x.fg);
  };
  return all
    .filter((x) => x.id !== texture.id)
    .map((x) => ({ x, s: score(x) }))
    .sort((a, b) => a.s - b.s)
    .slice(0, limit)
    .map((r) => r.x);
}

/** Every tag in use, deduped and sorted - drives the sidebar submenu. */
export const ALL_TEXTURE_TAGS: string[] = [...new Set(TEXTURES.flatMap((t) => t.tags))].sort();
