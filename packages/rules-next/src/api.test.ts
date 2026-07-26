import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  all,
  builtinPlugins,
  condition,
  createRegistry,
  field,
  literal,
  rule,
  sequentialIds,
} from '@adysre/rules-core';
import { createMemoryStorage } from '@adysre/rules-storage';
import type { RuleDocument, RuleOutcome, RuleSummary } from '@adysre/rules-types';

import {
  createRuleApi,
  nextRoute,
  queryFromParams,
  ruleAction,
  sortFromParams,
  type Authorize,
  type RuleApi,
} from './index.ts';

/**
 * The API, driven end to end without a server.
 *
 * Handlers are `(Request) => Response`, so a test builds a real `Request` and
 * reads a real `Response`. No Next, no listening socket, no mocking of either -
 * which is the practical payoff of staying on the Web standard, and the reason
 * these are integration tests rather than unit tests around a shape.
 */

const ids = sequentialIds();
const FIXED = Date.parse('2026-01-01T00:00:00.000Z');
const registry = createRegistry(builtinPlugins);

function sample(overrides: Partial<RuleDocument> = {}): RuleDocument {
  const options = { ids, now: () => FIXED };
  return {
    ...rule(
      {
        name: 'Large orders',
        kind: 'validation',
        tags: ['orders'],
        when: all(
          [
            condition(
              { left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] },
              options,
            ),
          ],
          options,
        ),
      },
      options,
    ),
    ...overrides,
  };
}

const allow: Authorize = () => ({ allowed: true, actor: 'user_1' });

function apiWith(authorize: Authorize = allow): RuleApi {
  return createRuleApi({
    storage: createMemoryStorage({ now: () => FIXED }),
    registry,
    authorize,
    // Faults are the host's to log; a test must not print them.
    onError: () => undefined,
    now: () => FIXED,
  });
}

function get(url: string): Request {
  return new Request(url);
}

function post(url: string, body: unknown): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

interface Envelope<T> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
  meta?: { page?: number; pageSize?: number; total?: number };
}

async function read<T>(response: Response): Promise<Envelope<T>> {
  return (await response.json()) as Envelope<T>;
}

describe('the envelope', () => {
  it('answers in the shape the rest of the platform does', async () => {
    const api = apiWith();
    const response = await api.save(post('http://x/rules', sample()));
    const body = await read<RuleDocument>(response);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
    assert.equal(body.success, true);
    assert.equal(body.data?.version, 1);
  });

  it('reports a failure with a stable code, not just a status', async () => {
    const api = apiWith();
    const body = await read(await api.save(post('http://x/rules', { not: 'a rule' })));

    assert.equal(body.success, false);
    assert.equal(body.code, 'VALIDATION_ERROR');
  });
});

describe('authorization', () => {
  it('refuses when the host says no', async () => {
    const api = apiWith(() => ({ allowed: false }));
    const response = await api.list(get('http://x/rules'));

    assert.equal(response.status, 403);
    assert.equal((await read(response)).code, 'FORBIDDEN');
  });

  it('answers 401 when the host asks for one', async () => {
    const api = apiWith(() => ({ allowed: false, status: 401 }));
    assert.equal((await api.list(get('http://x/rules'))).status, 401);
  });

  it('treats a thrown check as a refusal, never as a pass', async () => {
    // A database blip or an expired key inside the host's check must not fall
    // open. The only failure worse than refusing a legitimate request is
    // admitting an illegitimate one.
    const api = apiWith(() => {
      throw new Error('the session store is down');
    });

    assert.equal((await api.list(get('http://x/rules'))).status, 403);
  });

  it('is asked about the specific rule, not just the route', async () => {
    const seen: string[] = [];
    const api = apiWith((_request, action) => {
      if ('id' in action) seen.push(`${action.type}:${action.id}`);
      return { allowed: true };
    });

    const saved = await read<RuleDocument>(await api.save(post('http://x/rules', sample())));
    const id = saved.data?.id ?? '';
    await api.get(get(`http://x/rules/${id}`), { id });
    await api.remove(new Request(`http://x/rules/${id}`, { method: 'DELETE' }), { id });

    assert.deepEqual(seen, [`write:${id}`, `read:${id}`, `delete:${id}`]);
  });

  it('checks before it reads, and before it writes', async () => {
    const api = apiWith(() => ({ allowed: false }));
    // A refused save must not have reached storage; the store is empty either
    // way, so the check is that nothing 500s and nothing is stored.
    assert.equal((await api.save(post('http://x/rules', sample()))).status, 403);

    const open = apiWith();
    assert.deepEqual((await read<RuleSummary[]>(await open.list(get('http://x/rules')))).data, []);
  });

  it('records who saved it', async () => {
    const api = apiWith();
    const body = await read<RuleDocument>(await api.save(post('http://x/rules', sample())));

    assert.equal(body.data?.metadata.updatedBy, 'user_1');
  });
});

describe('saving', () => {
  it('refuses a body that is not JSON', async () => {
    const api = apiWith();
    const request = new Request('http://x/rules', { method: 'POST', body: '{not json' });

    assert.equal((await api.save(request)).status, 400);
  });

  it('refuses a rule naming an operator this deployment does not have', async () => {
    // Storing it would move the failure from a clear message here to an
    // `errored` verdict at three in the morning.
    const api = apiWith();
    const broken = sample({
      when: all([condition({ left: field('a'), operator: 'noSuchOperator', args: [] }, { ids })], {
        ids,
      }),
    });

    const body = await read(await api.save(post('http://x/rules', broken)));
    assert.equal(body.success, false);
    assert.ok(body.message?.includes('noSuchOperator'));
  });

  it('refuses a document written by a newer engine', async () => {
    const api = apiWith();
    const body = await read(
      await api.save(post('http://x/rules', { ...sample(), schemaVersion: 99 })),
    );

    assert.equal(body.success, false);
  });

  it('upserts, and the version says what happened', async () => {
    const api = apiWith();
    const first = await read<RuleDocument>(await api.save(post('http://x/rules', sample())));
    const document = first.data as RuleDocument;

    const again = await read<RuleDocument>(
      await api.save(post('http://x/rules', { ...document, name: 'Renamed' })),
    );

    assert.equal(again.data?.version, 2);
  });
});

describe('reading', () => {
  it('answers 404 for a rule that is not there', async () => {
    const api = apiWith();
    const response = await api.get(get('http://x/rules/nope'), { id: 'nope' });

    assert.equal(response.status, 404);
    assert.equal((await read(response)).code, 'NOT_FOUND');
  });

  it('needs an id, and says so rather than guessing', async () => {
    const api = apiWith();
    assert.equal((await api.get(get('http://x/rules/'))).status, 400);
  });

  it('pages, and reports the page it gave', async () => {
    const api = apiWith();
    for (let index = 0; index < 5; index += 1) {
      await api.save(post('http://x/rules', sample({ id: `r_${String(index)}` })));
    }

    const body = await read<RuleSummary[]>(await api.list(get('http://x/rules?page=2&pageSize=2')));

    assert.equal(body.data?.length, 2);
    assert.equal(body.meta?.page, 2);
    assert.equal(body.meta?.pageSize, 2);
    // The memory store cannot count without paging, so `total` is absent rather
    // than the handler quietly fetching every rule to produce one.
    assert.equal(body.meta?.total, undefined);
  });

  it('reports a total when the adapter can count', async () => {
    const storage = createMemoryStorage({ now: () => FIXED });
    const api = createRuleApi({
      storage: Object.assign(storage, { count: () => Promise.resolve(42) }),
      registry,
      authorize: allow,
      onError: () => undefined,
    });

    const body = await read<RuleSummary[]>(await api.list(get('http://x/rules')));
    assert.equal(body.meta?.total, 42);
  });

  it('filters by what the API standard says it filters by', async () => {
    const api = apiWith();
    await api.save(post('http://x/rules', sample({ id: 'r_a', tags: ['orders'] })));
    await api.save(
      post('http://x/rules', sample({ id: 'r_b', kind: 'workflow', tags: ['refunds'] })),
    );

    const filtered = await read<RuleSummary[]>(
      await api.list(get('http://x/rules?filter[kind]=workflow')),
    );
    assert.equal(filtered.data?.length, 1);

    const tagged = await read<RuleSummary[]>(
      await api.list(get('http://x/rules?filter[tags]=orders')),
    );
    assert.equal(tagged.data?.length, 1);
  });

  it('refuses a filter naming a kind that does not exist', async () => {
    // A closed set: ignoring it would answer with the whole list, which reads
    // as "the filter does nothing" rather than "that is not a kind".
    const api = apiWith();
    const response = await api.list(get('http://x/rules?filter[kind]=nonsense'));

    assert.equal(response.status, 400);
  });
});

describe('versions', () => {
  it('lists them newest first and restores forward', async () => {
    const api = apiWith();
    const first = await read<RuleDocument>(await api.save(post('http://x/rules', sample())));
    const document = first.data as RuleDocument;
    await api.save(post('http://x/rules', { ...document, name: 'Mistake' }));

    const listed = await read<RuleSummary[]>(
      await api.versions(get(`http://x/rules/${document.id}/versions`), { id: document.id }),
    );
    assert.equal(listed.data?.[0]?.version, 2);

    const restored = await read<RuleDocument>(
      await api.restore(post(`http://x/rules/${document.id}/restore`, {}), {
        id: document.id,
        version: '1',
      }),
    );
    assert.equal(restored.data?.name, 'Large orders');
    assert.equal(restored.data?.version, 3, 'a restore is a new version, never a rewind');
  });

  it('answers 404 for a version that never existed', async () => {
    const api = apiWith();
    const saved = await read<RuleDocument>(await api.save(post('http://x/rules', sample())));
    const id = saved.data?.id ?? '';

    const response = await api.restore(post('http://x/rules/restore', {}), { id, version: '99' });
    assert.equal(response.status, 404);
  });

  it('needs a version number', async () => {
    const api = apiWith();
    const response = await api.restore(post('http://x/rules/restore', {}), { id: 'r_1' });

    assert.equal(response.status, 400);
  });
});

describe('evaluating', () => {
  it('runs a rule sent in the body', async () => {
    const api = apiWith();
    const body = await read<RuleOutcome>(
      await api.evaluate(
        post('http://x/rules/evaluate', { rule: sample(), data: { order: { total: 2000 } } }),
      ),
    );

    assert.equal(body.data?.verdict, 'matched');
  });

  it('runs a rule already stored', async () => {
    const api = apiWith();
    const saved = await read<RuleDocument>(await api.save(post('http://x/rules', sample())));

    const body = await read<RuleOutcome>(
      await api.evaluate(
        post('http://x/rules/evaluate', {
          ruleId: saved.data?.id,
          data: { order: { total: 10 } },
        }),
      ),
    );

    assert.equal(body.data?.verdict, 'unmatched');
  });

  it('takes the clock from the request, so a run is reproducible', async () => {
    const api = apiWith();
    const body = await read<RuleOutcome>(
      await api.evaluate(
        post('http://x/rules/evaluate', {
          rule: sample(),
          data: { order: { total: 2000 } },
          now: FIXED,
          shortCircuit: false,
        }),
      ),
    );

    assert.equal(body.data?.verdict, 'matched');
    assert.ok((body.data?.trace.length ?? 0) > 0);
  });

  it('answers 404 for a stored rule that is not there', async () => {
    const api = apiWith();
    const response = await api.evaluate(
      post('http://x/rules/evaluate', { ruleId: 'nope', data: {} }),
    );

    assert.equal(response.status, 404);
  });
});

describe('query parameters', () => {
  it('turns pages into limits and offsets', () => {
    const { query, page, pageSize } = queryFromParams(new URLSearchParams('page=3&pageSize=10'));

    assert.equal(query.limit, 10);
    assert.equal(query.offset, 20);
    assert.equal(page, 3);
    assert.equal(pageSize, 10);
  });

  it('ignores nonsense rather than rejecting a stale bookmark', () => {
    const { page, pageSize } = queryFromParams(new URLSearchParams('page=banana&pageSize=-4'));

    assert.equal(page, 1);
    assert.equal(pageSize, 25);
  });

  it('caps a page size, so one request cannot ask for everything', () => {
    const { pageSize } = queryFromParams(new URLSearchParams('pageSize=100000'));
    assert.equal(pageSize, 200);
  });

  it('reads tags however a caller wrote them', () => {
    const commas = queryFromParams(new URLSearchParams('filter[tags]=a,b'));
    const repeated = queryFromParams(new URLSearchParams('filter[tags]=a&filter[tags]=b'));

    assert.deepEqual(commas.query.tags, ['a', 'b']);
    assert.deepEqual(repeated.query.tags, ['a', 'b']);
  });

  it('reads the sort parameter the standard defines', () => {
    assert.deepEqual(sortFromParams(new URLSearchParams('sort=updatedAt:asc')), {
      field: 'updatedAt',
      direction: 'asc',
    });
    // Anything that is not `asc` is `desc`, which is the useful default for a
    // list of rules somebody is looking through.
    assert.deepEqual(sortFromParams(new URLSearchParams('sort=name')), {
      field: 'name',
      direction: 'desc',
    });
    assert.equal(sortFromParams(new URLSearchParams('')), undefined);
  });
});

describe('the Next adapter', () => {
  it('accepts params as an object and as a promise', async () => {
    // Next 14 passes an object and Next 15 passes a promise. A package that
    // hard-coded either would break on an upgrade it has no stake in.
    const api = apiWith();
    const saved = await read<RuleDocument>(await api.save(post('http://x/rules', sample())));
    const id = saved.data?.id ?? '';

    const route = nextRoute(api.get);

    const fromObject = await read<RuleDocument>(
      await route(get(`http://x/rules/${id}`), { params: { id } }),
    );
    const fromPromise = await read<RuleDocument>(
      await route(get(`http://x/rules/${id}`), { params: Promise.resolve({ id }) }),
    );

    assert.equal(fromObject.data?.id, id);
    assert.equal(fromPromise.data?.id, id);
  });

  it('works with no params at all', async () => {
    const api = apiWith();
    const response = await nextRoute(api.list)(get('http://x/rules'));

    assert.equal(response.status, 200);
  });

  it('runs the same check behind a server action as behind a route', async () => {
    // One implementation behind both doors: an action and a route cannot drift
    // into disagreeing about who may save a rule.
    const refused = ruleAction(apiWith(() => ({ allowed: false })).save);
    const body = (await refused(sample())) as Envelope<RuleDocument>;

    assert.equal(body.success, false);
    assert.equal(body.code, 'FORBIDDEN');
  });

  it('returns a failure as a value the caller can render', async () => {
    const action = ruleAction(apiWith().save);
    const body = (await action({ not: 'a rule' })) as Envelope<RuleDocument>;

    assert.equal(body.success, false);
  });
});
