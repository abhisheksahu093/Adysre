/**
 * Design Playground - export.
 *
 * Two families, deliberately separated:
 *  - RASTER (PNG/JPEG) comes from the live Konva stage, because only the
 *    renderer knows exactly what is on screen.
 *  - VECTOR/CODE (SVG, HTML, JSON) is generated from the DOCUMENT, so output
 *    never depends on the current zoom, scroll position or device pixel ratio.
 *
 * Adding a target means adding an emitter here; nothing else changes (PRD §7.11).
 */

import { absolutePosition, boundsOf, descendantsOf, topLevelNodes } from './document';
import { serializeDocument } from './schema';
import type { Document, Node, Page, ShadowSpec } from './types';

export type ExportFormat = 'png' | 'jpeg' | 'svg' | 'html' | 'json';

/* ------------------------------------------------------------------ effects */

/**
 * One shadow, one identity.
 *
 * Two nodes that look identical must share a single SVG filter definition -
 * otherwise a page of fifty cards ships fifty byte-identical `<filter>` blocks.
 */
function shadowKey(shadow: ShadowSpec): string {
  return `${shadow.color}|${shadow.blur}|${shadow.offsetX}|${shadow.offsetY}|${shadow.opacity}`;
}

/** `#rgb` / `#rrggbb` / `#rrggbbaa` → `r, g, b`. Null when it is not a hex. */
function rgbChannels(hex: string): [number, number, number] | null {
  const body = hex.trim().replace(/^#/, '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(body)) return null;
  const full =
    body.length === 3
      ? body
          .split('')
          .map((char) => char + char)
          .join('')
      : body;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

/**
 * The shadow colour as CSS.
 *
 * The model keeps colour and opacity apart; `box-shadow` takes one value, so
 * they are folded into an `rgba()` here rather than anywhere upstream.
 */
function shadowCssColor(shadow: ShadowSpec): string {
  const channels = rgbChannels(shadow.color);
  if (!channels) return `rgba(0, 0, 0, ${shadow.opacity})`;
  return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${shadow.opacity})`;
}

/** Escape text for inclusion in XML/HTML content. */
function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** The page's content bounds, so an export is cropped to the artwork. */
export function pageBounds(doc: Document, page: Page): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const roots = topLevelNodes(doc, page);
  if (roots.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

  const minX = Math.min(...roots.map((n) => n.transform.x));
  const minY = Math.min(...roots.map((n) => n.transform.y));
  const maxX = Math.max(...roots.map((n) => n.transform.x + n.transform.width));
  const maxY = Math.max(...roots.map((n) => n.transform.y + n.transform.height));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/* --------------------------------------------------------------------- SVG */

/**
 * Every distinct shadow on a page, as `key → filter id`.
 *
 * Collected in one pass before emitting, because SVG wants its `<defs>` up
 * front while the references to them are discovered depth-first.
 */
function collectShadowFilters(doc: Document, page: Page): Map<string, string> {
  const filters = new Map<string, string>();
  for (const node of descendantsOf(doc, page.rootId)) {
    // A group is a container, not a shape: it has no geometry of its own to cast
    // a shadow, which is exactly how the canvas treats it.
    if (node.hidden || node.type === 'group' || !node.style.shadow) continue;
    const key = shadowKey(node.style.shadow);
    if (!filters.has(key)) filters.set(key, `adysre-shadow-${filters.size + 1}`);
  }
  return filters;
}

function svgFilterDefs(doc: Document, page: Page, filters: Map<string, string>): string {
  if (filters.size === 0) return '';
  const byKey = new Map<string, ShadowSpec>();
  for (const node of descendantsOf(doc, page.rootId)) {
    if (node.style.shadow) byKey.set(shadowKey(node.style.shadow), node.style.shadow);
  }

  const defs = [...filters.entries()]
    .map(([key, id]) => {
      const shadow = byKey.get(key);
      if (!shadow) return '';
      // The default filter region (-10%..120%) would crop a soft or far-offset
      // shadow, so the region is widened to the largest a shape can need.
      return (
        `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%">` +
        // CSS blur is roughly twice the Gaussian deviation a filter takes, so
        // halving it is what keeps the SVG matching the canvas and the HTML.
        `<feDropShadow dx="${shadow.offsetX}" dy="${shadow.offsetY}" stdDeviation="${shadow.blur / 2}" flood-color="${shadow.color}" flood-opacity="${shadow.opacity}" />` +
        `</filter>`
      );
    })
    .join('');
  return `<defs>${defs}</defs>`;
}

function svgForNode(
  doc: Document,
  node: Node,
  offsetX: number,
  offsetY: number,
  filters: Map<string, string>,
): string {
  if (node.hidden) return '';

  const { x, y, width, height, rotation } = node.transform;
  const absX = x + offsetX;
  const absY = y + offsetY;
  const { fill, stroke, strokeWidth, radius, opacity, shadow } = node.style;

  // Blend mode is deliberately NOT emitted. `mix-blend-mode` is a CSS property
  // that only some SVG consumers honour, and SVG's own `<feBlend>` blends a
  // filter's inputs, not an element with the page behind it - neither is the
  // thing the canvas does, and a wrong blend is worse than an absent one.
  const filterId = shadow && node.type !== 'group' ? filters.get(shadowKey(shadow)) : undefined;
  const filterAttr = filterId ? ` filter="url(#${filterId})"` : '';

  // SVG rotates about the origin, so a rotated node is wrapped in a transform
  // about its own centre - the same anchor Konva uses on the canvas.
  const open = rotation
    ? `<g transform="rotate(${rotation} ${absX + width / 2} ${absY + height / 2})">`
    : '';
  const close = rotation ? '</g>' : '';

  const paint = [
    fill ? `fill="${fill}"` : 'fill="none"',
    stroke ? `stroke="${stroke}" stroke-width="${strokeWidth}"` : '',
    opacity !== 1 ? `opacity="${opacity}"` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const children = node.children
    .map((id) => doc.nodes[id])
    .filter((child): child is Node => child !== undefined)
    .map((child) => svgForNode(doc, child, absX, absY, filters))
    .join('');

  switch (node.type) {
    case 'frame':
      return `${open}<rect x="${absX}" y="${absY}" width="${width}" height="${height}" rx="${radius}" ${paint}${filterAttr} />${children}${close}`;
    case 'group':
      return `${open}${children}${close}`;
    case 'ellipse':
      return `${open}<ellipse cx="${absX + width / 2}" cy="${absY + height / 2}" rx="${width / 2}" ry="${height / 2}" ${paint}${filterAttr} />${close}`;
    case 'text': {
      const text = node.text;
      if (!text) return '';
      const anchor = text.align === 'center' ? 'middle' : text.align === 'right' ? 'end' : 'start';
      const anchorX =
        text.align === 'center' ? absX + width / 2 : text.align === 'right' ? absX + width : absX;
      // dy lifts the baseline to roughly the first line's box, matching Konva.
      return `${open}<text x="${anchorX}" y="${absY + text.fontSize}" text-anchor="${anchor}" font-family="${escapeText(text.fontFamily)}" font-size="${text.fontSize}" font-weight="${text.fontWeight}" letter-spacing="${text.letterSpacing}" ${fill ? `fill="${fill}"` : ''}${filterAttr}>${escapeText(text.text)}</text>${close}`;
    }
    case 'image':
      return node.image?.src
        ? `${open}<image x="${absX}" y="${absY}" width="${width}" height="${height}" href="${escapeText(node.image.src)}" preserveAspectRatio="${node.image.fit === 'fill' ? 'none' : 'xMidYMid slice'}"${filterAttr} />${close}`
        : '';
    case 'rectangle':
    default:
      return `${open}<rect x="${absX}" y="${absY}" width="${width}" height="${height}" rx="${radius}" ${paint}${filterAttr} />${close}`;
  }
}

export function toSvg(doc: Document, page: Page): string {
  const bounds = pageBounds(doc, page);
  const filters = collectShadowFilters(doc, page);
  const body = topLevelNodes(doc, page)
    .map((node) => svgForNode(doc, node, -bounds.x, -bounds.y, filters))
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${bounds.width}" height="${bounds.height}" viewBox="0 0 ${bounds.width} ${bounds.height}">${svgFilterDefs(doc, page, filters)}${body}</svg>`;
}

/**
 * SVG for a subset of nodes, cropped to their combined bounds.
 *
 * Exporting a selection is not the page export with a smaller viewBox: the
 * chosen nodes must be emitted at their ABSOLUTE positions (a node nested in a
 * frame carries a parent-relative transform) and everything else left out
 * entirely, so what lands in the file is exactly what was selected.
 */
export function toSvgForSelection(doc: Document, page: Page, ids: string[]): string | null {
  const nodes = ids
    .map((id) => doc.nodes[id])
    .filter((node): node is Node => node !== undefined && !node.hidden);
  if (nodes.length === 0) return null;

  const bounds = boundsOf(doc, nodes.map((node) => node.id));
  if (!bounds || bounds.width <= 0 || bounds.height <= 0) return null;

  const filters = collectShadowFilters(doc, page);
  const body = nodes
    .map((node) => {
      // svgForNode adds the node's own transform, so the offset passed in is
      // the node's absolute origin minus its local one - i.e. its ancestors'.
      const absolute = absolutePosition(doc, node.id);
      return svgForNode(
        doc,
        node,
        absolute.x - node.transform.x - bounds.x,
        absolute.y - node.transform.y - bounds.y,
        filters,
      );
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${bounds.width}" height="${bounds.height}" viewBox="0 0 ${bounds.width} ${bounds.height}">${svgFilterDefs(doc, page, filters)}${body}</svg>`;
}

/* -------------------------------------------------------------------- HTML */

/** Absolutely-positioned HTML, which is the honest mapping of a free canvas. */
function htmlForNode(doc: Document, node: Node): string {
  if (node.hidden) return '';

  const { x, y, width, height, rotation } = node.transform;
  const { fill, stroke, strokeWidth, radius, opacity, shadow, blendMode } = node.style;

  // Text takes `text-shadow` (which follows the glyphs) and everything else
  // `box-shadow` (which follows the border box) - the same distinction the
  // canvas makes by shadowing a Text node rather than its bounding rect.
  const shadowValue = shadow
    ? `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadowCssColor(shadow)}`
    : '';
  const shadowRule = !shadowValue
    ? ''
    : node.type === 'text'
      ? `text-shadow:${shadowValue}`
      : `box-shadow:${shadowValue}`;

  const style = [
    'position:absolute',
    `left:${x}px`,
    `top:${y}px`,
    `width:${width}px`,
    `height:${height}px`,
    rotation ? `transform:rotate(${rotation}deg)` : '',
    fill && node.type !== 'text' ? `background:${fill}` : '',
    stroke ? `border:${strokeWidth}px solid ${stroke}` : '',
    radius ? `border-radius:${node.type === 'ellipse' ? '50%' : `${radius}px`}` : '',
    node.type === 'ellipse' ? 'border-radius:50%' : '',
    opacity !== 1 ? `opacity:${opacity}` : '',
    shadowRule,
    blendMode !== 'normal' ? `mix-blend-mode:${blendMode}` : '',
    node.type === 'text' && node.text
      ? `color:${fill ?? '#000'};font-family:${node.text.fontFamily};font-size:${node.text.fontSize}px;font-weight:${node.text.fontWeight};line-height:${node.text.lineHeight};letter-spacing:${node.text.letterSpacing}px;text-align:${node.text.align}`
      : '',
  ]
    .filter(Boolean)
    .join(';');

  const children = node.children
    .map((id) => doc.nodes[id])
    .filter((child): child is Node => child !== undefined)
    .map((child) => htmlForNode(doc, child))
    .join('');

  if (node.type === 'text') {
    return `<div style="${style}">${escapeText(node.text?.text ?? '')}</div>`;
  }
  if (node.type === 'image') {
    return `<img src="${escapeText(node.image?.src ?? '')}" alt="${escapeText(node.image?.alt ?? '')}" style="${style};object-fit:${node.image?.fit ?? 'cover'}" />`;
  }
  return `<div style="${style}">${children}</div>`;
}

export function toHtml(doc: Document, page: Page): string {
  const bounds = pageBounds(doc, page);
  const body = topLevelNodes(doc, page)
    .map((node) => htmlForNode(doc, node))
    .join('\n      ');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeText(doc.name)} - ${escapeText(page.name)}</title>
    <style>
      body { margin: 0; font-family: Inter, system-ui, sans-serif; }
      .page { position: relative; width: ${bounds.width}px; height: ${bounds.height}px; }
    </style>
  </head>
  <body>
    <div class="page">
      ${body}
    </div>
  </body>
</html>
`;
}

/* ------------------------------------------------------------------ output */

export function toJson(doc: Document): string {
  return serializeDocument(doc);
}

export const MIME: Record<ExportFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  html: 'text/html',
  json: 'application/json',
};

export const EXTENSION: Record<ExportFormat, string> = {
  png: 'png',
  jpeg: 'jpg',
  svg: 'svg',
  html: 'html',
  json: 'adysre.json',
};

/** Turn a name into something safe for a file system. */
export function fileName(documentName: string, pageName: string, format: ExportFormat): string {
  const slug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'untitled';
  return `${slug(documentName)}-${slug(pageName)}.${EXTENSION[format]}`;
}

/** Push a blob or data URL to the user as a download. */
export function download(content: string | Blob, name: string, mime: string): void {
  const blob = typeof content === 'string' ? new Blob([content], { type: mime }) : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  // The object URL holds the blob alive; release it once the click is handled.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
