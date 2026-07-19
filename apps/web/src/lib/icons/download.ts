'use client';

/**
 * Browser-only download helpers for icons. Kept apart from the pure builders in
 * `./svg` so that module stays DOM-free and testable.
 */

import { buildSvgMarkup, slugify, type IconStyle } from './svg';

/**
 * The concrete colour to bake into a standalone file when the icon is set to
 * follow the theme (`currentColor` has no meaning in a downloaded SVG/PNG).
 * Reads the live `--foreground` token so the file matches the active theme,
 * with a neutral last resort if the token can't be read.
 */
function resolveThemeColor(color: string): string {
  if (color !== 'currentColor') return color;
  if (typeof document !== 'undefined') {
    const token = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim();
    if (token) return token;
  }
  return '#0f172a';
}

/** Hand a text blob (an SVG file, a snippet) to the browser as a download. */
export function downloadTextFile(fileName: string, text: string, type = 'text/plain'): void {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

/** Download the icon as a standalone `.svg` file at the chosen style. */
export function downloadIconSvg(name: string, body: string, style: IconStyle): void {
  // A downloaded file can't inherit `currentColor`; bake the theme colour in.
  const resolved = { ...style, color: resolveThemeColor(style.color) };
  downloadTextFile(`${slugify(name)}.svg`, buildSvgMarkup(body, resolved), 'image/svg+xml');
}

/**
 * Rasterise the icon to a transparent PNG at `pixelSize` and download it.
 *
 * The SVG is drawn at 24-grid but exported at the requested pixel size, so the
 * line weight scales with the size. `currentColor` can't survive rasterisation,
 * so callers pass a concrete colour in `style.color`.
 */
export function downloadIconPng(
  name: string,
  body: string,
  style: IconStyle,
  pixelSize: number,
): Promise<void> {
  // Force a concrete colour: a PNG can't inherit `currentColor`.
  const color = resolveThemeColor(style.color);
  const markup = buildSvgMarkup(body, { ...style, size: pixelSize, color });

  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.decoding = 'async';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelSize;
      canvas.height = pixelSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }
      ctx.clearRect(0, 0, pixelSize, pixelSize);
      ctx.drawImage(img, 0, 0, pixelSize, pixelSize);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('PNG encoding failed'));
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `${slugify(name)}-${pixelSize}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
        resolve();
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG for rasterisation'));
    };
    img.src = url;
  });
}
