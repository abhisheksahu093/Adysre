import 'server-only';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { ChannelInput, ChannelStore, NotificationChannel } from './types';

/**
 * File-backed channel store - one JSON array on disk. Survives a restart with
 * no database; reads and writes go through the file each call (fine at channel
 * scale, not concurrency-safe across processes - the Prisma store is the answer
 * there).
 */
export class FileChannelStore implements ChannelStore {
  constructor(
    private readonly path: string,
    private readonly idFactory: () => string = randomUUID,
  ) {}

  private async readAll(): Promise<NotificationChannel[]> {
    try {
      const parsed: unknown = JSON.parse(await readFile(this.path, 'utf8'));
      return Array.isArray(parsed) ? (parsed as NotificationChannel[]) : [];
    } catch {
      return [];
    }
  }

  private async writeAll(records: NotificationChannel[]): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(this.path, JSON.stringify(records), 'utf8');
  }

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
    const records = await this.readAll();
    records.unshift(record);
    await this.writeAll(records);
    return record;
  }

  async get(tenantId: string, id: string): Promise<NotificationChannel | null> {
    const record = (await this.readAll()).find((r) => r.id === id);
    return record && record.tenantId === tenantId ? record : null;
  }

  async list(tenantId: string): Promise<NotificationChannel[]> {
    return (await this.readAll()).filter((r) => r.tenantId === tenantId);
  }

  async remove(tenantId: string, id: string): Promise<boolean> {
    const records = await this.readAll();
    const next = records.filter((r) => !(r.id === id && r.tenantId === tenantId));
    if (next.length === records.length) return false;
    await this.writeAll(next);
    return true;
  }
}
