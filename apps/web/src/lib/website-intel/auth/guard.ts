import 'server-only';
import { NextResponse } from 'next/server';
import { getSession, canWrite, type IntelSession } from './session';
import { constantTimeEqual } from './policy';

/**
 * Route-handler authorization for the Website Intelligence API.
 *
 * Every endpoint under `/api/website-intelligence/*` starts with one call:
 *
 *   const auth = await authorize('write');
 *   if (!auth.ok) return auth.response;
 *   // ...auth.session is a verified principal from here on
 *
 * `'read'` requires any authenticated session; `'write'` additionally requires a
 * privileged role (see `canWrite`). Denials come back as the repo's standard
 * error envelope so callers get a consistent `{ success:false, code, message }`.
 */

export type Access = 'read' | 'write';

type Authorized = { ok: true; session: IntelSession };
type Denied = { ok: false; response: NextResponse };

function deny(status: number, code: string, message: string): Denied {
  return { ok: false, response: NextResponse.json({ success: false, code, message }, { status }) };
}

export async function authorize(access: Access): Promise<Authorized | Denied> {
  const session = await getSession();
  if (!session) {
    return deny(401, 'unauthenticated', 'Sign in to use Website Intelligence.');
  }
  if (access === 'write' && !canWrite(session)) {
    return deny(
      403,
      'forbidden',
      'Your role cannot perform this action. Ask an Owner, Admin or Manager.',
    );
  }
  return { ok: true, session };
}

/**
 * Whether the request carries the configured cron secret. The schedule sweep is
 * called by a machine (system cron / BullMQ repeatable / Vercel Cron), which has
 * no user session - so it authenticates with a shared secret sent as
 * `Authorization: Bearer <secret>` or `x-cron-secret`. Constant-time compared.
 *
 * Returns false when `WEBSITE_INTEL_CRON_SECRET` is unset: a machine caller then
 * has no way in, and the route falls back to requiring a privileged session.
 */
export function hasCronSecret(request: Request): boolean {
  const expected = process.env.WEBSITE_INTEL_CRON_SECRET;
  if (!expected) return false;
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const provided = bearer ?? request.headers.get('x-cron-secret') ?? '';
  return constantTimeEqual(provided, expected);
}
