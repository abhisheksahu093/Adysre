import 'server-only';
import type { ScheduleStore } from './types';
import { MemoryScheduleStore } from './memory-store';
import { FileScheduleStore } from './file-store';

/**
 * The schedule-store factory.
 *
 * Selected by `WEBSITE_INTEL_STORE` (shared with the scan store): 'file' uses a
 * JSON file at `WEBSITE_INTEL_SCHEDULE_PATH`, anything else the in-memory store.
 * Memoised on `globalThis` for the same reason the scan store is - Route Handler
 * and Server Component module graphs must share one instance. The Prisma
 * schedule store slots in here as another case when production needs it.
 */
type ScheduleGlobal = typeof globalThis & { __adysreWebsiteIntelScheduleStore__?: ScheduleStore };

function createStore(): ScheduleStore {
  const kind = process.env.WEBSITE_INTEL_STORE ?? 'memory';
  if (kind === 'file') {
    return new FileScheduleStore(
      process.env.WEBSITE_INTEL_SCHEDULE_PATH ?? '.data/website-intel-schedules.json',
    );
  }
  return new MemoryScheduleStore();
}

export function getScheduleStore(): ScheduleStore {
  const scope = globalThis as ScheduleGlobal;
  scope.__adysreWebsiteIntelScheduleStore__ ??= createStore();
  return scope.__adysreWebsiteIntelScheduleStore__;
}

/** Reset the memoised store. Tests only. */
export function resetScheduleStoreForTests(): void {
  delete (globalThis as ScheduleGlobal).__adysreWebsiteIntelScheduleStore__;
}
