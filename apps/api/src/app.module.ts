import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';

/**
 * Modular monolith root. Feature modules are registered here. Additional core
 * modules per BACKEND_ARCHITECTURE.md (Organization, Role, Permission,
 * Dashboard, Notification, Audit, Files, Settings, AI) are scaffolded
 * incrementally — see docs/MODULES.md.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
