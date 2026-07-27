import { z } from 'zod';
import { NOT_FOUND, ok, reportRouteError } from '@/lib/api/response';
import { requireAuth } from '@/lib/auth/guard';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { checkUsage } from '@/lib/entitlements/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({ featureKey: z.string().min(1) });

/**
 * POST /api/usage/check
 *
 * What is left on one feature, WITHOUT consuming anything.
 *
 * ─── ADVISORY ONLY ──────────────────────────────────────────────────────────
 * This must never be used to authorise an action. Between reading the answer
 * and acting on it, another request can spend the last unit: that gap is a
 * time-of-check-to-time-of-use race, and it is exactly how a limit of five
 * becomes six under concurrency.
 *
 * Use it to render a badge, disable a button, or decide whether to warn. Use
 * `/api/usage/consume` to actually take a unit, which checks and records under
 * one lock.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return invalid(parsed.error);

  try {
    const usage = await checkUsage(auth.session.tenantId, parsed.data.featureKey);

    // An unknown key is a caller bug, not a quota answer. Reporting it as
    // "allowed" would silently disable a gate the moment someone mistyped it.
    if (!usage) return NOT_FOUND(`No feature is registered under "${parsed.data.featureKey}".`);

    return ok(usage);
  } catch (error) {
    return reportRouteError('usage.check', error, 'Could not check your usage.');
  }
}
