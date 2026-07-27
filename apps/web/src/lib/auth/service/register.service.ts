import 'server-only';
import type { RegisterInput } from '@adysre/validators';
import { hashPassword } from '../password';
import {
  createTenantWithOwner,
  findCandidatesByEmail,
  isSlugTaken,
  loadAuthContext,
} from '../repository/user.repository';
import { issueSession, type IssuedSession, type RequestInfo } from './issue';
import { EmailRegisteredError, SlugTakenError } from './errors';
import { sendVerificationLink } from './verification.service';

/**
 * Registration: a new tenant, its Owner, and a signed-in session.
 *
 * Registering creates a WORKSPACE, not just a user. Joining an existing tenant
 * happens by invitation, which is a later phase; this endpoint is the front
 * door for someone who has nothing yet.
 */

export interface RegisterResult extends IssuedSession {
  userId: string;
  tenantId: string;
}

export async function register(
  input: RegisterInput,
  request: RequestInfo = {},
): Promise<RegisterResult> {
  const slug = input.organizationSlug.toLowerCase();
  const email = input.email.toLowerCase();

  // Checked before hashing. bcrypt costs ~250ms, and there is no reason to
  // spend it on a request that is going to be refused anyway.
  if (await isSlugTaken(slug)) throw new SlugTakenError();

  // A new tenant cannot contain this address yet, so any hit means the person
  // already has an account somewhere and should sign in instead. This DOES
  // reveal that an address is registered. The alternative, always answering 201
  // and mailing "someone tried to register with your address", needs working
  // email delivery, which is Phase 6. Recorded in docs/API_ARCHITECTURE.md so
  // the trade is a decision rather than an oversight.
  const existing = await findCandidatesByEmail(email);
  if (existing.length > 0) throw new EmailRegisteredError();

  const passwordHash = await hashPassword(input.password);

  const { userId, tenantId } = await createTenantWithOwner({
    email,
    name: input.name,
    passwordHash,
    organizationName: input.organizationName,
    organizationSlug: slug,
  });

  // Read the context back from the database rather than assuming Owner with no
  // permissions. The token then says exactly what the database says, which is
  // the invariant every refresh also maintains.
  const auth = await loadAuthContext(tenantId, userId);
  const session = await issueSession(auth, request);

  // Issued HERE rather than in the route handler, so no path can create an
  // account with no way to confirm its address. An invite flow or a seeding
  // script that called this service would otherwise silently skip it, and the
  // resulting user has no route to verification at all.
  //
  // Never throws, and runs after the account and session exist, so a mail
  // outage cannot undo a successful registration.
  await sendVerificationLink({ tenantId, userId, email, name: input.name });

  return { ...session, userId, tenantId };
}
