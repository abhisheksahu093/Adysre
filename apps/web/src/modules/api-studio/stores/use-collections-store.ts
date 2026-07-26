'use client';

import { create } from 'zustand';
import type { ApiCollection, ApiNode, ApiRequestNode, ApiTreeNode } from '../types';
import { buildTree, canMove, childrenOf, descendantIds, positionBetween, renumber } from '../utils/tree';
import { createId } from '../utils/ids';
import type { LoadStatus } from './use-workspace-store';

/**
 * Collections and the request tree.
 *
 * Nodes are held as a flat map keyed by id, exactly as they are stored. Every
 * structural question (children, tree, descendants, where a drop lands) is
 * answered by the pure helpers in `utils/tree`, so this store stays a set of
 * synchronous reducers with no traversal logic of its own.
 *
 * Derived trees are memoised on the identity of the `nodes` map: reducers
 * replace it immutably, so an unchanged map returns the previously built tree
 * and a 5,000-node sidebar does not rebuild on every unrelated keystroke.
 */

const treeCache = new WeakMap<object, Map<string, ApiTreeNode[]>>();

interface CollectionsState {
  status: LoadStatus;
  error: string | null;

  collections: ApiCollection[];
  nodes: Record<string, ApiNode>;

  /** Folder open/closed state, by node id. Absent means closed. */
  expanded: Record<string, boolean>;
  selectedNodeId: string | null;
  /** Sidebar filter text. */
  query: string;

  beginLoad: () => void;
  failLoad: (error: string) => void;
  load: (payload: { collections: ApiCollection[]; nodes: ApiNode[] }) => void;

  upsertCollection: (collection: ApiCollection) => void;
  removeCollection: (id: string) => void;

  upsertNode: (node: ApiNode) => void;
  updateNode: (id: string, patch: Partial<Omit<ApiNode, 'id' | 'kind'>>) => void;
  /** Soft-deletes the node and everything under it, in one update. */
  removeNode: (id: string) => void;

  /**
   * Move a node under `parentId`, landing at `index` among its siblings.
   * Refuses a move that would create a cycle or nest inside a request.
   *
   * @returns whether the move was applied.
   */
  moveNode: (id: string, parentId: string | null, index: number) => boolean;

  /**
   * Copy a node and its subtree. New ids throughout, so the copy is a peer of
   * the original rather than an alias of it.
   *
   * @param rename - names the copy. The store never invents display text; the
   * caller supplies a translated label.
   * @returns the new node's id, or `null` when the source is gone.
   */
  duplicateNode: (id: string, rename?: (name: string) => string) => string | null;

  toggleFavorite: (id: string) => void;
  toggleExpanded: (id: string) => void;
  setExpanded: (id: string, expanded: boolean) => void;
  setSelected: (id: string | null) => void;
  setQuery: (query: string) => void;

  /** The renderable tree for a collection. Memoised per `nodes` identity. */
  tree: (collectionId: string) => ApiTreeNode[];
  /** Live nodes matching `query` across name, url and tags. */
  matches: () => ApiNode[];
  requestNode: (id: string) => ApiRequestNode | undefined;
}

/** Soft delete stamps a timestamp rather than dropping the row. */
function markDeleted(node: ApiNode, at: string): ApiNode {
  return { ...node, deletedAt: at };
}

export const useCollectionsStore = create<CollectionsState>((set, get) => ({
  status: 'idle',
  error: null,
  collections: [],
  nodes: {},
  expanded: {},
  selectedNodeId: null,
  query: '',

  beginLoad: () => set({ status: 'loading', error: null }),
  failLoad: (error) => set({ status: 'error', error }),

  load: ({ collections, nodes }) =>
    set({
      status: 'ready',
      error: null,
      collections,
      nodes: Object.fromEntries(nodes.map((node) => [node.id, node])),
    }),

  upsertCollection: (collection) =>
    set((state) => {
      const index = state.collections.findIndex((item) => item.id === collection.id);
      if (index === -1) return { collections: [...state.collections, collection] };
      const collections = [...state.collections];
      collections[index] = collection;
      return { collections };
    }),

  removeCollection: (id) =>
    set((state) => {
      const at = new Date().toISOString();
      const nodes = { ...state.nodes };
      for (const node of Object.values(nodes)) {
        if (node.collectionId === id) nodes[node.id] = markDeleted(node, at);
      }
      return {
        collections: state.collections.filter((collection) => collection.id !== id),
        nodes,
      };
    }),

  upsertNode: (node) => set((state) => ({ nodes: { ...state.nodes, [node.id]: node } })),

  updateNode: (id, patch) =>
    set((state) => {
      const node = state.nodes[id];
      if (!node) return {};
      // The spread is typed through the union, so a folder can never acquire a
      // request's fields by way of a patch.
      const next = { ...node, ...patch } as ApiNode;
      return { nodes: { ...state.nodes, [id]: next } };
    }),

  removeNode: (id) =>
    set((state) => {
      const node = state.nodes[id];
      if (!node) return {};
      const at = new Date().toISOString();
      const nodes = { ...state.nodes, [id]: markDeleted(node, at) };
      for (const descendant of descendantIds(state.nodes, id)) {
        const child = nodes[descendant];
        if (child) nodes[descendant] = markDeleted(child, at);
      }
      return {
        nodes,
        selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      };
    }),

  moveNode: (id, parentId, index) => {
    const state = get();
    const node = state.nodes[id];
    if (!node || !canMove(state.nodes, id, parentId)) return false;

    const siblings = childrenOf(state.nodes, node.collectionId, parentId).filter(
      (sibling) => sibling.id !== id,
    );
    const clamped = Math.max(0, Math.min(index, siblings.length));
    const before = clamped === 0 ? null : (siblings[clamped - 1] ?? null);
    const after = siblings[clamped] ?? null;

    const position = positionBetween(before, after);
    if (position !== null) {
      set({ nodes: { ...state.nodes, [id]: { ...node, parentId, position } } });
      return true;
    }

    // The gap between two siblings closed. Spread the list out again, then drop
    // the node into the freshly opened space.
    const nodes = { ...state.nodes };
    const spread = renumber(siblings);
    for (const { id: siblingId, position: next } of spread) {
      const sibling = nodes[siblingId];
      if (sibling) nodes[siblingId] = { ...sibling, position: next };
    }

    const renumbered = childrenOf(nodes, node.collectionId, parentId).filter(
      (sibling) => sibling.id !== id,
    );
    const gapBefore = clamped === 0 ? null : (renumbered[clamped - 1] ?? null);
    const gapAfter = renumbered[clamped] ?? null;
    const settled = positionBetween(gapBefore, gapAfter);
    if (settled === null) return false;

    nodes[id] = { ...node, parentId, position: settled };
    set({ nodes });
    return true;
  },

  duplicateNode: (id, rename) => {
    const state = get();
    const source = state.nodes[id];
    if (!source) return null;

    const at = new Date().toISOString();
    const idMap = new Map<string, string>([[id, createId()]]);
    for (const descendant of descendantIds(state.nodes, id)) {
      idMap.set(descendant, createId());
    }

    const nodes = { ...state.nodes };
    const siblings = childrenOf(state.nodes, source.collectionId, source.parentId);
    const lastPosition = siblings.reduce((max, sibling) => Math.max(max, sibling.position), 0);

    for (const [oldId, newId] of idMap) {
      const original = state.nodes[oldId];
      if (!original) continue;
      const isRoot = oldId === id;
      nodes[newId] = {
        ...original,
        id: newId,
        parentId: isRoot
          ? original.parentId
          : (idMap.get(original.parentId ?? '') ?? original.parentId),
        name: isRoot && rename ? rename(original.name) : original.name,
        position: isRoot ? lastPosition + 1000 : original.position,
        createdAt: at,
        updatedAt: at,
        deletedAt: null,
        ...(original.kind === 'request' ? { version: 1 } : {}),
      } as ApiNode;
    }

    set({ nodes });
    return idMap.get(id) ?? null;
  },

  toggleFavorite: (id) =>
    set((state) => {
      const node = state.nodes[id];
      if (!node) return {};
      return { nodes: { ...state.nodes, [id]: { ...node, favorite: !node.favorite } } };
    }),

  toggleExpanded: (id) =>
    set((state) => ({ expanded: { ...state.expanded, [id]: !state.expanded[id] } })),

  setExpanded: (id, expanded) =>
    set((state) => ({ expanded: { ...state.expanded, [id]: expanded } })),

  setSelected: (selectedNodeId) => set({ selectedNodeId }),
  setQuery: (query) => set({ query }),

  tree: (collectionId) => {
    const { nodes } = get();
    let byCollection = treeCache.get(nodes);
    if (!byCollection) {
      byCollection = new Map();
      treeCache.set(nodes, byCollection);
    }
    const cached = byCollection.get(collectionId);
    if (cached) return cached;

    const built = buildTree(nodes, collectionId);
    byCollection.set(collectionId, built);
    return built;
  },

  matches: () => {
    const { nodes, query } = get();
    const needle = query.trim().toLowerCase();
    const live = Object.values(nodes).filter((node) => node.deletedAt === null);
    if (needle === '') return live;

    return live.filter((node) => {
      if (node.name.toLowerCase().includes(needle)) return true;
      if (node.tags.some((tag) => tag.toLowerCase().includes(needle))) return true;
      return node.kind === 'request' && node.request.url.toLowerCase().includes(needle);
    });
  },

  requestNode: (id) => {
    const node = get().nodes[id];
    return node?.kind === 'request' ? node : undefined;
  },
}));
