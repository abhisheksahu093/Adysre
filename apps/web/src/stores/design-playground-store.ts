import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AVAILABLE_EDITOR_PANELS,
  EDITOR_BREAKPOINTS,
  ZOOM,
  type EditorBreakpointId,
} from '@/config/design-playground';

/**
 * Design Playground - editor shell state.
 *
 * Phase 1 scope: what the CHROME needs (armed tool, open panels, viewport,
 * breakpoint). The document itself - pages, frames, nodes - is deliberately not
 * here: it belongs to the command-driven document model
 * (`documents/DESIGN_PLAYGROUND_PRD.md` §4.2) so that every mutation is
 * undoable, syncable and replayable. Keep document state out of this store.
 *
 * Panel layout and zoom persist (a returning user finds their workspace as they
 * left it); the armed tool does not, because a session should start on select.
 */
/** The right sidebar's tabs: what is selected, and what can be added. */
export type InspectorTab = 'properties' | 'frames';

interface DesignPlaygroundStore {
  /** Armed tool id, from EDITOR_TOOLS. Session-only. */
  tool: string;
  /** Open left-rail panel, or null when the rail is collapsed. Persisted. */
  panel: string | null;
  /** Right inspector open. Persisted. */
  inspectorOpen: boolean;
  /** Which tab of the right sidebar is showing. Persisted. */
  inspectorTab: InspectorTab;
  /** Viewport scale. Persisted, clamped to the configured range. */
  zoom: number;
  /** Breakpoint being designed. Persisted. */
  breakpoint: EditorBreakpointId;
  /** Grid + snapping on. Persisted. */
  gridVisible: boolean;

  setTool: (tool: string) => void;
  /** Selecting the open panel closes the rail (a toggle, like Figma). */
  togglePanel: (panel: string) => void;
  /** Collapse the rail outright - what a sheet's backdrop and close button do. */
  closePanel: () => void;
  toggleInspector: () => void;
  /** Set the inspector open state directly, rather than flipping it. */
  setInspectorOpen: (open: boolean) => void;
  setInspectorTab: (tab: InspectorTab) => void;
  setZoom: (zoom: number) => void;
  /** Step to the next/previous configured zoom stop. */
  stepZoom: (direction: 1 | -1) => void;
  resetZoom: () => void;
  setBreakpoint: (breakpoint: EditorBreakpointId) => void;
  toggleGrid: () => void;
}

const clampZoom = (zoom: number): number => Math.min(ZOOM.max, Math.max(ZOOM.min, zoom));

const FIRST_PANEL = AVAILABLE_EDITOR_PANELS[0]?.id ?? null;
const FIRST_BREAKPOINT = (EDITOR_BREAKPOINTS[0]?.id ?? 'desktop') as EditorBreakpointId;

export const useDesignPlaygroundStore = create<DesignPlaygroundStore>()(
  persist(
    (set) => ({
      tool: 'select',
      panel: FIRST_PANEL,
      inspectorOpen: true,
      inspectorTab: 'properties',
      zoom: ZOOM.default,
      breakpoint: FIRST_BREAKPOINT,
      gridVisible: true,

      setTool: (tool) => set({ tool }),
      togglePanel: (panel) => set((s) => ({ panel: s.panel === panel ? null : panel })),
      closePanel: () => set({ panel: null }),
      toggleInspector: () => set((s) => ({ inspectorOpen: !s.inspectorOpen })),
      setInspectorOpen: (inspectorOpen) => set({ inspectorOpen }),
      setInspectorTab: (inspectorTab) => set({ inspectorTab }),
      setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
      stepZoom: (direction) =>
        set((s) => {
          const stops = [...ZOOM.steps];
          const next =
            direction === 1
              ? stops.find((stop) => stop > s.zoom + 0.0001)
              : [...stops].reverse().find((stop) => stop < s.zoom - 0.0001);
          return { zoom: clampZoom(next ?? s.zoom) };
        }),
      resetZoom: () => set({ zoom: ZOOM.default }),
      setBreakpoint: (breakpoint) => set({ breakpoint }),
      toggleGrid: () => set((s) => ({ gridVisible: !s.gridVisible })),
    }),
    {
      name: 'adysre-design-playground',
      // The armed tool is session state: a reload should hand back the pointer,
      // not whatever destructive tool was last used.
      partialize: (s) => ({
        panel: s.panel,
        inspectorOpen: s.inspectorOpen,
        inspectorTab: s.inspectorTab,
        zoom: s.zoom,
        breakpoint: s.breakpoint,
        gridVisible: s.gridVisible,
      }),
    },
  ),
);
