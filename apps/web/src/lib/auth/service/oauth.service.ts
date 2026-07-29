import 'server-only';
import { randomBytes } from 'node:crypto';
import {
  createTenantWithOwner,
  findCandidatesByEmail,
  isSlugTaken,
  loadAuthContext,
  recordSuccessfulLogin,
} from '../repository/user.repository';
import { issueSession, type IssuedSession, type RequestInfo } from './issue';
import type { OAuthProfile } from '../oauth/client';

/**
 * Turning a provider profile into a session.
 *
 * Mirrors `login.service` and `register.service` and shares their last two
 * steps (`loadAuthContext` then `issueSession`), so a session minted through
 * Google is indistinguishable from one minted with a password. Anything less
 * would mean two session shapes to keep in step.
 *
 * ## Accounts are matched by email, and that is a deliberate limit
 *
 * There is no table linking a provider account to a user, so `providerAccountId`
 * is carried through the flow and then dropped. A user who changes their
 * address at the provider therefore arrives as a stranger and gets a new
 * workspace. Fixing that needs a schema change (a `provider` +
 * `providerAccountId` unique pair), which is why this matches the behaviour
 * `apps/api` already shipped rather than inventing a third thing.
 *
 * What that limit makes non-negotiable is the verification check below: with
 * email as the only join key, an unverified address from a provider would let
 * anyone who can type a victim's address into a throwaway account walk into
 * that victim's workspace.
 */

/** The provider did not vouch for the address, so it cannot identify anyone. */
export class OAuthEmailUnverifiedError extends Error {
  constructor() {
    super('The provider did not confirm this email address.');
    this.name = 'OAuthEmailUnverifiedError';
  }
}

/** The address exists in more than one workspace; a redirect cannot ask which. */
export class OAuthAmbiguousError extends Error {
  constructor() {
    super('That email belongs to more than one workspace.');
    this.name = 'OAuthAmbiguousError';
  }
}

/** The matched account is disabled. */
export class OAuthAccountInactiveError extends Error {
  constructor() {
    super('That account is not active.');
    this.name = 'OAuthAccountInactiveError';
  }
}

export interface OAuthSignInResult extends IssuedSession {
  userId: string;
  tenantId: string;
  /** True when this sign-in created the workspace, for the audit trail. */
  created: boolean;
}

export async function signInWithOAuth(
  profile: OAuthProfile,
  request: RequestInfo = {},
): Promise<OAuthSignInResult> {
  // Checked before anything is looked up, so an unverified address never even
  // reveals whether an account exists by taking a different code path.
  if (!profile.emailVerified || profile.email === '') {
    throw new OAuthEmailUnverifiedError();
  }

  const candidates = await findCandidatesByEmail(profile.email);

  if (candidates.length > 1) {
    // Password sign-in answers this with a workspace picker. A provider
    // redirect has nowhere to ask, so it sends the user back to choose by
    // signing in with their email instead of guessing on their behalf.
    throw new OAuthAmbiguousError();
  }

  const existing = candidates[0];

  if (existing) {
    if (!existing.isActive) throw new OAuthAccountInactiveError();

    await recordSuccessfulLogin(existing.id);
    const auth = await loadAuthContext(existing.tenantId, existing.id);
    const session = await issueSession(auth, request);
    return { ...session, userId: existing.id, tenantId: existing.tenantId, created: false };
  }

  const name = profile.name.trim() || profile.email.split('@')[0] || 'Owner';
  const { userId, tenantId } = await createTenantWithOwner({
    email: profile.email,
    name,
    // No password at all, rather than a random one nobody knows: a random hash
    // would make `passwordHash` non-null and quietly tell every future check
    // that this account has a password it can be asked for.
    passwordHash: null,
    organizationName: `${name}'s Workspace`,
    organizationSlug: await uniqueSlug(name),
    // The provider already proved the address; asking again would be theatre.
    emailVerifiedAt: new Date(),
  });

  const auth = await loadAuthContext(tenantId, userId);
  const session = await issueSession(auth, request);
  return { ...session, userId, tenantId, created: true };
}

/**
 * A workspace slug that is free.
 *
 * Slugs are globally unique, and two people called Alex signing in with Google
 * on the same afternoon is not a rare event, so a name alone will collide. The
 * random suffix makes that vanishingly unlikely and the loop makes it
 * impossible; without the loop this would be a registration that fails with a
 * unique-constraint error the user can do nothing about.
 */
async function uniqueSlug(name: string): Promise<string> {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'workspace';

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = `${base}-${randomBytes(3).toString('hex')}`;
    if (!(await isSlugTaken(candidate))) return candidate;
  }

  // Five collisions on a 24-bit suffix means something is very wrong; a longer
  // suffix is still better than throwing away a valid sign-in.
  return `${base}-${randomBytes(8).toString('hex')}`;
}
