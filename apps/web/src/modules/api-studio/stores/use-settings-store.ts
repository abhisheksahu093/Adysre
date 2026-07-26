'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApiStudioSettings, LayoutState, SidebarPanel } from '../types';
import { DEFAULT_LAYOUT, DEFAULT_SETTINGS } from '../constants/defaults';
import {
  MAX_HISTORY_LIMIT,
  MAX_TIMEOUT_MS,
  MIN_TIMEOUT_MS,
  STORAGE_KEYS,
} from '../constants/limits';

/**
 * Module settings and panel layout.
 *
 * Both persist, and they are two stores rather than one because they are two
 * different kinds of preference with two different lifetimes: settings are
 * choices a person made, layout is where they left the furniture. Splitting
 * them means dragging a panel does not rewrite the settings blob, and a
 * settings migration cannot cost someone their layout.
 *
 * Values that a limit bounds are clamped on the way IN. Restored state is
 * merged the same way, so a hand-edited or stale localStorage entry cannot put
 * an out-of-range timeout into a request.
 */

interface SettingsState {
  settings: ApiStudioSettings;
  update: (patch: Partial<ApiStudioSettings>) => void;
  reset: () => void;
}

/** Keep every bounded field inside the range `constants/limits` declares. */
function clampSettings(settings: ApiStudioSettings): ApiStudioSettings {
  return {
    ...settings,
    fontSize: Math.max(10, Math.min(settings.fontSize, 24)),
    historyLimit: Math.max(1, Math.min(settings.historyLimit, MAX_HISTORY_LIMIT)),
    defaultTimeoutMs: Math.max(
      MIN_TIMEOUT_MS,
      Math.min(settings.defaultTimeoutMs, MAX_TIMEOUT_MS),
    ),
  };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      update: (patch) =>
        set((state) => ({ settings: clampSettings({ ...state.settings, ...patch }) })),
      reset: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: STORAGE_KEYS.settings,
      // A stored blob predates any field added since: merge it over the
      // defaults so a new setting arrives at its default instead of undefined.
      merge: (persisted, current) => ({
        ...current,
        settings: clampSettings({
          ...current.settings,
          ...((persisted as Partial<SettingsState>)?.settings ?? {}),
        }),
      }),
    },
  ),
);

interface LayoutStore {
  layout: LayoutState;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setActivePanel: (panel: SidebarPanel) => void;
  toggleOrientation: () => void;
  setRequestPaneRatio: (ratio: number) => void;
  reset: () => void;
}

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 520;
/** Neither pane may be squeezed to nothing by a drag. */
const MIN_PANE_RATIO = 0.2;
const MAX_PANE_RATIO = 0.8;

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      layout: DEFAULT_LAYOUT,

      setSidebarCollapsed: (sidebarCollapsed) =>
        set((state) => ({ layout: { ...state.layout, sidebarCollapsed } })),

      toggleSidebar: () =>
        set((state) => ({
          layout: { ...state.layout, sidebarCollapsed: !state.layout.sidebarCollapsed },
        })),

      setSidebarWidth: (width) =>
        set((state) => ({
          layout: {
            ...state.layout,
            sidebarWidth: Math.max(MIN_SIDEBAR_WIDTH, Math.min(width, MAX_SIDEBAR_WIDTH)),
          },
        })),

      setActivePanel: (activePanel) =>
        set((state) => ({ layout: { ...state.layout, activePanel } })),

      toggleOrientation: () =>
        set((state) => ({
          layout: {
            ...state.layout,
            orientation: state.layout.orientation === 'horizontal' ? 'vertical' : 'horizontal',
          },
        })),

      setRequestPaneRatio: (ratio) =>
        set((state) => ({
          layout: {
            ...state.layout,
            requestPaneRatio: Math.max(MIN_PANE_RATIO, Math.min(ratio, MAX_PANE_RATIO)),
          },
        })),

      reset: () => set({ layout: DEFAULT_LAYOUT }),
    }),
    {
      name: STORAGE_KEYS.layout,
      merge: (persisted, current) => ({
        ...current,
        layout: { ...current.layout, ...((persisted as Partial<LayoutStore>)?.layout ?? {}) },
      }),
    },
  ),
);
