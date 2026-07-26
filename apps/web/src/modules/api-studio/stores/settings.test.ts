import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MAX_HISTORY_LIMIT, MAX_TIMEOUT_MS, MIN_TIMEOUT_MS } from '../constants/limits';

/**
 * Settings and layout tests.
 *
 * These two stores persist, so they read `localStorage` the moment the module
 * is imported. The stub below is installed first and the store imported after,
 * which is also the honest way to test what happens to a STALE stored value:
 * the clamps have to hold on the way in from storage, not only on the way in
 * from the settings dialog, because a stored blob is just as untrusted as a
 * typed number.
 */

interface MemoryStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

/**
 * zustand's persist middleware reads `window.localStorage`, not the bare
 * global, which is exactly how it degrades to a no-op during server rendering.
 * The stub therefore has to hang off a `window` too.
 */
function installStorage(seed: Record<string, string> = {}): void {
  const data = new Map(Object.entries(seed));
  const storage: MemoryStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage: storage },
    configurable: true,
    writable: true,
  });
}

describe('settings store', () => {
  it('clamps a value the limits forbid, from the dialog or from storage', async () => {
    installStorage({
      'adysre.api-studio.settings.v1': JSON.stringify({
        state: { settings: { defaultTimeoutMs: 10_000_000, historyLimit: 99_999, fontSize: 99 } },
        version: 0,
      }),
    });

    const { useSettingsStore } = await import('./use-settings-store');
    const restored = useSettingsStore.getState().settings;
    assert.equal(restored.defaultTimeoutMs, MAX_TIMEOUT_MS);
    assert.equal(restored.historyLimit, MAX_HISTORY_LIMIT);
    assert.equal(restored.fontSize, 24);
    // A field absent from the stored blob falls back to its default.
    assert.equal(restored.theme, 'system');

    useSettingsStore.getState().update({ defaultTimeoutMs: 1 });
    assert.equal(useSettingsStore.getState().settings.defaultTimeoutMs, MIN_TIMEOUT_MS);

    useSettingsStore.getState().reset();
    assert.equal(useSettingsStore.getState().settings.defaultTimeoutMs, 30_000);
  });
});

describe('layout store', () => {
  it('keeps panes and the sidebar inside usable bounds', async () => {
    installStorage();
    const { useLayoutStore } = await import('./use-settings-store');

    useLayoutStore.getState().setRequestPaneRatio(0.99);
    assert.equal(useLayoutStore.getState().layout.requestPaneRatio, 0.8);
    useLayoutStore.getState().setRequestPaneRatio(0.01);
    assert.equal(useLayoutStore.getState().layout.requestPaneRatio, 0.2);

    useLayoutStore.getState().setSidebarWidth(10_000);
    assert.equal(useLayoutStore.getState().layout.sidebarWidth, 520);

    useLayoutStore.getState().toggleSidebar();
    assert.equal(useLayoutStore.getState().layout.sidebarCollapsed, true);

    useLayoutStore.getState().toggleOrientation();
    assert.equal(useLayoutStore.getState().layout.orientation, 'vertical');

    useLayoutStore.getState().reset();
    assert.equal(useLayoutStore.getState().layout.sidebarCollapsed, false);
  });
});
