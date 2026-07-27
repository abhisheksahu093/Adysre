import 'server-only';
import { Prisma, prisma, notDeleted } from '@adysre/database';
import type { Enforcement } from './types';

/**
 * How many of a stock-metered thing a workspace currently has.
 *
 * A stock limit is a ceiling on live rows, so it is counted from the table that
 * owns them rather than from the usage log. That is what makes deleting a
 * collection free the slot, which is the behaviour anyone would expect and the
 * usage log cannot provide.
 *
 * A feature with no counter here cannot be enforced on the server, and the
 * registry says so explicitly rather than defaulting to something that looks
 * like enforcement.
 */

/**
 * Counts on whichever client the caller supplies.
 *
 * Inside a transaction it MUST be the transaction client: a count on the global
 * client would need a second connection while the first is held, which
 * deadlocks at `connection_limit=1`.
 */
type Db = Prisma.TransactionClient | typeof prisma;
type StockCounter = (tenantId: string, db: Db) => Promise<number>;

/**
 * Server-side counters, one per stock feature that has server-owned rows.
 *
 * `builder.pages` is deliberately absent: the page builder keeps its document
 * in the browser (zustand with localStorage), never posts it anywhere, and so
 * there is nothing on the server to count. See `ENFORCEMENT` below.
 */
const STOCK_COUNTERS: Record<string, StockCounter> = {
  'api-studio.collections': (tenantId, db) =>
    db.apiCollection.count({ where: { tenantId, ...notDeleted } }),

  'design-playground.projects': (tenantId, db) =>
    db.designProject.count({ where: { tenantId, ...notDeleted } }),
};

/**
 * Which features the server can actually refuse.
 *
 * Everything not listed is `client-reported`: the work happens in the browser,
 * the client asks to consume before doing it, and the server records and
 * denies. Someone editing the page's JavaScript bypasses that.
 *
 * This is a fact about the product, not a shortcut. The Tool Suite is
 * local-only by design (see CLAUDE.md) and the AI tools process images
 * on-device, so no server resource is consumed by a bypass. Turning these into
 * genuinely enforceable limits means moving the work to a server, which is a
 * product decision rather than a patch.
 */
const SERVER_ENFORCED = new Set([
  // These already require a request that writes a row, so the quota is checked
  // on the path that does the work.
  'api-studio.collections',
  'design-playground.projects',
  'website-intel.scan',
]);

export function enforcementFor(featureKey: string): Enforcement {
  return SERVER_ENFORCED.has(featureKey) ? 'server' : 'client-reported';
}

/** Whether this feature's stock can be counted server-side. */
export function hasStockCounter(featureKey: string): boolean {
  return featureKey in STOCK_COUNTERS;
}

/**
 * Count the live rows a stock limit applies to.
 *
 * Returns null when there is no counter, which the service reports as usage it
 * cannot measure rather than as zero. Zero would be worse than useless: it
 * would report "0 of 5 used" for a workspace that has fifty, and the UI would
 * confidently invite them to create more.
 */
export async function countStock(
  featureKey: string,
  tenantId: string,
  db: Db = prisma,
): Promise<number | null> {
  const counter = STOCK_COUNTERS[featureKey];
  if (!counter) return null;
  return counter(tenantId, db);
}
