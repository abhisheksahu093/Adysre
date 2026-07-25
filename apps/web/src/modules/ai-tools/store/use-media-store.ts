'use client';

import { create } from 'zustand';
import type { ItemStatus, MediaItem, ToolResult } from '../types';
import { loadImage } from '../engine/image';

function createId(): string {
  return `m_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

/** Read a file into a fully-formed MediaItem (measuring its dimensions). */
export async function createItem(file: File): Promise<MediaItem> {
  let width = 0;
  let height = 0;
  try {
    const { bitmap } = await loadImage(file);
    width = bitmap.width;
    height = bitmap.height;
    bitmap.close();
  } catch {
    /* non-decodable files still enter the queue and fail visibly on process */
  }
  return {
    id: createId(),
    file,
    name: file.name || 'image',
    srcUrl: URL.createObjectURL(file),
    width,
    height,
    size: file.size,
    mime: file.type || 'image/*',
    status: 'idle',
    progress: 0,
    rotation: 0,
    history: [0],
    historyIndex: 0,
  };
}

interface MediaState {
  toolId: string | null;
  items: MediaItem[];
  settings: Record<string, unknown>;
  selectedId: string | null;
  running: boolean;
  zoom: number;

  initTool: (toolId: string, defaults: Record<string, unknown>) => void;
  addItems: (items: MediaItem[]) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  select: (id: string | null) => void;

  updateSettings: (patch: Record<string, unknown>) => void;

  setStatus: (id: string, status: ItemStatus) => void;
  setProgress: (id: string, progress: number) => void;
  setResult: (id: string, result: ToolResult) => void;
  setError: (id: string, error: string) => void;
  clearResults: () => void;
  setRunning: (running: boolean) => void;

  rotate: (id: string, delta: number) => void;
  undo: (id: string) => void;
  redo: (id: string) => void;

  setZoom: (zoom: number) => void;
}

function patchItem(items: MediaItem[], id: string, patch: Partial<MediaItem>): MediaItem[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export const useMediaStore = create<MediaState>((set, get) => ({
  toolId: null,
  items: [],
  settings: {},
  selectedId: null,
  running: false,
  zoom: 1,

  initTool: (toolId, defaults) => {
    if (get().toolId === toolId) return;
    for (const item of get().items) {
      URL.revokeObjectURL(item.srcUrl);
      if (item.result) URL.revokeObjectURL(item.result.url);
    }
    set({ toolId, items: [], settings: { ...defaults }, selectedId: null, running: false, zoom: 1 });
  },

  addItems: (items) =>
    set((state) => ({
      items: [...state.items, ...items],
      selectedId: state.selectedId ?? items[0]?.id ?? null,
    })),

  removeItem: (id) =>
    set((state) => {
      const target = state.items.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.srcUrl);
        if (target.result) URL.revokeObjectURL(target.result.url);
      }
      const items = state.items.filter((i) => i.id !== id);
      return { items, selectedId: state.selectedId === id ? (items[0]?.id ?? null) : state.selectedId };
    }),

  clear: () => {
    for (const item of get().items) {
      URL.revokeObjectURL(item.srcUrl);
      if (item.result) URL.revokeObjectURL(item.result.url);
    }
    set({ items: [], selectedId: null });
  },

  select: (id) => set({ selectedId: id }),

  updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),

  setStatus: (id, status) => set((state) => ({ items: patchItem(state.items, id, { status }) })),
  setProgress: (id, progress) => set((state) => ({ items: patchItem(state.items, id, { progress }) })),

  setResult: (id, result) =>
    set((state) => {
      const prev = state.items.find((i) => i.id === id)?.result;
      if (prev) URL.revokeObjectURL(prev.url);
      return { items: patchItem(state.items, id, { result, status: 'done', progress: 1 }) };
    }),

  setError: (id, error) => set((state) => ({ items: patchItem(state.items, id, { status: 'error', error }) })),

  clearResults: () =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.result) URL.revokeObjectURL(item.result.url);
        const { result: _result, error: _error, ...rest } = item;
        void _result;
        void _error;
        return { ...rest, status: 'idle' as const, progress: 0 };
      }),
    })),

  setRunning: (running) => set({ running }),

  rotate: (id, delta) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item;
        const rotation = ((item.rotation + delta) % 360 + 360) % 360;
        const history = [...item.history.slice(0, item.historyIndex + 1), rotation];
        return { ...item, rotation, history, historyIndex: history.length - 1 };
      }),
    })),

  undo: (id) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id || item.historyIndex <= 0) return item;
        const index = item.historyIndex - 1;
        return { ...item, historyIndex: index, rotation: item.history[index] ?? 0 };
      }),
    })),

  redo: (id) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id || item.historyIndex >= item.history.length - 1) return item;
        const index = item.historyIndex + 1;
        return { ...item, historyIndex: index, rotation: item.history[index] ?? 0 };
      }),
    })),

  setZoom: (zoom) => set({ zoom: Math.min(5, Math.max(0.2, zoom)) }),
}));
