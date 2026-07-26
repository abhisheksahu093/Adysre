import type { Project, StudioSettings } from '../types';

/**
 * Guest persistence for Code Studio, backed by IndexedDB.
 *
 * Everything a signed-out user makes lives here so work survives a refresh and
 * autosave has somewhere to go without a backend. When a project sync API lands
 * this becomes the offline cache in front of it; the interface is deliberately
 * promise-based so that swap is invisible to callers.
 */

const DB_NAME = 'adysre-code-studio';
const DB_VERSION = 1;
const PROJECT_STORE = 'projects';
const META_STORE = 'meta';
const SETTINGS_KEY = 'settings';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PROJECT_STORE)) {
        db.createObjectStore(PROJECT_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
  });
}

function tx<T>(store: string, mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const request = run(db.transaction(store, mode).objectStore(store));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
      }),
  );
}

export const studioStorage = {
  async saveProject(project: Project): Promise<void> {
    await tx(PROJECT_STORE, 'readwrite', (s) => s.put(project));
  },

  async getProject(id: string): Promise<Project | undefined> {
    return tx<Project | undefined>(PROJECT_STORE, 'readonly', (s) => s.get(id));
  },

  async listProjects(): Promise<Project[]> {
    const all = await tx<Project[]>(PROJECT_STORE, 'readonly', (s) => s.getAll());
    return [...all].sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async deleteProject(id: string): Promise<void> {
    await tx(PROJECT_STORE, 'readwrite', (s) => s.delete(id));
  },

  async saveSettings(settings: StudioSettings): Promise<void> {
    await tx(META_STORE, 'readwrite', (s) => s.put(settings, SETTINGS_KEY));
  },

  async getSettings(): Promise<StudioSettings | undefined> {
    return tx<StudioSettings | undefined>(META_STORE, 'readonly', (s) => s.get(SETTINGS_KEY));
  },

  async setLastProjectId(id: string): Promise<void> {
    await tx(META_STORE, 'readwrite', (s) => s.put(id, 'lastProjectId'));
  },

  async getLastProjectId(): Promise<string | undefined> {
    return tx<string | undefined>(META_STORE, 'readonly', (s) => s.get('lastProjectId'));
  },
};
