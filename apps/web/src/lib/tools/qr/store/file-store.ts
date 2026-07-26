import 'server-only';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { ScanContext } from '../dynamic/scan-capture';
import { generateSlug } from '../dynamic/slug';
import type {
  CreateQrInput,
  ListQrQuery,
  QrRecord,
  QrScanRecord,
  QrStore,
  UpdateQrPatch,
} from './types';

interface FileShape {
  codes: QrRecord[];
  scans: QrScanRecord[];
}

/**
 * File-backed dynamic-QR store - codes and scans in one JSON document. Survives
 * a restart with no database; every call reads and writes the whole file, which
 * is fine at this scale but not concurrency-safe across processes (the Prisma
 * store is the answer there).
 */
export class FileQrStore implements QrStore {
  constructor(
    private readonly path: string,
    private readonly idFactory: () => string = randomUUID,
    private readonly slugFactory: () => string = generateSlug,
  ) {}

  private async read(): Promise<FileShape> {
    try {
      const parsed = JSON.parse(await readFile(this.path, 'utf8')) as Partial<FileShape>;
      return { codes: parsed.codes ?? [], scans: parsed.scans ?? [] };
    } catch {
      return { codes: [], scans: [] };
    }
  }

  private async write(data: FileShape): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(this.path, JSON.stringify(data), 'utf8');
  }

  async create(tenantId: string, input: CreateQrInput): Promise<QrRecord> {
    const data = await this.read();
    let slug = this.slugFactory();
    while (data.codes.some((c) => c.slug === slug)) slug = this.slugFactory();
    const now = new Date().toISOString();
    const record: QrRecord = {
      id: this.idFactory(),
      tenantId,
      slug,
      type: input.type,
      name: input.name,
      payload: input.payload,
      design: input.design,
      targetUrl: input.targetUrl,
      favorite: false,
      tags: input.tags ?? [],
      folderId: input.folderId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    data.codes.unshift(record);
    await this.write(data);
    return record;
  }

  async list(tenantId: string, query: ListQrQuery = {}): Promise<QrRecord[]> {
    const { codes } = await this.read();
    return codes.filter(
      (c) =>
        c.tenantId === tenantId &&
        (query.favorite === undefined || c.favorite === query.favorite) &&
        (query.folderId === undefined || c.folderId === query.folderId),
    );
  }

  async get(tenantId: string, id: string): Promise<QrRecord | null> {
    const record = (await this.read()).codes.find((c) => c.id === id);
    return record && record.tenantId === tenantId ? record : null;
  }

  async update(tenantId: string, id: string, patch: UpdateQrPatch): Promise<QrRecord | null> {
    const data = await this.read();
    const record = data.codes.find((c) => c.id === id && c.tenantId === tenantId);
    if (!record) return null;
    Object.assign(record, patch, { updatedAt: new Date().toISOString() });
    await this.write(data);
    return record;
  }

  async remove(tenantId: string, id: string): Promise<boolean> {
    const data = await this.read();
    const next = data.codes.filter((c) => !(c.id === id && c.tenantId === tenantId));
    if (next.length === data.codes.length) return false;
    await this.write({ codes: next, scans: data.scans.filter((s) => s.qrCodeId !== id) });
    return true;
  }

  async findBySlug(slug: string): Promise<QrRecord | null> {
    return (await this.read()).codes.find((c) => c.slug === slug) ?? null;
  }

  async recordScan(
    qrCodeId: string,
    tenantId: string,
    context: ScanContext,
    now: Date = new Date(),
  ): Promise<QrScanRecord> {
    const data = await this.read();
    const record: QrScanRecord = {
      id: this.idFactory(),
      tenantId,
      qrCodeId,
      scannedAt: now.toISOString(),
      ...context,
    };
    data.scans.unshift(record);
    await this.write(data);
    return record;
  }

  async listScans(tenantId: string, qrCodeId: string): Promise<QrScanRecord[]> {
    return (await this.read()).scans.filter((s) => s.tenantId === tenantId && s.qrCodeId === qrCodeId);
  }
}
