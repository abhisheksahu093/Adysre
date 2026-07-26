'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApiRequestNode, ApiTab, ClosedTab, RequestDefinition } from '../types';
import type { Assertion } from '../types';
import { EMPTY_REQUEST } from '../constants/defaults';
import { MAX_CLOSED_TAB_STACK, MAX_OPEN_TABS, STORAGE_KEYS } from '../constants/limits';
import { createId } from '../utils/ids';
import { paramsFromUrl, pathVariablesFromUrl, urlWithParams } from '../utils/url';

/**
 * Open tabs and their drafts.
 *
 * A tab owns a `draft`: the request as typed, which nothing else in the app
 * reads. Saving copies the draft onto the node and clears `dirty`, so an
 * unsaved edit can never leak into a collection, an export or another tab, and
 * "do you want to save" has a single, honest source of truth.
 *
 * The URL and the params table are two views of one thing, so `updateDraft`
 * keeps them in step: editing the address rebuilds the table, editing the table
 * rebuilds the address. Neither can silently drift from the other.
 *
 * Tabs and their drafts PERSIST. That is what makes "remember tabs after
 * refresh", draft recovery and crash recovery one mechanism rather than three:
 * a reload, a crash and closing the laptop all look the same to a store that
 * writes as it goes. In-flight responses are deliberately not persisted - a
 * response is about a moment, and restoring one next to a request that has been
 * edited since would be worse than an empty pane.
 *
 * A draft can contain a literal credential someone typed into the auth tab, and
 * that draft is written to `localStorage`. It is the same trade every API
 * client makes: the alternative is losing an hour of work to a refresh. What
 * does NOT go there is anything the module encrypts - environment secrets live
 * on the server and resolve at send time.
 */

interface TabsState {
  tabs: ApiTab[];
  activeTabId: string | null;
  /** Recently closed tabs, newest first, for "reopen closed tab". */
  closed: ClosedTab[];

  /** Focuses the tab already editing this node, or opens one. */
  openRequest: (node: ApiRequestNode) => string | null;
  /**
   * Open an unsaved scratch tab.
   *
   * @param title - display text, supplied by the caller so the store never
   * invents untranslated copy.
   */
  openScratch: (title: string, draft?: RequestDefinition) => string | null;

  setActive: (id: string) => void;
  closeTab: (id: string) => void;
  closeOthers: (id: string) => void;
  closeAll: () => void;
  reopenClosed: () => string | null;

  setPinned: (id: string, pinned: boolean) => void;
  duplicateTab: (id: string) => string | null;

  updateDraft: (id: string, patch: Partial<RequestDefinition>) => void;
  setAssertions: (id: string, assertions: Assertion[]) => void;
  setTitle: (id: string, title: string) => void;
  /** Marks the tab saved against a node, clearing the unsaved indicator. */
  markSaved: (id: string, nodeId: string) => void;
  setResponseId: (id: string, responseId: string | null) => void;

  nextTab: () => void;
  previousTab: () => void;

  tab: (id: string) => ApiTab | undefined;
  activeTab: () => ApiTab | undefined;
  dirtyTabs: () => ApiTab[];
  hasUnsavedChanges: () => boolean;
}

function newTab(patch: Partial<ApiTab> & { title: string; draft: RequestDefinition }): ApiTab {
  return {
    id: createId(),
    nodeId: null,
    assertions: [],
    pinned: false,
    dirty: false,
    responseId: null,
    createdAt: Date.now(),
    ...patch,
  };
}

/**
 * Make room for one more tab.
 *
 * Evicts the oldest tab that is neither pinned nor unsaved, because those two
 * are the tabs a person has said they care about. If every tab is protected,
 * the open is refused rather than something being thrown away silently.
 */
function withRoom(tabs: ApiTab[]): ApiTab[] | null {
  if (tabs.length < MAX_OPEN_TABS) return tabs;
  const index = tabs.findIndex((tab) => !tab.pinned && !tab.dirty);
  if (index === -1) return null;
  return tabs.filter((_, position) => position !== index);
}

/** Pinned tabs sit to the left, in the order they were pinned. */
function sortPinned(tabs: ApiTab[]): ApiTab[] {
  return [...tabs].sort((a, b) => Number(b.pinned) - Number(a.pinned));
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
  tabs: [],
  activeTabId: null,
  closed: [],

  openRequest: (node) => {
    const existing = get().tabs.find((tab) => tab.nodeId === node.id);
    if (existing) {
      set({ activeTabId: existing.id });
      return existing.id;
    }

    const room = withRoom(get().tabs);
    if (!room) return null;

    const tab = newTab({
      nodeId: node.id,
      title: node.name,
      // A structural copy: the tab must not edit the node's own object.
      draft: structuredClone(node.request),
    });
    set({ tabs: sortPinned([...room, tab]), activeTabId: tab.id });
    return tab.id;
  },

  openScratch: (title, draft) => {
    const room = withRoom(get().tabs);
    if (!room) return null;

    const tab = newTab({ title, draft: draft ? structuredClone(draft) : structuredClone(EMPTY_REQUEST) });
    set({ tabs: sortPinned([...room, tab]), activeTabId: tab.id });
    return tab.id;
  },

  setActive: (activeTabId) => set({ activeTabId }),

  closeTab: (id) =>
    set((state) => {
      const index = state.tabs.findIndex((tab) => tab.id === id);
      if (index === -1) return {};
      const tab = state.tabs[index]!;
      const tabs = state.tabs.filter((candidate) => candidate.id !== id);
      // Focus moves to the neighbour on the right, or the left when there is
      // none: the tab under the cursor, which is what a person expects.
      const nextActive =
        state.activeTabId === id ? (tabs[index]?.id ?? tabs[index - 1]?.id ?? null) : state.activeTabId;

      return {
        tabs,
        activeTabId: nextActive,
        closed: [{ tab, closedAt: Date.now() }, ...state.closed].slice(0, MAX_CLOSED_TAB_STACK),
      };
    }),

  closeOthers: (id) =>
    set((state) => {
      const kept = state.tabs.filter((tab) => tab.id === id || tab.pinned);
      const removed = state.tabs.filter((tab) => tab.id !== id && !tab.pinned);
      return {
        tabs: kept,
        activeTabId: id,
        closed: [
          ...removed.map((tab) => ({ tab, closedAt: Date.now() })),
          ...state.closed,
        ].slice(0, MAX_CLOSED_TAB_STACK),
      };
    }),

  closeAll: () =>
    set((state) => ({
      tabs: [],
      activeTabId: null,
      closed: [
        ...state.tabs.map((tab) => ({ tab, closedAt: Date.now() })),
        ...state.closed,
      ].slice(0, MAX_CLOSED_TAB_STACK),
    })),

  reopenClosed: () => {
    const [entry, ...rest] = get().closed;
    if (!entry) return null;
    const room = withRoom(get().tabs);
    if (!room) return null;

    set({ tabs: sortPinned([...room, entry.tab]), activeTabId: entry.tab.id, closed: rest });
    return entry.tab.id;
  },

  setPinned: (id, pinned) =>
    set((state) => ({
      tabs: sortPinned(state.tabs.map((tab) => (tab.id === id ? { ...tab, pinned } : tab))),
    })),

  duplicateTab: (id) => {
    const source = get().tabs.find((tab) => tab.id === id);
    if (!source) return null;
    const room = withRoom(get().tabs);
    if (!room) return null;

    // A duplicate is a scratch copy: it edits no saved request, so saving it
    // cannot overwrite the one the original is attached to.
    const copy = newTab({
      title: source.title,
      draft: structuredClone(source.draft),
      assertions: structuredClone(source.assertions),
      dirty: true,
    });
    set({ tabs: sortPinned([...room, copy]), activeTabId: copy.id });
    return copy.id;
  },

  updateDraft: (id, patch) =>
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.id !== id) return tab;
        return { ...tab, draft: mergeDraft(tab.draft, patch), dirty: true };
      }),
    })),

  setAssertions: (id, assertions) =>
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, assertions, dirty: true } : tab)),
    })),

  setTitle: (id, title) =>
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, title, dirty: true } : tab)),
    })),

  markSaved: (id, nodeId) =>
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, nodeId, dirty: false } : tab)),
    })),

  setResponseId: (id, responseId) =>
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, responseId } : tab)),
    })),

  nextTab: () => step(set, get, 1),
  previousTab: () => step(set, get, -1),

  tab: (id) => get().tabs.find((tab) => tab.id === id),
  activeTab: () => {
    const { tabs, activeTabId } = get();
    return tabs.find((tab) => tab.id === activeTabId);
  },
  dirtyTabs: () => get().tabs.filter((tab) => tab.dirty),
  hasUnsavedChanges: () => get().tabs.some((tab) => tab.dirty),
    }),
    {
      name: STORAGE_KEYS.tabs,
      // Only what a person would be sad to lose. A response, a spinner and an
      // abort handle all belong to a moment that has passed.
      partialize: (state) => ({
        tabs: state.tabs.map((tab) => ({ ...tab, responseId: null })),
        activeTabId: state.activeTabId,
        closed: state.closed,
      }),
      merge: (persisted, current) => {
        const stored = persisted as Partial<TabsState> | undefined;
        return {
          ...current,
          tabs: Array.isArray(stored?.tabs) ? stored.tabs : [],
          activeTabId: typeof stored?.activeTabId === 'string' ? stored.activeTabId : null,
          closed: Array.isArray(stored?.closed) ? stored.closed : [],
        };
      },
    },
  ),
);

/** Cycle the active tab, wrapping at both ends. */
function step(
  set: (partial: Partial<TabsState>) => void,
  get: () => TabsState,
  direction: 1 | -1,
): void {
  const { tabs, activeTabId } = get();
  if (tabs.length === 0) return;
  const index = tabs.findIndex((tab) => tab.id === activeTabId);
  const next = (index + direction + tabs.length) % tabs.length;
  set({ activeTabId: tabs[next]?.id ?? null });
}

/**
 * Apply a draft patch, keeping the URL and its two derived tables in step.
 *
 * Which side wins is decided by which side the edit came from: a `url` in the
 * patch rebuilds the tables, `params` in the patch rebuilds the URL. A patch
 * carrying both is taken at its word and merged as given.
 */
function mergeDraft(draft: RequestDefinition, patch: Partial<RequestDefinition>): RequestDefinition {
  const merged = { ...draft, ...patch };
  const urlChanged = patch.url !== undefined && patch.url !== draft.url;
  const paramsChanged = patch.params !== undefined;

  if (urlChanged && !paramsChanged) {
    return {
      ...merged,
      params: paramsFromUrl(merged.url, draft.params),
      pathVariables: pathVariablesFromUrl(merged.url, draft.pathVariables),
    };
  }

  if (paramsChanged && !urlChanged) {
    return { ...merged, url: urlWithParams(merged.url, merged.params) };
  }

  return merged;
}
