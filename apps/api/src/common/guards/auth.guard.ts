import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { AuthContext } from '@adysre/types';
import { IS_PUBLIC_KEY } from '../decorators/index.js';

/**
 * Validates the JWT access token (from HTTP-only cookie) and attaches the
 * AuthContext to the request. First guard in the chain.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request & { auth?: AuthContext }>();
    const token = req.cookies?.['access_token'] ?? this.fromHeader(req);
    if (!token) throw new UnauthorizedException('Missing access token');

    try {
      const payload = await this.jwt.verifyAsync<AuthContext & { sub: string }>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      req.auth = {
        userId: payload.sub ?? payload.userId,
        tenantId: payload.tenantId,
        roles: payload.roles ?? [],
        permissions: payload.permissions ?? [],
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private fromHeader(req: Request): string | undefined {
    const header = req.headers.authorization;
    return header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  }
}
