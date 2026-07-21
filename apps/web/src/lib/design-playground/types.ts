/**
 * Design Playground - the document model.
 *
 * One primitive (`Node`) describes everything on the canvas; a `Document` is a
 * FLAT map of nodes plus a root per page. Flat storage is deliberate
 * (`documents/DESIGN_PLAYGROUND_PRD.md` §6): it keeps command application O(1),
 * diffs small and future CRDT merges tractable. Children are referenced by id -
 * never nested objects.
 *
 * Nothing here mutates. Every change goes through a command (`./commands`).
 */

/** Every node kind the canvas can draw. */
export type NodeType = 'frame' | 'rectangle' | 'ellipse' | 'text' | 'image' | 'group';

/** Position and size in canvas pixels; rotation in degrees, clockwise. */
export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

/**
 * A drop shadow. Colour and opacity are stored apart rather than baked into an
 * eight-digit hex, because every renderer we target (Konva, CSS, SVG filters)
 * takes them as two arguments - combining them here would only mean splitting
 * them again three times.
 */
export interface ShadowSpec {
  /** Literal hex, `#rrggbb`. */
  color: string;
  /** CSS blur radius (twice the Gaussian deviation an SVG filter wants). */
  blur: number;
  offsetX: number;
  offsetY: number;
  /** 0-1, like `StyleSpec.opacity`. */
  opacity: number;
}

/**
 * How a node composites onto what is already painted. A deliberate subset of
 * CSS `mix-blend-mode`: every member here maps 1:1 onto a canvas
 * `globalCompositeOperation`, so the canvas and an export cannot disagree.
 */
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';

export const BLEND_MODES: readonly BlendMode[] = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
];

/** Paint. Colours are literal user data, not theme tokens - see PRD §4.4. */
export interface StyleSpec {
  fill: string | null;
  stroke: string | null;
  strokeWidth: number;
  /** Uniform corner radius; ignored by types that cannot round. */
  radius: number;
  opacity: number;
  /** null means "no shadow", mirroring how `fill`/`stroke` model absence. */
  shadow: ShadowSpec | null;
  blendMode: BlendMode;
}

/** Text-only properties. Absent on every other node type. */
export interface TextSpec {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  align: 'left' | 'center' | 'right';
}

/**
 * Image-only properties. `src` is whatever the browser can load: a data URI for
 * a local upload, or a URL once server-backed assets land (PRD §6.1).
 */
export interface ImageSpec {
  src: string;
  alt: string;
  /** How the bitmap fills its box, mirroring CSS `object-fit`. */
  fit: 'cover' | 'contain' | 'fill';
}

/** How a node arranges its children. Auto-layout arrives in Phase 2. */
export interface LayoutSpec {
  mode: 'none' | 'flex';
  direction: 'row' | 'column';
  gap: number;
  padding: number;
}

export interface Node {
  id: string;
  type: NodeType;
  name: string;
  /** null only for a page root. */
  parentId: string | null;
  /** Child ids in paint order: last is on top. */
  children: string[];
  transform: Transform;
  style: StyleSpec;
  layout: LayoutSpec;
  text?: TextSpec;
  image?: ImageSpec;
  locked: boolean;
  hidden: boolean;
}

export interface Page {
  id: string;
  name: string;
  /** The node every top-level frame hangs from. Never rendered itself. */
  rootId: string;
}

export interface Document {
  /** Bumped when the shape below changes; `./schema` migrates on read. */
  schemaVersion: number;
  id: string;
  name: string;
  pages: Page[];
  /** id → node, for every page in this document. */
  nodes: Record<string, Node>;
}

/**
 * A partial node update, as carried by an update command.
 *
 * Each group is shallow: `style.shadow` is replaced whole, never merged field by
 * field. That is what lets `inversePatch` capture the previous value of any key
 * generically, so undo stays one mechanism rather than one per nested object.
 */
export type NodePatch = Partial<
  Pick<Node, 'name' | 'locked' | 'hidden'> & {
    transform: Partial<Transform>;
    style: Partial<StyleSpec>;
    layout: Partial<LayoutSpec>;
    text: Partial<TextSpec>;
    image: Partial<ImageSpec>;
  }
>;

/** Types that accept children today. */
export const CONTAINER_TYPES: readonly NodeType[] = ['frame', 'group'];

export function isContainer(node: Node): boolean {
  return CONTAINER_TYPES.includes(node.type);
}

/** Types the user draws directly with a tool. */
export const DRAWABLE_TYPES: readonly NodeType[] = ['frame', 'rectangle', 'ellipse', 'text'];

/** Types placed from a panel rather than drawn with a tool. */
export const PLACEABLE_TYPES: readonly NodeType[] = ['image'];
