import type { Category, ScanResult } from '../types';

/**
 * Scan history - the storage seam.
 *
 * Everything downstream (the API, the console) depends only on the `ScanStore`
 * interface, never on a concrete store. That is what makes persistence
 * swappable: an in-memory Map today, a JSON file for a single box, a Prisma /
 * Postgres table for production - each is one class implementing this contract,
 * chosen in `store.ts`. No caller changes when the backing store does.
 */

/** A stored scan: the result plus the identity a store gives it. */
export interface ScanRecord {
  id: string;
  /** Owning organization (shared-schema multi-tenancy). Every read/write is
   * partitioned by it, so one org can never see another's history. */
  tenantId: string;
  /** ISO timestamp the record was stored. */
  createdAt: string;
  /** Lower-cased host of the final URL, the key history is grouped by. */
  host: string;
  result: ScanResult;
}

/** The lightweight projection a list returns, so the wire stays small. */
export interface ScanSummary {
  id: string;
  createdAt: string;
  host: string;
  url: string;
  finalUrl: string;
  overallScore: number;
  findings: number;
}

/** One category's movement between two scans. */
export interface CategoryDelta {
  category: Category;
  delta: number;
}

/** How the current scan differs from the previous one of the same host. */
export interface ScanComparison {
  previousId: string;
  previousAt: string;
  /** current.overall − previous.overall. Positive is an improvement. */
  overallDelta: number;
  categoryDeltas: CategoryDelta[];
  /** Rule ids that fired before and no longer do. */
  resolved: string[];
  /** Rule ids that are new since the previous scan. */
  introduced: string[];
}

/** Filters for a list query. */
export interface ScanListQuery {
  /** Restrict to one host's history. */
  host?: string;
  /** Cap the number returned; omit for all. */
  limit?: number;
}

/**
 * The persistence contract. Implementations return records newest-first from
 * `list`, and `save` stamps the id and `createdAt`.
 *
 * Every method is scoped by `tenantId`: it is the org the caller is acting as,
 * resolved from the verified session, never from anything the client supplies.
 * `get` returns null for an id owned by another tenant (so a guessed id cannot
 * cross the org boundary), and `list` only ever sees the caller's own history.
 */
export interface ScanStore {
  save(tenantId: string, result: ScanResult, now?: Date): Promise<ScanRecord>;
  get(tenantId: string, id: string): Promise<ScanRecord | null>;
  list(tenantId: string, query?: ScanListQuery): Promise<ScanRecord[]>;
}
