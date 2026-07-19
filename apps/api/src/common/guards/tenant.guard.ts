import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { AuthContext } from '@adysre/types';
import { IS_PUBLIC_KEY } from '../decorators/index.js';

/**
 * Ensures a tenant context exists before any permission check.
 * RBAC rule: "Check tenant before permissions." Runs after AuthGuard.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request & { auth?: AuthContext }>();
    if (!req.auth?.tenantId) {
      throw new ForbiddenException('Tenant context required');
    }
    return true;
  }
}
