import { NextResponse } from 'next/server';
import { runScan } from '@/lib/website-intel/scan';
import { getScanStore } from '@/lib/website-intel/history/store';
import { recordScan } from '@/lib/website-intel/history/service';
import { getScheduleStore } from '@/lib/website-intel/schedule/store';
import { runDueSchedules } from '@/lib/website-intel/schedule/runner';
import { getChannelStore } from '@/lib/website-intel/notify/store';
import { HttpNotifier } from '@/lib/website-intel/notify/notifier';
import { dispatchNotifications } from '@/lib/website-intel/notify/dispatch';
import { authorize, hasCronSecret } from '@/lib/website-intel/auth/guard';

/**
 * POST /api/website-intelligence/schedules/run
 *
 * Run every schedule that is currently due. This is the endpoint a scheduler
 * calls on a tick - a system cron hitting it, a BullMQ repeatable, or a Vercel
 * Cron - and the one the UI's "Run due now" button uses. It is not a timer
 * itself; standing up the recurring trigger is a deployment concern.
 *
 * Gated two ways, because two very different callers use it: a machine scheduler
 * presents the `WEBSITE_INTEL_CRON_SECRET` (Authorization/x-cron-secret header),
 * and the UI's "Run due now" button rides the user's privileged session. Either
 * satisfies the gate; anything else is rejected so it cannot be used to force scans.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!hasCronSecret(request)) {
    const auth = await authorize('write');
    if (!auth.ok) return auth.response;
  }

  // The sweep spans every tenant, so channels are resolved per-run for the
  // schedule's own org - never a single shared list, which would cross-post one
  // org's scan results to another's webhooks.
  const notifier = new HttpNotifier();

  const summary = await runDueSchedules({
    schedules: getScheduleStore(),
    scanStore: getScanStore(),
    runScan,
    recordScan,
    notify: async (tenantId, event) => {
      const channels = await getChannelStore().list(tenantId);
      await dispatchNotifications(channels, notifier, event);
    },
  });
  return NextResponse.json({ success: true, data: summary });
}
