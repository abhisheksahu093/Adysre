import 'server-only';
import type { LoginInput } from '@adysre/validators';
import { hashPassword, needsRehash, verifyOrBurn } from '../password';
import {
  findCandidatesByEmail,
  loadAuthContext,
  recordFailedLogin,
  recordSuccessfulLogin,
  updatePasswordHash,
  type LoginCandidate,
} from '../repository/user.repository';
import { issueSession, type IssuedSession, type RequestInfo } from './issue';
import { AccountLockedError, InvalidCredentialsError, TenantAmbiguousError } from './errors';

/**
 * Sign-in.
 *
 * The complication is that `users` is unique on `(tenant_id, email)`, so an
 * address can hold accounts in several tenants and email plus password does not
 * always identify one account. The resolution order below is deliberate, and
 * every branch that fails does so in the same amount of time.
 */

export interface LoginResult extends IssuedSession {
  userId: string;
  tenantId: string;
  requiresEmailVerification: boolean;
}

export async function login(input: LoginInput, request: RequestInfo = {}): Promise<LoginResult> {
  const email = input.email.toLowerCase();
  const candidates = await findCandidatesByEmail(email);

  const scoped = input.tenantSlug
    ? candidates.filter((c) => c.organization.slug === input.tenantSlug!.toLowerCase())
    : candidates;

  // No account at all, or none in the named workspace. The burn is what makes
  // this indistinguishable in time from a wrong password: returning here
  // without it takes ~2ms against ~250ms, which is trivially measurable and
  // turns sign-in into a list of who is registered.
  if (scoped.length === 0) {
    await verifyOrBurn(input.password, null);
    throw new InvalidCredentialsError();
  }

  // Verify against every candidate. This costs ~250ms each, and the count is
  // bounded by how many tenants share one address, which is realistically one
  // or two. Checking all of them is what allows the right account to be found
  // without asking the user which workspace they meant.
  const verified: LoginCandidate[] = [];
  for (const candidate of scoped) {
    if (await verifyOrBurn(input.password, candidate.passwordHash)) verified.push(candidate);
  }

  if (verified.length === 0) {
    // Count the failure against every account the address names, so an attacker
    // cannot dodge lockout by leaving the workspace unspecified. Only accounts
    // that could actually be signed into are counted: an inactive or
    // OAuth-only account has no password to guess.
    await Promise.all(
      scoped.filter((c) => c.isActive && c.passwordHash).map((c) => recordFailedLogin(c.id)),
    );
    throw new InvalidCredentialsError();
  }

  // The password matched in more than one workspace, which means it was reused.
  // Only workspaces whose password actually verified are named, so this cannot
  // reveal where an address exists to someone who does not hold the password.
  if (verified.length > 1) {
    throw new TenantAmbiguousError(
      verified.map((c) => ({ slug: c.organization.slug, name: c.organization.name })),
    );
  }

  const user = verified[0]!;

  // Lockout is checked AFTER the password verifies, not before. Checking first
  // would answer 423 for any address an attacker has locked out, confirming
  // that the address is registered. The lock still holds: a correct password
  // during a lock does not sign in.
  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    throw new AccountLockedError(user.lockedUntil);
  }

  // A deactivated account is refused with the same answer as a wrong password.
  // Saying "your account is disabled" tells someone with stolen credentials
  // that the credentials were right.
  if (!user.isActive) throw new InvalidCredentialsError();

  // The one moment the plaintext exists, so the only chance to upgrade a hash
  // without asking the user to do anything. Covers accounts registered through
  // apps/api with argon2, and any hash below the current cost factor.
  if (user.passwordHash && needsRehash(user.passwordHash)) {
    await updatePasswordHash(user.id, await hashPassword(input.password));
  }

  await recordSuccessfulLogin(user.id);

  const auth = await loadAuthContext(user.tenantId, user.id);
  const session = await issueSession(auth, request);

  return {
    ...session,
    userId: user.id,
    tenantId: user.tenantId,
    // Reported so the UI can nudge, not enforced. Blocking sign-in on an
    // unverified address before email delivery works (Phase 6) would lock
    // everyone out of their own new account.
    requiresEmailVerification: user.emailVerifiedAt === null,
  };
}
