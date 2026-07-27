import { ok, reportRouteError } from '@/lib/api/response';
import { requireAuth } from '@/lib/auth/guard';
import { getSubscription } from '@/lib/entitlements/service';
import { listActivePlans } from '@/lib/entitlements/repository';
import { canSwitchPlan } from '@/lib/entitlements/switching';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/subscription
 *
 * The workspace's current plan, status and renewal date, plus the plans it
 * could move to.
 *
 * The available plans ride along so the upgrade modal can render a comparison
 * without a second request, and so prices come from the database rather than
 * from a copy in the UI.
 */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const [subscription, plans, eligibility] = await Promise.all([
      getSubscription(auth.session.tenantId),
      listActivePlans(),
      canSwitchPlan(auth.session.userId),
    ]);

    // The SERVER decides whether the plan switcher is available, and the client
    // renders from that. Letting the browser decide from NODE_ENV would put the
    // control back where the old cookie toggle was: visible whenever the client
    // felt like it, and a request that then fails for reasons the UI cannot see.
    const canSwitchPlans =
      eligibility.allowed &&
      (auth.session.roles.includes('Owner') || auth.session.roles.includes('Admin'));

    return ok({ subscription, plans, canSwitchPlans });
  } catch (error) {
    return reportRouteError('subscription.get', error, 'Could not load your subscription.');
  }
}
