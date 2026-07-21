/**
 * Design Playground - pure helpers over a `Document`.
 *
 * Readers (traversal, bounds, ancestry) and constructors only. Nothing here
 * mutates a document: commands (`./commands`) own every change, so undo,
 * history and future collaboration all go through one path.
 */

import type {
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
import { createId } from './ids';

export const SCHEMA_VERSION = 1;

/**
 * The shadow a node gets the moment the user switches shadows on. Soft, slightly
 * below the shape and well short of opaque - the neutral elevation every design
 * tool opens on, so the first click reads as an improvement, not a smudge.
 */
export const DEFAULT_SHADOW: ShadowSpec = {
  color: '#000000',
  blur: 12,
  offsetX: 0,
  offsetY: 4,
  opacity: 0.25,
};

/** Effects a freshly drawn node starts with: none, and normal compositing. */
const NO_EFFECTS = { shadow: null, blendMode: 'normal' } as const;

/** Neutral paint a freshly drawn node starts with, per type. */
const DEFAULT_STYLE: Record<NodeType, StyleSpec> = {
  frame: { fill: '#ffffff', stroke: null, strokeWidth: 0, radius: 0, opacity: 1, ...NO_EFFECTS },
  rectangle: { fill: '#3b82f6', stroke: null, strokeWidth: 0, radius: 8, opacity: 1, ...NO_EFFECTS },
  ellipse: { fill: '#8b5cf6', stroke: null, strokeWidth: 0, radius: 0, opacity: 1, ...NO_EFFECTS },
  text: { fill: '#111827', stroke: null, strokeWidth: 0, radius: 0, opacity: 1, ...NO_EFFECTS },
  image: { fill: null, stroke: null, strokeWidth: 0, radius: 0, opacity: 1, ...NO_EFFECTS },
  group: { fill: null, stroke: null, strokeWidth: 0, radius: 0, opacity: 1, ...NO_EFFECTS },
};

const DEFAULT_LAYOUT: LayoutSpec = { mode: 'none', direction: 'row', gap: 0, padding: 0 };

export const DEFAULT_IMAGE: ImageSpec = { src: '', alt: '', fit: 'cover' };

export const DEFAULT_TEXT: TextSpec = {
  text: 'Text',
  fontSize: 24,
  fontFamily: 'Inter, system-ui, sans-serif',
  fontWeight: 400,
  lineHeight: 1.3,
  letterSpacing: 0,
  align: 'left',
};

export function createNode(
  type: NodeType,
  transform: Transform,
  overrides: Partial<Node> = {},
): Node {
  return {
    id: createId(),
    type,
    name: overrides.name ?? defaultName(type),
    parentId: overrides.parentId ?? null,
    children: [],
    transform,
    style: { ...DEFAULT_STYLE[type], ...overrides.style },
    layout: { ...DEFAULT_LAYOUT, ...overrides.layout },
    ...(type === 'text' ? { text: { ...DEFAULT_TEXT, ...overrides.text } } : {}),
    ...(type === 'image' ? { image: { ...DEFAULT_IMAGE, ...overrides.image } } : {}),
    locked: false,
    hidden: false,
  };
}

function defaultName(type: NodeType): string {
  // Names are user-facing but user-editable; the type is the honest default and
  // is deliberately not translated - a renamed layer must not change with locale.
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/** A page and its (never-rendered) root node. */
export function createPage(name: string): { page: Page; root: Node } {
  const root = createNode('group', { x: 0, y: 0, width: 0, height: 0, rotation: 0 }, {
    name: 'Root',
  });
  return { page: { id: createId(), name, rootId: root.id }, root };
}

/** An empty document with one page - what a new project opens on. */
export function createDocument(name: string, firstPageName: string): Document {
  const { page, root } = createPage(firstPageName);
  return {
    schemaVersion: SCHEMA_VERSION,
    id: createId(),
    name,
    pages: [page],
    nodes: { [root.id]: root },
  };
}

export function getNode(doc: Document, id: string | null): Node | null {
  return id ? (doc.nodes[id] ?? null) : null;
}

/** Ancestors of `id`, nearest first. */
export function ancestorsOf(doc: Document, id: string): Node[] {
  const out: Node[] = [];
  let current = doc.nodes[id]?.parentId ?? null;
  while (current) {
    const node = doc.nodes[current];
    if (!node) break;
    out.push(node);
    current = node.parentId;
  }
  return out;
}

/** `id` and everything under it, parents before children. */
export function descendantsOf(doc: Document, id: string): Node[] {
  const out: Node[] = [];
  const stack = [id];
  while (stack.length > 0) {
    const next = stack.pop();
    const node = next ? doc.nodes[next] : undefined;
    if (!node) continue;
    out.push(node);
    // Reversed so siblings come off the stack in paint order.
    stack.push(...[...node.children].reverse());
  }
  return out;
}

/** True when `ancestorId` is at or above `id` - the guard against cyclic moves. */
export function isAncestorOf(doc: Document, ancestorId: string, id: string): boolean {
  if (ancestorId === id) return true;
  return ancestorsOf(doc, id).some((node) => node.id === ancestorId);
}

/** A node's position in absolute canvas space (rotation is not accumulated). */
export function absolutePosition(doc: Document, id: string): { x: number; y: number } {
  const node = doc.nodes[id];
  if (!node) return { x: 0, y: 0 };
  let x = node.transform.x;
  let y = node.transform.y;
  for (const ancestor of ancestorsOf(doc, id)) {
    x += ancestor.transform.x;
    y += ancestor.transform.y;
  }
  return { x, y };
}

/** Bounding box, in absolute canvas space, of a set of nodes. */
export function boundsOf(
  doc: Document,
  ids: string[],
): { x: number; y: number; width: number; height: number } | null {
  const boxes = ids
    .map((id) => {
      const node = doc.nodes[id];
      if (!node) return null;
      const { x, y } = absolutePosition(doc, id);
      return { x, y, width: node.transform.width, height: node.transform.height };
    })
    .filter((box): box is NonNullable<typeof box> => box !== null);

  if (boxes.length === 0) return null;

  const minX = Math.min(...boxes.map((b) => b.x));
  const minY = Math.min(...boxes.map((b) => b.y));
  const maxX = Math.max(...boxes.map((b) => b.x + b.width));
  const maxY = Math.max(...boxes.map((b) => b.y + b.height));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/**
 * The frame a point falls inside, if any - so a shape drawn over a frame is
 * parented to it. Searched topmost-first, which is paint order reversed.
 */
export function frameAt(doc: Document, page: Page, point: { x: number; y: number }): Node | null {
  const root = doc.nodes[page.rootId];
  if (!root) return null;
  for (const id of [...root.children].reverse()) {
    const node = doc.nodes[id];
    if (!node || node.type !== 'frame' || node.hidden || node.locked) continue;
    const { x, y } = node.transform;
    if (
      point.x >= x &&
      point.x <= x + node.transform.width &&
      point.y >= y &&
      point.y <= y + node.transform.height
    ) {
      return node;
    }
  }
  return null;
}

/** Top-level nodes of a page, in paint order. */
export function topLevelNodes(doc: Document, page: Page): Node[] {
  const root = doc.nodes[page.rootId];
  if (!root) return [];
  return root.children.map((id) => doc.nodes[id]).filter((n): n is Node => n !== undefined);
}
