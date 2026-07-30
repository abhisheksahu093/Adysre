import 'server-only';
import { randomBytes } from 'node:crypto';
import {
  createTenantWithOwner,
  findCandidatesByEmail,
  isSlugTaken,
  loadAuthContext,
  recordSuccessfulLogin,
} from '../repository/user.repository';
import { findLink, linkAccount, touchLink } from '../repository/oauth-account.repository';
import { issueSession, type IssuedSession, type RequestInfo } from './issue';
import type { OAuthProfile } from '../oauth/client';

/**
 * Turning a provider profile into a session.
 *
 * Mirrors `login.service` and `register.service` and shares their last two
 * steps (`loadAuthContext` then `issueSession`), so a session minted through
 * Google is indistinguishable from one minted with a password.
 *
 * ## Three ways in, in this order
 *
 * 1. **A known provider account.** `oauth_accounts` is checked first, on the
 *    provider's own id. This is what makes identity survive an email change:
 *    someone who renames their Google address still lands in their own
 *    workspace instead of being handed a new, empty one.
 * 2. **A verified email that already has an account.** The link is created and
 *    the user signs in. This is how existing password accounts adopt a
 *    provider, and how the first sign-in after this table was added works.
 * 3. **Neither.** A new workspace is created with this person as its Owner,
 *    and linked.
 *
 * ## Why verification only gates the second path
 *
 * Creating a link on an email match is a claim that two identities are the same
 * person, and the only evidence is the address. An unverified one proves
 * nothing: anyone able to put a victim's address on a throwaway provider
 * account would inherit that victim's workspace. Once the link exists it stands
 * on the provider account id, which the provider cannot be tricked into
 * misreporting, so step 1 needs no such check.
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
  /** True when this sign-in attached the provider to an existing account. */
  linked: boolean;
}

export async function signInWithOAuth(
  profile: OAuthProfile,
  request: RequestInfo = {},
): Promise<OAuthSignInResult> {
  // 1. A provider account we have seen before. No email involved at all.
  const link = await findLink(profile.provider, profile.providerAccountId);
  if (link) {
    if (!link.isActive) throw new OAuthAccountInactiveError();

    await touchLink(link.id);
    await recordSuccessfulLogin(link.userId);
    const session = await finish(link.tenantId, link.userId, request);
    return { ...session, created: false, linked: false };
  }

  // From here the address is the only evidence, so it has to be trustworthy.
  if (!profile.emailVerified || profile.email === '') {
    throw new OAuthEmailUnverifiedError();
  }

  const candidates = await findCandidatesByEmail(profile.email);

  // 2. An existing account with this address: adopt the provider.
  if (candidates.length > 1) {
    // Password sign-in answers this with a workspace picker. A provider
    // redirect has nowhere to ask, so it sends the user back to choose by
    // signing in with their email rather than guessing on their behalf.
    throw new OAuthAmbiguousError();
  }

  const existing = candidates[0];
  if (existing) {
    if (!existing.isActive) throw new OAuthAccountInactiveError();

    await linkAccount({
      tenantId: existing.tenantId,
      userId: existing.id,
      provider: profile.provider,
      providerAccountId: profile.providerAccountId,
      email: profile.email,
    });
    await recordSuccessfulLogin(existing.id);
    const session = await finish(existing.tenantId, existing.id, request);
    return { ...session, created: false, linked: true };
  }

  // 3. Nobody by that address: a new workspace, owned by this person.
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

  await linkAccount({
    tenantId,
    userId,
    provider: profile.provider,
    providerAccountId: profile.providerAccountId,
    email: profile.email,
  });

  const session = await finish(tenantId, userId, request);
  return { ...session, created: true, linked: true };
}

/** The last two steps, identical for all three paths. */
async function finish(
  tenantId: string,
  userId: string,
  request: RequestInfo,
): Promise<IssuedSession & { userId: string; tenantId: string }> {
  const auth = await loadAuthContext(tenantId, userId);
  const session = await issueSession(auth, request);
  return { ...session, userId, tenantId };
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
