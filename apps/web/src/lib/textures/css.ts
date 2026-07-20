/**
 * Pure builders that turn a texture into CSS: an inline style object for the
 * live preview, a copyable CSS/SCSS/Tailwind/array/JSON snippet, and a PNG
 * export.
 *
 * Noise / grain / paper are an inline SVG `feTurbulence` filter tinted with the
 * foreground colour (self-contained data URI, no image file). Carbon and fabric
 * are layered CSS gradients. `opacity` sets the strength; `scale` sets grain
 * coarseness or weave spacing.
 */

import type { CSSProperties } from 'react';
import { hexToRgb } from '@/lib/palettes/color';
import type { Texture, TextureType } from '@/data/textures';

export type TextureFormatId = 'css' | 'scss' | 'tailwind' | 'array' | 'json';

export interface TextureFormat {
  id: TextureFormatId;
  label: string;
  lang: string;
  ext: string;
}

export const TEXTURE_FORMATS: TextureFormat[] = [
  { id: 'css', label: 'CSS', lang: 'css', ext: 'css' },
  { id: 'scss', label: 'SCSS', lang: 'scss', ext: 'scss' },
  { id: 'tailwind', label: 'Tailwind', lang: 'html', ext: 'txt' },
  { id: 'array', label: 'Array', lang: 'ts', ext: 'ts' },
  { id: 'json', label: 'JSON', lang: 'json', ext: 'json' },
];

export const TEXTURE_TYPES: TextureType[] = ['noise', 'grain', 'paper', 'carbon', 'fabric'];

const NOISE_CFG: Record<'noise' | 'grain' | 'paper', { mult: number; oct: number; kind: string }> = {
  noise: { mult: 6, oct: 2, kind: 'fractalNoise' },
  grain: { mult: 14, oct: 2, kind: 'turbulence' },
  paper: { mult: 3, oct: 3, kind: 'fractalNoise' },
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'texture';
}

function withAlpha(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}

/** An inline SVG turbulence filter, tinted to `fg`, as a background-image URL. */
function noiseImage(t: Texture): string {
  const cfg = NOISE_CFG[t.type as 'noise' | 'grain' | 'paper'];
  const { r, g, b } = hexToRgb(t.fg);
  const R = (r / 255).toFixed(3);
  const G = (g / 255).toFixed(3);
  const B = (b / 255).toFixed(3);
  const freq = Math.max(0.02, Math.min(0.9, cfg.mult / Math.max(8, t.scale))).toFixed(3);
  const a = (t.opacity / 100).toFixed(2);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${t.scale}' height='${t.scale}'>` +
    `<filter id='t'><feTurbulence type='${cfg.kind}' baseFrequency='${freq}' numOctaves='${cfg.oct}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 ${R} 0 0 0 0 ${G} 0 0 0 0 ${B} 0.5 0.4 0.3 0 0'/></filter>` +
    `<rect width='100%' height='100%' filter='url(#t)' opacity='${a}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

interface TextureDecls {
  color: string;
  image: string;
  size?: string;
}

function decls(t: Texture): TextureDecls {
  if (t.type === 'noise' || t.type === 'grain' || t.type === 'paper') {
    return { color: t.bg, image: noiseImage(t), size: `${t.scale}px ${t.scale}px` };
  }
  const c = withAlpha(t.fg, t.opacity / 100);
  if (t.type === 'carbon') {
    const gap = Math.max(6, Math.round(t.scale / 2));
    return {
      color: t.bg,
      image:
        `repeating-linear-gradient(45deg, ${c} 0 2px, transparent 2px ${gap}px), ` +
        `repeating-linear-gradient(135deg, ${c} 0 2px, transparent 2px ${gap}px)`,
    };
  }
  // fabric
  const gap = Math.max(3, Math.round(t.scale / 6));
  return {
    color: t.bg,
    image:
      `repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px ${gap}px), ` +
      `repeating-linear-gradient(90deg, ${c} 0 1px, transparent 1px ${gap}px)`,
  };
}

/** Inline style for the live preview (React camelCase). */
export function textureToStyle(t: Texture): CSSProperties {
  const d = decls(t);
  return {
    backgroundColor: d.color,
    backgroundImage: d.image,
    ...(d.size ? { backgroundSize: d.size } : {}),
  };
}

function cssBody(t: Texture, indent = '  '): string {
  const d = decls(t);
  const lines = [`${indent}background-color: ${d.color};`, `${indent}background-image: ${d.image};`];
  if (d.size) lines.push(`${indent}background-size: ${d.size};`);
  return lines.join('\n');
}

/** Render a texture in the requested export format. */
export function formatTexture(t: Texture, format: TextureFormatId): string {
  const slug = slugify(t.name);
  const d = decls(t);
  switch (format) {
    case 'scss':
      return `.${slug} {\n${cssBody(t)}\n}`;
    case 'tailwind': {
      const parts = [
        `bg-[${d.color}]`,
        `[background-image:${d.image.replace(/\s+/g, '_')}]`,
        ...(d.size ? [`[background-size:${d.size.replace(/\s+/g, '_')}]`] : []),
      ];
      return `<div class="${parts.join(' ')}"></div>`;
    }
    case 'array':
      return `export const ${slug.replace(/-/g, '_')} = ${JSON.stringify(
        { type: t.type, fg: t.fg, bg: t.bg, opacity: t.opacity, scale: t.scale },
        null,
        2,
      )};`;
    case 'json':
      return JSON.stringify({ id: t.id, name: t.name, type: t.type, fg: t.fg, bg: t.bg, opacity: t.opacity, scale: t.scale }, null, 2);
    case 'css':
    default:
      return `.${slug} {\n${cssBody(t)}\n}`;
  }
}

function drawStripes(ctx: CanvasRenderingContext2D, angle: number, step: number, w: number, h: number): void {
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate((angle * Math.PI) / 180);
  const d = Math.hypot(w, h);
  ctx.beginPath();
  for (let x = -d; x < d; x += step) {
    ctx.moveTo(x, -d);
    ctx.lineTo(x, d);
  }
  ctx.stroke();
  ctx.restore();
}

/** Render the texture to a PNG and trigger a download. Browser-only. */
export function downloadTexturePng(texture: Texture, width = 1200, height = 630): void {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = texture.bg;
  ctx.fillRect(0, 0, width, height);

  if (texture.type === 'noise' || texture.type === 'grain' || texture.type === 'paper') {
    const { r, g, b } = hexToRgb(texture.fg);
    const a = texture.opacity / 100;
    const img = ctx.getImageData(0, 0, width, height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const al = a * Math.random();
      d[i] = Math.round(r * al + d[i]! * (1 - al));
      d[i + 1] = Math.round(g * al + d[i + 1]! * (1 - al));
      d[i + 2] = Math.round(b * al + d[i + 2]! * (1 - al));
    }
    ctx.putImageData(img, 0, 0);
  } else {
    ctx.strokeStyle = withAlpha(texture.fg, texture.opacity / 100);
    if (texture.type === 'carbon') {
      ctx.lineWidth = 2;
      const gap = Math.max(6, Math.round(texture.scale / 2));
      drawStripes(ctx, 45, gap, width, height);
      drawStripes(ctx, 135, gap, width, height);
    } else {
      ctx.lineWidth = 1;
      const gap = Math.max(3, Math.round(texture.scale / 6));
      drawStripes(ctx, 0, gap, width, height);
      drawStripes(ctx, 90, gap, width, height);
    }
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(texture.name)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}
