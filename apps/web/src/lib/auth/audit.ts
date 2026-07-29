import 'server-only';
import { prisma } from '@adysre/database';
import { createId } from '@/modules/api-studio/utils/ids';

/**
 * Audit trail for authentication events.
 *
 * The most valuable rows here are written for callers who are not authenticated
 * at all: a failed sign-in, a reset requested for an address that does not
 * exist. That is why `audit_logs.actor_id` is nullable and why this helper
 * takes the actor as an explicit argument rather than reading a session.
 *
 * Auditing never fails the request it is auditing. A logging outage that
 * blocked every sign-in would be a far worse failure than a missing line.
 */

export type AuthAuditAction =
  | 'auth.register'
  | 'auth.login.success'
  | 'auth.login.failed'
  | 'auth.login.blocked'
  | 'auth.logout'
  | 'auth.refresh.success'
  /** A rotated refresh token was replayed. Someone should look at this. */
  | 'auth.refresh.reuse'
  | 'auth.password.reset.requested'
  | 'auth.password.reset.completed'
  | 'auth.password.changed'
  | 'auth.account.locked'
  | 'auth.profile.updated'
  /** Signed in through a provider, into an account that already existed. */
  | 'auth.oauth.login'
  /** A provider sign-in that created a new workspace. */
  | 'auth.oauth.register'
  /**
   * A provider sign-in that was refused. Worth recording separately from
   * `auth.login.failed`: a burst of these means the provider integration is
   * broken, not that someone is guessing passwords.
   */
  | 'auth.oauth.failed'
  /**
   * A workspace hit a wall. The clearest upgrade signal there is, and the
   * clearest sign a limit is set wrong.
   */
  | 'entitlement.quota.denied'
  | 'entitlement.upgrade.requested'
  | 'entitlement.upgrade.applied';

export interface AuditContext {
  tenantId: string;
  actorId: string | null;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * Write one audit row.
 *
 * `metadata` must never carry a password, a token, a reset link, or a session
 * cookie. Audit logs are widely readable inside an organization and are exactly
 * where a leaked credential would sit unnoticed for months.
 */
export async function recordAuthEvent(
  context: AuditContext,
  action: AuthAuditAction,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        id: createId(),
        tenantId: context.tenantId,
        actorId: context.actorId,
        action,
        resource: 'user',
        resourceId: context.actorId,
        metadata: {
          ...metadata,
          ip: context.ip ?? null,
          userAgent: context.userAgent ?? null,
        },
      },
    });
  } catch (error) {
    // Best effort by design. Logged so the gap is visible to an operator
    // rather than silently swallowed.
    console.error(
      `[auth.audit] failed to record ${action}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/** The request metadata every auth event records. */
export function requestContext(request: Request): { ip: string; userAgent: string | null } {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  return { ip, userAgent: request.headers.get('user-agent') };
}
