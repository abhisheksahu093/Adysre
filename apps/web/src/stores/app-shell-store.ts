import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * App shell chrome state.
 *
 * Just the sidebar's collapsed/expanded choice today. It is persisted because it
 * is a WORKSPACE preference, not a per-visit one: someone who works collapsed
 * expects it collapsed tomorrow, and re-collapsing on every load is the kind of
 * small friction that makes an app feel like it is not listening.
 *
 * Deliberately not in a React context: the sidebar and the topbar's toggle sit
 * in different branches of the tree, and threading a provider around the whole
 * shell to share one boolean is more plumbing than the state deserves.
 */
interface AppShellStore {
  /** Desktop sidebar collapsed to an icon rail. Persisted. */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppShellStore = create<AppShellStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    { name: 'adysre:app-shell' },
  ),
);
