import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Likes the visitor has added, keyed by item id (gradients, palettes, …).
 *
 * Stores only the delta on top of each item's base like count from the data,
 * so the displayed total is `base + likes[id]`. Persisted to localStorage so a
 * tap survives a reload.
 */
interface LikesStore {
  likes: Record<string, number>;
  /** Add one like to an item. */
  addLike: (id: string) => void;
}

export const useLikesStore = create<LikesStore>()(
  persist(
    (set) => ({
      likes: {},
      addLike: (id) =>
        set((state) => ({ likes: { ...state.likes, [id]: (state.likes[id] ?? 0) + 1 } })),
    }),
    { name: 'adysre:likes' },
  ),
);
