import { z } from 'zod';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '@adysre/validators';

/**
 * The OpenAPI description of the auth API.
 *
 * Generated from the SAME Zod schemas the route handlers validate with, which
 * is the entire point. A hand-written spec is a second description of the
 * system that drifts from the first the moment anyone adds a field, and it
 * drifts silently because nothing checks it. Here, changing `registerSchema`
 * changes the document.
 *
 * What still has to be written by hand is what Zod cannot know: paths, methods,
 * status codes, and why an endpoint behaves the way it does. Those live below,
 * next to the schema they describe.
 */

// Adds `.openapi()` to every Zod schema, including the ones already
// constructed in @adysre/validators, because the whole workspace resolves to
// one zod instance.
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

/**
 * The password policy, in words.
 *
 * Necessary because JSON Schema allows exactly one `pattern`, while
 * `passwordSchema` applies three separate regexes (a lowercase letter, an
 * uppercase letter, a digit). The generator keeps only the first, so a spec
 * left to itself advertises `pattern: "[a-z]"` and a client building a form
 * from it would happily accept passwords this API rejects.
 *
 * Stated here rather than fixed in `@adysre/validators`, because annotating
 * those schemas would require the OpenAPI extension to be loaded wherever they
 * are imported, including `apps/api`, which does not use it.
 */
const PASSWORD_POLICY =
  'At least 12 characters and at most 128, containing a lowercase letter, an uppercase ' +
  'letter and a digit. NOTE: the `pattern` below expresses only the first of those three ' +
  'rules, because JSON Schema permits a single pattern per field.';

/**
 * Cross-field rules that JSON Schema cannot express at all.
 *
 * Zod `.refine` checks compare two fields, which has no equivalent here, so
 * they are spelled out in the endpoint descriptions instead of being silently
 * dropped.
 */
const CONFIRM_RULE = 'Must equal the new password. Checked server-side; not expressible in JSON Schema.';

// --- Shared response shapes -------------------------------------------------

/**
 * The success envelope from `documents/API_STANDARDS.md`.
 *
 * `data` is described per endpoint; this wrapper is what every one of them
 * shares, so a client can unwrap once rather than per call.
 */
function success<T extends z.ZodTypeAny>(data: T) {
  return z.object({
    success: z.literal(true),
    message: z.string().openapi({ example: 'OK' }),
    data,
  });
}

const errorResponse = registry.register(
  'Error',
  z
    .object({
      success: z.literal(false),
      // Stable and meant to be switched on. The message is for a developer
      // reading a log and may change without notice.
      code: z.string().openapi({ example: 'INVALID_CREDENTIALS' }),
      message: z.string().openapi({ example: 'Email or password is incorrect.' }),
    })
    .openapi({ description: 'Every failure uses this shape. Branch on `code`, never on `message`.' }),
);

const identity = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
});

const profile = registry.register(
  'Profile',
  z.object({
    user: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      name: z.string(),
      avatarUrl: z.string().url().nullable(),
      emailVerifiedAt: z.string().datetime().nullable(),
      lastLoginAt: z.string().datetime().nullable(),
    }),
    organization: z.object({
      id: z.string().uuid(),
      name: z.string(),
      slug: z.string(),
    }),
    roles: z.array(z.string()).openapi({ example: ['Owner'] }),
    permissions: z.array(z.string()).openapi({ example: ['api-studio:collection:read'] }),
  }),
);

// The session cookies, so a reader knows what authenticates a request even
// though they can never read them from JavaScript.
registry.registerComponent('securitySchemes', 'sessionCookie', {
  type: 'apiKey',
  in: 'cookie',
  name: 'access_token',
  description:
    'HTTP-only cookie set by /api/auth/login and /api/auth/register, and rotated by ' +
    '/api/auth/refresh. It cannot be read or set by JavaScript, so there is no bearer ' +
    'token to paste: use a client that keeps cookies.',
});

/** Shorthand for the error responses nearly every endpoint can return. */
const errors = (...codes: [number, string][]) =>
  Object.fromEntries(
    codes.map(([status, description]) => [
      String(status),
      { description, content: { 'application/json': { schema: errorResponse } } },
    ]),
  );

function json<T extends z.ZodTypeAny>(schema: T, description: string) {
  return { description, content: { 'application/json': { schema } } };
}

function body<T extends z.ZodTypeAny>(schema: T) {
  return { body: { content: { 'application/json': { schema } }, required: true } };
}

// --- Paths ------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['auth'],
  summary: 'Create a workspace and its Owner',
  description:
    'Creates the organization, its first user, the Owner role and a signed-in session in one ' +
    'transaction, then mails a confirmation link. Registering creates a WORKSPACE; joining an ' +
    'existing one happens by invitation.\n\n' +
    'Sets `access_token` and `refresh_token` as HTTP-only cookies.\n\n' +
    'Note: a 409 on a known address does reveal that the address is registered. The ' +
    'alternative needs mail delivery on a path that must answer immediately; the trade is ' +
    'recorded in docs/API_ARCHITECTURE.md.',
  // `.extend` keeps every rule and only adds the prose the generator cannot
  // derive. The schema is otherwise the one the handler validates with.
  request: body(
    registerSchema.extend({
      password: registerSchema.shape.password.openapi({ description: PASSWORD_POLICY }),
    }),
  ),
  responses: {
    201: json(success(identity), 'Workspace created and signed in.'),
    ...errors(
      [400, 'The body failed validation.'],
      [409, 'SLUG_TAKEN, or EMAIL_REGISTERED.'],
      [429, 'Rate limited: 5 per hour per IP.'],
      [503, 'The database is unreachable.'],
    ),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['auth'],
  summary: 'Sign in',
  description:
    'Users are unique on (tenant, email), so one address can hold accounts in several ' +
    'workspaces. When the password matches more than one, the response is 409 ' +
    'TENANT_AMBIGUOUS carrying the candidates, and the client re-posts with `tenantSlug`.\n\n' +
    'A wrong password and an unknown address return an identical body and take a comparable ' +
    'amount of time, so this endpoint cannot be used to discover which addresses are ' +
    'registered.',
  request: body(loginSchema),
  responses: {
    200: json(
      success(identity.extend({ requiresEmailVerification: z.boolean() })),
      'Signed in. Both cookies are set.',
    ),
    ...errors(
      [400, 'The body failed validation.'],
      [401, 'INVALID_CREDENTIALS. Identical for a wrong password and an unknown address.'],
      [409, 'TENANT_AMBIGUOUS. `data.workspaces` lists the candidates.'],
      [423, 'ACCOUNT_LOCKED after 5 failures. Carries Retry-After; the lock expires itself.'],
      [429, 'Rate limited: 10 per 15 minutes, per IP and per address.'],
    ),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/refresh',
  tags: ['auth'],
  summary: 'Rotate the session',
  description:
    'Takes no body: the credential is the HTTP-only `refresh_token` cookie. Every refresh ' +
    'issues a new token and retires the old one.\n\n' +
    'Presenting a token that was already rotated away is treated as theft: every session for ' +
    'that user is revoked. Clients MUST therefore share one in-flight refresh across ' +
    'concurrent 401s, or parallel requests will present a retired token and sign the user out ' +
    'for doing nothing wrong.',
  security: [{ sessionCookie: [] }],
  responses: {
    200: json(success(identity), 'Rotated. Both cookies are replaced.'),
    ...errors(
      [401, 'Missing, expired, revoked, or reused. Both cookies are cleared.'],
      [429, 'Rate limited: 60 per 15 minutes per IP.'],
    ),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/logout',
  tags: ['auth'],
  summary: 'Sign out',
  description:
    'Revokes the session row and clears both cookies. ALWAYS answers 200, even with no valid ' +
    'session: the outcome is "you are signed out" either way, and a logout that can fail ' +
    'leaves a user stuck on a page they cannot leave.',
  responses: {
    200: json(success(z.object({ signedOut: z.literal(true) })), 'Signed out.'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/forgot-password',
  tags: ['auth'],
  summary: 'Request a password reset link',
  description:
    'ALWAYS answers 200 with an identical message, whether or not the address has an account, ' +
    'and whether or not sending succeeded. Any other behaviour would make this endpoint a ' +
    'directory of who is registered, and it is unauthenticated.\n\n' +
    'The link expires in one hour and can be used once.',
  request: body(forgotPasswordSchema),
  responses: {
    200: json(
      success(z.object({ requested: z.literal(true) })),
      'Accepted. Reveals nothing about whether the account exists.',
    ),
    ...errors([400, 'The body was not a valid email.'], [429, 'Rate limited: 3 per hour per address.']),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/reset-password',
  tags: ['auth'],
  summary: 'Set a new password using a reset token',
  description:
    'Marks the token used, sets the password, clears any lockout and revokes EVERY session for ' +
    'the user, in one transaction. The revocation is the point: someone resetting after a ' +
    'compromise expects the attacker to be signed out.\n\n' +
    'Missing, expired, already-used and forged tokens all return the same 400.\n\n' +
    `**password**: ${PASSWORD_POLICY}\n\n` +
    `**confirmPassword**: ${CONFIRM_RULE}`,
  request: body(resetPasswordSchema),
  responses: {
    200: json(success(z.object({ reset: z.literal(true) })), 'Password updated. Sign in again.'),
    ...errors([400, 'Invalid or expired token, or the body failed validation.'], [429, 'Rate limited.']),
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/me',
  tags: ['auth'],
  summary: 'The signed-in user',
  description:
    'Profile fields come from the database and are current. Roles and permissions come from ' +
    'the access token and can be up to 15 minutes stale, which is deliberate: they are what ' +
    'every other endpoint authorises against, and a second source could disagree with them.',
  security: [{ sessionCookie: [] }],
  responses: {
    200: json(success(profile), 'The current user, workspace, roles and permissions.'),
    ...errors([401, 'No session, or one that failed verification.'], [404, 'The account no longer exists.']),
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/auth/profile',
  tags: ['auth'],
  summary: 'Update your own profile',
  description:
    'Email is NOT editable here. Changing an address needs a verification round trip, and the ' +
    'schema is strict, so sending an `email` field is a 400 rather than a silent no-op that ' +
    'would report success while nothing changed.',
  security: [{ sessionCookie: [] }],
  request: body(updateProfileSchema),
  responses: {
    200: json(success(profile.omit({ roles: true, permissions: true })), 'The updated profile.'),
    ...errors([400, 'Unknown field, or nothing to update.'], [401, 'No session.'], [429, 'Rate limited.']),
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/auth/change-password',
  tags: ['auth'],
  summary: 'Change your password',
  description:
    'Requires the current password even though the caller is authenticated, because the threat ' +
    'is an unlocked laptop rather than a forged token.\n\n' +
    'Requires a CSRF token: GET /api/auth/csrf, then echo it in `x-csrf-token`.\n\n' +
    'Revokes every OTHER session and reissues cookies for this one. Signing out the device ' +
    'that made the change would be hostile; leaving the others signed in would defeat the point.\n\n' +
    `**newPassword**: ${PASSWORD_POLICY}\n\n` +
    `**confirmPassword**: ${CONFIRM_RULE} It must also differ from the current password.`,
  security: [{ sessionCookie: [] }],
  request: body(changePasswordSchema),
  responses: {
    200: json(
      success(z.object({ changed: z.literal(true), sessionsRevoked: z.number().int() })),
      'Password updated. This session survives.',
    ),
    ...errors(
      [400, 'The body failed validation.'],
      [401, 'No session, or the current password is wrong.'],
      [403, 'Missing or invalid CSRF token.'],
      [429, 'Rate limited: 5 per 15 minutes per user.'],
    ),
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/csrf',
  tags: ['auth'],
  summary: 'Issue a CSRF token',
  description:
    'Sets the readable `adysre_csrf` cookie and returns the same value. Public, because the ' +
    'token proves a request came from a page on this origin and grants nothing on its own.',
  responses: {
    200: json(success(z.object({ token: z.string() })), 'The token, also set as a cookie.'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/verify-email',
  tags: ['auth'],
  summary: 'Confirm an email address',
  description:
    'Public, because confirmation happens from a mail client rather than from a signed-in ' +
    'device. `alreadyVerified` is a SUCCESS, not an error: mail scanners prefetch links, so ' +
    'the token is often redeemed before the human clicks.',
  request: body(z.object({ token: z.string().min(1) })),
  responses: {
    200: json(
      success(z.object({ verified: z.literal(true), alreadyVerified: z.boolean() })),
      'Confirmed, or already confirmed.',
    ),
    ...errors([400, 'Invalid, expired, or already-used token.'], [429, 'Rate limited.']),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/resend-verification',
  tags: ['auth'],
  summary: 'Resend your confirmation link',
  description:
    'Takes no body. The address comes from the session, so this cannot be aimed at somebody ' +
    "else's inbox: an endpoint that accepted an address would be a way to send mail from this " +
    'domain to anyone.\n\n' +
    'Answers 200 with `alreadyVerified` when there is nothing to send.',
  security: [{ sessionCookie: [] }],
  responses: {
    200: json(
      success(z.object({ sent: z.boolean(), alreadyVerified: z.boolean() })),
      'Sent, or already verified.',
    ),
    ...errors([401, 'No session.'], [429, 'Rate limited: 3 per hour per user.']),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/cleanup',
  tags: ['operations'],
  summary: 'Delete expired records',
  description:
    'Removes expired sessions, reset and verification tokens, and rate-limit windows. For a ' +
    'scheduled caller, authenticated by a shared secret (`Authorization: Bearer <secret>` or ' +
    '`x-cron-secret`) rather than a session, because the caller is a machine.\n\n' +
    'An unset AUTH_CLEANUP_SECRET means NOBODY can run it: an endpoint that deletes rows must ' +
    'not be open by default.\n\n' +
    'Sweeps 30 days PAST expiry, so an investigation starting weeks later can still see what ' +
    'existed. `audit_logs` is never swept.',
  responses: {
    200: json(
      success(
        z.object({
          sessions: z.number().int(),
          passwordResets: z.number().int(),
          emailVerifications: z.number().int(),
          rateLimits: z.number().int(),
        }),
      ),
      'What was removed.',
    ),
    ...errors([401, 'Missing, wrong, or unconfigured secret.'], [503, 'The database is unreachable.']),
  },
});

/**
 * Build the document. Called by the route handler and the generator script.
 *
 * The return type is annotated rather than inferred. Inference here names a
 * type from `openapi3-ts`, which reaches this project only as a transitive
 * dependency of the generator, and TypeScript refuses to emit a declaration
 * that references a path it cannot guarantee (TS2742). Naming it makes the
 * dependency explicit, which it is.
 */
export function buildOpenApiDocument(): OpenAPIObject {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'ADYSRE Authentication API',
      version: '1.0.0',
      description:
        'Authentication for the ADYSRE platform, served same-origin by the Next.js app.\n\n' +
        '**There is no bearer token.** Both credentials are HTTP-only cookies, which is what ' +
        'stops an XSS payload from stealing a session, and it means you need a client that ' +
        'keeps a cookie jar (curl -c/-b, Bruno, Postman) rather than one that pastes a header.\n\n' +
        'Every response uses one envelope: `{success, message, data}` or ' +
        '`{success: false, code, message}`. Branch on `code`, which is stable; `message` is for ' +
        'a developer reading a log.',
    },
    servers: [
      { url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000', description: 'This deployment' },
    ],
    tags: [
      { name: 'auth', description: 'Sessions, passwords and address confirmation.' },
      { name: 'operations', description: 'Scheduled maintenance, authenticated by shared secret.' },
    ],
  });
}
