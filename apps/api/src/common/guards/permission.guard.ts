import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { AuthContext, Permission } from '@adysre/types';
import { PERMISSIONS_KEY } from '../decorators/index.js';

/**
 * Enforces `@RequirePermissions(...)`. Deny by default: a route with required
 * permissions rejects unless the principal holds every one. Runs last.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<Request & { auth?: AuthContext }>();
    const held = new Set(req.auth?.permissions ?? []);
    const owner = req.auth?.roles.includes('Owner');

    const ok = owner || required.every((p) => held.has(p));
    if (!ok) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
