import { create } from 'zustand';
import type { Command } from '@/lib/design-playground/commands';
import {
  batch,
  insertNodes,
  moveNode,
  removeNodes,
  updateNode,
} from '@/lib/design-playground/commands';
import {
  createDocument,
  createNode,
  createPage,
  descendantsOf,
  frameAt,
} from '@/lib/design-playground/document';
import { materialize, type TemplateSpec } from '@/lib/design-playground/templates';
import { planGroup, planUngroup } from '@/lib/design-playground/grouping';
import { commit, emptyHistory, redo, undo, type History } from '@/lib/design-playground/history';
import { deserializeDocument, serializeDocument } from '@/lib/design-playground/schema';
import {
  createProject,
  loadLatestProject,
  loadProject,
  saveProject as saveProjectToServer,
} from '@/lib/design-playground/project-client';
import type { Document, Node, NodePatch, NodeType, Transform } from '@/lib/design-playground/types';
import { createId } from '@/lib/design-playground/ids';

/**
 * Design Playground - the document store.
 *
 * Separate from the chrome store on purpose: this is the user's WORK. It moves
 * only through commands, so undo/redo, autosave and (later) collaboration all
 * observe the same stream. `dispatch` is the single write path - components
 * build a command and hand it over; nothing mutates `document` directly.
 *
 * Persistence is manual rather than zustand's `persist` middleware, because a
 * document must be validated and migrated on read (`schema.parseDocument`) and
 * throttled on write - neither of which the middleware does.
 */

/**
 * Local storage is no longer the system of record - the server is (PRD §6.1).
 * It stays as an OFFLINE BUFFER: the last document is mirrored here on every
 * save so a dropped connection, a crashed tab or a closed laptop cannot lose
 * work that has not reached the database yet.
 */
const STORAGE_KEY = 'adysre-design-document';
const AUTOSAVE_MS = 1000;

/** What the editor can tell the user about persistence. */
export type SyncStatus = 'idle' | 'saving' | 'saved' | 'offline' | 'error';

interface DesignDocumentStore {
  document: Document;
  history: History;
  /** Page being edited. */
  pageId: string;
  /** Selected node ids, in selection order. */
  selection: string[];
  /** True once a change has been made since the last successful save. */
  dirty: boolean;
  /** Server-side project id, once the document has been persisted. */
  projectId: string | null;
  /** What the last sync attempt did, for the status chip. */
  sync: SyncStatus;

  /** The only write path into the document. */
  dispatch: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  select: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;

  setPage: (pageId: string) => void;
  addPage: (name: string) => void;
  renamePage: (pageId: string, name: string) => void;
  removePage: (pageId: string) => void;

  /** Create a node of `type` at `transform` under `parentId` and select it. */
  createNodeAt: (type: NodeType, transform: Transform, parentId?: string) => void;
  /**
   * Place a whole subtree (a component, section or asset) on the page and
   * select its root. `spec` is a template - ids are minted here, so the same
   * template can be placed any number of times.
   */
  insertTemplate: (spec: TemplateSpec, at?: { x: number; y: number }) => void;
  patchSelection: (patch: NodePatch) => void;
  patchNode: (id: string, patch: NodePatch) => void;
  deleteSelection: () => void;
  duplicateSelection: () => void;
  reorderSelection: (direction: 'front' | 'back') => void;
  /** Move a node one step up or down within its parent's paint order. */
  nudgeOrder: (id: string, direction: 'up' | 'down') => void;
  /** Wrap the selected siblings in a group, or dissolve selected groups. */
  groupSelection: () => void;
  ungroupSelection: () => void;
  reparent: (id: string, parentId: string, index: number) => void;

  /** Replace the open document with a parsed `.adysre` file. */
  importDocument: (json: string) => boolean;
  /**
   * Open the tenant's most recent project, falling back to the local draft when
   * the server cannot be reached. Call once, on mount.
   */
  open: () => Promise<void>;
  /** Start a blank project. The current one is already saved server-side. */
  newProject: (name?: string) => void;
  /** Switch to a previously saved project. */
  openProject: (id: string) => Promise<boolean>;
  /** Rename the open project (also its file name on export). */
  renameProject: (name: string) => void;
  /** Write to local storage now, and to the server if it is reachable. */
  save: () => void;
}

const INITIAL_DOCUMENT_NAME = 'Untitled project';
const INITIAL_PAGE_NAME = 'Page 1';

function firstPageId(doc: Document): string {
  return doc.pages[0]?.id ?? '';
}

/** Throttled write-behind, so a drag does not hit storage on every frame. */
let saveTimer: ReturnType<typeof setTimeout> | null = null;

export const useDesignDocumentStore = create<DesignDocumentStore>()((set, get) => {
  const initial = createDocument(INITIAL_DOCUMENT_NAME, INITIAL_PAGE_NAME);

  /** Queue an autosave; every mutation funnels through here. */
  function scheduleSave(): void {
    if (typeof window === 'undefined') return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => get().save(), AUTOSAVE_MS);
  }

  return {
    document: initial,
    history: emptyHistory,
    pageId: firstPageId(initial),
    selection: [],
    dirty: false,
    projectId: null,
    sync: 'idle',

    dispatch: (command) => {
      set((state) => {
        const next = commit(state.document, state.history, command);
        return { document: next.doc, history: next.history, dirty: true };
      });
      scheduleSave();
    },

    undo: () => {
      set((state) => {
        const next = undo(state.document, state.history);
        // A node that undo removed must not stay selected.
        const selection = state.selection.filter((id) => next.doc.nodes[id] !== undefined);
        return { document: next.doc, history: next.history, selection, dirty: true };
      });
      scheduleSave();
    },

    redo: () => {
      set((state) => {
        const next = redo(state.document, state.history);
        const selection = state.selection.filter((id) => next.doc.nodes[id] !== undefined);
        return { document: next.doc, history: next.history, selection, dirty: true };
      });
      scheduleSave();
    },

    canUndo: () => get().history.past.length > 0,
    canRedo: () => get().history.future.length > 0,

    select: (ids) => set({ selection: ids }),
    toggleSelection: (id) =>
      set((state) => ({
        selection: state.selection.includes(id)
          ? state.selection.filter((current) => current !== id)
          : [...state.selection, id],
      })),
    clearSelection: () => set({ selection: [] }),

    setPage: (pageId) => set({ pageId, selection: [] }),

    addPage: (name) => {
      const { page, root } = createPage(name);
      set((state) => ({
        document: {
          ...state.document,
          pages: [...state.document.pages, page],
          nodes: { ...state.document.nodes, [root.id]: root },
        },
        pageId: page.id,
        selection: [],
        dirty: true,
      }));
      scheduleSave();
    },

    renamePage: (pageId, name) => {
      set((state) => ({
        document: {
          ...state.document,
          pages: state.document.pages.map((page) =>
            page.id === pageId ? { ...page, name } : page,
          ),
        },
        dirty: true,
      }));
      scheduleSave();
    },

    removePage: (pageId) => {
      set((state) => {
        // A document always has at least one page - removing the last would
        // leave the canvas with nothing to render and no way back.
        if (state.document.pages.length <= 1) return state;
        const page = state.document.pages.find((p) => p.id === pageId);
        if (!page) return state;

        const nodes = { ...state.document.nodes };
        for (const node of descendantsOf(state.document, page.rootId)) delete nodes[node.id];

        const pages = state.document.pages.filter((p) => p.id !== pageId);
        return {
          document: { ...state.document, pages, nodes },
          pageId: state.pageId === pageId ? (pages[0]?.id ?? '') : state.pageId,
          selection: [],
          dirty: true,
        };
      });
      scheduleSave();
    },

    createNodeAt: (type, transform, parentId) => {
      const state = get();
      const page = state.document.pages.find((p) => p.id === state.pageId);
      if (!page) return;

      const target = parentId ?? page.rootId;
      const parent = state.document.nodes[target];
      // A child's transform is relative to its parent, so subtract the parent's
      // own origin when dropping into a frame.
      const local =
        parent && target !== page.rootId
          ? { ...transform, x: transform.x - parent.transform.x, y: transform.y - parent.transform.y }
          : transform;

      const node = createNode(type, local, { parentId: target });
      const index = state.document.nodes[target]?.children.length ?? 0;
      state.dispatch(insertNodes({ [node.id]: node }, [node.id], target, index));
      set({ selection: [node.id] });
    },

    insertTemplate: (spec, at) => {
      const state = get();
      const page = state.document.pages.find((p) => p.id === state.pageId);
      if (!page) return;

      // Drop into the frame under the point when there is one, so a component
      // placed over an artboard becomes part of it rather than floating beside.
      const point = at ?? { x: 0, y: 0 };
      const frame = frameAt(state.document, page, point);
      const target = frame?.id ?? page.rootId;
      const origin = frame
        ? { x: point.x - frame.transform.x, y: point.y - frame.transform.y }
        : point;

      const { nodes, rootId } = materialize(spec, target, origin);
      const index = state.document.nodes[target]?.children.length ?? 0;
      state.dispatch(insertNodes(nodes, [rootId], target, index));
      set({ selection: [rootId] });
    },

    patchNode: (id, patch) => get().dispatch(updateNode(id, patch)),

    patchSelection: (patch) => {
      const { selection, dispatch } = get();
      if (selection.length === 0) return;
      dispatch(
        selection.length === 1 && selection[0]
          ? updateNode(selection[0], patch)
          : batch(selection.map((id) => updateNode(id, patch)), 'node.update.multi'),
      );
    },

    deleteSelection: () => {
      const { selection, dispatch } = get();
      if (selection.length === 0) return;
      dispatch(removeNodes(selection));
      set({ selection: [] });
    },

    duplicateSelection: () => {
      const state = get();
      if (state.selection.length === 0) return;

      const commands: Command[] = [];
      const newRootIds: string[] = [];

      for (const id of state.selection) {
        const source = state.document.nodes[id];
        if (!source?.parentId) continue;

        // Copy the whole subtree with fresh ids, keeping parent/child links.
        const idMap = new Map<string, string>();
        const subtree = descendantsOf(state.document, id);
        for (const node of subtree) idMap.set(node.id, createId());

        const copies: Record<string, Node> = {};
        for (const node of subtree) {
          const copyId = idMap.get(node.id);
          if (!copyId) continue;
          copies[copyId] = {
            ...node,
            id: copyId,
            parentId: node.parentId ? (idMap.get(node.parentId) ?? node.parentId) : null,
            children: node.children.map((child) => idMap.get(child) ?? child),
            // Offset the copy so it does not hide under the original.
            ...(node.id === id
              ? {
                  transform: {
                    ...node.transform,
                    x: node.transform.x + DUPLICATE_OFFSET,
                    y: node.transform.y + DUPLICATE_OFFSET,
                  },
                }
              : {}),
          };
        }

        const copyRootId = idMap.get(id);
        if (!copyRootId) continue;
        const parent = state.document.nodes[source.parentId];
        commands.push(
          insertNodes(copies, [copyRootId], source.parentId, parent?.children.length ?? 0),
        );
        newRootIds.push(copyRootId);
      }

      if (commands.length === 0) return;
      state.dispatch(batch(commands, 'node.duplicate'));
      set({ selection: newRootIds });
    },

    reorderSelection: (direction) => {
      const state = get();
      const commands: Command[] = [];
      for (const id of state.selection) {
        const node = state.document.nodes[id];
        if (!node?.parentId) continue;
        const siblings = state.document.nodes[node.parentId]?.children.length ?? 0;
        commands.push(moveNode(id, node.parentId, direction === 'front' ? siblings : 0));
      }
      if (commands.length > 0) state.dispatch(batch(commands, `node.${direction}`));
    },

    groupSelection: () => {
      const state = get();
      const command = planGroup(state.document, state.selection);
      // planGroup returns null when there is nothing sensible to group; pushing
      // an empty command would cost the user an undo step that does nothing.
      if (!command) return;
      const before = new Set(Object.keys(state.document.nodes));
      state.dispatch(command);
      // Select the group that was just created - it is the only node the
      // command added, and it is what the user now wants to move.
      const created = Object.keys(get().document.nodes).find((id) => !before.has(id));
      if (created) set({ selection: [created] });
    },

    ungroupSelection: () => {
      const state = get();
      const command = planUngroup(state.document, state.selection);
      if (!command) return;
      // Keep the freed children selected, so the next action applies to them.
      const freed = state.selection.flatMap((id) => state.document.nodes[id]?.children ?? []);
      state.dispatch(command);
      set({ selection: freed });
    },

    nudgeOrder: (id, direction) => {
      const state = get();
      const node = state.document.nodes[id];
      if (!node?.parentId) return;

      const siblings = state.document.nodes[node.parentId]?.children ?? [];
      const index = siblings.indexOf(id);
      // "Up" means towards the viewer, which is LATER in the children array -
      // the document stores paint order, so the last child draws on top.
      const target = direction === 'up' ? index + 1 : index - 1;
      // Already at the end: do nothing rather than spend an undo step.
      if (index === -1 || target < 0 || target >= siblings.length) return;

      state.dispatch(moveNode(id, node.parentId, target));
    },

    reparent: (id, parentId, index) => get().dispatch(moveNode(id, parentId, index)),

    importDocument: (json) => {
      const parsed = deserializeDocument(json);
      // A file that does not parse is rejected outright rather than partially
      // loaded: half a document is worse than the one already open.
      if (!parsed) return false;
      set({
        document: parsed,
        pageId: firstPageId(parsed),
        selection: [],
        history: emptyHistory,
        dirty: true,
      });
      scheduleSave();
      return true;
    },

    open: async () => {
      if (typeof window === 'undefined') return;

      // Read the local buffer first so the canvas has something immediately,
      // even on a slow or failed round trip.
      const buffered = deserializeDocument(window.localStorage.getItem(STORAGE_KEY) ?? '');

      const result = await loadLatestProject();

      if (result.ok && result.value) {
        set({
          document: result.value.document,
          projectId: result.value.summary.id,
          pageId: firstPageId(result.value.document),
          selection: [],
          history: emptyHistory,
          dirty: false,
          sync: 'saved',
        });
        return;
      }

      if (buffered) {
        set({
          document: buffered,
          pageId: firstPageId(buffered),
          selection: [],
          history: emptyHistory,
          // The buffer has not reached the server, so it counts as unsaved work.
          dirty: true,
          sync: result.ok ? 'idle' : 'offline',
        });
        // A reachable server with no project yet means this draft has never been
        // persisted - push it up so the next device sees it.
        if (result.ok) void get().save();
        return;
      }

      set({ sync: result.ok ? 'idle' : 'offline' });
    },

    newProject: (name = INITIAL_DOCUMENT_NAME) => {
      const fresh = createDocument(name, INITIAL_PAGE_NAME);
      // projectId is cleared, so the first save CREATES a row rather than
      // overwriting the project the user just left.
      set({
        document: fresh,
        projectId: null,
        pageId: firstPageId(fresh),
        selection: [],
        history: emptyHistory,
        dirty: true,
        sync: 'idle',
      });
      get().save();
    },

    openProject: async (id) => {
      const result = await loadProject(id);
      if (!result.ok || !result.value) return false;
      set({
        document: result.value.document,
        projectId: result.value.summary.id,
        pageId: firstPageId(result.value.document),
        selection: [],
        // History is per-session and per-document: carrying it across projects
        // would let an undo apply a command to a document it never ran on.
        history: emptyHistory,
        dirty: false,
        sync: 'saved',
      });
      return true;
    },

    renameProject: (name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      set((state) => ({ document: { ...state.document, name: trimmed }, dirty: true }));
      get().save();
    },

    save: () => {
      if (typeof window === 'undefined') return;
      const { document: doc, projectId } = get();

      // Always mirror locally first: whatever happens to the network, the last
      // edit is recoverable from this tab.
      try {
        window.localStorage.setItem(STORAGE_KEY, serializeDocument(doc));
      } catch {
        // Quota or private-mode failures must not break editing; the document
        // stays in memory and the server copy is the one that matters.
      }

      set({ sync: 'saving' });

      void (async () => {
        const result = projectId
          ? await saveProjectToServer(projectId, doc, doc.name)
          : await createProject(doc, doc.name);

        if (result.ok) {
          set({
            dirty: false,
            sync: 'saved',
            ...('id' in result.value ? { projectId: result.value.id } : {}),
          });
          return;
        }

        // A project deleted elsewhere should not strand this tab: drop the id so
        // the next save recreates it rather than 404ing forever.
        if (result.reason === 'not-found') {
          set({ projectId: null, sync: 'error' });
          return;
        }
        set({ sync: result.reason === 'unavailable' ? 'offline' : 'error' });
      })();
    },
  };
});

/** How far a duplicate is nudged from its original, in canvas pixels. */
const DUPLICATE_OFFSET = 16;
