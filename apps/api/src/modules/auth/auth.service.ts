import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { randomBytes } from 'node:crypto';
import type { AuthContext, Permission, SystemRole } from '@adysre/types';
import type { LoginInput, RegisterInput } from '@adysre/validators';
import { AuthRepository } from './auth.repository.js';
import { TokenService } from './token.service.js';
import type { OAuthProfile } from './oauth.service.js';

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  auth: AuthContext;
}

/** Auth business logic. Thin controller, no Prisma here (repository owns it). */
@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly tokens: TokenService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const passwordHash = await argon2.hash(input.password);
    try {
      const { organization, user } = await this.repo.registerTenant({
        organizationName: input.organizationName,
        organizationSlug: input.organizationSlug,
        email: input.email,
        name: input.name,
        passwordHash,
      });
      const auth: AuthContext = {
        userId: user.id,
        tenantId: organization.id,
        roles: ['Owner'],
        permissions: [],
      };
      return this.issue(auth);
    } catch (err) {
      if (isUniqueViolation(err)) throw new ConflictException('Organization or email already exists');
      throw err;
    }
  }

  async login(tenantId: string, input: LoginInput): Promise<AuthResult> {
    const user = await this.repo.findUserByEmail(tenantId, input.email);
    if (!user?.passwordHash || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await argon2.verify(user.passwordHash, input.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issue(this.toAuthContext(user));
  }

  /**
   * OAuth sign-in and sign-up in one path.
   *
   * If a verified provider email already matches an active account, that user
   * is logged in - so signing in with Google and having registered with the
   * same address land on the same account. Otherwise a fresh organization is
   * created with this person as its Owner, mirroring email registration but
   * without a password (they authenticate through the provider from now on).
   *
   * Linking to an existing account is gated on `emailVerified`: trusting an
   * unverified provider email would let anyone claim an account by that address.
   */
  async loginOrCreateWithOAuth(profile: OAuthProfile): Promise<AuthResult> {
    const existing = await this.repo.findActiveUserByEmailGlobal(profile.email);
    if (existing) {
      if (!profile.emailVerified) {
        throw new UnauthorizedException('Provider did not verify this email address');
      }
      return this.issue(this.toAuthContext(existing));
    }

    const emailLocalPart = profile.email.split('@')[0] ?? profile.email;
    const name = profile.name.trim() || emailLocalPart;
    const { organization, user } = await this.repo.registerTenant({
      organizationName: `${name}'s Workspace`,
      organizationSlug: oauthSlug(name),
      email: profile.email,
      name,
      // Provider-authenticated: no local password to store.
      passwordHash: null,
    });
    const auth: AuthContext = {
      userId: user.id,
      tenantId: organization.id,
      roles: ['Owner'],
      permissions: [],
    };
    return this.issue(auth);
  }

  async refresh(tenantId: string, refreshToken: string): Promise<AuthResult> {
    const hash = this.tokens.hashRefreshToken(refreshToken);
    const session = await this.repo.findValidSession(tenantId, hash);
    if (!session) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.repo.findUserById(session.userId);
    if (!user?.isActive) throw new UnauthorizedException('User inactive');

    // Rotate: issue a new refresh token and update the existing session.
    const next = this.tokens.generateRefreshToken();
    await this.repo.rotateSession(session.id, next.hash, new Date(Date.now() + this.tokens.refreshTtlMs));
    const auth = this.toAuthContext(user);
    const accessToken = await this.tokens.signAccessToken(auth);
    return { accessToken, refreshToken: next.token, auth };
  }

  async logout(tenantId: string, refreshToken: string): Promise<void> {
    const hash = this.tokens.hashRefreshToken(refreshToken);
    const session = await this.repo.findValidSession(tenantId, hash);
    if (session) await this.repo.revokeSession(session.id);
  }

  private async issue(auth: AuthContext): Promise<AuthResult> {
    const accessToken = await this.tokens.signAccessToken(auth);
    const refresh = this.tokens.generateRefreshToken();
    await this.repo.createSession({
      tenantId: auth.tenantId,
      userId: auth.userId,
      refreshTokenHash: refresh.hash,
      expiresAt: new Date(Date.now() + this.tokens.refreshTtlMs),
    });
    return { accessToken, refreshToken: refresh.token, auth };
  }

  private toAuthContext(user: UserWithRoles): AuthContext {
    const roles = user.userRoles.map((ur) => ur.role.name as SystemRole);
    const permissions = user.userRoles.flatMap((ur) =>
      ur.role.rolePermissions.map((rp) => rp.permission.key as Permission),
    );
    return {
      userId: user.id,
      tenantId: user.tenantId,
      roles,
      permissions: [...new Set(permissions)],
    };
  }
}

interface UserWithRoles {
  id: string;
  tenantId: string;
  userRoles: {
    role: { name: string; rolePermissions: { permission: { key: string } }[] };
  }[];
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === 'P2002';
}

/**
 * A workspace slug for an OAuth signup. Derived from the person's name plus a
 * short random suffix, so two "Jane Doe"s never collide on the unique slug and
 * we avoid a check-then-insert race.
 */
function oauthSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const suffix = randomBytes(3).toString('hex');
  return `${base || 'workspace'}-${suffix}`;
}
