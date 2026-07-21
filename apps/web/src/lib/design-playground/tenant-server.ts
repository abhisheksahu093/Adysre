import 'server-only';

import { prisma, notDeleted } from '@adysre/database';

/**
 * Who the design routes are acting for.
 *
 * ─── NOT SECURE YET ─────────────────────────────────────────────────────────
 * The web app has no session yet (see `lib/access-server.ts` for the same
 * caveat on entitlements), so this resolves the seeded demo tenant instead of a
 * signed-in user. Every stored row is still tenant-scoped and every query still
 * filters by it, so the data model is correct and the trust boundary is the
 * only missing piece.
 *
 * When auth lands (`documents/AUTHENTICATION_RBAC.md`), replace the body with:
 *   1. Read the HTTP-only access token and verify it.
 *   2. Return the token's `tenantId` and `userId` - never a value the client
 *      can influence, and never a lookup by slug.
 *   3. Check `design:project:*` before the route touches the repository.
 * The call sites do not change: they already treat this as the only source of
 * tenancy, so nothing downstream has to be rewritten.
 */
export interface DesignActor {
  tenantId: string;
  userId: string | null;
}

/** The seeded tenant every unauthenticated request is attributed to. */
const DEMO_ORG_SLUG = 'demo';

export async function resolveActor(): Promise<DesignActor | null> {
  const org = await prisma.organization.findFirst({
    where: { slug: DEMO_ORG_SLUG, ...notDeleted },
    select: { id: true },
  });
  // No seeded tenant means the database has not been set up. Returning null
  // lets the route answer "persistence unavailable" rather than inventing a
  // tenant id and writing rows that belong to nobody.
  if (!org) return null;

  return { tenantId: org.id, userId: null };
}
