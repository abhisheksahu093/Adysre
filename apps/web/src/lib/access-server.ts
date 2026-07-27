import 'server-only';
import { getAuthSession } from './auth/guard';
import { resolveTier } from './entitlements/service';
import type { AccessLevel } from './access';

/**
 * The current workspace's entitlement, resolved on the server.
 *
 * This used to read a plain `adysre_access` cookie: a development switch anyone
 * could set from devtools, carrying a comment saying to replace it with the
 * subscription record once auth landed. Auth landed, so it now reads the
 * verified session and the workspace's subscription, and the cookie is gone.
 *
 * **Fails closed.** No session, no subscription, or an unreachable database all
 * return `free`. A bug then withholds a paid feature, which someone reports in
 * minutes, rather than handing the library out silently to everyone.
 *
 * Entitlement is per WORKSPACE, not per user: every gated table carries
 * `tenant_id`, so a per-user quota on shared rows would give a ten-person free
 * workspace ten times the limit on data everybody can see.
 */
export async function getAccessLevel(): Promise<AccessLevel> {
  try {
    const session = await getAuthSession();
    if (!session) return 'free';
    return await resolveTier(session.tenantId);
  } catch (error) {
    console.error(
      `[access] could not resolve entitlement: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return 'free';
  }
}
