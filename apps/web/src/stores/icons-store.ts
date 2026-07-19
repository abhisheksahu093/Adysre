import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Icons library state. Mirrors the other resource stores (gradients/palettes):
 * only the user's saved set, their preferred preview weight, and which tours
 * they've seen persist - everything else is derived at render time.
 */
interface IconsStore {
  /** Names of icons the user pinned. Persisted. */
  savedIcons: string[];
  /** Global preview stroke weight applied across the grid. Persisted. */
  stroke: number;
  /** Index into the tour steps, or -1 when not running. */
  tourStep: number;
  tourDone: boolean;

  toggleSave: (name: string) => void;
  isSaved: (name: string) => boolean;
  setStroke: (stroke: number) => void;
  startTour: () => void;
  setTourStep: (step: number, total: number) => void;
  endTour: () => void;
}

export const DEFAULT_PREVIEW_STROKE = 1.5;

export const useIconsStore = create<IconsStore>()(
  persist(
    (set, get) => ({
      savedIcons: [],
      stroke: DEFAULT_PREVIEW_STROKE,
      tourStep: -1,
      tourDone: false,

      toggleSave: (name) =>
        set((s) => ({
          savedIcons: s.savedIcons.includes(name)
            ? s.savedIcons.filter((n) => n !== name)
            : [name, ...s.savedIcons],
        })),
      isSaved: (name) => get().savedIcons.includes(name),
      setStroke: (stroke) => set({ stroke }),
      startTour: () => set({ tourStep: 0 }),
      setTourStep: (step, total) =>
        set(step < 0 || step >= total ? { tourStep: -1, tourDone: true } : { tourStep: step }),
      endTour: () => set({ tourStep: -1, tourDone: true }),
    }),
    {
      name: 'adysre:icons',
      partialize: (state) => ({
        savedIcons: state.savedIcons,
        stroke: state.stroke,
        tourDone: state.tourDone,
      }),
    },
  ),
);
