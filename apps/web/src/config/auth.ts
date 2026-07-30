/**
 * Switches for the sign-in page that are decisions, not credentials.
 *
 * Anything that depends on secrets is answered by the server
 * (`/api/auth/oauth/providers` reports which providers actually have
 * credentials). What lives here is the separate question of whether we are
 * offering the option at all yet.
 */

/**
 * Whether sign-in and registration offer social providers.
 *
 * Off until the Google, Microsoft and GitHub apps are registered and their
 * credentials are in the environment. The buttons already disable themselves
 * when the server reports no credentials, but a row of three dead buttons above
 * the email form reads as something broken rather than as something coming, so
 * the whole block is held back instead.
 *
 * Turning this back on is the only change needed: the flow, the route handlers,
 * the callback and the error banner all stay wired up and in the build.
 */
export const SOCIAL_SIGN_IN_ENABLED = false;
