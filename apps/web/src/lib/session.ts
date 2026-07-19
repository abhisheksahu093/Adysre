import { api } from './api-client';
import type { AccessLevel } from './access';

/**
 * The signed-in user shown in the profile menu.
 *
 * TODO(auth): replace the demo fallback with a real `GET /me` call once the API
 * is running. `fetchProfile` already targets the SDK; it falls back to the
 * seeded demo Owner so the UI is usable before the backend is up.
 */
export interface SessionUser {
  name: string;
  email: string;
  /**
   * Org role - what you may administer (Owner/Admin/Member).
   * Deliberately separate from `accessLevel`: an Owner on the free plan still
   * can't copy premium prompts, and a Member on a Team plan can.
   */
  role: string;
  /** What the user has paid for. Drives the prompt paywall. */
  accessLevel: AccessLevel;
}

export const DEMO_USER: SessionUser = {
  name: 'Demo Owner',
  email: 'owner@demo.test',
  role: 'Owner',
  // Free by default. If the profile call fails, denying is the safe answer -
  // a fallback must never hand out paid content.
  accessLevel: 'free',
};

export async function fetchProfile(): Promise<SessionUser> {
  try {
    const profile = await api.me.profile();
    return {
      name: profile.name,
      email: profile.email,
      role: 'Member',
      // TODO(billing): read the real entitlement from the profile once the API
      // returns one. Until then assume the least, never the most.
      accessLevel: 'free',
    };
  } catch {
    return DEMO_USER;
  }
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
