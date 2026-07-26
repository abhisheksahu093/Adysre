import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { BAD_REQUEST, UNAVAILABLE, ok } from '@/lib/api/response';
import { parseBody, requiredParam } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { can } from '@/lib/api-studio/auth-policy';
import { recordAudit } from '@/lib/api-studio/audit';
import { SecretStorageError } from '@/lib/api-studio/crypto';
import { createCollection, listCollections } from '@/lib/api-studio/repositories/collections';
import { collectionCreateSchema } from '@/modules/api-studio/schemas/api';

/**
 * API Studio collections.
 *
 * `GET  /api/api-studio/collections?workspaceId=…[&reveal=1]`
 * `POST /api/api-studio/collections`
 *
 * `reveal=1` returns secret variables in plaintext and requires
 * `api-studio:secret:read`. It is audited on every use: revealing a credential
 * is an event worth being able to ask "who, and when" about.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.collectionRead);
  if (!auth.ok) return auth.response;

  const workspaceId = requiredParam(request, 'workspaceId');
  if (!workspaceId.ok) return workspaceId.response;

  const wantsReveal = new URL(request.url).searchParams.get('reveal') === '1';
  const reveal = wantsReveal && can(auth.session, API_STUDIO_PERMISSIONS.secretRead);

  try {
    if (reveal) {
      await recordAudit(auth.session, 'secret.reveal', 'api-studio.collection', workspaceId.value);
    }
    return ok(await listCollections(auth.session.tenantId, workspaceId.value, reveal));
  } catch {
    return UNAVAILABLE();
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.collectionCreate);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, collectionCreateSchema);
  if (!body.ok) return body.response;

  try {
    return ok(
      await createCollection(auth.session.tenantId, auth.session.userId, body.data),
      'Collection created.',
    );
  } catch (error) {
    // Refusing a secret is better than storing one in the clear, and an
    // operator can fix a missing key; a leaked token cannot be unleaked.
    if (error instanceof SecretStorageError) return BAD_REQUEST(error.message);
    return UNAVAILABLE();
  }
}
