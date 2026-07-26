/**
 * ADYSRE API Studio - tree operations over the flat node map.
 *
 * The store holds nodes as `Record<id, ApiNode>` and derives structure here, so
 * a move is a field change rather than a document rewrite. Everything in this
 * file is pure and takes the map as an argument, which is what makes it
 * testable without a store and reusable by the import parsers.
 *
 * Ordering uses sparse `position` values (multiples of `POSITION_STEP`): an
 * insert between two siblings takes the midpoint and rewrites ONE row. When a
 * gap finally closes, {@link renumber} spreads the whole sibling list out again.
 * That is the trade: one cheap update almost always, one expensive one rarely.
 */

import type { ApiNode, ApiTreeNode } from '../types';
import { POSITION_STEP } from '../constants/limits';

export type NodeMap = Readonly<Record<string, ApiNode>>;

/** Live (not soft-deleted) children of a parent, in display order. */
export function childrenOf(
  nodes: NodeMap,
  collectionId: string,
  parentId: string | null,
): ApiNode[] {
  return Object.values(nodes)
    .filter(
      (node) =>
        node.collectionId === collectionId &&
        node.parentId === parentId &&
        node.deletedAt === null,
    )
    .sort(comparePosition);
}

/** Siblings sort by position, then by id so the order is never ambiguous. */
function comparePosition(a: ApiNode, b: ApiNode): number {
  return a.position - b.position || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

/**
 * Build the renderable tree for one collection.
 *
 * Single pass: children are bucketed by parent, then linked. A recursive filter
 * would be O(n^2) and a 5,000-node collection would feel it on every keystroke.
 */
export function buildTree(nodes: NodeMap, collectionId: string): ApiTreeNode[] {
  const buckets = new Map<string, ApiNode[]>();

  for (const node of Object.values(nodes)) {
    if (node.collectionId !== collectionId || node.deletedAt !== null) continue;
    const key = node.parentId ?? '';
    const bucket = buckets.get(key);
    if (bucket) bucket.push(node);
    else buckets.set(key, [node]);
  }

  for (const bucket of buckets.values()) bucket.sort(comparePosition);

  const seen = new Set<string>();

  function link(parentId: string | null, depth: number): ApiTreeNode[] {
    return (buckets.get(parentId ?? '') ?? []).flatMap((node) => {
      // A cycle would recurse forever. The database forbids one, but an import
      // file is not the database, so the walk defends itself.
      if (seen.has(node.id)) return [];
      seen.add(node.id);
      return [{ node, depth, children: link(node.id, depth + 1) }];
    });
  }

  return link(null, 0);
}

/** Every descendant id of a node, depth first. Excludes the node itself. */
export function descendantIds(nodes: NodeMap, nodeId: string): string[] {
  const out: string[] = [];
  const stack = [nodeId];
  const seen = new Set<string>([nodeId]);

  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const node of Object.values(nodes)) {
      if (node.parentId !== current || seen.has(node.id)) continue;
      seen.add(node.id);
      out.push(node.id);
      stack.push(node.id);
    }
  }

  return out;
}

/**
 * Whether `nodeId` may be dropped into `parentId`.
 *
 * Refuses the two moves that would corrupt the tree: into itself, and into one
 * of its own descendants (which would detach the branch into a cycle). Also
 * refuses a request as a parent, since only folders hold children.
 */
export function canMove(nodes: NodeMap, nodeId: string, parentId: string | null): boolean {
  if (parentId === null) return true;
  if (parentId === nodeId) return false;

  const parent = nodes[parentId];
  if (!parent || parent.kind !== 'folder') return false;

  return !descendantIds(nodes, nodeId).includes(parentId);
}

/** Position for a node appended after `siblings`. */
export function nextPosition(siblings: readonly ApiNode[]): number {
  const last = siblings.reduce((max, node) => Math.max(max, node.position), 0);
  return last + POSITION_STEP;
}

/**
 * Position for a node dropped between two siblings.
 *
 * @returns the midpoint, or `null` when the gap has closed and the sibling list
 * has to be renumbered first. Callers must handle `null` rather than rounding,
 * because two nodes sharing a position is exactly the ambiguity the sparse
 * scheme exists to avoid.
 */
export function positionBetween(before: ApiNode | null, after: ApiNode | null): number | null {
  if (!before && !after) return POSITION_STEP;
  if (!before) return after!.position <= 1 ? null : Math.floor(after!.position / 2);
  if (!after) return before.position + POSITION_STEP;

  const gap = after.position - before.position;
  if (gap <= 1) return null;
  return before.position + Math.floor(gap / 2);
}

/** Fresh, evenly spaced positions for a sibling list. Used when a gap closes. */
export function renumber(siblings: readonly ApiNode[]): { id: string; position: number }[] {
  return [...siblings]
    .sort(comparePosition)
    .map((node, index) => ({ id: node.id, position: (index + 1) * POSITION_STEP }));
}

/** The path from the collection root down to a node, root first. */
export function pathTo(nodes: NodeMap, nodeId: string): ApiNode[] {
  const path: ApiNode[] = [];
  const seen = new Set<string>();
  let current = nodes[nodeId];

  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    path.unshift(current);
    current = current.parentId ? nodes[current.parentId] : undefined;
  }

  return path;
}
