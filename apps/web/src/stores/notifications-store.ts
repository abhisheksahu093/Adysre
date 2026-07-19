import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Read/dismissed state for the topbar announcements. The announcements
 * themselves are static data (`@/data/notifications`); this store only records
 * which ids the user has read or cleared, so the list survives reloads.
 */
interface NotificationsStore {
  /** Ids the user has seen. */
  readIds: string[];
  /** Ids the user has removed from the list. */
  dismissedIds: string[];

  isRead: (id: string) => boolean;
  isDismissed: (id: string) => boolean;
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  dismiss: (id: string) => void;
  clearAll: (ids: string[]) => void;
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set, get) => ({
      readIds: [],
      dismissedIds: [],

      isRead: (id) => get().readIds.includes(id),
      isDismissed: (id) => get().dismissedIds.includes(id),
      markRead: (id) =>
        set((s) => (s.readIds.includes(id) ? s : { readIds: [...s.readIds, id] })),
      markAllRead: (ids) =>
        set((s) => ({ readIds: [...new Set([...s.readIds, ...ids])] })),
      dismiss: (id) =>
        set((s) => ({
          dismissedIds: s.dismissedIds.includes(id)
            ? s.dismissedIds
            : [...s.dismissedIds, id],
        })),
      clearAll: (ids) =>
        set((s) => ({ dismissedIds: [...new Set([...s.dismissedIds, ...ids])] })),
    }),
    {
      name: 'adysre:notifications',
      partialize: (state) => ({ readIds: state.readIds, dismissedIds: state.dismissedIds }),
    },
  ),
);
