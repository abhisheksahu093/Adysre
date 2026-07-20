/**
 * Curated CSS background patterns - the "trending" seed set the page opens on.
 *
 * A pattern is plain data: an id, a display name (a proper noun, never
 * translated - same rule as gradients), a repeat type, a foreground/background
 * colour, a tile size and (for line types) an angle, plus search tags.
 * Everything the page does - preview, quick view, edit, export, "explore
 * similar" - derives from this shape, so adding a pattern is one entry here.
 */

import { colorDistance, hexToHsl } from '@/lib/palettes/color';

/** How the tile repeats. Each maps to a CSS recipe in `@/lib/patterns/css`. */
export type PatternType = 'dots' | 'grid' | 'lines' | 'checkerboard' | 'crosshatch';

export interface Pattern {
  id: string;
  name: string;
  type: PatternType;
  /** Foreground (the mark) colour. */
  fg: string;
  /** Background (the field) colour. */
  bg: string;
  /** Tile size in px. */
  size: number;
  /** Line angle in degrees - used by `lines`; ignored by other types. */
  angle: number;
  tags: string[];
  /** Static popularity, until real analytics exist - drives "trending". */
  likes: number;
}

export const PATTERNS: Pattern[] = [
  { id: 'ink-dots', name: 'Ink Dots', type: 'dots', fg: '#0f172a', bg: '#f8fafc', size: 22, angle: 0, tags: ['dots', 'light', 'minimal', 'mono'], likes: 84 },
  { id: 'night-dots', name: 'Night Dots', type: 'dots', fg: '#334155', bg: '#0b1120', size: 22, angle: 0, tags: ['dots', 'dark', 'subtle', 'mono'], likes: 79 },
  { id: 'indigo-dots', name: 'Indigo Dots', type: 'dots', fg: '#6366f1', bg: '#eef2ff', size: 20, angle: 0, tags: ['dots', 'light', 'purple', 'colorful'], likes: 71 },
  { id: 'mint-dots', name: 'Mint Dots', type: 'dots', fg: '#10b981', bg: '#ecfdf5', size: 24, angle: 0, tags: ['dots', 'light', 'green', 'fresh'], likes: 63 },
  { id: 'amber-dots', name: 'Amber Dots', type: 'dots', fg: '#f59e0b', bg: '#1c1917', size: 20, angle: 0, tags: ['dots', 'dark', 'orange', 'bold'], likes: 66 },
  { id: 'rose-dots', name: 'Rose Dots', type: 'dots', fg: '#f43f5e', bg: '#fff1f2', size: 26, angle: 0, tags: ['dots', 'light', 'pink', 'soft'], likes: 58 },

  { id: 'blueprint-grid', name: 'Blueprint Grid', type: 'grid', fg: '#1d4ed8', bg: '#0b1220', size: 24, angle: 0, tags: ['grid', 'dark', 'blue', 'blueprint'], likes: 92 },
  { id: 'graph-paper', name: 'Graph Paper', type: 'grid', fg: '#cbd5e1', bg: '#ffffff', size: 20, angle: 0, tags: ['grid', 'light', 'paper', 'subtle'], likes: 88 },
  { id: 'slate-grid', name: 'Slate Grid', type: 'grid', fg: '#1e293b', bg: '#f1f5f9', size: 28, angle: 0, tags: ['grid', 'light', 'mono', 'minimal'], likes: 74 },
  { id: 'carbon-grid', name: 'Carbon Grid', type: 'grid', fg: '#1f2937', bg: '#0a0a0a', size: 18, angle: 0, tags: ['grid', 'dark', 'mono', 'subtle'], likes: 70 },
  { id: 'teal-grid', name: 'Teal Grid', type: 'grid', fg: '#14b8a6', bg: '#042f2e', size: 26, angle: 0, tags: ['grid', 'dark', 'teal', 'neon'], likes: 61 },
  { id: 'violet-grid', name: 'Violet Grid', type: 'grid', fg: '#a78bfa', bg: '#1e1b4b', size: 24, angle: 0, tags: ['grid', 'dark', 'purple', 'colorful'], likes: 64 },

  { id: 'pinstripe', name: 'Pinstripe', type: 'lines', fg: '#334155', bg: '#f8fafc', size: 12, angle: 90, tags: ['lines', 'light', 'mono', 'minimal'], likes: 77 },
  { id: 'diagonal-slate', name: 'Diagonal Slate', type: 'lines', fg: '#475569', bg: '#0f172a', size: 14, angle: 45, tags: ['lines', 'diagonal', 'dark', 'mono'], likes: 81 },
  { id: 'candy-stripe', name: 'Candy Stripe', type: 'lines', fg: '#fb7185', bg: '#fff1f2', size: 16, angle: 45, tags: ['lines', 'diagonal', 'pink', 'retro'], likes: 69 },
  { id: 'sky-stripe', name: 'Sky Stripe', type: 'lines', fg: '#38bdf8', bg: '#082f49', size: 18, angle: 0, tags: ['lines', 'dark', 'blue', 'bold'], likes: 60 },
  { id: 'lime-diagonal', name: 'Lime Diagonal', type: 'lines', fg: '#84cc16', bg: '#1a2e05', size: 16, angle: -45, tags: ['lines', 'diagonal', 'green', 'neon'], likes: 57 },
  { id: 'amber-vertical', name: 'Amber Vertical', type: 'lines', fg: '#f59e0b', bg: '#fffbeb', size: 14, angle: 90, tags: ['lines', 'light', 'orange', 'warm'], likes: 55 },

  { id: 'classic-check', name: 'Classic Check', type: 'checkerboard', fg: '#e2e8f0', bg: '#ffffff', size: 28, angle: 0, tags: ['checkerboard', 'light', 'mono', 'subtle'], likes: 83 },
  { id: 'noir-check', name: 'Noir Check', type: 'checkerboard', fg: '#111827', bg: '#1f2937', size: 26, angle: 0, tags: ['checkerboard', 'dark', 'mono', 'bold'], likes: 72 },
  { id: 'coral-check', name: 'Coral Check', type: 'checkerboard', fg: '#fb923c', bg: '#fff7ed', size: 30, angle: 0, tags: ['checkerboard', 'light', 'orange', 'retro'], likes: 62 },
  { id: 'ocean-check', name: 'Ocean Check', type: 'checkerboard', fg: '#0ea5e9', bg: '#0c4a6e', size: 28, angle: 0, tags: ['checkerboard', 'dark', 'blue', 'colorful'], likes: 59 },

  { id: 'hatch-ink', name: 'Hatch Ink', type: 'crosshatch', fg: '#0f172a', bg: '#f8fafc', size: 16, angle: 0, tags: ['crosshatch', 'light', 'mono', 'paper'], likes: 78 },
  { id: 'hatch-night', name: 'Hatch Night', type: 'crosshatch', fg: '#475569', bg: '#0b1120', size: 18, angle: 0, tags: ['crosshatch', 'dark', 'mono', 'subtle'], likes: 68 },
  { id: 'hatch-emerald', name: 'Hatch Emerald', type: 'crosshatch', fg: '#059669', bg: '#ecfdf5', size: 20, angle: 0, tags: ['crosshatch', 'light', 'green', 'fresh'], likes: 56 },
  { id: 'hatch-plum', name: 'Hatch Plum', type: 'crosshatch', fg: '#c084fc', bg: '#2e1065', size: 18, angle: 0, tags: ['crosshatch', 'dark', 'purple', 'neon'], likes: 54 },

  { id: 'coral-dots-dark', name: 'Coral Dots Dark', type: 'dots', fg: '#fb7185', bg: '#111827', size: 24, angle: 0, tags: ['dots', 'dark', 'pink', 'bold'], likes: 65 },
  { id: 'sand-grid', name: 'Sand Grid', type: 'grid', fg: '#d6d3d1', bg: '#fafaf9', size: 22, angle: 0, tags: ['grid', 'light', 'neutral', 'paper'], likes: 52 },
  { id: 'steel-diagonal', name: 'Steel Diagonal', type: 'lines', fg: '#64748b', bg: '#e2e8f0', size: 14, angle: 135, tags: ['lines', 'diagonal', 'light', 'mono'], likes: 51 },
  { id: 'gold-check', name: 'Gold Check', type: 'checkerboard', fg: '#eab308', bg: '#1c1917', size: 26, angle: 0, tags: ['checkerboard', 'dark', 'gold', 'luxury'], likes: 60 },

  { id: 'cyan-dots', name: 'Cyan Dots', type: 'dots', fg: '#06b6d4', bg: '#ecfeff', size: 22, angle: 0, tags: ['dots', 'light', 'teal', 'fresh'], likes: 62 },
  { id: 'fuchsia-dots', name: 'Fuchsia Dots', type: 'dots', fg: '#d946ef', bg: '#0b0713', size: 22, angle: 0, tags: ['dots', 'dark', 'purple', 'neon'], likes: 58 },
  { id: 'slate-dots-light', name: 'Slate Dots Light', type: 'dots', fg: '#94a3b8', bg: '#ffffff', size: 18, angle: 0, tags: ['dots', 'light', 'neutral', 'subtle'], likes: 67 },
  { id: 'emerald-dots', name: 'Emerald Dots', type: 'dots', fg: '#34d399', bg: '#022c22', size: 24, angle: 0, tags: ['dots', 'dark', 'green', 'neon'], likes: 55 },
  { id: 'sky-grid', name: 'Sky Grid', type: 'grid', fg: '#0ea5e9', bg: '#f0f9ff', size: 24, angle: 0, tags: ['grid', 'light', 'blue', 'fresh'], likes: 64 },
  { id: 'rose-grid', name: 'Rose Grid', type: 'grid', fg: '#fb7185', bg: '#1a1113', size: 22, angle: 0, tags: ['grid', 'dark', 'pink', 'colorful'], likes: 53 },
  { id: 'amber-grid', name: 'Amber Grid', type: 'grid', fg: '#f59e0b', bg: '#fffbeb', size: 26, angle: 0, tags: ['grid', 'light', 'orange', 'warm'], likes: 50 },
  { id: 'lime-grid-dark', name: 'Lime Grid', type: 'grid', fg: '#a3e635', bg: '#161a0b', size: 24, angle: 0, tags: ['grid', 'dark', 'green', 'neon'], likes: 57 },
  { id: 'indigo-diagonal', name: 'Indigo Diagonal', type: 'lines', fg: '#6366f1', bg: '#eef2ff', size: 16, angle: 45, tags: ['lines', 'diagonal', 'purple', 'colorful'], likes: 61 },
  { id: 'teal-pinstripe', name: 'Teal Pinstripe', type: 'lines', fg: '#14b8a6', bg: '#042f2e', size: 12, angle: 90, tags: ['lines', 'dark', 'teal', 'minimal'], likes: 54 },
  { id: 'coral-horizontal', name: 'Coral Horizontal', type: 'lines', fg: '#fb923c', bg: '#fff7ed', size: 16, angle: 0, tags: ['lines', 'light', 'orange', 'bold'], likes: 49 },
  { id: 'violet-diagonal', name: 'Violet Diagonal', type: 'lines', fg: '#a78bfa', bg: '#1e1b4b', size: 18, angle: -45, tags: ['lines', 'diagonal', 'dark', 'purple'], likes: 56 },
  { id: 'mint-check', name: 'Mint Check', type: 'checkerboard', fg: '#6ee7b7', bg: '#ecfdf5', size: 28, angle: 0, tags: ['checkerboard', 'light', 'green', 'soft'], likes: 52 },
  { id: 'indigo-check', name: 'Indigo Check', type: 'checkerboard', fg: '#818cf8', bg: '#0b1120', size: 26, angle: 0, tags: ['checkerboard', 'dark', 'purple', 'colorful'], likes: 58 },
  { id: 'slate-check-light', name: 'Slate Check', type: 'checkerboard', fg: '#e2e8f0', bg: '#f8fafc', size: 24, angle: 0, tags: ['checkerboard', 'light', 'mono', 'minimal'], likes: 66 },
  { id: 'crimson-check', name: 'Crimson Check', type: 'checkerboard', fg: '#f87171', bg: '#1c0d0d', size: 28, angle: 0, tags: ['checkerboard', 'dark', 'red', 'bold'], likes: 51 },
  { id: 'hatch-sky', name: 'Hatch Sky', type: 'crosshatch', fg: '#0ea5e9', bg: '#f0f9ff', size: 18, angle: 0, tags: ['crosshatch', 'light', 'blue', 'fresh'], likes: 55 },
  { id: 'hatch-amber', name: 'Hatch Amber', type: 'crosshatch', fg: '#f59e0b', bg: '#1c1917', size: 16, angle: 0, tags: ['crosshatch', 'dark', 'orange', 'bold'], likes: 50 },
  { id: 'hatch-slate-light', name: 'Hatch Slate', type: 'crosshatch', fg: '#94a3b8', bg: '#ffffff', size: 20, angle: 0, tags: ['crosshatch', 'light', 'neutral', 'subtle'], likes: 59 },
  { id: 'hatch-rose', name: 'Hatch Rose', type: 'crosshatch', fg: '#fb7185', bg: '#1a1113', size: 18, angle: 0, tags: ['crosshatch', 'dark', 'pink', 'colorful'], likes: 48 },
];

/** Total number of curated patterns - the single source of truth for counts. */
export const PATTERN_COUNT = PATTERNS.length;

/** Patterns closest in foreground hue to `pattern`, for "explore similar". */
export function similarPatterns(pattern: Pattern, all: Pattern[], limit = 6): Pattern[] {
  const targetHue = hexToHsl(pattern.fg).h;
  const score = (p: Pattern): number => {
    const dh = Math.abs(
      Math.atan2(
        Math.sin(((hexToHsl(p.fg).h - targetHue) * Math.PI) / 180),
        Math.cos(((hexToHsl(p.fg).h - targetHue) * Math.PI) / 180),
      ),
    );
    return dh * 300 + colorDistance(pattern.fg, p.fg);
  };
  return all
    .filter((p) => p.id !== pattern.id)
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => a.s - b.s)
    .slice(0, limit)
    .map((x) => x.p);
}

/** Every tag in use, deduped and sorted - drives the sidebar submenu. */
export const ALL_PATTERN_TAGS: string[] = [...new Set(PATTERNS.flatMap((p) => p.tags))].sort();
