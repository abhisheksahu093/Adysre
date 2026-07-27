/**
 * Names shared by the server and browser halves of the CSRF check.
 *
 * Their own module because `csrf.ts` is `server-only` (it reads `next/headers`)
 * and the browser helper must not import it. Two hardcoded copies of a header
 * name is exactly the kind of drift that produces a check which silently
 * passes nothing.
 */

/** Readable by our own JavaScript, unlike the session cookies. */
export const CSRF_COOKIE = 'adysre_csrf';

/** The header the client echoes the token back in. */
export const CSRF_HEADER = 'x-csrf-token';
