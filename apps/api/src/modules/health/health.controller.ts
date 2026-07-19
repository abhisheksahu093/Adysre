import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { PrismaClient } from '@adysre/database';
import { PRISMA } from '../../common/prisma/prisma.module.js';
import { Public } from '../../common/decorators/index.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  @Public()
  @Get()
  async check() {
    let database = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = 'up';
    } catch {
      database = 'down';
    }
    return { data: { status: 'ok', database, uptime: process.uptime() } };
  }
}
