import 'server-only';
import { prisma } from '@adysre/database';
import { createId } from '@/modules/api-studio/utils/ids';
import { toJson } from './mappers';
import type { PlatformSession } from '@/lib/auth/access-token';

/**
 * Audit trail for privileged API Studio actions.
 *
 * Writes to the platform's `audit_logs`, not to a module table: an audit record
 * outlives the thing it describes, and a workspace being deleted must not take
 * the record of its deletion with it (AUTHENTICATION_RBAC.md asks for
 * privileged actions to be audited).
 *
 * Auditing never fails the request it is auditing. A logging outage that
 * blocked a delete would be a worse failure than a missing line, and the write
 * is deliberately best-effort for that reason.
 */

export type AuditAction =
  | 'workspace.create'
  | 'workspace.delete'
  | 'collection.delete'
  | 'environment.delete'
  | 'secret.reveal'
  | 'history.clear';

export async function recordAudit(
  session: PlatformSession,
  action: AuditAction,
  resource: string,
  resourceId: string | null,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        id: createId(),
        tenantId: session.tenantId,
        actorId: isUuid(session.userId) ? session.userId : null,
        action,
        resource,
        resourceId,
        ...(metadata ? { metadata: toJson(metadata) } : {}),
      },
    });
  } catch {
    // Best effort by design. See the note above.
  }
}

/** The dev session's synthetic user id is not a UUID; the column requires one. */
function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
