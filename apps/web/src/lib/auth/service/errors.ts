/**
 * Typed failures the auth services raise.
 *
 * Services do not build HTTP responses: they are meant to be callable from a
 * job or a script, and a service that returns a `NextResponse` cannot be. They
 * throw these instead, and the route handler is the single place that decides
 * which status code each one deserves.
 *
 * Every one of these is an expected outcome rather than a defect, which is what
 * separates them from a thrown `Error`: anything that is NOT one of these
 * reaching a handler is a real fault and becomes a 503 with the cause logged.
 */

export abstract class AuthError extends Error {
  abstract readonly code: string;
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Wrong password, unknown address, inactive account, or OAuth-only account. */
export class InvalidCredentialsError extends AuthError {
  readonly code = 'INVALID_CREDENTIALS';
  constructor() {
    // The message is never shown to the caller; the handler substitutes one
    // identical response for every cause, so nothing here can leak which.
    super('Credentials did not verify.');
  }
}

export class AccountLockedError extends AuthError {
  readonly code = 'ACCOUNT_LOCKED';
  constructor(readonly until: Date) {
    super(`Account locked until ${until.toISOString()}.`);
  }
}

/** The address holds accounts in several tenants and the password matched more than one. */
export class TenantAmbiguousError extends AuthError {
  readonly code = 'TENANT_AMBIGUOUS';
  constructor(readonly workspaces: { slug: string; name: string }[]) {
    super('The credentials match more than one workspace.');
  }
}

export class SlugTakenError extends AuthError {
  readonly code = 'SLUG_TAKEN';
  constructor() {
    super('That workspace URL is already in use.');
  }
}

export class EmailRegisteredError extends AuthError {
  readonly code = 'EMAIL_REGISTERED';
  constructor() {
    super('That email is already registered in this workspace.');
  }
}

/** The supplied current password did not verify. */
export class WrongPasswordError extends AuthError {
  readonly code = 'WRONG_PASSWORD';
  constructor() {
    super('Current password is incorrect.');
  }
}

/**
 * A reset or verification token that is missing, expired, already used, or
 * forged.
 *
 * One error for all four on purpose. Distinguishing "expired" from "never
 * existed" tells an attacker which of their guesses were once real tokens.
 */
export class InvalidTokenError extends AuthError {
  readonly code = 'INVALID_TOKEN';
  constructor() {
    super('That link is invalid or has expired.');
  }
}

/** A refresh token that is missing, expired, revoked, or replayed. */
export class InvalidSessionError extends AuthError {
  readonly code = 'INVALID_SESSION';
  constructor(readonly reused = false) {
    super(reused ? 'Refresh token reuse detected.' : 'Session is not valid.');
  }
}
