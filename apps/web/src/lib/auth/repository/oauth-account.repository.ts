import 'server-only';
import { prisma, notDeleted } from '@adysre/database';
import { createId } from '@/modules/api-studio/utils/ids';
import type { OAuthProvider } from '@adysre/validators';

/**
 * Links between a user and their account at an external identity provider. The
 * only place that touches Prisma for `oauth_accounts`
 * (BACKEND_ARCHITECTURE.md: only repositories touch the database).
 *
 * `findLink` is the third query in this codebase that runs across tenants, and
 * for the same reason as `findCandidatesByEmail` and `isSlugTaken`: at the
 * OAuth callback there is a provider account and nothing else, so there is no
 * tenant to scope by. The unique pair `(provider, provider_account_id)` is what
 * makes that safe, because it can match at most one row platform-wide.
 */

/** A resolved link, with just enough of the user to decide what happens next. */
export interface LinkedAccount {
  id: string;
  tenantId: string;
  userId: string;
  isActive: boolean;
}

/**
 * The user behind a provider account, or null.
 *
 * Soft-deleted users and soft-deleted organizations are both excluded, exactly
 * as `findCandidatesByEmail` does: a removed account must not be signable-in
 * through a link that outlived it.
 */
export async function findLink(
  provider: OAuthProvider,
  providerAccountId: string,
): Promise<LinkedAccount | null> {
  const row = await prisma.oAuthAccount.findFirst({
    where: {
      provider,
      providerAccountId,
      user: { ...notDeleted, organization: { ...notDeleted } },
    },
    select: {
      id: true,
      tenantId: true,
      userId: true,
      user: { select: { isActive: true } },
    },
  });

  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    userId: row.userId,
    isActive: row.user.isActive,
  };
}

export interface LinkInput {
  tenantId: string;
  userId: string;
  provider: OAuthProvider;
  providerAccountId: string;
  email: string;
}

/**
 * Record that this user signs in with this provider.
 *
 * An upsert on `(user_id, provider)`, not a create. Someone who deletes their
 * Google account and makes a new one keeps the same workspace and simply
 * repoints the link; a plain insert would fail on the unique pair and strand
 * them with an error they cannot act on.
 *
 * `email` is refreshed on every sign-in so the audit trail shows the address
 * the provider reports NOW, which is the whole point of not joining on it.
 */
export async function linkAccount(input: LinkInput): Promise<void> {
  const now = new Date();
  await prisma.oAuthAccount.upsert({
    where: { userId_provider: { userId: input.userId, provider: input.provider } },
    create: {
      id: createId(),
      tenantId: input.tenantId,
      userId: input.userId,
      provider: input.provider,
      providerAccountId: input.providerAccountId,
      email: input.email.toLowerCase(),
      lastUsedAt: now,
    },
    update: {
      providerAccountId: input.providerAccountId,
      email: input.email.toLowerCase(),
      lastUsedAt: now,
    },
  });
}

/** Note that a link was just used to sign in. */
export async function touchLink(id: string): Promise<void> {
  await prisma.oAuthAccount.update({
    where: { id },
    data: { lastUsedAt: new Date() },
  });
}

/** Every provider a user has linked, for the security screen. */
export async function listLinks(
  tenantId: string,
  userId: string,
): Promise<Array<{ provider: string; email: string; lastUsedAt: Date | null }>> {
  return prisma.oAuthAccount.findMany({
    where: { tenantId, userId },
    select: { provider: true, email: true, lastUsedAt: true },
    orderBy: { provider: 'asc' },
  });
}

/**
 * Remove a link.
 *
 * A hard delete, deliberately. The unique pair has to be freed or the user
 * could unlink Google and never link it again; a soft-deleted row would keep
 * occupying the slot. Scoped by tenant AND user so the WHERE clause enforces
 * ownership rather than a fetch-then-compare in application code.
 */
export async function unlinkAccount(
  tenantId: string,
  userId: string,
  provider: OAuthProvider,
): Promise<void> {
  await prisma.oAuthAccount.deleteMany({ where: { tenantId, userId, provider } });
}
