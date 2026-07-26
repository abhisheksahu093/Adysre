import type { StoragePlugin } from '@adysre/rules-types';
import { createStorage, type History, type StoreOptions } from './store.ts';

/**
 * Rules in memory, with their history.
 *
 * The reference adapter, and not a stub: it implements every semantic the
 * contract has, which is what makes it the thing a database adapter is checked
 * against rather than a placeholder somebody eventually replaces.
 *
 * It is also the store a test, a preview and a playground want. Nothing here
 * touches a network or a disk, so a rule editor can be driven end to end at the
 * speed of a function call.
 */
export function createMemoryStorage(options: StoreOptions = {}): StoragePlugin {
  // Held in a closure, so two stores cannot see each other's rules. A module
  // level map would make two tests, or two tenants, share a history.
  const history: History = new Map();

  return createStorage(
    {
      read: () => history,
      // Nothing to do: `read` handed out the live map, and the store mutated it.
      write: () => undefined,
    },
    { id: 'storage.memory', ...options },
  );
}
