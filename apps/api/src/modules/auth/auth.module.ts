import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { OAuthController } from './oauth.controller.js';
import { AuthService } from './auth.service.js';
import { OAuthService } from './oauth.service.js';
import { AuthRepository } from './auth.repository.js';
import { TokenService } from './token.service.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { PermissionGuard } from '../../common/guards/permission.guard.js';

/**
 * Registers auth services and wires the global guard chain in order:
 * AuthGuard → TenantGuard → PermissionGuard (deny by default).
 */
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, OAuthController],
  providers: [
    AuthService,
    OAuthService,
    AuthRepository,
    TokenService,
    Reflector,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
