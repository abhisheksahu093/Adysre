import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { NOT_FOUND, ok, reportRouteError } from '@/lib/api/response';
import { parseBody } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { recordAudit } from '@/lib/api-studio/audit';
import {
  getWorkspace,
  softDeleteWorkspace,
  updateWorkspace,
} from '@/lib/api-studio/repositories/workspaces';
import { workspaceUpdateSchema } from '@/modules/api-studio/schemas/api';

/**
 * One workspace.
 *
 * `GET | PATCH | DELETE /api/api-studio/workspaces/{id}`
 *
 * A row belonging to another tenant answers 404, the same as a row that does
 * not exist: distinguishing them would hand out a way to enumerate ids.
 */
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.workspaceRead);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const workspace = await getWorkspace(auth.session.tenantId, id);
    return workspace ? ok(workspace) : NOT_FOUND('Workspace not found.');
  } catch (error) {
    return reportRouteError('api-studio.workspaces.id', error);
  }
}

export async function PATCH(request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.workspaceManage);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, workspaceUpdateSchema);
  if (!body.ok) return body.response;

  const { id } = await params;
  try {
    const workspace = await updateWorkspace(
      auth.session.tenantId,
      auth.session.userId,
      id,
      body.data,
    );
    return workspace ? ok(workspace, 'Workspace updated.') : NOT_FOUND('Workspace not found.');
  } catch (error) {
    return reportRouteError('api-studio.workspaces.id', error);
  }
}

export async function DELETE(_request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.workspaceManage);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const deleted = await softDeleteWorkspace(auth.session.tenantId, auth.session.userId, id);
    if (!deleted) return NOT_FOUND('Workspace not found.');
    await recordAudit(auth.session, 'workspace.delete', 'api-studio.workspace', id);
    return ok({ id }, 'Workspace deleted.');
  } catch (error) {
    return reportRouteError('api-studio.workspaces.id', error);
  }
}
