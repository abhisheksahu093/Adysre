import 'server-only';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { ScheduleInput, SchedulePatch, ScheduleRecord, ScheduleStore } from './types';
import { nextRun } from './cadence';

/**
 * File-backed schedule store - one JSON array on disk. Survives a restart with
 * no database; reads and writes go through the file each call, which is fine at
 * schedule scale but not concurrency-safe across processes (the Prisma store is
 * the answer there).
 */
export class FileScheduleStore implements ScheduleStore {
  constructor(
    private readonly path: string,
    private readonly idFactory: () => string = randomUUID,
  ) {}

  private async readAll(): Promise<ScheduleRecord[]> {
    try {
      const parsed: unknown = JSON.parse(await readFile(this.path, 'utf8'));
      return Array.isArray(parsed) ? (parsed as ScheduleRecord[]) : [];
    } catch {
      return [];
    }
  }

  private async writeAll(records: ScheduleRecord[]): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(this.path, JSON.stringify(records), 'utf8');
  }

  async create(
    tenantId: string,
    input: ScheduleInput,
    now: Date = new Date(),
  ): Promise<ScheduleRecord> {
    const record: ScheduleRecord = {
      id: this.idFactory(),
      tenantId,
      url: input.url,
      cadence: input.cadence,
      active: true,
      createdAt: now.toISOString(),
      lastRunAt: null,
      nextRunAt: nextRun(input.cadence, now),
      lastScanId: null,
    };
    const records = await this.readAll();
    records.unshift(record);
    await this.writeAll(records);
    return record;
  }

  async get(tenantId: string, id: string): Promise<ScheduleRecord | null> {
    const record = (await this.readAll()).find((r) => r.id === id);
    return record && record.tenantId === tenantId ? record : null;
  }

  async list(tenantId: string): Promise<ScheduleRecord[]> {
    return (await this.readAll()).filter((r) => r.tenantId === tenantId);
  }

  async listAll(): Promise<ScheduleRecord[]> {
    return this.readAll();
  }

  async update(
    tenantId: string,
    id: string,
    patch: SchedulePatch,
  ): Promise<ScheduleRecord | null> {
    const records = await this.readAll();
    const record = records.find((r) => r.id === id && r.tenantId === tenantId);
    if (!record) return null;
    Object.assign(record, patch);
    await this.writeAll(records);
    return record;
  }

  async remove(tenantId: string, id: string): Promise<boolean> {
    const records = await this.readAll();
    const next = records.filter((r) => !(r.id === id && r.tenantId === tenantId));
    if (next.length === records.length) return false;
    await this.writeAll(next);
    return true;
  }
}
