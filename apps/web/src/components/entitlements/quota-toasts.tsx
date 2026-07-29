'use client';

import { useQuotaToasts } from '@/hooks/use-quota-toasts';

/**
 * Mount point for the quota watcher: renders nothing, exists so a Server
 * Component layout can switch on a hook.
 *
 * Lives in the app shell rather than in each gated page, because a limit can be
 * spent anywhere and the warning should not depend on which screen the user
 * happens to be looking at when it runs out.
 */
export function QuotaToasts() {
  useQuotaToasts();
  return null;
}
