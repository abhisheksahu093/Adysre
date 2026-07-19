import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { AuthContext } from '@adysre/types';
import { UsersService } from './users.service.js';
import { CurrentUser, RequirePermissions } from '../../common/decorators/index.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @RequirePermissions('org:user:read')
  async list(
    @CurrentUser() user: AuthContext,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    const result = await this.users.list(user.tenantId, Number(page), Number(pageSize));
    return {
      data: result.items,
      meta: { page: result.page, pageSize: result.pageSize, total: result.total },
    };
  }

  @Get(':id')
  @RequirePermissions('org:user:read')
  async getOne(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return { data: await this.users.getById(user.tenantId, id) };
  }

  @Delete(':id')
  @RequirePermissions('org:user:delete')
  async remove(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    await this.users.remove(user.tenantId, id, user.userId);
    return { data: { ok: true } };
  }
}
