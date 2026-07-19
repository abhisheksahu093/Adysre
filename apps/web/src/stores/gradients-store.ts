import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Gradient } from '@/data/gradients';

interface GradientsStore {
  savedGradients: Gradient[];
  /** Active tour step index, or -1 when the tour is not running. */
  tourStep: number;
  tourDone: boolean;

  saveGradient: (gradient: Gradient) => void;
  removeGradient: (id: string) => void;

  startTour: () => void;
  setTourStep: (step: number, total: number) => void;
  endTour: () => void;
}

export const useGradientsStore = create<GradientsStore>()(
  persist(
    (set) => ({
      savedGradients: [],
      tourStep: -1,
      tourDone: false,

      saveGradient: (gradient) =>
        set((s) => ({
          savedGradients: s.savedGradients.some((g) => g.id === gradient.id)
            ? s.savedGradients
            : [gradient, ...s.savedGradients],
        })),
      removeGradient: (id) =>
        set((s) => ({ savedGradients: s.savedGradients.filter((g) => g.id !== id) })),

      startTour: () => set({ tourStep: 0 }),
      setTourStep: (step, total) =>
        set(step < 0 || step >= total ? { tourStep: -1, tourDone: true } : { tourStep: step }),
      endTour: () => set({ tourStep: -1, tourDone: true }),
    }),
    {
      name: 'adysre:gradients',
      partialize: (state) => ({ savedGradients: state.savedGradients, tourDone: state.tourDone }),
    },
  ),
);
