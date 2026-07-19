/**
 * Turn a palette into copyable / downloadable code, and into a PNG swatch card.
 * Pure string builders plus one canvas helper - no DOM state, no dependencies.
 */

import { readableText } from './color';

export type PaletteFormatId = 'css' | 'scss' | 'tailwind' | 'array' | 'json';

export interface PaletteFormat {
  id: PaletteFormatId;
  label: string;
  /** Shiki language for highlighting. */
  lang: string;
  ext: string;
}

export const PALETTE_FORMATS: PaletteFormat[] = [
  { id: 'css', label: 'CSS', lang: 'css', ext: 'css' },
  { id: 'scss', label: 'SCSS', lang: 'scss', ext: 'scss' },
  { id: 'tailwind', label: 'Tailwind', lang: 'js', ext: 'js' },
  { id: 'array', label: 'Array', lang: 'js', ext: 'js' },
  { id: 'json', label: 'JSON', lang: 'json', ext: 'json' },
];

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'palette'
  );
}

/** Render `colors` in the requested format. `name` seeds variable/key names. */
export function formatPalette(colors: string[], name: string, format: PaletteFormatId): string {
  const slug = slugify(name);
  const entries = colors.map((c, i) => [`${slug}-${i + 1}`, c] as const);

  switch (format) {
    case 'css':
      return `:root {\n${entries.map(([k, v]) => `  --${k}: ${v};`).join('\n')}\n}`;
    case 'scss':
      return entries.map(([k, v]) => `$${k}: ${v};`).join('\n');
    case 'tailwind':
      return [
        '// tailwind.config.js',
        'module.exports = {',
        '  theme: {',
        '    extend: {',
        '      colors: {',
        `        '${slug}': {`,
        ...colors.map((c, i) => `          '${(i + 1) * 100}': '${c}',`),
        '        },',
        '      },',
        '    },',
        '  },',
        '};',
      ].join('\n');
    case 'array':
      return `export const ${slug.replace(/-/g, '_')} = [\n${colors
        .map((c) => `  '${c}',`)
        .join('\n')}\n];`;
    case 'json':
      return JSON.stringify({ name, colors }, null, 2);
    default:
      return colors.join(', ');
  }
}

/**
 * Draw the palette as a PNG (swatches with hex labels) and hand it to the
 * browser as a download. Client-only - needs a canvas.
 */
export function downloadPalettePng(colors: string[], name: string): void {
  const swatchW = 240;
  const w = swatchW;
  const h = 140 * colors.length;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  colors.forEach((color, i) => {
    const y = i * 140;
    ctx.fillStyle = color;
    ctx.fillRect(0, y, w, 140);
    ctx.fillStyle = readableText(color);
    ctx.font = '600 22px ui-sans-serif, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(color.toUpperCase(), 20, y + 70);
  });

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(name)}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
