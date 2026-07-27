import { z } from 'zod';
import { ok, reportRouteError } from '@/lib/api/response';
import { requireAuth } from '@/lib/auth/guard';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { release } from '@/lib/entitlements/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({ eventId: z.string().uuid() });

/**
 * POST /api/usage/release
 *
 * Gives back a unit that was consumed for work which then failed.
 *
 * Scoped to the caller's own workspace, so an event id from somewhere else
 * cannot be released by guessing: without that, the id alone would be a way to
 * refund another tenant's usage, or to farm free units by replaying ids.
 *
 * Answers 200 whether or not a row was removed. A release for an id that has
 * already been released, or never existed, leaves the ledger in exactly the
 * state the caller wanted, and reporting an error would push clients into retry
 * loops over a no-op. `released` says which happened.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return invalid(parsed.error);

  try {
    const released = await release(auth.session.tenantId, parsed.data.eventId);
    return ok({ released });
  } catch (error) {
    return reportRouteError('usage.release', error, 'Could not release your usage.');
  }
}
