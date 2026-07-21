import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import type { AuthContext } from '@adysre/types';
import { accessTokenSecret } from '../../common/config/jwt-secret';

/** Issues/verifies JWT access tokens and generates/hashes refresh tokens. */
@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async signAccessToken(auth: AuthContext): Promise<string> {
    return this.jwt.signAsync(
      {
        sub: auth.userId,
        tenantId: auth.tenantId,
        roles: auth.roles,
        permissions: auth.permissions,
      },
      {
        secret: accessTokenSecret(),
        expiresIn: Number(process.env.JWT_ACCESS_TTL ?? 900),
      },
    );
  }

  /** Opaque refresh token; only its hash is persisted (rotation). */
  generateRefreshToken(): { token: string; hash: string } {
    const token = randomBytes(48).toString('base64url');
    return { token, hash: this.hashRefreshToken(token) };
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  get refreshTtlMs(): number {
    return Number(process.env.JWT_REFRESH_TTL ?? 1_209_600) * 1000;
  }
}
