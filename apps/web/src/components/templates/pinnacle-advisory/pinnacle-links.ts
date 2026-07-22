import type { PinnaclePageId } from '@/data/templates/pinnacle-advisory-content';

/**
 * PINNACLE - the multipage link scheme, stated once.
 *
 * Pages are addressed by query string so the template drives its own navigation
 * without a router: the preview route, a card thumbnail and a downloaded project
 * all render the same `<a href="?page=...">`. Every section builds its links
 * through this helper, so changing the scheme is a one-line edit.
 */
export function pinnacleHref(page: PinnaclePageId): string {
  return `?page=${page}`;
}
