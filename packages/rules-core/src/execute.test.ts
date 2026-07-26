import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { EvaluationContext, OperatorPlugin, TraceEvent } from '@adysre/rules-types';
import {
  action,
  all,
  any,
  builtinPlugins,
  condition,
  createContext,
  createEvaluator,
  createRegistry,
  evaluateRule,
  evaluateSet,
  field,
  fn,
  group,
  literal,
  none,
  readPath,
  rule,
  ruleSet,
  sequentialIds,
  variable,
} from './index.ts';

/**
 * Executor tests.
 *
 * The ones that matter most are not "does `equals` work" - Phase 2 covers that.
 * They are the ones that pin down what happens when something goes WRONG, since
 * that is where a rules engine either stays honest or quietly starts lying: an
 * errored branch must not read as a failed one, a short-circuited branch must
 * not read as a passing one, and a missing field must be visible rather than
 * silently empty forever.
 */

const registry = createRegistry(builtinPlugins);

/**
 * One id sequence for the whole file.
 *
 * A factory per node would hand two different nodes the same `c_1`, and a trace
 * keyed by node id cannot tell them apart - which is precisely why `validateRule`
 * refuses duplicate ids.
 */
const nextId = sequentialIds();
const ids = () => ({ ids: nextId });

/** A fixed clock, so anything involving dates is reproducible. */
const NOW = Date.UTC(2026, 6, 26, 12, 0, 0);

function contextFor(data: unknown, variables: Record<string, unknown> = {}): EvaluationContext {
  return createContext(data as never, { now: NOW, variables: variables as never });
}

/** One condition, wrapped in the rule the executor expects. */
function ruleOf(
  when: ReturnType<typeof all>,
  extra: { then?: ReturnType<typeof action>[]; otherwise?: ReturnType<typeof action>[] } = {},
) {
  const options = ids();
  return rule({ name: 'Test', kind: 'validation', when, ...extra }, options);
}

function run(when: ReturnType<typeof all>, data: unknown, variables?: Record<string, unknown>) {
  return evaluateRule(registry, ruleOf(when), contextFor(data, variables));
}

/** Trace without the timings, which are the one part that cannot repeat. */
function shape(trace: readonly TraceEvent[]): unknown[] {
  return trace.map(({ ms: _ms, ...rest }) => rest);
}

describe('reading the subject', () => {
  it('walks dotted paths and array indexes', () => {
    const data = { order: { items: [{ price: 10 }, { price: 20 }] } };
    assert.deepEqual(readPath(data, 'order.items[1].price'), { found: true, value: 20 });
    assert.deepEqual(readPath(data, 'order.items[9].price'), { found: false, value: null });
  });

  it('tells an absent field from one holding null', () => {
    assert.deepEqual(readPath({ a: null }, 'a'), { found: true, value: null });
    assert.deepEqual(readPath({ a: null }, 'b'), { found: false, value: null });
  });

  it('never reaches through the prototype chain', () => {
    // A path comes out of a stored document, and `constructor.prototype` is a
    // path. Own properties only, so the worst a hostile rule can learn is what
    // the subject actually contains.
    assert.equal(readPath({}, 'constructor.prototype').found, false);
    assert.equal(readPath({}, '__proto__.polluted').found, false);
    assert.equal(readPath({}, 'toString').found, false);

    // JSON.parse really does create an own `__proto__` key, so this is not
    // theoretical.
    const parsed: unknown = JSON.parse('{"__proto__":{"admin":true}}');
    assert.equal(readPath(parsed as never, '__proto__.admin').found, false);
  });

  it('reports a missing field once, as a warning, and reads it as empty', () => {
    const outcome = run(
      all(
        [
          condition({ left: field('custmoer.tier'), operator: 'isEmpty' }, ids()),
          condition({ left: field('custmoer.tier'), operator: 'isEmpty' }, ids()),
        ],
        ids(),
      ),
      { customer: { tier: 'gold' } },
    );

    assert.equal(outcome.verdict, 'matched', 'an absent field is empty, not an error');
    const missing = outcome.diagnostics.filter((entry) => entry.code === 'field_missing');
    assert.equal(missing.length, 1, 'one absent field is one warning, not one per mention');
    assert.equal(missing[0]?.severity, 'warning');
    assert.equal(missing[0]?.path, 'custmoer.tier');
  });

  it('reads variables the host supplied, and warns about the ones it did not', () => {
    const supplied = run(
      all([condition({ left: field('n'), operator: 'lessThan', args: [variable('cap')] }, ids())], ids()),
      { n: 5 },
      { cap: 10 },
    );
    assert.equal(supplied.verdict, 'matched');
    assert.deepEqual(supplied.diagnostics, []);

    const absent = run(
      all([condition({ left: variable('cap'), operator: 'isEmpty' }, ids())], ids()),
      {},
    );
    assert.equal(absent.verdict, 'matched');
    assert.equal(absent.diagnostics[0]?.code, 'variable_missing');
  });
});

describe('evaluating', () => {
  it('matches, and yields the actions with their operands resolved', () => {
    const options = ids();
    const document = rule(
      {
        name: 'Large orders need approval',
        kind: 'validation',
        when: all(
          [condition({ left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] }, options)],
          options,
        ),
        then: [action({ type: 'setField', target: 'order.flag', value: field('order.total') }, options)],
      },
      options,
    );

    const outcome = evaluateRule(registry, document, contextFor({ order: { total: 2500 } }));
    assert.equal(outcome.verdict, 'matched');
    assert.deepEqual(outcome.actions, [
      { actionId: document.then[0]!.id, type: 'setField', target: 'order.flag', value: 2500 },
    ]);
  });

  it('takes the otherwise branch when it does not match', () => {
    const options = ids();
    const document = rule(
      {
        name: 'Either way',
        kind: 'validation',
        when: all([condition({ left: field('n'), operator: 'equals', args: [literal(1)] }, options)], options),
        then: [action({ type: 'allow' }, options)],
        otherwise: [action({ type: 'reject', target: 'n' }, options)],
      },
      options,
    );

    const outcome = evaluateRule(registry, document, contextFor({ n: 2 }));
    assert.equal(outcome.verdict, 'unmatched');
    assert.deepEqual(outcome.actions, [
      { actionId: document.otherwise![0]!.id, type: 'reject', target: 'n' },
    ]);
  });

  it('resolves function operands against the injected clock, never the real one', () => {
    const outcome = run(
      all(
        [
          condition(
            { left: fn('daysBetween', field('placedAt'), fn('now')), operator: 'lessThan', args: [literal(7)] },
            ids(),
          ),
        ],
        ids(),
      ),
      { placedAt: new Date(NOW - 3 * 86_400_000).toISOString() },
    );

    assert.equal(outcome.verdict, 'matched');
  });

  it('skips a disabled rule rather than calling it unmatched', () => {
    const options = ids();
    const document = rule(
      {
        name: 'Off',
        kind: 'validation',
        enabled: false,
        when: all([condition({ left: field('n'), operator: 'isEmpty' }, options)], options),
        then: [action({ type: 'allow' }, options)],
      },
      options,
    );

    const outcome = evaluateRule(registry, document, contextFor({}));
    // "Did not run" and "ran and did not apply" are different answers, and a
    // report that conflates them cannot explain why nothing happened.
    assert.equal(outcome.verdict, 'skipped');
    assert.deepEqual(outcome.actions, []);
    assert.deepEqual(outcome.trace, []);
  });

  it('gives the same answer twice, down to the trace', () => {
    const document = ruleOf(
      all([condition({ left: field('n'), operator: 'between', args: [literal(1), literal(9)] }, ids())], ids()),
    );
    const first = evaluateRule(registry, document, contextFor({ n: 5 }));
    const second = evaluateRule(registry, document, contextFor({ n: 5 }));
    assert.deepEqual(shape(first.trace), shape(second.trace));
  });
});

describe('combinators', () => {
  const yes = () => condition({ left: literal(1), operator: 'equals', args: [literal(1)] }, ids());
  const no = () => condition({ left: literal(1), operator: 'equals', args: [literal(2)] }, ids());

  it('combines all, any and none', () => {
    const data = {};
    assert.equal(run(all([yes(), yes()], ids()), data).verdict, 'matched');
    assert.equal(run(all([yes(), no()], ids()), data).verdict, 'unmatched');
    assert.equal(run(any([no(), yes()], ids()), data).verdict, 'matched');
    assert.equal(run(any([no(), no()], ids()), data).verdict, 'unmatched');
    assert.equal(run(none([no(), no()], ids()), data).verdict, 'matched');
    assert.equal(run(none([no(), yes()], ids()), data).verdict, 'unmatched');
  });

  it('treats an empty group as no restriction, whichever combinator it carries', () => {
    // Not the mathematical convention for an empty `any`, deliberately: an empty
    // group means "nothing has been said yet", and every rule starts as one.
    for (const empty of [all([], ids()), any([], ids()), none([], ids())]) {
      assert.equal(run(empty, {}).verdict, 'matched', empty.combinator);
    }
  });

  it('nests groups', () => {
    const options = ids();
    const tree = all([yes(), any([no(), all([yes(), yes()], options)], options)], options);
    assert.equal(run(tree, {}).verdict, 'matched');
  });

  it('inverts a negated condition and a negated group', () => {
    const negatedCondition = condition(
      { left: literal(1), operator: 'equals', args: [literal(2)], negate: true },
      ids(),
    );
    assert.equal(run(all([negatedCondition], ids()), {}).verdict, 'matched');

    const negatedGroup = group('all', [no()], { ...ids(), negate: true });
    assert.equal(run(all([negatedGroup], ids()), {}).verdict, 'matched');
  });

  it('walks a tree deep enough to overflow a recursive executor', () => {
    const options = ids();
    let tree = all([yes()], options);
    for (let level = 0; level < 20_000; level += 1) tree = all([tree], options);

    const outcome = evaluateRule(registry, ruleOf(tree), contextFor({}), {
      trace: false,
      timeoutMs: 60_000,
    });
    assert.equal(outcome.verdict, 'matched');
  });
});

describe('short-circuiting', () => {
  const yes = () => condition({ left: literal(1), operator: 'equals', args: [literal(1)] }, ids());
  const no = () => condition({ left: literal(1), operator: 'equals', args: [literal(2)] }, ids());

  it('stops an all group at the first unmatched child, and says so in the trace', () => {
    const first = no();
    const second = yes();
    const outcome = run(all([first, second], ids()), {});

    assert.equal(outcome.verdict, 'unmatched');
    const group = outcome.trace.find((event) => event.kind === 'group');
    assert.deepEqual(group?.children, [first.id], 'a skipped sibling is absent, not passing');
    assert.equal(outcome.trace.some((event) => event.nodeId === second.id), false);
  });

  it('runs every branch when a debugger asks it to', () => {
    const first = no();
    const second = yes();
    const outcome = evaluateRule(registry, ruleOf(all([first, second], ids())), contextFor({}), {
      shortCircuit: false,
    });

    assert.equal(outcome.verdict, 'unmatched', 'the answer does not change');
    const group = outcome.trace.find((event) => event.kind === 'group');
    assert.deepEqual(group?.children, [first.id, second.id]);
  });

  it('collects no trace at all when it is turned off', () => {
    const outcome = evaluateRule(registry, ruleOf(all([yes()], ids())), contextFor({}), { trace: false });
    assert.equal(outcome.verdict, 'matched');
    assert.deepEqual(outcome.trace, []);
  });
});

describe('when something is wrong', () => {
  const broken = () =>
    // Comparing a number to text: a mistake in the rule, not a failed test.
    condition({ left: field('n'), operator: 'greaterThan', args: [literal('apple')] }, ids());

  it('makes a type mismatch an errored verdict, not a false one', () => {
    const outcome = run(all([broken()], ids()), { n: 5 });

    assert.equal(outcome.verdict, 'errored');
    assert.equal(outcome.diagnostics[0]?.code, 'not_comparable');
    assert.equal(outcome.diagnostics[0]?.severity, 'error');
    assert.ok(outcome.diagnostics[0]?.nodeId, 'the diagnostic points at the row that caused it');
    assert.equal(outcome.trace[0]?.verdict, 'errored');
    assert.ok(outcome.trace[0]?.error);
  });

  it('applies no actions when a rule errored', () => {
    const options = ids();
    const document = rule(
      {
        name: 'Broken',
        kind: 'validation',
        when: all([broken()], options),
        then: [action({ type: 'allow' }, options)],
        otherwise: [action({ type: 'reject' }, options)],
      },
      options,
    );

    const outcome = evaluateRule(registry, document, contextFor({ n: 5 }));
    // Neither branch: the engine does not know which one was right.
    assert.deepEqual(outcome.actions, []);
  });

  it('lets an error win over a combinator that had already decided', () => {
    const matching = condition({ left: literal(1), operator: 'equals', args: [literal(1)] }, ids());
    const outcome = run(any([broken(), matching], ids()), { n: 5 });

    // `any` saw a match, but half the rule could not be evaluated, so it does
    // not get to claim it matched.
    assert.equal(outcome.verdict, 'errored');
  });

  it('can short-circuit past an error, which is what turning it off reveals', () => {
    const matching = condition({ left: literal(1), operator: 'equals', args: [literal(1)] }, ids());
    const tree = any([matching, broken()], ids());

    assert.equal(run(tree, { n: 5 }).verdict, 'matched');
    assert.equal(
      evaluateRule(registry, ruleOf(tree), contextFor({ n: 5 }), { shortCircuit: false }).verdict,
      'errored',
      'the debugger sees the branch the fast path never reached',
    );
  });

  it('names an operator nobody registered', () => {
    const outcome = run(
      all([condition({ left: field('n'), operator: 'isPurple' }, ids())], ids()),
      { n: 1 },
    );
    assert.equal(outcome.verdict, 'errored');
    assert.equal(outcome.diagnostics[0]?.code, 'unknown_plugin');
    assert.match(outcome.diagnostics[0]?.message ?? '', /isPurple/);
  });

  it('names a function nobody registered', () => {
    const outcome = run(
      all([condition({ left: fn('taxFor', field('n')), operator: 'isEmpty' }, ids())], ids()),
      { n: 1 },
    );
    assert.equal(outcome.verdict, 'errored');
    assert.equal(outcome.diagnostics[0]?.code, 'unknown_plugin');
  });

  it('catches the wrong number of operands before the plugin sees them', () => {
    const outcome = run(
      all([condition({ left: field('n'), operator: 'between', args: [literal(1)] }, ids())], ids()),
      { n: 5 },
    );
    assert.equal(outcome.verdict, 'errored');
    assert.equal(outcome.diagnostics[0]?.code, 'arity_mismatch');
  });

  it('tells a plugin declining to answer from a plugin that broke', () => {
    const boom: OperatorPlugin = {
      id: 'boom',
      arity: 0,
      evaluate: () => {
        throw new Error('kaboom');
      },
    };
    const shrug: OperatorPlugin = {
      id: 'shrug',
      arity: 0,
      // Only an untyped plugin can do this, which is exactly why it is checked.
      evaluate: () => 'maybe' as unknown as boolean,
    };
    const extended = registry.extend({ operators: [boom, shrug] });

    const bug = evaluateRule(
      extended,
      ruleOf(all([condition({ left: literal(1), operator: 'boom' }, ids())], ids())),
      contextFor({}),
    );
    assert.equal(bug.diagnostics[0]?.code, 'plugin_failed');
    assert.match(bug.diagnostics[0]?.message ?? '', /kaboom/);

    const nonsense = evaluateRule(
      extended,
      ruleOf(all([condition({ left: literal(1), operator: 'shrug' }, ids())], ids())),
      contextFor({}),
    );
    assert.equal(nonsense.verdict, 'errored');
    assert.equal(nonsense.diagnostics[0]?.code, 'invalid_argument');
  });

  it('refuses a rule whose conditions are not a group', () => {
    const document = ruleOf(all([], ids()));
    const outcome = evaluateRule(
      registry,
      { ...document, when: null as never },
      contextFor({}),
    );
    assert.equal(outcome.verdict, 'errored');
    assert.equal(outcome.diagnostics[0]?.code, 'when_not_group');
  });

  it('refuses a node kind it does not know, instead of ignoring it', () => {
    const tree = all([], ids());
    tree.children.push({ kind: 'comment', id: 'x_1' } as never);

    const outcome = run(tree, {});
    assert.equal(outcome.verdict, 'errored');
    assert.equal(outcome.diagnostics[0]?.code, 'node_kind_unknown');
  });

  it('fails the whole rule when an action cannot resolve its value', () => {
    const options = ids();
    const document = rule(
      {
        name: 'Half done',
        kind: 'transformation',
        when: all([], options),
        then: [
          action({ type: 'setField', target: 'a', value: literal(1) }, options),
          action({ type: 'setField', target: 'b', value: fn('nope') }, options),
        ],
      },
      options,
    );

    const outcome = evaluateRule(registry, document, contextFor({}));
    assert.equal(outcome.verdict, 'errored');
    // Not "the one that worked": a rule that does half of what it says is worse
    // than one that says it could not run.
    assert.deepEqual(outcome.actions, []);
  });
});

describe('limits', () => {
  it('refuses function operands nested past the ceiling', () => {
    let operand = field('text');
    for (let level = 0; level < 6; level += 1) operand = fn('lower', operand);

    const outcome = evaluateRule(
      registry,
      ruleOf(all([condition({ left: operand, operator: 'isEmpty' }, ids())], ids())),
      contextFor({ text: 'A' }),
      { maxDepth: 3 },
    );

    assert.equal(outcome.verdict, 'errored');
    assert.equal(outcome.diagnostics[0]?.code, 'limit_exceeded');
  });

  it('abandons a rule that runs out of time', () => {
    const outcome = evaluateRule(
      registry,
      ruleOf(all([condition({ left: literal(1), operator: 'equals', args: [literal(1)] }, ids())], ids())),
      contextFor({}),
      { timeoutMs: 0 },
    );

    assert.equal(outcome.verdict, 'errored');
    assert.equal(outcome.diagnostics[0]?.code, 'timeout');
  });

  it('abandons partway through, keeping what it had already evaluated', () => {
    const options = ids();
    const conditions = Array.from({ length: 6 }, () =>
      condition({ left: literal(1), operator: 'equals', args: [literal(1)] }, options),
    );

    // A clock that jumps a millisecond per reading, so the timeout is reached by
    // doing work rather than by waiting. See `EvaluationOptions.clock`.
    let ticks = 0;
    const outcome = evaluateRule(registry, ruleOf(all(conditions, options)), contextFor({}), {
      timeoutMs: 8,
      clock: () => (ticks += 1),
    });

    assert.equal(outcome.verdict, 'errored');
    assert.ok(outcome.diagnostics.some((entry) => entry.code === 'timeout'));
    assert.ok(outcome.trace.length > 0, 'what did run is still on the record');
    assert.ok(outcome.trace.length < conditions.length, 'and the rest never ran');
  });
});

describe('the trace', () => {
  it('records what the operator actually saw', () => {
    const leaf = condition(
      { left: field('order.total'), operator: 'greaterThan', args: [variable('cap')] },
      ids(),
    );
    const outcome = run(all([leaf], ids()), { order: { total: 2500 } }, { cap: 1000 });

    const event = outcome.trace.find((entry) => entry.nodeId === leaf.id);
    assert.equal(event?.kind, 'condition');
    assert.equal(event?.operator, 'greaterThan');
    assert.equal(event?.left, 2500);
    assert.deepEqual(event?.args, [1000]);
    assert.equal(event?.verdict, 'matched');
    assert.equal(typeof event?.ms, 'number');
  });

  it('records children before their parent, so a reader can rebuild the tree', () => {
    const leaf = condition({ left: literal(1), operator: 'equals', args: [literal(1)] }, ids());
    const inner = all([leaf], ids());
    const outer = all([inner], ids());

    const outcome = run(outer, {});
    assert.deepEqual(
      outcome.trace.map((event) => event.nodeId),
      [leaf.id, inner.id, outer.id],
    );
  });
});

describe('sets', () => {
  function ruleFor(name: string, matches: boolean, priority: number) {
    const options = ids();
    return rule(
      {
        name,
        kind: 'validation',
        priority,
        when: all(
          [condition({ left: literal(1), operator: 'equals', args: [literal(matches ? 1 : 2)] }, options)],
          options,
        ),
        then: [action({ type: 'tag', params: { name } }, options)],
      },
      options,
    );
  }

  it('runs rules in priority order, lowest first, and keeps ties stable', () => {
    const late = ruleFor('late', true, 10);
    const early = ruleFor('early', true, 1);
    const tiedA = ruleFor('tied-a', true, 1);
    const tiedB = ruleFor('tied-b', true, 1);

    const outcome = evaluateSet(
      registry,
      ruleSet({ name: 'Set', rules: [late, early, tiedA, tiedB] }, ids()),
      contextFor({}),
    );

    assert.deepEqual(
      outcome.outcomes.map((entry) => entry.ruleId),
      [early.id, tiedA.id, tiedB.id, late.id],
    );
    assert.deepEqual(
      outcome.actions.map((entry) => entry.params?.name),
      ['early', 'tied-a', 'tied-b', 'late'],
    );
  });

  it('stops at the first match when that is the strategy', () => {
    const missed = ruleFor('missed', false, 1);
    const hit = ruleFor('hit', true, 2);
    const after = ruleFor('after', true, 3);

    const outcome = evaluateSet(
      registry,
      ruleSet({ name: 'Set', strategy: 'first-match', rules: [missed, hit, after] }, ids()),
      contextFor({}),
    );

    assert.equal(outcome.outcomes.length, 2, 'the unmatched rule ran, the one after the match did not');
    assert.deepEqual(outcome.actions.map((entry) => entry.params?.name), ['hit']);
  });

  it('gathers every rule that matched when that is the strategy', () => {
    const outcome = evaluateSet(
      registry,
      ruleSet(
        { name: 'Set', strategy: 'all-matches', rules: [ruleFor('a', true, 1), ruleFor('b', true, 2)] },
        ids(),
      ),
      contextFor({}),
    );
    assert.equal(outcome.actions.length, 2);
  });
});

describe('the evaluator', () => {
  it('binds a registry that cannot be swapped underneath it', () => {
    const evaluator = createEvaluator(registry);
    const outcome = evaluator.evaluate(
      ruleOf(all([condition({ left: literal(1), operator: 'equals', args: [literal(1)] }, ids())], ids())),
      contextFor({}),
    );

    assert.equal(outcome.verdict, 'matched');
    assert.throws(() => {
      (evaluator as { registry: unknown }).registry = createRegistry();
    });
  });

  it('fills in a context without hiding the clock', () => {
    const context = createContext({ a: 1 } as never);
    assert.equal(typeof context.now, 'number');
    assert.deepEqual(context.variables, {});

    const fixed = createContext({ a: 1 } as never, { now: NOW });
    assert.equal(fixed.now, NOW);
  });
});
