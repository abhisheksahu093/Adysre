/**
 * Pure builders that turn an icon's raw SVG body into the shapes a consumer
 * wants: a standalone SVG file, a JSX snippet, a full React component, a data
 * URI, or a CSS background rule. No DOM here - the browser-only download helpers
 * live in `./download`.
 *
 * Every icon is authored as a 24x24, `fill="none"` line drawing whose colour,
 * stroke weight and fill come entirely from the wrapper `<svg>` - so a single
 * body renders at any size, colour and weight the user picks, and the same
 * knobs bake straight into the exported code.
 */

/** How an icon should be styled when rendered or exported. */
export interface IconStyle {
  /** Rendered pixel size (width = height). */
  size: number;
  /** Stroke colour - a hex, a CSS colour, or the literal `currentColor`. */
  color: string;
  /** Stroke weight on the 24px grid. */
  stroke: number;
  /** Fill the shapes with the stroke colour (solid look) instead of outline. */
  filled: boolean;
}

/** The default look every icon ships in. */
export const DEFAULT_ICON_STYLE: IconStyle = {
  size: 24,
  color: 'currentColor',
  stroke: 1.5,
  filled: false,
};

/** Raster export sizes offered for PNG download. */
export const ICON_SIZES = [16, 24, 32, 48, 64, 128, 256] as const;

/** The grid every icon body is drawn on. */
const VIEWBOX = 24;

export type IconCopyFormatId = 'svg' | 'jsx' | 'react' | 'dataUri' | 'css';

export interface IconCopyFormat {
  id: IconCopyFormatId;
  label: string;
  /** File extension used when this format is downloaded as a file. */
  ext: string;
  /** Highlight language hint (for the code block styling only). */
  lang: string;
}

export const ICON_COPY_FORMATS: IconCopyFormat[] = [
  { id: 'svg', label: 'SVG', ext: 'svg', lang: 'html' },
  { id: 'jsx', label: 'JSX', ext: 'jsx', lang: 'jsx' },
  { id: 'react', label: 'React', ext: 'tsx', lang: 'tsx' },
  { id: 'dataUri', label: 'Data URI', ext: 'txt', lang: 'text' },
  { id: 'css', label: 'CSS', ext: 'css', lang: 'css' },
];

/** `arrow-up-right` -> `ArrowUpRight`, for component and file names. */
export function pascalCase(name: string): string {
  return name
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

/** `Arrow Up Right` - a human-readable label from a slug. */
export function humanize(name: string): string {
  return name
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'icon';
}

/** Shared wrapper attributes, honouring the chosen style. */
function wrapperAttrs(style: IconStyle): string {
  const strokeAttrs = style.filled
    ? `fill="${style.color}" stroke="none"`
    : `fill="none" stroke="${style.color}" stroke-width="${style.stroke}" stroke-linecap="round" stroke-linejoin="round"`;
  return `viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" ${strokeAttrs}`;
}

/**
 * A standalone, self-contained SVG document string - the canonical export and
 * the source every other format is derived from.
 */
export function buildSvgMarkup(body: string, style: IconStyle): string {
  const { size } = style;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
    `${wrapperAttrs(style)}>` +
    `\n  ${body.trim()}\n` +
    `</svg>`
  );
}

/**
 * Camel-case the handful of hyphenated SVG attributes JSX requires.
 *
 * Exported because the icon-component generator needs the same mapping when it
 * bakes each body into a `.tsx` file - one rule, one place.
 */
export function toJsxAttrs(markup: string): string {
  const map: Record<string, string> = {
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-miterlimit': 'strokeMiterlimit',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'fill-opacity': 'fillOpacity',
    'stroke-opacity': 'strokeOpacity',
  };
  return markup.replace(
    /\b(stroke-width|stroke-linecap|stroke-linejoin|stroke-dasharray|stroke-miterlimit|fill-rule|clip-rule|fill-opacity|stroke-opacity)=/g,
    (_m, attr: string) => `${map[attr]}=`,
  );
}

/** A JSX `<svg>` element ready to paste into a component. */
export function buildJsxSnippet(body: string, style: IconStyle): string {
  return toJsxAttrs(buildSvgMarkup(body, style));
}

/**
 * A self-contained, prop-driven React component. Size, colour and stroke become
 * props so the consumer keeps the same live customisation this library offers.
 */
export function buildReactComponent(name: string, body: string): string {
  const comp = pascalCase(name);
  const jsxBody = toJsxAttrs(body.trim()).replace(/\n/g, '\n      ');
  return `import * as React from 'react';

export interface ${comp}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}

export function ${comp}({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  ...props
}: ${comp}Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      ${jsxBody}
    </svg>
  );
}
`;
}

/** A URL-encoded `data:` URI - safe for `src`, `url()` and `mask`. */
export function buildDataUri(body: string, style: IconStyle): string {
  const svg = buildSvgMarkup(body, style).replace(/\n\s*/g, '');
  // Encode the characters that break inside url()/attribute values, keep the
  // rest legible so the URI reads well when pasted.
  const encoded = encodeURIComponent(svg)
    .replace(/%20/g, ' ')
    .replace(/%3D/g, '=')
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/')
    .replace(/%22/g, "'");
  return `data:image/svg+xml,${encoded}`;
}

/** A ready-to-use CSS rule: a recolourable mask plus a background fallback. */
export function buildCssRule(body: string, style: IconStyle): string {
  const uri = buildDataUri(body, { ...style, color: 'currentColor' });
  return `.icon {
  width: ${style.size}px;
  height: ${style.size}px;
  background-color: currentColor;
  -webkit-mask: url("${uri}") center / contain no-repeat;
  mask: url("${uri}") center / contain no-repeat;
}`;
}

/** Produce whichever copyable format the UI asked for. */
export function formatIcon(
  name: string,
  body: string,
  format: IconCopyFormatId,
  style: IconStyle,
): string {
  switch (format) {
    case 'svg':
      return buildSvgMarkup(body, style);
    case 'jsx':
      return buildJsxSnippet(body, style);
    case 'react':
      return buildReactComponent(name, body);
    case 'dataUri':
      return buildDataUri(body, style);
    case 'css':
      return buildCssRule(body, style);
    default:
      return buildSvgMarkup(body, style);
  }
}
