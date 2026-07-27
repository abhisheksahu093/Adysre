import 'server-only';
import type { AuthContext } from '@adysre/types';
import { generateRefreshToken, refreshTokenExpiry, signAccessToken } from '../tokens';
import { createSession } from '../repository/session.repository';

/**
 * Minting a signed-in session: the tokens, plus the row that makes the refresh
 * token revocable.
 *
 * Shared by register, login and refresh so the three cannot drift. A session
 * created with a different TTL or without its row is the kind of difference
 * that only shows up two weeks later when a token refuses to refresh.
 */

export interface IssuedSession {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}

export interface RequestInfo {
  ip?: string | null | undefined;
  userAgent?: string | null | undefined;
}

export async function issueSession(
  auth: AuthContext,
  request: RequestInfo = {},
): Promise<IssuedSession> {
  const refresh = generateRefreshToken();

  // The session row is written BEFORE the tokens are handed out. If the write
  // fails, the caller gets an error rather than a refresh token that can never
  // be redeemed because nothing on the server knows about it.
  const sessionId = await createSession({
    tenantId: auth.tenantId,
    userId: auth.userId,
    refreshTokenHash: refresh.hash,
    expiresAt: refreshTokenExpiry(),
    ip: request.ip,
    userAgent: request.userAgent,
  });

  return {
    accessToken: await signAccessToken(auth),
    refreshToken: refresh.token,
    sessionId,
  };
}
