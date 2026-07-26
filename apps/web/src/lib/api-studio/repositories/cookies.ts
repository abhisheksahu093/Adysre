import 'server-only';
import { prisma } from '@adysre/database';
import type { CookieRecord } from '@/modules/api-studio/types';
import { createId } from '@/modules/api-studio/utils/ids';
import { decryptSecret, encryptSecret, isSecretStorageConfigured } from '../crypto';
import { canStore, selectCookies, type CookieJar } from '../runner/cookies';

/**
 * The persistent cookie jar.
 *
 * Values are encrypted with the same envelope as secret variables, because a
 * session cookie IS a credential: a jar in plaintext is a table of live logins
 * for every API anyone on the team has tested.
 *
 * When no encryption key is configured the jar degrades to reading nothing and
 * storing nothing, rather than falling back to plaintext. A request then simply
 * carries no cookies, which is visible and fixable; a silently plaintext jar is
 * neither.
 */

/** Rows to records, decrypting as it goes. Unreadable rows are skipped. */
function toRecords(
  rows: {
    name: string;
    valueCipher: string;
    domain: string;
    path: string;
    expiresAt: Date | null;
    secure: boolean;
    httpOnly: boolean;
    sameSite: string | null;
  }[],
): CookieRecord[] {
  const records: CookieRecord[] = [];

  for (const row of rows) {
    const value = decryptSecret(row.valueCipher);
    // Encrypted with a key this deployment no longer holds. Skipping is the
    // only honest option: sending an empty cookie would look like a logout.
    if (value === null) continue;

    records.push({
      name: row.name,
      value,
      domain: row.domain,
      path: row.path,
      expires: row.expiresAt ? row.expiresAt.getTime() : null,
      secure: row.secure,
      httpOnly: row.httpOnly,
      sameSite:
        row.sameSite === 'strict' || row.sameSite === 'lax' || row.sameSite === 'none'
          ? row.sameSite
          : null,
    });
  }

  return records;
}

/**
 * A jar backed by `api_studio_cookies`, scoped to one workspace.
 *
 * Matching rules come from `runner/cookies`, the same pure functions the
 * in-memory jar uses, so persistence changes where cookies live and never which
 * ones are sent.
 */
export function databaseJar(tenantId: string, workspaceId: string, userId: string | null): CookieJar {
  return {
    async read(url: URL): Promise<CookieRecord[]> {
      if (!isSecretStorageConfigured()) return [];

      const rows = await prisma.apiCookie.findMany({
        where: { tenantId, workspaceId, enabled: true },
      });
      return selectCookies(toRecords(rows), url);
    },

    async write(url: URL, cookies: readonly CookieRecord[]): Promise<void> {
      if (!isSecretStorageConfigured()) return;

      for (const cookie of cookies) {
        if (!canStore(cookie, url)) continue;

        const where = {
          workspaceId_domain_path_name: {
            workspaceId,
            domain: cookie.domain,
            path: cookie.path,
            name: cookie.name,
          },
        };

        // An expired cookie is a deletion: that is how a server logs someone
        // out, and storing it would keep the session alive locally.
        if (cookie.expires !== null && cookie.expires <= Date.now()) {
          await prisma.apiCookie.deleteMany({
            where: {
              tenantId,
              workspaceId,
              domain: cookie.domain,
              path: cookie.path,
              name: cookie.name,
            },
          });
          continue;
        }

        const data = {
          tenantId,
          workspaceId,
          domain: cookie.domain,
          path: cookie.path,
          name: cookie.name,
          valueCipher: encryptSecret(cookie.value),
          expiresAt: cookie.expires === null ? null : new Date(cookie.expires),
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite,
          enabled: true,
          updatedBy: userId,
        };

        await prisma.apiCookie.upsert({
          where,
          create: { id: createId(), createdBy: userId, ...data },
          update: data,
        });
      }
    },
  };
}

/** Every cookie in a workspace's jar, for the cookie editor. */
export async function listCookies(tenantId: string, workspaceId: string): Promise<CookieRecord[]> {
  const rows = await prisma.apiCookie.findMany({
    where: { tenantId, workspaceId },
    orderBy: [{ domain: 'asc' }, { path: 'asc' }, { name: 'asc' }],
  });
  return toRecords(rows);
}

/** Remove one cookie, or the whole jar when no cookie is named. */
export async function deleteCookies(
  tenantId: string,
  workspaceId: string,
  cookie?: { domain: string; path: string; name: string },
): Promise<number> {
  const result = await prisma.apiCookie.deleteMany({
    where: { tenantId, workspaceId, ...(cookie ?? {}) },
  });
  return result.count;
}
