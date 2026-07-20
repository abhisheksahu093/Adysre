import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Texture } from '@/data/textures';

interface TexturesStore {
  savedTextures: Texture[];
  /** Active tour step index, or -1 when the tour is not running. */
  tourStep: number;
  tourDone: boolean;

  saveTexture: (texture: Texture) => void;
  removeTexture: (id: string) => void;

  startTour: () => void;
  setTourStep: (step: number, total: number) => void;
  endTour: () => void;
}

export const useTexturesStore = create<TexturesStore>()(
  persist(
    (set) => ({
      savedTextures: [],
      tourStep: -1,
      tourDone: false,

      saveTexture: (texture) =>
        set((s) => ({
          savedTextures: s.savedTextures.some((x) => x.id === texture.id)
            ? s.savedTextures
            : [texture, ...s.savedTextures],
        })),
      removeTexture: (id) =>
        set((s) => ({ savedTextures: s.savedTextures.filter((x) => x.id !== id) })),

      startTour: () => set({ tourStep: 0 }),
      setTourStep: (step, total) =>
        set(step < 0 || step >= total ? { tourStep: -1, tourDone: true } : { tourStep: step }),
      endTour: () => set({ tourStep: -1, tourDone: true }),
    }),
    {
      name: 'adysre:textures',
      partialize: (state) => ({ savedTextures: state.savedTextures, tourDone: state.tourDone }),
    },
  ),
);
