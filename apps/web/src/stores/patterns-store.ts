import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Pattern } from '@/data/patterns';

interface PatternsStore {
  savedPatterns: Pattern[];
  /** Active tour step index, or -1 when the tour is not running. */
  tourStep: number;
  tourDone: boolean;

  savePattern: (pattern: Pattern) => void;
  removePattern: (id: string) => void;

  startTour: () => void;
  setTourStep: (step: number, total: number) => void;
  endTour: () => void;
}

export const usePatternsStore = create<PatternsStore>()(
  persist(
    (set) => ({
      savedPatterns: [],
      tourStep: -1,
      tourDone: false,

      savePattern: (pattern) =>
        set((s) => ({
          savedPatterns: s.savedPatterns.some((p) => p.id === pattern.id)
            ? s.savedPatterns
            : [pattern, ...s.savedPatterns],
        })),
      removePattern: (id) =>
        set((s) => ({ savedPatterns: s.savedPatterns.filter((p) => p.id !== id) })),

      startTour: () => set({ tourStep: 0 }),
      setTourStep: (step, total) =>
        set(step < 0 || step >= total ? { tourStep: -1, tourDone: true } : { tourStep: step }),
      endTour: () => set({ tourStep: -1, tourDone: true }),
    }),
    {
      name: 'adysre:patterns',
      partialize: (state) => ({ savedPatterns: state.savedPatterns, tourDone: state.tourDone }),
    },
  ),
);
