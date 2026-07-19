import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import type { AuthContext, Permission } from '@adysre/types';

/** Marks a route as public — skips AuthGuard. */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Declares the permissions required for a route (checked by PermissionGuard). */
export const PERMISSIONS_KEY = 'requiredPermissions';
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/** Injects the authenticated principal populated by AuthGuard. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthContext => {
    return ctx.switchToHttp().getRequest().auth as AuthContext;
  },
);
