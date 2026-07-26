/**
 * ADYSRE API Studio - redaction.
 *
 * What a request may look like once it is a LOG rather than a request. History
 * exists so a call can be found and replayed; it must not become the place
 * every credential the team ever sent piles up, readable by anyone who can list
 * it.
 *
 * Pure and module-level rather than server-side, because both ends need it: the
 * server redacts before it writes, and the client redacts before it offers a
 * history entry for export.
 */

import type { RequestDefinition } from '../types';

/**
 * Header names whose value is a credential by definition. Compared lowercase,
 * because header names are case-insensitive and an attacker-friendly bug would
 * be redacting `Authorization` but not `authorization`.
 */
const CREDENTIAL_HEADERS = new Set([
  'authorization',
  'proxy-authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'x-amz-security-token',
]);

/**
 * Strip credentials out of a definition.
 *
 * Auth drops to `none` rather than being kept and masked: a masked field still
 * means the token is in the row, one query away from anyone with read access.
 * The URL is left alone deliberately - it is the thing history exists to show,
 * and a token in a query string is a problem to fix at the source, not to hide
 * here where hiding it would make the entry unreplayable.
 */
export function redactSecrets(request: RequestDefinition): RequestDefinition {
  return {
    ...request,
    auth: { type: 'none' },
    headers: request.headers.map((header) =>
      CREDENTIAL_HEADERS.has(header.key.trim().toLowerCase()) ? { ...header, value: '' } : header,
    ),
    variables: request.variables.map((variable) =>
      variable.secret ? { ...variable, value: '', initialValue: '' } : variable,
    ),
  };
}
