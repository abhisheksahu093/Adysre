import { ok } from '@/lib/api/response';
import { ensureCsrfToken } from '@/lib/auth/csrf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/csrf
 *
 * Issues (or returns) the CSRF token for this browser and sets the readable
 * cookie alongside it.
 *
 * Public on purpose. The token proves a request originated from a page on this
 * origin; it grants nothing, identifies nobody, and is useless to a cross-site
 * attacker who cannot read the response or the cookie. Gating it behind
 * authentication would mean a signed-out visitor could not submit the very
 * forms that need protecting.
 */
export async function GET() {
  const token = await ensureCsrfToken();
  return ok({ token }, 'CSRF token issued.');
}
