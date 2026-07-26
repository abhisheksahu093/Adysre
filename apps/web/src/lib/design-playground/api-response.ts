import { fail, ok } from '@/lib/api/response';

/**
 * The response envelope from `documents/API_STANDARDS.md`.
 *
 * The envelope itself is shared (`lib/api/response`), so every module answers
 * in one shape. What stays here is this module's own failure: storage that is
 * configured but unreachable, which the editor reports as "offline" rather than
 * pretending a save succeeded.
 */

export { ok, fail };

/** Persistence is configured but unreachable, or the tenant is not seeded. */
export const UNAVAILABLE = () =>
  fail(
    'PERSISTENCE_UNAVAILABLE',
    'Project storage is not available. Check DATABASE_URL and run the migrations.',
    503,
  );
