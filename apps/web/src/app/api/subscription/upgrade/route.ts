import { z } from 'zod';
import { FORBIDDEN, NOT_FOUND, ok, reportRouteError } from '@/lib/api/response';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { requireAuth } from '@/lib/auth/guard';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { findPlanByKey, setSubscriptionPlan } from '@/lib/entitlements/repository';
import { getSubscription } from '@/lib/entitlements/service';
import { canSwitchPlan } from '@/lib/entitlements/switching';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({ planKey: z.string().min(1) });

/**
 * POST /api/subscription/upgrade
 *
 * Moves the workspace onto a plan, in either direction.
 *
 * Downgrading is deliberately the same call: testing a paywall means going back
 * to Free as often as going forward, and a separate "downgrade" endpoint would
 * be a second place to keep the audit trail and the role check correct.
 *
 * ─── PAYMENT IS NOT WIRED UP ────────────────────────────────────────────────
 * With no provider connected, this cannot take money, and it does not pretend
 * to. In production it records the intent and answers with what the client
 * should do next, so the UI never shows a success it did not earn.
 *
 * When a provider is connected, the honest shape is:
 *   1. create a checkout session for the plan, priced from the PLAN RECORD
 *      and never from the request body;
 *   2. redirect the user to the hosted page;
 *   3. grant the tier from the WEBHOOK. The redirect back is not proof of
 *      payment and must never grant anything.
 *
 * `BILLING_ALLOW_DIRECT_GRANT=true` outside production applies the change
 * immediately, so the gating can be exercised end to end without a card.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  // Billing is an owner-level action. Anyone in the workspace being able to
  // change what it is charged is not a limit anybody expects.
  if (!auth.session.roles.includes('Owner') && !auth.session.roles.includes('Admin')) {
    return FORBIDDEN('Only an Owner or Admin can change the workspace plan.');
  }

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return invalid(parsed.error);

  try {
    // Resolved from the database, so the tier and the price are ours and not
    // the caller's. A planKey is all the client is trusted with.
    const plan = await findPlanByKey(parsed.data.planKey);
    if (!plan) return NOT_FOUND(`No active plan is available under "${parsed.data.planKey}".`);

    const current = await getSubscription(auth.session.tenantId);
    if (current.planKey === plan.key) {
      // Not an error. Clicking the tier you are already on should be a no-op,
      // not a red message, and a switcher that rejects it is annoying to use.
      return ok({ applied: false, alreadyOnPlan: true, subscription: current }, `Already on ${plan.name}.`);
    }

    await recordAuthEvent(
      { tenantId: auth.session.tenantId, actorId: auth.session.userId, ...requestContext(request) },
      'entitlement.upgrade.requested',
      { from: current.planKey, to: plan.key, tier: plan.tier },
    );

    // Resolved from the session, never from the request: an email or a flag
    // supplied by the caller would make the allowlist decorative.
    const eligibility = await canSwitchPlan(auth.session.userId);

    if (!eligibility.allowed) {
      // The reason goes to the log, so an operator can see why a switcher is
      // inactive; the caller is told only that checkout is not connected, which
      // is what is true for them.
      console.info(`[subscription.upgrade] direct grant refused: ${eligibility.reason}`);

      // No payment provider. Saying so plainly beats a fake success or a 500.
      return ok(
        {
          applied: false,
          checkoutUrl: null,
          planKey: plan.key,
          planName: plan.name,
          priceCents: plan.priceCents,
          currency: plan.currency,
        },
        'Checkout is not connected yet. Your request has been recorded.',
      );
    }

    const periodEnd =
      plan.billingInterval === 'year'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : // Lifetime and free never renew, so they carry no period end rather
          // than a date far in the future that a renewal job would act on.
          null;

    await setSubscriptionPlan({
      tenantId: auth.session.tenantId,
      planId: plan.id,
      tier: plan.tier,
      actorId: auth.session.userId,
      currentPeriodEnd: periodEnd,
    });

    await recordAuthEvent(
      { tenantId: auth.session.tenantId, actorId: auth.session.userId, ...requestContext(request) },
      'entitlement.upgrade.applied',
      { from: current.planKey, to: plan.key, tier: plan.tier, direct: true },
    );

    const updated = await getSubscription(auth.session.tenantId);
    return ok({ applied: true, checkoutUrl: null, subscription: updated }, `Now on ${plan.name}.`);
  } catch (error) {
    return reportRouteError('subscription.upgrade', error, 'Could not change your plan.');
  }
}
