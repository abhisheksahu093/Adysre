import { z } from 'zod';
import {
  BAD_REQUEST,
  NOT_FOUND,
  QUOTA_EXCEEDED,
  RATE_LIMITED,
  ok,
  reportRouteError,
} from '@/lib/api/response';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { requireAuth } from '@/lib/auth/guard';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { rateLimit } from '@/lib/auth/rate-limit';
import { consume, UnknownFeatureError } from '@/lib/entitlements/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  featureKey: z.string().min(1),
  // Bounded: an unbounded quantity lets one call drain a quota to report a
  // denial, and lets a mistyped value consume a workspace's whole allowance.
  quantity: z.number().int().min(1).max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * POST /api/usage/consume
 *
 * Takes a unit if one is available, atomically, and records it.
 *
 * This is the ONLY call that may authorise a metered action. It checks and
 * writes inside one transaction holding an advisory lock on (tenant, feature),
 * so concurrent callers serialise and a limit of five stays five.
 *
 * Call it BEFORE doing the work, and release afterwards if the work fails.
 * Consuming afterwards lets a caller take the work and never be counted.
 *
 * For features the server cannot enforce (the Tool Suite runs in the browser),
 * this is the client reporting its own usage. It is honest metering, not a
 * security boundary; see `Enforcement` in lib/entitlements/types.ts.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  // Independent of the quota itself. Without it, a client can hammer this
  // endpoint to enumerate limits or to churn the lock, and a spent quota costs
  // a database round trip per attempt.
  const limit = await rateLimit(`usage-consume:${auth.session.tenantId}`, {
    max: 120,
    windowSec: 60,
  });
  if (!limit.ok) return RATE_LIMITED(limit.retryAfter);

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return invalid(parsed.error);

  try {
    const result = await consume({
      tenantId: auth.session.tenantId,
      userId: auth.session.userId,
      featureKey: parsed.data.featureKey,
      quantity: parsed.data.quantity ?? 1,
      metadata: parsed.data.metadata,
    });

    if (!result.ok && result.denial) {
      // Audited: a workspace repeatedly hitting a wall is the clearest upgrade
      // signal there is, and the clearest sign a limit is set wrong.
      await recordAuthEvent(
        {
          tenantId: auth.session.tenantId,
          actorId: auth.session.userId,
          ...requestContext(request),
        },
        'entitlement.quota.denied',
        { featureKey: result.denial.featureKey, limit: result.denial.limit, tier: result.denial.tier },
      );

      return QUOTA_EXCEEDED(
        result.denial,
        result.denial.locked
          ? `${result.denial.featureName} is not included in your plan.`
          : `You have used all ${result.denial.limit} ${result.denial.unit}s available on your plan.`,
      );
    }

    return ok({ consumed: true, eventId: result.eventId ?? null });
  } catch (error) {
    if (error instanceof UnknownFeatureError) {
      return NOT_FOUND(`No feature is registered under "${error.featureKey}".`);
    }
    // A stock feature reaching this endpoint is a caller mistake: its ceiling
    // is counted from the owning table at creation, and a usage event here
    // would be written and never read.
    if (error instanceof Error && error.message.includes('stock feature')) {
      return BAD_REQUEST(error.message);
    }
    return reportRouteError('usage.consume', error, 'Could not record your usage.');
  }
}
