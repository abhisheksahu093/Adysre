/**
 * Design Playground - where a panel-inserted node lands.
 *
 * Clicking a component in the left rail has no drop point, so something has to
 * decide the coordinates. Dropping everything at the page origin stacks every
 * insert on top of the last one, which reads as "the panel is broken" - the
 * second component appears to replace the first.
 *
 * The rule here is the one a page builder implies: new content goes UNDER the
 * content already there, inside the frame the user is working in. That makes the
 * panel behave like appending to a page rather than scattering onto a canvas.
 *
 * Pure functions over a `Document`: no commands, no store. The store turns what
 * these return into a command so the whole insert stays one undo step.
 */

import { descendantsOf } from './document';
import type { Document, Node, Page } from './types';

/**
 * Gap left between a dropped node and the content above it, in canvas pixels.
 *
 * Zero for anything spanning its container: page sections are designed to butt
 * together, and a seam between a navbar and a hero would be a visible defect.
 */
export const STACK_GAP = 24;

/** A node counts as spanning when it fills its container edge to edge. */
const SPAN_TOLERANCE = 1;

/**
 * The frame new content belongs to.
 *
 * The one holding the selection wins - that is demonstrably where the user is
 * working. Failing that, the last top-level frame, which is the one most
 * recently drawn or added. `null` means the page has no frame at all and content
 * goes loose on the canvas.
 */
export function activeFrame(doc: Document, page: Page, selection: readonly string[]): Node | null {
  const root = doc.nodes[page.rootId];
  if (!root) return null;

  const topLevelFrames = root.children
    .map((id) => doc.nodes[id])
    .filter((node): node is Node => node?.type === 'frame' && !node.locked);

  for (const id of selection) {
    // The selected node itself may BE the frame, so start the walk at it.
    let current: Node | undefined = doc.nodes[id];
    while (current) {
      if (current.type === 'frame' && topLevelFrames.some((f) => f.id === current?.id)) {
        return current;
      }
      current = current.parentId ? doc.nodes[current.parentId] : undefined;
    }
  }

  return topLevelFrames[topLevelFrames.length - 1] ?? null;
}

/**
 * Where to put a `width × height` box so it sits below everything already in
 * `containerId`, in coordinates relative to that container.
 *
 * Hidden children are ignored: content the user has turned off should not push
 * the next drop into empty space.
 */
export function stackPosition(
  doc: Document,
  containerId: string,
  size: { width: number; height: number },
): { x: number; y: number } {
  const container = doc.nodes[containerId];
  if (!container) return { x: 0, y: 0 };

  const children = container.children
    .map((id) => doc.nodes[id])
    .filter((node): node is Node => node !== undefined && !node.hidden);

  const containerWidth = container.transform.width;
  const spans =
    containerWidth > 0 && Math.abs(size.width - containerWidth) <= SPAN_TOLERANCE;

  // A spanning section starts at the container's left edge; anything narrower is
  // centred, which is what makes a stack of mixed-width components read as a
  // column rather than a ragged left-aligned pile.
  const x = spans || containerWidth <= 0 ? 0 : Math.max(0, Math.round((containerWidth - size.width) / 2));

  if (children.length === 0) return { x, y: 0 };

  const bottom = Math.max(...children.map((child) => child.transform.y + child.transform.height));
  return { x, y: Math.round(bottom + (spans ? 0 : STACK_GAP)) };
}

/**
 * The height `frameId` needs to contain everything in it, or null when it
 * already does.
 *
 * Frames do not clip content out of existence - the canvas hides the overflow -
 * so a section dropped past the bottom edge would simply vanish. Growing the
 * frame keeps "what I added is on the page" true.
 */
export function grownHeight(doc: Document, frameId: string): number | null {
  const frame = doc.nodes[frameId];
  if (!frame || frame.type !== 'frame') return null;

  const children = frame.children
    .map((id) => doc.nodes[id])
    .filter((node): node is Node => node !== undefined && !node.hidden);
  if (children.length === 0) return null;

  const needed = Math.ceil(
    Math.max(...children.map((child) => child.transform.y + child.transform.height)),
  );
  return needed > frame.transform.height ? needed : null;
}

/**
 * The node a plain click should select, given the node actually hit.
 *
 * Clicking a heading inside a hero should hand the user the hero, not the
 * heading - otherwise "move this section" means selecting a dozen leaves by
 * hand. So a click resolves to the outermost ancestor sitting directly inside
 * the artboard (or directly on the page, for loose content). Double-click drills
 * to the exact node; that is the escape hatch, and it is the same bargain Figma
 * makes.
 */
export function topSelectable(doc: Document, page: Page, id: string): string {
  const node = doc.nodes[id];
  if (!node) return id;

  // Walk to the top-level node (the one parented to the page root), keeping the
  // step below it - that is the artboard's direct child, i.e. the section.
  let current: Node = node;
  let childOfTopLevel: Node = node;
  while (current.parentId && current.parentId !== page.rootId) {
    const parent = doc.nodes[current.parentId];
    if (!parent) break;
    childOfTopLevel = current;
    current = parent;
  }

  // `current` is now top-level. Clicking it directly (an artboard's own
  // background) selects it; anything deeper selects its outermost child.
  return current.id === node.id ? current.id : childOfTopLevel.id;
}

/**
 * Whether any of `ids` is currently inside the viewport rectangle.
 *
 * Drives the canvas's "back to content" escape hatch: an infinite canvas will
 * happily pan somewhere with nothing in it, and without a way back the work
 * looks lost.
 */
export function anyNodeVisible(
  doc: Document,
  page: Page,
  view: { x: number; y: number; width: number; height: number },
): boolean {
  const root = doc.nodes[page.rootId];
  if (!root) return false;

  return root.children.some((id) => {
    const nodes = descendantsOf(doc, id);
    return nodes.some((node) => {
      if (node.hidden) return false;
      const { width, height } = node.transform;
      if (width <= 0 || height <= 0) return false;
      const { x, y } = absoluteOf(doc, node);
      return (
        x < view.x + view.width && x + width > view.x && y < view.y + view.height && y + height > view.y
      );
    });
  });
}

/** Absolute position without re-walking ancestors per call site. */
function absoluteOf(doc: Document, node: Node): { x: number; y: number } {
  let x = node.transform.x;
  let y = node.transform.y;
  let parentId = node.parentId;
  while (parentId) {
    const parent = doc.nodes[parentId];
    if (!parent) break;
    x += parent.transform.x;
    y += parent.transform.y;
    parentId = parent.parentId;
  }
  return { x, y };
}
