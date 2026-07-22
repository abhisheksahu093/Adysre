import type { NorthgatePageId } from '@/data/templates/northgate-pay-content';

/**
 * NORTHGATE - the multipage link scheme, stated once.
 *
 * Pages are addressed by query string so the template can drive its own
 * navigation without a router: the preview route, a thumbnail and a downloaded
 * project all render the same `<a href="?page=...">`. Every section builds its
 * links through this helper, so changing the scheme is a one-line edit.
 */
export function northgateHref(page: NorthgatePageId): string {
  return `?page=${page}`;
}
