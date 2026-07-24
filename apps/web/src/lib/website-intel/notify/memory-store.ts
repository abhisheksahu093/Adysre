import { randomUUID } from 'node:crypto';
import type { ChannelInput, ChannelStore, NotificationChannel } from './types';

/**
 * In-memory channel store - the default. Process-local; the file (and future
 * Prisma) store cover shared/persistent cases. `idFactory` is injectable so
 * tests are deterministic.
 */
export class MemoryChannelStore implements ChannelStore {
  private readonly records: NotificationChannel[] = [];

  constructor(private readonly idFactory: () => string = randomUUID) {}

  async create(
    tenantId: string,
    input: ChannelInput,
    now: Date = new Date(),
  ): Promise<NotificationChannel> {
    const record: NotificationChannel = {
      id: this.idFactory(),
      tenantId,
      type: input.type,
      target: input.target,
      active: true,
      createdAt: now.toISOString(),
    };
    this.records.unshift(record);
    return record;
  }

  async get(tenantId: string, id: string): Promise<NotificationChannel | null> {
    const record = this.records.find((r) => r.id === id);
    return record && record.tenantId === tenantId ? record : null;
  }

  async list(tenantId: string): Promise<NotificationChannel[]> {
    return this.records.filter((r) => r.tenantId === tenantId);
  }

  async remove(tenantId: string, id: string): Promise<boolean> {
    const index = this.records.findIndex((r) => r.id === id && r.tenantId === tenantId);
    if (index === -1) return false;
    this.records.splice(index, 1);
    return true;
  }
}
