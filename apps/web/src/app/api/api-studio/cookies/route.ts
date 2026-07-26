import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { UNAVAILABLE, ok } from '@/lib/api/response';
import { parseBody, requiredParam } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { can } from '@/lib/api-studio/auth-policy';
import { recordAudit } from '@/lib/api-studio/audit';
import { deleteCookies, listCookies } from '@/lib/api-studio/repositories/cookies';
import { cookieClearSchema } from '@/modules/api-studio/schemas/api';

/**
 * The cookie jar.
 *
 * `GET    /api/api-studio/cookies?workspaceId=…[&reveal=1]`
 * `DELETE /api/api-studio/cookies`  one cookie, or the whole jar
 *
 * A cookie value IS a credential, so listing masks values unless the caller
 * holds `api-studio:secret:read`, exactly as environment secrets do, and a
 * reveal is audited. Reading the jar otherwise shows names, domains, paths and
 * flags: enough to see what is stored and delete what should not be.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.environmentRead);
  if (!auth.ok) return auth.response;

  const workspaceId = requiredParam(request, 'workspaceId');
  if (!workspaceId.ok) return workspaceId.response;

  const wantsReveal = new URL(request.url).searchParams.get('reveal') === '1';
  const reveal = wantsReveal && can(auth.session, API_STUDIO_PERMISSIONS.secretRead);

  try {
    if (reveal) {
      await recordAudit(auth.session, 'secret.reveal', 'api-studio.cookie', workspaceId.value);
    }

    const cookies = await listCookies(auth.session.tenantId, workspaceId.value);
    return ok(reveal ? cookies : cookies.map((cookie) => ({ ...cookie, value: '' })));
  } catch {
    return UNAVAILABLE();
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  // Clearing cookies is how someone signs out of an API they were testing, so
  // it rides on environment management rather than on a destructive permission
  // nobody would hold.
  const auth = await authorize(API_STUDIO_PERMISSIONS.environmentManage);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, cookieClearSchema);
  if (!body.ok) return body.response;

  try {
    const removed = await deleteCookies(
      auth.session.tenantId,
      body.data.workspaceId,
      body.data.cookie ?? undefined,
    );
    return ok({ removed }, 'Cookies cleared.');
  } catch {
    return UNAVAILABLE();
  }
}
