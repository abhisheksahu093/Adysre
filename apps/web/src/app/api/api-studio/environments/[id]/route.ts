import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { BAD_REQUEST, NOT_FOUND, UNAVAILABLE, ok } from '@/lib/api/response';
import { parseBody } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { can } from '@/lib/api-studio/auth-policy';
import { recordAudit } from '@/lib/api-studio/audit';
import { SecretStorageError } from '@/lib/api-studio/crypto';
import {
  getEnvironment,
  softDeleteEnvironment,
  updateEnvironment,
} from '@/lib/api-studio/repositories/environments';
import { environmentUpdateSchema } from '@/modules/api-studio/schemas/api';

/**
 * One environment.
 *
 * `GET | PATCH | DELETE /api/api-studio/environments/{id}`
 *
 * A secret submitted with an empty value keeps the ciphertext it had: that is
 * what lets a UI which only ever saw a masked field save the environment
 * without wiping the credential behind it.
 */
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.environmentRead);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const wantsReveal = new URL(request.url).searchParams.get('reveal') === '1';
  const reveal = wantsReveal && can(auth.session, API_STUDIO_PERMISSIONS.secretRead);

  try {
    if (reveal) await recordAudit(auth.session, 'secret.reveal', 'api-studio.environment', id);
    const environment = await getEnvironment(auth.session.tenantId, id, reveal);
    return environment ? ok(environment) : NOT_FOUND('Environment not found.');
  } catch {
    return UNAVAILABLE();
  }
}

export async function PATCH(request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.environmentManage);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, environmentUpdateSchema);
  if (!body.ok) return body.response;

  const { id } = await params;
  try {
    const environment = await updateEnvironment(
      auth.session.tenantId,
      auth.session.userId,
      id,
      body.data,
    );
    return environment
      ? ok(environment, 'Environment updated.')
      : NOT_FOUND('Environment not found.');
  } catch (error) {
    if (error instanceof SecretStorageError) return BAD_REQUEST(error.message);
    return UNAVAILABLE();
  }
}

export async function DELETE(_request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.environmentManage);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const deleted = await softDeleteEnvironment(auth.session.tenantId, auth.session.userId, id);
    if (!deleted) return NOT_FOUND('Environment not found.');
    await recordAudit(auth.session, 'environment.delete', 'api-studio.environment', id);
    return ok({ id }, 'Environment deleted.');
  } catch {
    return UNAVAILABLE();
  }
}
