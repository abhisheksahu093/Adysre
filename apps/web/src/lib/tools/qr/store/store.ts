import 'server-only';
import type { QrStore } from './types';
import { MemoryQrStore } from './memory-store';
import { FileQrStore } from './file-store';

/**
 * The dynamic-QR store factory - the one place that knows the backend.
 *
 * Selected by `QR_STORE`:
 *   - unset / 'memory' → {@link MemoryQrStore} (default; process-local)
 *   - 'file'           → {@link FileQrStore} at `QR_STORE_PATH`
 *
 * Production persistence is a `PrismaQrStore` against the `qr_codes`/`qr_scans`
 * models (packages/database) - add `case 'prisma'` here and nothing else in the
 * app changes.
 *
 * Memoised on `globalThis` (not a module variable) so the public redirect route
 * and the management routes - bundled into separate module graphs by Next -
 * share one instance and see the same data.
 */
type StoreGlobal = typeof globalThis & { __adysreQrStore__?: QrStore };

function createStore(): QrStore {
  const kind = process.env.QR_STORE ?? 'memory';
  if (kind === 'file') return new FileQrStore(process.env.QR_STORE_PATH ?? '.data/qr-codes.json');
  return new MemoryQrStore();
}

export function getQrStore(): QrStore {
  const scope = globalThis as StoreGlobal;
  scope.__adysreQrStore__ ??= createStore();
  return scope.__adysreQrStore__;
}
