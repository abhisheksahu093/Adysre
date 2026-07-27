import { ok, reportRouteError } from '@/lib/api/response';
import { requireAuth } from '@/lib/auth/guard';
import { getSubscription, getUsage } from '@/lib/entitlements/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/usage
 *
 * Every feature, its limit, what is used and what is left.
 *
 * One call for the whole picture rather than one per badge: a page with eight
 * gated controls would otherwise make eight round trips before it could render
 * any of them, and the badges would pop in one at a time.
 *
 * The tier rides along so a component can render the comparison without a
 * second request.
 */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const [features, subscription] = await Promise.all([
      getUsage(auth.session.tenantId),
      getSubscription(auth.session.tenantId),
    ]);

    return ok({ tier: subscription.tier, subscription, features });
  } catch (error) {
    return reportRouteError('usage.list', error, 'Could not load your usage.');
  }
}
