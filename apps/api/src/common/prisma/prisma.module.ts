import { Global, Module } from '@nestjs/common';
import { prisma } from '@adysre/database';

export const PRISMA = Symbol('PRISMA');

/** Provides the shared Prisma client. Only repositories should inject it. */
@Global()
@Module({
  providers: [{ provide: PRISMA, useValue: prisma }],
  exports: [PRISMA],
})
export class PrismaModule {}
