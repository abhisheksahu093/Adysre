import { Injectable, NotFoundException } from '@nestjs/common';
import type { Paginated, UserDto } from '@adysre/types';
import { UsersRepository } from './users.repository.js';

/** User business logic. Maps Prisma rows to DTOs (never expose entities). */
@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<Paginated<UserDto>> {
    const { items, total } = await this.repo.list(tenantId, page, pageSize);
    return { items: items.map(toDto), page, pageSize, total };
  }

  async getById(tenantId: string, id: string): Promise<UserDto> {
    const user = await this.repo.findById(tenantId, id);
    if (!user) throw new NotFoundException('User not found');
    return toDto(user);
  }

  async remove(tenantId: string, id: string, actorId: string): Promise<void> {
    const result = await this.repo.softDelete(tenantId, id, actorId);
    if (result.count === 0) throw new NotFoundException('User not found');
  }
}

type UserRow = {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: Date | null;
};

function toDto(u: UserRow): UserDto {
  return {
    id: u.id,
    tenantId: u.tenantId,
    email: u.email,
    name: u.name,
    avatarUrl: u.avatarUrl,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
    createdBy: u.createdBy,
    updatedBy: u.updatedBy,
    deletedAt: u.deletedAt?.toISOString() ?? null,
  };
}
