import type { RuleDocument, RuleQuery, RuleSummary } from '@adysre/rules-types';

/**
 * Listing rules: filtering, ordering, paging.
 *
 * Defined once, here, for the same reason comparison semantics are defined once
 * in the executor. Every adapter has to answer `list({ tags: ['orders'] })`, and
 * three adapters each deciding for themselves whether that means "has all of
 * these tags" or "has any of them" is a system where moving from the in-memory
 * store to the database quietly changes which rules a screen shows.
 *
 * An adapter backed by a database will translate most of this into SQL rather
 * than call it. That is fine and expected - what matters is that this file is
 * the specification it is translating, and the conformance suite is what checks
 * it arrived at the same answer.
 */

/** Enough of a rule to list it without loading its tree. */
export function summarise(rule: RuleDocument): RuleSummary {
  return {
    id: rule.id,
    ...(rule.key === undefined ? {} : { key: rule.key }),
    name: rule.name,
    kind: rule.kind,
    status: rule.status,
    version: rule.version,
    updatedAt: rule.metadata.updatedAt,
    tags: rule.tags,
  };
}

/**
 * What `search` looks at: the fields that IDENTIFY a rule.
 *
 * Name, business key and tags, and deliberately not the description. A
 * description is prose, and a search that matches prose returns most of the
 * list for most words - which teaches people the search box does not work and
 * to scroll instead.
 */
function searchable(summary: RuleSummary): string {
  return [summary.name, summary.key ?? '', ...summary.tags].join(' ').toLowerCase();
}

export function matchesQuery(summary: RuleSummary, query: RuleQuery = {}): boolean {
  if (query.kind !== undefined && summary.kind !== query.kind) return false;
  if (query.status !== undefined && summary.status !== query.status) return false;

  if (query.tags !== undefined && query.tags.length > 0) {
    // ALL of them, not any. A tag filter is something people reach for to
    // narrow a list, and one that widened it as they added tags would be
    // read as broken long before it was read as a union.
    const has = new Set(summary.tags);
    if (!query.tags.every((tag) => has.has(tag))) return false;
  }

  if (query.search !== undefined && query.search.trim() !== '') {
    if (!searchable(summary).includes(query.search.trim().toLowerCase())) return false;
  }

  return true;
}

/**
 * Most recently changed first, ties broken by id.
 *
 * The tiebreak is not decoration. Two rules saved in the same millisecond is
 * ordinary, and a list whose order depends on which one the adapter happened to
 * iterate first pages differently on two machines - so an item can appear twice
 * across two pages, or never.
 */
export function byRecency(left: RuleSummary, right: RuleSummary): number {
  const time = right.updatedAt.localeCompare(left.updatedAt);
  return time !== 0 ? time : left.id.localeCompare(right.id);
}

/** How many rules a list returns when nobody said. */
export const DEFAULT_LIMIT = 50;

export function applyQuery(
  summaries: readonly RuleSummary[],
  query: RuleQuery = {},
): RuleSummary[] {
  const matched = summaries.filter((summary) => matchesQuery(summary, query)).sort(byRecency);

  const offset = Math.max(0, query.offset ?? 0);
  const limit = Math.max(0, query.limit ?? DEFAULT_LIMIT);

  return matched.slice(offset, offset + limit);
}

/** How many rules match, ignoring the page. What a pager needs. */
export function countMatching(summaries: readonly RuleSummary[], query: RuleQuery = {}): number {
  return summaries.filter((summary) => matchesQuery(summary, query)).length;
}
