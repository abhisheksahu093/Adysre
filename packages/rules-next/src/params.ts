import { RULE_KINDS, RULE_STATUSES, type RuleQuery } from '@adysre/rules-types';
import type { ResponseMeta } from './responses.ts';

/**
 * A query string, as a `RuleQuery`.
 *
 * `documents/API_STANDARDS.md` says filtering is `?filter[field]=value`,
 * sorting is `?sort=field:direction` and pagination is `page` and `pageSize`.
 * The storage contract, meanwhile, speaks `limit` and `offset`. Something has
 * to translate, and doing it here rather than in each handler is what keeps
 * "page 2" meaning the same thing on every route.
 *
 * Nothing here throws or reports. An unreadable parameter is IGNORED rather
 * than rejected: a caller who sends `page=banana` has made a mistake that
 * page 1 answers perfectly well, and a 400 on a malformed query string is a
 * screen that shows nothing because a stale bookmark had a typo in it.
 *
 * The exception is a filter value that is not a real kind or status. Those are
 * closed sets, and silently ignoring one would answer with the whole list -
 * which reads as "the filter does nothing" rather than "you asked for
 * something that does not exist".
 */

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 200;

export interface ParsedQuery {
  query: RuleQuery;
  page: number;
  pageSize: number;
  /** Set when a closed-set filter named something that does not exist. */
  error?: string;
}

function positiveInt(raw: string | null, fallback: number, max?: number): number {
  if (raw === null) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  const value = Math.floor(parsed);
  return max === undefined ? value : Math.min(value, max);
}

export function queryFromParams(params: URLSearchParams): ParsedQuery {
  const page = positiveInt(params.get('page'), 1);
  // Capped, so one request cannot ask a store for every rule it has.
  const pageSize = positiveInt(params.get('pageSize'), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  const query: RuleQuery = {
    limit: pageSize,
    offset: (page - 1) * pageSize,
  };

  const kind = params.get('filter[kind]');
  if (kind !== null && kind !== '') {
    if (!RULE_KINDS.includes(kind as (typeof RULE_KINDS)[number])) {
      return { query, page, pageSize, error: `"${kind}" is not a rule kind.` };
    }
    query.kind = kind as (typeof RULE_KINDS)[number];
  }

  const status = params.get('filter[status]');
  if (status !== null && status !== '') {
    if (!RULE_STATUSES.includes(status as (typeof RULE_STATUSES)[number])) {
      return { query, page, pageSize, error: `"${status}" is not a rule status.` };
    }
    query.status = status as (typeof RULE_STATUSES)[number];
  }

  // Comma separated, and repeatable: `filter[tags]=a,b` and `filter[tags]=a&
  // filter[tags]=b` mean the same thing, because both are what a caller
  // reasonably writes and refusing either would be a distinction without one.
  const tags = params
    .getAll('filter[tags]')
    .flatMap((value) => value.split(','))
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '');
  if (tags.length > 0) query.tags = tags;

  const search = params.get('search') ?? params.get('filter[search]');
  if (search !== null && search.trim() !== '') query.search = search.trim();

  return { query, page, pageSize };
}

export function metaFor(page: number, pageSize: number, total: number): ResponseMeta {
  return { page, pageSize, total };
}

/**
 * `sort=updatedAt:desc`, as a field and a direction.
 *
 * Parsed but not obeyed by the storage contract, which orders by recency and
 * breaks ties by id - an order chosen so paging cannot show a rule twice.
 * Reading the parameter anyway means a handler can pass it to an adapter that
 * DOES support ordering, and means a caller sending it gets a documented answer
 * rather than silence.
 */
export interface SortOrder {
  field: string;
  direction: 'asc' | 'desc';
}

export function sortFromParams(params: URLSearchParams): SortOrder | undefined {
  const raw = params.get('sort');
  if (raw === null || raw.trim() === '') return undefined;

  const [field, direction] = raw.split(':');
  if (field === undefined || field.trim() === '') return undefined;

  return { field: field.trim(), direction: direction === 'asc' ? 'asc' : 'desc' };
}
