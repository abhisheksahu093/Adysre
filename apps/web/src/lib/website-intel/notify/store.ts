import 'server-only';
import type { ChannelStore } from './types';
import { MemoryChannelStore } from './memory-store';
import { FileChannelStore } from './file-store';

/**
 * The channel-store factory. Selected by `WEBSITE_INTEL_STORE` (shared with the
 * scan and schedule stores): 'file' uses a JSON file at
 * `WEBSITE_INTEL_CHANNELS_PATH`, anything else the in-memory store. Memoised on
 * `globalThis` so Route Handler and Server Component module graphs share one
 * instance. The Prisma channel store slots in here when production needs it.
 */
type ChannelGlobal = typeof globalThis & { __adysreWebsiteIntelChannelStore__?: ChannelStore };

function createStore(): ChannelStore {
  const kind = process.env.WEBSITE_INTEL_STORE ?? 'memory';
  if (kind === 'file') {
    return new FileChannelStore(
      process.env.WEBSITE_INTEL_CHANNELS_PATH ?? '.data/website-intel-channels.json',
    );
  }
  return new MemoryChannelStore();
}

export function getChannelStore(): ChannelStore {
  const scope = globalThis as ChannelGlobal;
  scope.__adysreWebsiteIntelChannelStore__ ??= createStore();
  return scope.__adysreWebsiteIntelChannelStore__;
}

/** Reset the memoised store. Tests only. */
export function resetChannelStoreForTests(): void {
  delete (globalThis as ChannelGlobal).__adysreWebsiteIntelChannelStore__;
}
