'use client';

import { create } from 'zustand';
import type { HistoryEntry, HttpMethod } from '../types';
import { DEFAULT_HISTORY_LIMIT, MAX_HISTORY_LIMIT } from '../constants/limits';

/**
 * Request history.
 *
 * Newest first, capped, and favourites are never evicted: a starred call is the
 * one someone kept on purpose, so the cap falls on the unstarred rows around
 * it. Filtering is a selector rather than stored state, so the list and the
 * filter can never disagree about what is being shown.
 */

export interface HistoryFilters {
  query: string;
  method: HttpMethod | null;
  /** Narrow to completed or failed exchanges. */
  outcome: 'success' | 'error' | null;
  favoritesOnly: boolean;
}

const NO_FILTERS: HistoryFilters = {
  query: '',
  method: null,
  outcome: null,
  favoritesOnly: false,
};

interface HistoryState {
  entries: HistoryEntry[];
  filters: HistoryFilters;
  limit: number;

  load: (entries: HistoryEntry[]) => void;
  add: (entry: HistoryEntry) => void;
  toggleFavorite: (id: string) => void;
  remove: (id: string) => void;
  /** Clears history. Favourites survive unless `includeFavorites` is set. */
  clear: (includeFavorites?: boolean) => void;
  setFilter: <K extends keyof HistoryFilters>(key: K, value: HistoryFilters[K]) => void;
  resetFilters: () => void;
  setLimit: (limit: number) => void;

  filtered: () => HistoryEntry[];
  entry: (id: string) => HistoryEntry | undefined;
}

/** Trim to the cap, dropping the oldest unstarred rows first. */
function evict(entries: HistoryEntry[], limit: number): HistoryEntry[] {
  if (entries.length <= limit) return entries;

  const kept: HistoryEntry[] = [];
  let budget = limit;

  // `entries` is newest first, so walking forward drops the oldest.
  for (const entry of entries) {
    if (entry.favorite) {
      kept.push(entry);
      continue;
    }
    if (budget > 0) {
      kept.push(entry);
      budget -= 1;
    }
  }

  return kept;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  entries: [],
  filters: NO_FILTERS,
  limit: DEFAULT_HISTORY_LIMIT,

  load: (entries) =>
    set((state) => ({
      entries: evict(
        [...entries].sort((a, b) => b.executedAt - a.executedAt),
        state.limit,
      ),
    })),

  add: (entry) =>
    set((state) => ({ entries: evict([entry, ...state.entries], state.limit) })),

  toggleFavorite: (id) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, favorite: !entry.favorite } : entry,
      ),
    })),

  remove: (id) => set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

  clear: (includeFavorites = false) =>
    set((state) => ({
      entries: includeFavorites ? [] : state.entries.filter((entry) => entry.favorite),
    })),

  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  resetFilters: () => set({ filters: NO_FILTERS }),

  setLimit: (limit) =>
    set((state) => {
      const clamped = Math.max(1, Math.min(limit, MAX_HISTORY_LIMIT));
      return { limit: clamped, entries: evict(state.entries, clamped) };
    }),

  filtered: () => {
    const { entries, filters } = get();
    const needle = filters.query.trim().toLowerCase();

    return entries.filter((entry) => {
      if (filters.favoritesOnly && !entry.favorite) return false;
      if (filters.method && entry.method !== filters.method) return false;
      if (filters.outcome === 'success' && entry.status === null) return false;
      if (filters.outcome === 'error' && entry.status !== null) return false;
      if (needle !== '' && !entry.url.toLowerCase().includes(needle)) return false;
      return true;
    });
  },

  entry: (id) => get().entries.find((item) => item.id === id),
}));
