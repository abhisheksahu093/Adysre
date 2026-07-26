import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { BAD_REQUEST, ok, reportRouteError } from '@/lib/api/response';
import { parseBody, requiredParam } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { can } from '@/lib/api-studio/auth-policy';
import { recordAudit } from '@/lib/api-studio/audit';
import { SecretStorageError } from '@/lib/api-studio/crypto';
import { createEnvironment, listEnvironments } from '@/lib/api-studio/repositories/environments';
import { environmentCreateSchema } from '@/modules/api-studio/schemas/api';

/**
 * Environments.
 *
 * `GET  /api/api-studio/environments?workspaceId=…[&reveal=1]`
 * `POST /api/api-studio/environments`
 *
 * Secret variables come back masked. `reveal=1` needs `api-studio:secret:read`
 * and is audited; asking for it without the permission is not an error, it just
 * returns the masked view, because a reveal toggle in a UI should degrade
 * rather than break.
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
      await recordAudit(auth.session, 'secret.reveal', 'api-studio.environment', workspaceId.value);
    }
    return ok(await listEnvironments(auth.session.tenantId, workspaceId.value, reveal));
  } catch (error) {
    return reportRouteError('api-studio.environments', error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.environmentManage);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, environmentCreateSchema);
  if (!body.ok) return body.response;

  try {
    return ok(
      await createEnvironment(auth.session.tenantId, auth.session.userId, body.data),
      'Environment created.',
    );
  } catch (error) {
    if (error instanceof SecretStorageError) return BAD_REQUEST(error.message);
    return reportRouteError('api-studio.environments', error);
  }
}
