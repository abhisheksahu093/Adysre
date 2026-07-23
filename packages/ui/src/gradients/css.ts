/**
 * Turn a gradient into a CSS string, into copyable/downloadable code, and into
 * a PNG. Pure builders plus one canvas helper - no DOM state, no dependencies.
 */

import type { CSSProperties } from 'react';
import type { Gradient, GradientStop } from './data.ts';

export type GradientFormatId = 'css' | 'scss' | 'tailwind' | 'array' | 'json';

export interface GradientFormat {
  id: GradientFormatId;
  label: string;
  lang: string;
  ext: string;
}

export const GRADIENT_FORMATS: GradientFormat[] = [
  { id: 'css', label: 'CSS', lang: 'css', ext: 'css' },
  { id: 'scss', label: 'SCSS', lang: 'scss', ext: 'scss' },
  { id: 'tailwind', label: 'Tailwind', lang: 'html', ext: 'html' },
  { id: 'array', label: 'Array', lang: 'js', ext: 'js' },
  { id: 'json', label: 'JSON', lang: 'json', ext: 'json' },
];

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'gradient'
  );
}

function stopList(stops: GradientStop[]): string {
  return stops.map((s) => `${s.color} ${s.position}%`).join(', ');
}

/** The `background-image` value, e.g. `linear-gradient(135deg, #a 0%, #b 100%)`. */
export function gradientToCss(gradient: Gradient): string {
  const stops = stopList(gradient.stops);
  switch (gradient.type) {
    case 'radial':
      return `radial-gradient(circle at center, ${stops})`;
    case 'conic':
      return `conic-gradient(from ${gradient.angle}deg at 50% 50%, ${stops})`;
    case 'linear':
    default:
      return `linear-gradient(${gradient.angle}deg, ${stops})`;
  }
}

/**
 * Inline style for a gradient (React camelCase), mirroring `patternToStyle` and
 * `textureToStyle` so all three surfaces are applied the same way.
 *
 * `backgroundColor` is the first stop, so the box still reads as intentional in
 * the frame before the gradient paints and in clients that drop background-image.
 */
export function gradientToStyle(gradient: Gradient): CSSProperties {
  return {
    backgroundColor: gradient.stops[0]?.color ?? 'transparent',
    backgroundImage: gradientToCss(gradient),
  };
}

/** Render the gradient in the requested export format. */
export function formatGradient(gradient: Gradient, format: GradientFormatId): string {
  const css = gradientToCss(gradient);
  const slug = slugify(gradient.name);
  const first = gradient.stops[0]?.color ?? '#000000';

  switch (format) {
    case 'css':
      return [
        '.gradient {',
        `  background: ${first};`,
        `  background-image: ${css};`,
        '}',
      ].join('\n');
    case 'scss':
      return `$${slug}: ${css};`;
    case 'tailwind':
      // Arbitrary-value utility - works without editing the config.
      return `<div class="bg-[${css.replace(/\s+/g, '_')}]"></div>`;
    case 'array':
      return `export const ${slug.replace(/-/g, '_')} = ${JSON.stringify(
        gradient.stops.map((s) => s.color),
      )};\nexport const ${slug.replace(/-/g, '_')}_css = '${css}';`;
    case 'json':
      return JSON.stringify(
        { name: gradient.name, type: gradient.type, angle: gradient.angle, stops: gradient.stops, css },
        null,
        2,
      );
    default:
      return css;
  }
}

/** Paint the gradient to a canvas and download it as a PNG. Client-only. */
export function downloadGradientPng(gradient: Gradient, width = 1200, height = 630): void {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const stops = [...gradient.stops].sort((a, b) => a.position - b.position);
  const addStops = (g: CanvasGradient) => {
    for (const s of stops) g.addColorStop(Math.min(1, Math.max(0, s.position / 100)), s.color);
  };

  if (gradient.type === 'radial') {
    const g = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2,
    );
    addStops(g);
    ctx.fillStyle = g;
  } else if (gradient.type === 'conic' && typeof ctx.createConicGradient === 'function') {
    const g = ctx.createConicGradient((gradient.angle * Math.PI) / 180, width / 2, height / 2);
    addStops(g);
    ctx.fillStyle = g;
  } else {
    // Linear (and a conic fallback): project the CSS angle onto the box.
    const rad = ((gradient.angle - 90) * Math.PI) / 180;
    const x = Math.cos(rad);
    const y = Math.sin(rad);
    const g = ctx.createLinearGradient(
      width / 2 - (x * width) / 2,
      height / 2 - (y * height) / 2,
      width / 2 + (x * width) / 2,
      height / 2 + (y * height) / 2,
    );
    addStops(g);
    ctx.fillStyle = g;
  }

  ctx.fillRect(0, 0, width, height);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(gradient.name)}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
