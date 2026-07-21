/**
 * Design Playground - commands.
 *
 * Every document change is a command: a plain, serialisable object that knows
 * how to `apply` itself and how to produce its own inverse. That single rule
 * (PRD §4.2) is what makes undo/redo, version history, prompt-driven AI edits
 * and future CRDT sync one mechanism instead of four.
 *
 * Rules for adding a command:
 *  - `apply` must be PURE: return a new document, never mutate the argument.
 *  - `invert` is computed against the document BEFORE apply, so it can capture
 *    whatever it needs to restore (previous values, previous parent, index).
 *  - Never reach into React or a store from here.
 */

import type { Document, Node, NodePatch } from './types';

export interface Command {
  /** Stable discriminator, e.g. 'node.insert'. Used by history and logs. */
  readonly type: string;
  /** A new document with the change applied. Pure. */
  apply(doc: Document): Document;
  /** The command that undoes this one, computed against the pre-apply doc. */
  invert(doc: Document): Command;
}

/* ------------------------------------------------------------------ helpers */

function withNodes(doc: Document, nodes: Record<string, Node>): Document {
  return { ...doc, nodes };
}

/** Replace one node, leaving the rest of the map untouched. */
function replaceNode(doc: Document, node: Node): Document {
  return withNodes(doc, { ...doc.nodes, [node.id]: node });
}

/** Insert `childId` into `parentId`'s children at `index` (clamped). */
function linkChild(doc: Document, parentId: string, childId: string, index: number): Document {
  const parent = doc.nodes[parentId];
  if (!parent) return doc;
  const children = parent.children.filter((id) => id !== childId);
  children.splice(Math.max(0, Math.min(index, children.length)), 0, childId);
  return replaceNode(doc, { ...parent, children });
}

function unlinkChild(doc: Document, parentId: string, childId: string): Document {
  const parent = doc.nodes[parentId];
  if (!parent) return doc;
  return replaceNode(doc, {
    ...parent,
    children: parent.children.filter((id) => id !== childId),
  });
}

function indexOfChild(doc: Document, parentId: string | null, childId: string): number {
  if (!parentId) return 0;
  return doc.nodes[parentId]?.children.indexOf(childId) ?? 0;
}

/** Deep-ish clone of the patchable sub-objects, so patches never alias. */
function patchNode(node: Node, patch: NodePatch): Node {
  return {
    ...node,
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.locked !== undefined ? { locked: patch.locked } : {}),
    ...(patch.hidden !== undefined ? { hidden: patch.hidden } : {}),
    ...(patch.transform ? { transform: { ...node.transform, ...patch.transform } } : {}),
    ...(patch.style ? { style: { ...node.style, ...patch.style } } : {}),
    ...(patch.layout ? { layout: { ...node.layout, ...patch.layout } } : {}),
    ...(patch.text && node.text ? { text: { ...node.text, ...patch.text } } : {}),
    ...(patch.image && node.image ? { image: { ...node.image, ...patch.image } } : {}),
  };
}

/**
 * The current values for exactly the keys a patch touches - the undo payload.
 *
 * The copy is one level deep, which is exactly right because a patch group is
 * itself one level deep: `style.shadow` is replaced whole (see `NodePatch`), so
 * capturing the previous shadow object - or `null` - restores it verbatim. If a
 * spec ever gains a field that is patched *inside* a nested object, it needs
 * handling here; nothing does today.
 */
function inversePatch(node: Node, patch: NodePatch): NodePatch {
  const inverse: NodePatch = {};
  if (patch.name !== undefined) inverse.name = node.name;
  if (patch.locked !== undefined) inverse.locked = node.locked;
  if (patch.hidden !== undefined) inverse.hidden = node.hidden;
  for (const key of ['transform', 'style', 'layout', 'text', 'image'] as const) {
    const group = patch[key];
    if (!group) continue;
    const source = node[key];
    if (!source) continue;
    const current = source as unknown as Record<string, unknown>;
    const restored: Record<string, unknown> = {};
    for (const field of Object.keys(group)) restored[field] = current[field];
    // Each group is a partial of its own spec; the keys came from that spec.
    Object.assign(inverse, { [key]: restored });
  }
  return inverse;
}

/* ----------------------------------------------------------------- commands */

/**
 * Insert a node (and any subtree it already carries) under a parent.
 *
 * `nodes` is a map so re-inserting a deleted subtree on undo restores it whole,
 * with its original ids - the only way a redo of a delete can be reversible.
 */
export function insertNodes(
  nodes: Record<string, Node>,
  rootIds: string[],
  parentId: string,
  index: number,
): Command {
  return {
    type: 'node.insert',
    apply(doc) {
      let next = withNodes(doc, { ...doc.nodes, ...nodes });
      rootIds.forEach((id, offset) => {
        const node = next.nodes[id];
        if (!node) return;
        next = replaceNode(next, { ...node, parentId });
        next = linkChild(next, parentId, id, index + offset);
      });
      return next;
    },
    invert() {
      return removeNodes(rootIds);
    },
  };
}

/** Remove nodes and everything beneath them. */
export function removeNodes(rootIds: string[]): Command {
  return {
    type: 'node.remove',
    apply(doc) {
      let next = doc;
      for (const rootId of rootIds) {
        const node = next.nodes[rootId];
        if (!node) continue;
        // Collect the subtree before unlinking, so nothing is orphaned.
        const doomed: string[] = [];
        const stack = [rootId];
        while (stack.length > 0) {
          const id = stack.pop();
          const current = id ? next.nodes[id] : undefined;
          if (!current) continue;
          doomed.push(current.id);
          stack.push(...current.children);
        }
        if (node.parentId) next = unlinkChild(next, node.parentId, rootId);
        const nodes = { ...next.nodes };
        for (const id of doomed) delete nodes[id];
        next = withNodes(next, nodes);
      }
      return next;
    },
    invert(doc) {
      // Capture each subtree and where it sat, so undo puts it back exactly.
      const captured: Record<string, Node> = {};
      const parents: { id: string; parentId: string; index: number }[] = [];
      for (const rootId of rootIds) {
        const node = doc.nodes[rootId];
        if (!node) continue;
        const stack = [rootId];
        while (stack.length > 0) {
          const id = stack.pop();
          const current = id ? doc.nodes[id] : undefined;
          if (!current) continue;
          captured[current.id] = current;
          stack.push(...current.children);
        }
        parents.push({
          id: rootId,
          parentId: node.parentId ?? '',
          index: indexOfChild(doc, node.parentId, rootId),
        });
      }
      return batch(
        parents.map((entry) => insertNodes(captured, [entry.id], entry.parentId, entry.index)),
        'node.restore',
      );
    },
  };
}

/** Patch one node's fields. The workhorse: drag, resize, restyle, rename. */
export function updateNode(id: string, patch: NodePatch): Command {
  return {
    type: 'node.update',
    apply(doc) {
      const node = doc.nodes[id];
      if (!node) return doc;
      return replaceNode(doc, patchNode(node, patch));
    },
    invert(doc) {
      const node = doc.nodes[id];
      if (!node) return updateNode(id, {});
      return updateNode(id, inversePatch(node, patch));
    },
  };
}

/** Reparent and/or reorder a node. Refuses cycles. */
export function moveNode(id: string, parentId: string, index: number): Command {
  return {
    type: 'node.move',
    apply(doc) {
      const node = doc.nodes[id];
      const parent = doc.nodes[parentId];
      if (!node || !parent) return doc;
      // A node cannot be moved inside itself or its own descendant.
      let cursor: string | null = parentId;
      while (cursor) {
        if (cursor === id) return doc;
        cursor = doc.nodes[cursor]?.parentId ?? null;
      }
      let next = node.parentId ? unlinkChild(doc, node.parentId, id) : doc;
      next = replaceNode(next, { ...(next.nodes[id] ?? node), parentId });
      return linkChild(next, parentId, id, index);
    },
    invert(doc) {
      const node = doc.nodes[id];
      if (!node?.parentId) return moveNode(id, parentId, index);
      return moveNode(id, node.parentId, indexOfChild(doc, node.parentId, id));
    },
  };
}

/**
 * Run several commands as one undo step.
 *
 * Inversion walks forward applying each command so every inverse is computed
 * against the document that command actually saw, then reverses the result -
 * the same reason a transaction log replays in order.
 */
export function batch(commands: Command[], type = 'batch'): Command {
  return {
    type,
    apply(doc) {
      return commands.reduce((acc, command) => command.apply(acc), doc);
    },
    invert(doc) {
      const inverses: Command[] = [];
      let cursor = doc;
      for (const command of commands) {
        inverses.push(command.invert(cursor));
        cursor = command.apply(cursor);
      }
      return batch(inverses.reverse(), `${type}.invert`);
    },
  };
}
