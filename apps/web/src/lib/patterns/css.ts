/**
 * Pure builders that turn a pattern into CSS: an inline style object for the
 * live preview, a copyable CSS/SCSS/Tailwind/array/JSON snippet, and a PNG
 * export. No DOM here except the browser-only `downloadPatternPng`.
 *
 * Each `PatternType` maps to a repeat recipe built from CSS gradients, so a
 * pattern renders anywhere with no images and the exported code is self-contained.
 */

import type { CSSProperties } from 'react';
import type { Pattern, PatternType } from '@/data/patterns';

export type PatternFormatId = 'css' | 'scss' | 'tailwind' | 'array' | 'json';

export interface PatternFormat {
  id: PatternFormatId;
  label: string;
  lang: string;
  ext: string;
}

export const PATTERN_FORMATS: PatternFormat[] = [
  { id: 'css', label: 'CSS', lang: 'css', ext: 'css' },
  { id: 'scss', label: 'SCSS', lang: 'scss', ext: 'scss' },
  { id: 'tailwind', label: 'Tailwind', lang: 'html', ext: 'txt' },
  { id: 'array', label: 'Array', lang: 'ts', ext: 'ts' },
  { id: 'json', label: 'JSON', lang: 'json', ext: 'json' },
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'pattern';
}

/** The CSS declarations a pattern needs, as raw values (no `background-size` when unused). */
interface PatternDecls {
  color: string;
  image: string;
  size?: string;
}

function decls(p: Pattern): PatternDecls {
  const s = p.size;
  switch (p.type) {
    case 'dots': {
      const r = Math.max(1, Math.round(s * 0.12 * 100) / 100);
      return { color: p.bg, image: `radial-gradient(${p.fg} ${r}px, transparent ${r}px)`, size: `${s}px ${s}px` };
    }
    case 'grid':
      return {
        color: p.bg,
        image: `linear-gradient(${p.fg} 1px, transparent 1px), linear-gradient(90deg, ${p.fg} 1px, transparent 1px)`,
        size: `${s}px ${s}px`,
      };
    case 'lines':
      return {
        color: p.bg,
        image: `repeating-linear-gradient(${p.angle}deg, ${p.fg} 0, ${p.fg} 2px, transparent 2px, transparent ${s}px)`,
      };
    case 'checkerboard':
      return {
        color: p.bg,
        image: `repeating-conic-gradient(${p.fg} 0% 25%, transparent 0% 50%)`,
        size: `${s}px ${s}px`,
      };
    case 'crosshatch':
      return {
        color: p.bg,
        image:
          `repeating-linear-gradient(45deg, ${p.fg} 0, ${p.fg} 1px, transparent 1px, transparent ${s}px), ` +
          `repeating-linear-gradient(-45deg, ${p.fg} 0, ${p.fg} 1px, transparent 1px, transparent ${s}px)`,
      };
  }
}

/** Inline style for the live preview (React camelCase). */
export function patternToStyle(p: Pattern): CSSProperties {
  const d = decls(p);
  return {
    backgroundColor: d.color,
    backgroundImage: d.image,
    ...(d.size ? { backgroundSize: d.size } : {}),
  };
}

/** The CSS declaration block body (indented lines), shared by every text format. */
function cssBody(p: Pattern, indent = '  '): string {
  const d = decls(p);
  const lines = [
    `${indent}background-color: ${d.color};`,
    `${indent}background-image: ${d.image};`,
  ];
  if (d.size) lines.push(`${indent}background-size: ${d.size};`);
  return lines.join('\n');
}

/** Render a pattern in the requested export format. */
export function formatPattern(p: Pattern, format: PatternFormatId): string {
  const slug = slugify(p.name);
  const d = decls(p);
  switch (format) {
    case 'scss':
      return `.${slug} {\n${cssBody(p)}\n}`;
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
        { type: p.type, fg: p.fg, bg: p.bg, size: p.size, angle: p.angle },
        null,
        2,
      )};`;
    case 'json':
      return JSON.stringify({ id: p.id, name: p.name, type: p.type, fg: p.fg, bg: p.bg, size: p.size, angle: p.angle }, null, 2);
    case 'css':
    default:
      return `.${slug} {\n${cssBody(p)}\n}`;
  }
}

/** Draw parallel stripes across the whole canvas, rotated by `angle`. */
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

/** Render the pattern to a PNG and trigger a download. Browser-only. */
export function downloadPatternPng(pattern: Pattern, width = 1200, height = 630): void {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const s = pattern.size;
  ctx.fillStyle = pattern.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = pattern.fg;
  ctx.strokeStyle = pattern.fg;

  switch (pattern.type) {
    case 'dots': {
      const r = Math.max(1, s * 0.12);
      for (let y = s / 2; y < height; y += s) {
        for (let x = s / 2; x < width; x += s) {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 'grid': {
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += s) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += s) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
      break;
    }
    case 'lines':
      ctx.lineWidth = 2;
      drawStripes(ctx, pattern.angle, s, width, height);
      break;
    case 'crosshatch':
      ctx.lineWidth = 1;
      drawStripes(ctx, 45, s, width, height);
      drawStripes(ctx, -45, s, width, height);
      break;
    case 'checkerboard': {
      let ry = 0;
      for (let y = 0; y < height; y += s, ry++) {
        let rx = 0;
        for (let x = 0; x < width; x += s, rx++) {
          if ((rx + ry) % 2 === 0) ctx.fillRect(x, y, s, s);
        }
      }
      break;
    }
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(pattern.name)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

/** The pattern types offered in the editor, for the type toggle. */
export const PATTERN_TYPES: PatternType[] = ['dots', 'grid', 'lines', 'checkerboard', 'crosshatch'];
