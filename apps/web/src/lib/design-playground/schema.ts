/**
 * Design Playground - document validation, serialisation and migration.
 *
 * Anything crossing a trust boundary (localStorage, an imported `.adysre`
 * file, an API response) is parsed here before it becomes a `Document`. A
 * malformed or hand-edited payload must fail loudly at the edge rather than
 * crash the canvas halfway through a render.
 *
 * Validation is hand-written rather than Zod because this runs on every load of
 * a document that may hold 10,000 nodes: a narrow, allocation-free check is
 * measurably cheaper than building a schema object graph, and the shape is
 * fully owned by this module (no external contract to mirror).
 */

import { DEFAULT_TEXT, SCHEMA_VERSION } from './document';
import { BLEND_MODES } from './types';
import type {
  BlendMode,
  Document,
  ImageSpec,
  LayoutSpec,
  Node,
  NodeType,
  Page,
  ShadowSpec,
  StyleSpec,
  TextSpec,
  Transform,
} from './types';

const NODE_TYPES: readonly NodeType[] = [
  'frame',
  'rectangle',
  'ellipse',
  'text',
  'image',
  'group',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Read a number, falling back when the field is absent or not finite. */
function num(source: Record<string, unknown>, key: string, fallback: number): number {
  const value = source[key];
  return isFiniteNumber(value) ? value : fallback;
}

function str(source: Record<string, unknown>, key: string, fallback: string): string {
  const value = source[key];
  return typeof value === 'string' ? value : fallback;
}

/** A colour field: a string, or null for "no paint". */
function colour(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  return typeof value === 'string' ? value : null;
}

function parseTransform(source: Record<string, unknown>): Transform {
  return {
    x: num(source, 'x', 0),
    y: num(source, 'y', 0),
    width: num(source, 'width', 0),
    height: num(source, 'height', 0),
    rotation: num(source, 'rotation', 0),
  };
}

/** `#rgb`, `#rrggbb` or `#rrggbbaa`. Anything else is not a colour we will paint. */
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * A shadow, or null.
 *
 * Absent, malformed, or not an object means "no shadow" - the same answer an
 * older document (written before effects existed) gives, so nothing needs a
 * migration step. Fields are clamped rather than rejected: a hand-edited blur of
 * 10,000 is a value to tame, not a document to refuse.
 */
function parseShadow(value: unknown): ShadowSpec | null {
  if (!isRecord(value)) return null;
  const rawColour = value.color;
  return {
    // A CSS expression or a url() would be paint the canvas never vetted.
    color: typeof rawColour === 'string' && HEX.test(rawColour) ? rawColour.toLowerCase() : '#000000',
    blur: clamp(num(value, 'blur', 0), 0, 500),
    offsetX: clamp(num(value, 'offsetX', 0), -5000, 5000),
    offsetY: clamp(num(value, 'offsetY', 0), -5000, 5000),
    opacity: clamp(num(value, 'opacity', 1), 0, 1),
  };
}

function parseStyle(source: Record<string, unknown>): StyleSpec {
  const blendMode = source.blendMode;
  return {
    fill: colour(source, 'fill'),
    stroke: colour(source, 'stroke'),
    strokeWidth: num(source, 'strokeWidth', 0),
    radius: num(source, 'radius', 0),
    opacity: clamp(num(source, 'opacity', 1), 0, 1),
    shadow: parseShadow(source.shadow),
    blendMode: BLEND_MODES.includes(blendMode as BlendMode) ? (blendMode as BlendMode) : 'normal',
  };
}

function parseLayout(source: Record<string, unknown>): LayoutSpec {
  const mode = source.mode === 'flex' ? 'flex' : 'none';
  const direction = source.direction === 'column' ? 'column' : 'row';
  return { mode, direction, gap: num(source, 'gap', 0), padding: num(source, 'padding', 0) };
}

function parseText(source: Record<string, unknown>): TextSpec {
  const align = source.align;
  return {
    text: str(source, 'text', ''),
    fontSize: num(source, 'fontSize', DEFAULT_TEXT.fontSize),
    fontFamily: str(source, 'fontFamily', DEFAULT_TEXT.fontFamily),
    fontWeight: num(source, 'fontWeight', DEFAULT_TEXT.fontWeight),
    lineHeight: num(source, 'lineHeight', DEFAULT_TEXT.lineHeight),
    letterSpacing: num(source, 'letterSpacing', DEFAULT_TEXT.letterSpacing),
    align: align === 'center' || align === 'right' ? align : 'left',
  };
}

function parseImage(source: Record<string, unknown>): ImageSpec {
  const fit = source.fit;
  return {
    src: str(source, 'src', ''),
    alt: str(source, 'alt', ''),
    fit: fit === 'contain' || fit === 'fill' ? fit : 'cover',
  };
}

/**
 * Parse a node.
 *
 * Identity and structure (id, type, parent, children) are REJECTED when wrong -
 * they define the graph, and a guess there corrupts it. Presentation fields
 * (transform, style, layout, text) fall back to defaults instead, so one stale
 * or missing property from an older save costs a value, not the document.
 */
function parseNode(value: unknown): Node | null {
  if (!isRecord(value)) return null;
  const { id, type, name, parentId, children } = value;

  if (typeof id !== 'string' || id.length === 0) return null;
  if (typeof type !== 'string' || !NODE_TYPES.includes(type as NodeType)) return null;
  if (typeof name !== 'string') return null;
  if (parentId !== null && typeof parentId !== 'string') return null;
  if (!Array.isArray(children) || children.some((child) => typeof child !== 'string')) return null;

  const nodeType = type as NodeType;
  const text = value.text;

  return {
    id,
    type: nodeType,
    name,
    parentId,
    children: children as string[],
    transform: parseTransform(isRecord(value.transform) ? value.transform : {}),
    style: parseStyle(isRecord(value.style) ? value.style : {}),
    layout: parseLayout(isRecord(value.layout) ? value.layout : {}),
    ...(nodeType === 'text' ? { text: parseText(isRecord(text) ? text : {}) } : {}),
    ...(nodeType === 'image'
      ? { image: parseImage(isRecord(value.image) ? value.image : {}) }
      : {}),
    locked: value.locked === true,
    hidden: value.hidden === true,
  };
}

function parsePage(value: unknown): Page | null {
  if (!isRecord(value)) return null;
  const { id, name, rootId } = value;
  if (typeof id !== 'string' || typeof name !== 'string' || typeof rootId !== 'string') return null;
  return { id, name, rootId };
}

/**
 * Bring an older payload up to the current schema.
 *
 * Each step is a pure function from version N to N+1, applied in order. There
 * is only one version today; the ladder exists so the first real migration is
 * an addition here rather than a refactor.
 */
const MIGRATIONS: Record<number, (doc: Record<string, unknown>) => Record<string, unknown>> = {};

function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  let version = isFiniteNumber(raw.schemaVersion) ? raw.schemaVersion : 0;
  let doc = raw;
  while (version < SCHEMA_VERSION) {
    const step = MIGRATIONS[version];
    if (!step) break;
    doc = step(doc);
    version += 1;
  }
  return { ...doc, schemaVersion: SCHEMA_VERSION };
}

/**
 * Parse an unknown payload into a Document, or return null.
 *
 * Beyond field checks this enforces the model's two invariants: every page root
 * exists, and every child reference resolves. A dangling id would render as a
 * silently missing layer, which is worse than refusing the document.
 */
export function parseDocument(value: unknown): Document | null {
  if (!isRecord(value)) return null;
  const raw = migrate(value);

  const { id, name, pages, nodes } = raw;
  if (typeof id !== 'string' || typeof name !== 'string') return null;
  if (!Array.isArray(pages) || pages.length === 0 || !isRecord(nodes)) return null;

  const parsedPages: Page[] = [];
  for (const page of pages) {
    const parsed = parsePage(page);
    if (!parsed) return null;
    parsedPages.push(parsed);
  }

  const parsedNodes: Record<string, Node> = {};
  for (const [key, node] of Object.entries(nodes)) {
    const parsed = parseNode(node);
    if (!parsed || parsed.id !== key) return null;
    parsedNodes[key] = parsed;
  }

  if (parsedPages.some((page) => parsedNodes[page.rootId] === undefined)) return null;
  for (const node of Object.values(parsedNodes)) {
    if (node.children.some((child) => parsedNodes[child] === undefined)) return null;
  }

  return { schemaVersion: SCHEMA_VERSION, id, name, pages: parsedPages, nodes: parsedNodes };
}

export function serializeDocument(doc: Document): string {
  return JSON.stringify(doc);
}

export function deserializeDocument(json: string): Document | null {
  try {
    return parseDocument(JSON.parse(json));
  } catch {
    // Malformed JSON is a corrupt save, not an exception the editor can act on.
    return null;
  }
}
