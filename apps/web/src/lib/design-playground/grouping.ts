/**
 * Design Playground - grouping and marquee selection.
 *
 * Both are pure planning functions over a document: they compute WHAT should
 * happen and hand back a command (or a set of ids), leaving the store to
 * dispatch it. That keeps the tricky coordinate maths testable without a canvas.
 */

import { batch, insertNodes, moveNode, removeNodes, updateNode, type Command } from './commands';
import { createNode } from './document';
import type { Document, Node } from './types';

/** Padding-free bounds of sibling nodes, in their shared parent's space. */
function siblingBounds(doc: Document, ids: string[]): { x: number; y: number } | null {
  const nodes = ids.map((id) => doc.nodes[id]).filter((node): node is Node => node !== undefined);
  if (nodes.length === 0) return null;
  return {
    x: Math.min(...nodes.map((n) => n.transform.x)),
    y: Math.min(...nodes.map((n) => n.transform.y)),
  };
}

/**
 * Plan a group of the given nodes.
 *
 * Only siblings can be grouped - nodes under different parents have different
 * coordinate spaces, and silently re-parenting across them would move things on
 * screen. The selection is therefore narrowed to the first node's parent.
 *
 * Returns null when there is nothing sensible to group (fewer than two
 * siblings), so the caller can no-op rather than push an empty undo step.
 */
export function planGroup(doc: Document, ids: string[]): Command | null {
  const first = ids.map((id) => doc.nodes[id]).find((node): node is Node => node !== undefined);
  const parentId = first?.parentId;
  if (!parentId) return null;

  const parent = doc.nodes[parentId];
  if (!parent) return null;

  // Keep the selection in paint order, so grouping never reshuffles z-order.
  const members = parent.children.filter((id) => ids.includes(id));
  if (members.length < 2) return null;

  const origin = siblingBounds(doc, members);
  if (!origin) return null;

  const group = createNode(
    'group',
    { x: origin.x, y: origin.y, width: 0, height: 0, rotation: 0 },
    { parentId, name: 'Group' },
  );

  // Insert where the topmost member sat, so the group lands at its z-position.
  const index = Math.max(...members.map((id) => parent.children.indexOf(id)));

  const commands: Command[] = [insertNodes({ [group.id]: group }, [group.id], parentId, index)];

  members.forEach((id, offset) => {
    const node = doc.nodes[id];
    if (!node) return;
    commands.push(moveNode(id, group.id, offset));
    // A child's transform is parent-relative, so rebase it onto the group's
    // origin - otherwise every member would jump by the group's offset.
    commands.push(
      updateNode(id, {
        transform: { x: node.transform.x - origin.x, y: node.transform.y - origin.y },
      }),
    );
  });

  return batch(commands, 'node.group');
}

/**
 * Plan the dissolution of every group in the selection.
 *
 * Children move back to the group's parent with their transforms rebased, and
 * the empty group is removed. Non-group nodes in the selection are ignored.
 */
export function planUngroup(doc: Document, ids: string[]): Command | null {
  const commands: Command[] = [];

  for (const id of ids) {
    const group = doc.nodes[id];
    if (!group || group.type !== 'group' || !group.parentId) continue;

    const parentId = group.parentId;
    const index = doc.nodes[parentId]?.children.indexOf(id) ?? 0;

    group.children.forEach((childId, offset) => {
      const child = doc.nodes[childId];
      if (!child) return;
      commands.push(moveNode(childId, parentId, index + offset));
      commands.push(
        updateNode(childId, {
          transform: {
            x: child.transform.x + group.transform.x,
            y: child.transform.y + group.transform.y,
          },
        }),
      );
    });

    commands.push(removeNodes([id]));
  }

  return commands.length > 0 ? batch(commands, 'node.ungroup') : null;
}

/** A rectangle in canvas space. */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function intersects(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
  );
}

/**
 * Top-level nodes touched by a marquee.
 *
 * Intersection rather than containment: dragging a band across a layout should
 * catch what it touches, which is what every canvas editor does and what users
 * expect from a quick sweep. Locked and hidden nodes are skipped - they cannot
 * be acted on, so selecting them would be a dead end.
 */
export function nodesInMarquee(doc: Document, rootId: string, marquee: Rect): string[] {
  const root = doc.nodes[rootId];
  if (!root) return [];

  return root.children.filter((id) => {
    const node = doc.nodes[id];
    if (!node || node.locked || node.hidden) return false;
    return intersects(marquee, {
      x: node.transform.x,
      y: node.transform.y,
      width: node.transform.width,
      height: node.transform.height,
    });
  });
}
