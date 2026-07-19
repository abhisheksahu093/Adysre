import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Palette } from '@/data/palettes';

interface PalettesStore {
  /** Palettes the user has generated or saved. Persisted. */
  savedPalettes: Palette[];
  /** Active tour step index, or -1 when the tour is not running. */
  tourStep: number;
  /** Whether the user has completed/dismissed the tour. Persisted. */
  tourDone: boolean;

  savePalette: (palette: Palette) => void;
  removePalette: (id: string) => void;

  startTour: () => void;
  /** Advance to `step`; out-of-range finishes the tour. */
  setTourStep: (step: number, total: number) => void;
  endTour: () => void;
}

export const usePalettesStore = create<PalettesStore>()(
  persist(
    (set) => ({
      savedPalettes: [],
      tourStep: -1,
      tourDone: false,

      savePalette: (palette) =>
        set((s) => ({
          // Newest first; ignore an exact id re-save.
          savedPalettes: s.savedPalettes.some((p) => p.id === palette.id)
            ? s.savedPalettes
            : [palette, ...s.savedPalettes],
        })),
      removePalette: (id) =>
        set((s) => ({ savedPalettes: s.savedPalettes.filter((p) => p.id !== id) })),

      startTour: () => set({ tourStep: 0 }),
      setTourStep: (step, total) =>
        set(step < 0 || step >= total ? { tourStep: -1, tourDone: true } : { tourStep: step }),
      endTour: () => set({ tourStep: -1, tourDone: true }),
    }),
    {
      name: 'adysre:palettes',
      partialize: (state) => ({ savedPalettes: state.savedPalettes, tourDone: state.tourDone }),
    },
  ),
);
