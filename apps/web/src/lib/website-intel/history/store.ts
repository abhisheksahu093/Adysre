import 'server-only';
import type { ScanStore } from './types';
import { MemoryScanStore } from './memory-store';
import { FileScanStore } from './file-store';

/**
 * The store factory - the one place that knows which backend is in use.
 *
 * Selected by `WEBSITE_INTEL_STORE`:
 *   - unset / 'memory' → {@link MemoryScanStore} (default; process-local)
 *   - 'file'           → {@link FileScanStore} at `WEBSITE_INTEL_STORE_PATH`
 *
 * ─── Adding the Prisma / Postgres store ─────────────────────────────────────
 * Production persistence is a class implementing `ScanStore` against
 * `@adysre/database` - save/get/list over a `scan` table keyed by `host` and
 * `created_at`. When it exists, add `case 'prisma': return new PrismaScanStore()`
 * here; nothing else in the platform changes, which is the whole point of the
 * abstraction.
 *
 * The instance is memoised on `globalThis`, not a module variable, on purpose:
 * Next bundles Route Handlers and Server Components into separate module graphs,
 * so a plain module-level singleton is instantiated TWICE - the API route that
 * writes a scan and the report page that reads it would each get their own
 * empty store. A `globalThis` key is shared across those graphs (and survives a
 * dev hot-reload), so all of them see the one store.
 */
type StoreGlobal = typeof globalThis & { __adysreWebsiteIntelScanStore__?: ScanStore };

function createStore(): ScanStore {
  const kind = process.env.WEBSITE_INTEL_STORE ?? 'memory';
  switch (kind) {
    case 'file':
      return new FileScanStore(
        process.env.WEBSITE_INTEL_STORE_PATH ?? '.data/website-intel-scans.json',
      );
    case 'memory':
    default:
      return new MemoryScanStore();
  }
}

export function getScanStore(): ScanStore {
  const scope = globalThis as StoreGlobal;
  scope.__adysreWebsiteIntelScanStore__ ??= createStore();
  return scope.__adysreWebsiteIntelScanStore__;
}

/** Reset the memoised store. Tests only. */
export function resetScanStoreForTests(): void {
  delete (globalThis as StoreGlobal).__adysreWebsiteIntelScanStore__;
}
