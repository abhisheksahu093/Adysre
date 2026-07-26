'use client';

import { create } from 'zustand';
import type {
  ConsoleEntry,
  PreviewDevice,
  PreviewDiagnostic,
  Project,
  ProjectFile,
  StudioSettings,
} from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { createId, normalizePath } from '../utils/files';

/**
 * The single Code Studio store.
 *
 * Holds the open project, editor UI state (open tabs, active file), the live
 * console/diagnostics feed and user settings. Persistence and compilation live
 * in services and hooks; this store is pure state + synchronous reducers so it
 * stays predictable and testable.
 */
interface StudioState {
  project: Project | null;
  activeFileId: string | null;
  openTabIds: string[];
  console: ConsoleEntry[];
  diagnostics: PreviewDiagnostic[];
  settings: StudioSettings;
  device: PreviewDevice;
  previewFullscreen: boolean;
  readOnly: boolean;

  loadProject: (project: Project) => void;
  importProject: (name: string, entries: { path: string; content: string }[]) => void;
  setReadOnly: (readOnly: boolean) => void;
  setActiveFile: (id: string) => void;
  openFile: (id: string) => void;
  closeTab: (id: string) => void;

  updateFileContent: (id: string, content: string) => void;
  createFile: (path: string, content?: string) => ProjectFile | null;
  deleteFile: (id: string) => void;
  renameFile: (id: string, nextPath: string) => boolean;
  duplicateFile: (id: string) => ProjectFile | null;

  renameProject: (name: string) => void;

  pushConsole: (entry: Omit<ConsoleEntry, 'id' | 'timestamp'>) => void;
  clearConsole: () => void;
  setDiagnostics: (diagnostics: PreviewDiagnostic[]) => void;

  updateSettings: (patch: Partial<StudioSettings>) => void;
  setDevice: (device: PreviewDevice) => void;
  togglePreviewFullscreen: () => void;
}

function touch(project: Project): Project {
  return { ...project, updatedAt: Date.now() };
}

export const useStudioStore = create<StudioState>((set, get) => ({
  project: null,
  activeFileId: null,
  openTabIds: [],
  console: [],
  diagnostics: [],
  settings: DEFAULT_SETTINGS,
  device: 'desktop',
  previewFullscreen: false,
  readOnly: false,

  loadProject: (project) => {
    const first = project.files[0]?.id ?? null;
    const preferred = project.files.find((f) => f.path === 'index.html')?.id ?? first;
    set({
      project,
      activeFileId: preferred,
      openTabIds: preferred ? [preferred] : [],
      console: [],
      diagnostics: [],
      readOnly: false,
    });
  },

  importProject: (name, entries) => {
    const files: ProjectFile[] = entries
      .filter((entry) => normalizePath(entry.path))
      .map((entry) => ({ id: createId(), path: normalizePath(entry.path), content: entry.content }));
    if (files.length === 0) return;
    const now = Date.now();
    get().loadProject({ id: createId('proj'), name, files, createdAt: now, updatedAt: now });
  },

  setReadOnly: (readOnly) => set({ readOnly }),

  setActiveFile: (id) => set({ activeFileId: id }),

  openFile: (id) =>
    set((state) => ({
      activeFileId: id,
      openTabIds: state.openTabIds.includes(id) ? state.openTabIds : [...state.openTabIds, id],
    })),

  closeTab: (id) =>
    set((state) => {
      const openTabIds = state.openTabIds.filter((tabId) => tabId !== id);
      const activeFileId =
        state.activeFileId === id ? (openTabIds[openTabIds.length - 1] ?? null) : state.activeFileId;
      return { openTabIds, activeFileId };
    }),

  updateFileContent: (id, content) =>
    set((state) => {
      if (!state.project) return {};
      return {
        project: touch({
          ...state.project,
          files: state.project.files.map((f) => (f.id === id ? { ...f, content } : f)),
        }),
      };
    }),

  createFile: (path, content = '') => {
    const state = get();
    if (!state.project) return null;
    const clean = normalizePath(path);
    if (!clean || state.project.files.some((f) => f.path === clean)) return null;
    const file: ProjectFile = { id: createId(), path: clean, content };
    set({
      project: touch({ ...state.project, files: [...state.project.files, file] }),
      activeFileId: file.id,
      openTabIds: [...state.openTabIds, file.id],
    });
    return file;
  },

  deleteFile: (id) =>
    set((state) => {
      if (!state.project) return {};
      const files = state.project.files.filter((f) => f.id !== id);
      const openTabIds = state.openTabIds.filter((tabId) => tabId !== id);
      const activeFileId =
        state.activeFileId === id ? (openTabIds[openTabIds.length - 1] ?? files[0]?.id ?? null) : state.activeFileId;
      return { project: touch({ ...state.project, files }), openTabIds, activeFileId };
    }),

  renameFile: (id, nextPath) => {
    const state = get();
    if (!state.project) return false;
    const clean = normalizePath(nextPath);
    if (!clean || state.project.files.some((f) => f.path === clean && f.id !== id)) return false;
    set({
      project: touch({
        ...state.project,
        files: state.project.files.map((f) => (f.id === id ? { ...f, path: clean } : f)),
      }),
    });
    return true;
  },

  duplicateFile: (id) => {
    const state = get();
    if (!state.project) return null;
    const source = state.project.files.find((f) => f.id === id);
    if (!source) return null;
    const dot = source.path.lastIndexOf('.');
    const copyPath =
      dot === -1 ? `${source.path}-copy` : `${source.path.slice(0, dot)}-copy${source.path.slice(dot)}`;
    return get().createFile(copyPath, source.content);
  },

  renameProject: (name) =>
    set((state) => (state.project ? { project: touch({ ...state.project, name }) } : {})),

  pushConsole: (entry) =>
    set((state) => ({
      console: [...state.console, { ...entry, id: createId('log'), timestamp: Date.now() }].slice(-500),
    })),

  clearConsole: () => set({ console: [] }),

  setDiagnostics: (diagnostics) => set({ diagnostics }),

  updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),

  setDevice: (device) => set({ device }),

  togglePreviewFullscreen: () => set((state) => ({ previewFullscreen: !state.previewFullscreen })),
}));
