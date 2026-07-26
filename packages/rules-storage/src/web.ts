import { parseRule, stringifyRule } from '@adysre/rules-core';
import type { RuleDocument, StoragePlugin } from '@adysre/rules-types';
import { createStorage, type History, type StoreOptions } from './store.ts';

/**
 * Rules in a browser's Web Storage, so a sandbox survives a refresh.
 *
 * The second adapter, and the reason there is a conformance suite. Two stores
 * that both type-check as `StoragePlugin` and disagree about what a tag filter
 * means is exactly the failure the suite exists to catch, and it cannot catch
 * it while there is only one of them.
 */

/** The part of `localStorage` this needs. Narrow, so a test can pass an object. */
export interface WebStorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export interface WebStorageOptions extends StoreOptions {
  /** Defaults to `localStorage` where there is one. */
  storage?: WebStorageLike | undefined;
  /** The key everything is kept under. Namespaced, so two apps can share a origin. */
  key?: string;
}

const DEFAULT_KEY = 'adysre.rules';

/**
 * Whatever Web Storage this environment has, or nothing.
 *
 * Nothing is the SERVER, which is the case that matters: a page using this
 * adapter is rendered once on the server and again in the browser, and an
 * adapter that threw where there is no `localStorage` would take the whole
 * render with it. An empty store on the server and the real one after
 * hydration is what every browser-persisted list does.
 */
function defaultStorage(): WebStorageLike | undefined {
  try {
    // Reached through `globalThis` rather than the global `localStorage`, so
    // this package needs no DOM lib. It does not depend on a browser; it uses
    // one if it is standing in one, which is exactly what the type says.
    return (globalThis as { localStorage?: WebStorageLike }).localStorage;
  } catch {
    // Reading `localStorage` THROWS in a browser with site data blocked, which
    // is a setting somebody chose rather than a fault to propagate.
    return undefined;
  }
}

/** Read the history, skipping anything that is no longer a rule. */
function decode(raw: string | null): History {
  const history: History = new Map();
  if (raw === null || raw === '') return history;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Corrupt storage reads as empty rather than as an exception. Somebody
    // editing their own browser storage should lose a sandbox, not the page.
    return history;
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return history;

  for (const [id, versions] of Object.entries(parsed as Record<string, unknown>)) {
    if (!Array.isArray(versions)) continue;

    const documents: RuleDocument[] = [];
    for (const entry of versions) {
      // `parseRule` and not a cast: a document written by an older engine is
      // migrated on the way in, and one written by a NEWER engine is refused
      // rather than half-understood. That is the whole point of schemaVersion,
      // and storage is where a stored rule meets a different build.
      const result = parseRule(entry);
      if (result.ok) documents.push(result.rule);
    }

    if (documents.length > 0) history.set(id, documents);
  }

  return history;
}

function encode(history: History): string {
  const plain: Record<string, unknown[]> = {};

  for (const [id, versions] of history) {
    // `stringifyRule` orders keys, so the same history always writes the same
    // bytes - which is what makes what is in storage diffable and comparable.
    plain[id] = versions.map((version) => JSON.parse(stringifyRule(version)) as unknown);
  }

  return JSON.stringify(plain);
}

export function createWebStorage(options: WebStorageOptions = {}): StoragePlugin {
  const backing = options.storage ?? defaultStorage();
  const key = options.key ?? DEFAULT_KEY;

  // Nowhere to persist: the store still works, it just forgets. Better than a
  // page that will not render on the server or in a locked-down browser.
  const fallback: History = new Map();

  return createStorage(
    {
      read: () => (backing === undefined ? fallback : decode(backing.getItem(key))),
      write: (history) => {
        if (backing === undefined) return;
        try {
          backing.setItem(key, encode(history));
        } catch {
          // Over quota, or storage disabled mid-session. Losing the write is
          // recoverable; taking down the editor that was trying to save is not.
        }
      },
    },
    { id: 'storage.web', ...options },
  );
}
