import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  action,
  all,
  any,
  addNode,
  collectFields,
  collectPluginIds,
  collectVariables,
  condition,
  countNodes,
  depth,
  field,
  findNode,
  fn,
  literal,
  logicHash,
  none,
  parseRule,
  pathTo,
  removeNode,
  replaceNode,
  rule,
  sequentialIds,
  stringifyRule,
  validateRule,
  variable,
  walk,
} from './index';

/**
 * Core tests.
 *
 * The AST is the single source of truth, so these are the tests every other
 * package inherits the consequences of. Two things get the most attention: that
 * a tree cannot be built into an invalid state, and that VALIDATION refuses the
 * documents that would otherwise reach the executor as something it has to
 * defend against - unknown node kinds, duplicate ids, cycles, a schema from a
 * newer engine.
 */

/** A reproducible rule: fixed ids and a fixed clock, so it compares equal. */
function sample() {
  const options = { ids: sequentialIds(), now: () => 1_700_000_000_000 };

  return rule(
    {
      name: 'Large orders need approval',
      kind: 'validation',
      when: all(
        [
          condition({ left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] }, options),
          any(
            [
              condition({ left: field('customer.tier'), operator: 'equals', args: [literal('new')] }, options),
              condition(
                { left: field('order.placedAt'), operator: 'before', args: [fn('today')] },
                options,
              ),
            ],
            options,
          ),
        ],
        options,
      ),
      then: [
        action({ type: 'reject', target: 'order.total', params: { messageKey: 'needsApproval' } }, options),
      ],
    },
    options,
  );
}

describe('builders', () => {
  it('produce a document that validates', () => {
    const result = validateRule(sample());
    assert.equal(result.valid, true, JSON.stringify(result.diagnostics));
  });

  it('are reproducible when ids and the clock are injected', () => {
    assert.equal(stringifyRule(sample()), stringifyRule(sample()));
  });

  it('start a rule with an empty group, which matches everything', () => {
    const empty = rule({ name: 'Everything', kind: 'filter' }, { ids: sequentialIds() });
    assert.equal(empty.when.kind, 'group');
    assert.deepEqual(empty.when.children, []);
    assert.equal(validateRule(empty).valid, true);
  });

  it('omit optional fields rather than writing undefined into the JSON', () => {
    const plain = condition({ left: field('a'), operator: 'isEmpty' }, { ids: sequentialIds() });
    assert.equal('negate' in plain, false);
    assert.equal('comment' in plain, false);
    assert.deepEqual(plain.args, []);
  });
});

describe('walking', () => {
  it('visits every node, parents before children, left to right', () => {
    const options = { ids: sequentialIds() };
    const tree = all(
      [
        condition({ left: field('a'), operator: 'equals', args: [literal(1)] }, options),
        any([condition({ left: field('b'), operator: 'equals', args: [literal(2)] }, options)], options),
      ],
      options,
    );

    const kinds = [...walk(tree)].map((node) => node.kind);
    assert.deepEqual(kinds, ['group', 'condition', 'group', 'condition']);
    assert.equal(countNodes(tree), 4);
    assert.equal(depth(tree), 3);
  });

  it('survives a tree deep enough to overflow a recursive walker', () => {
    const options = { ids: sequentialIds() };
    let node = all([condition({ left: field('a'), operator: 'isEmpty' }, options)], options);
    for (let level = 0; level < 20_000; level += 1) node = all([node], options);

    // The point of the iterative walk: an imported tree is not authored by
    // anyone, and a stack overflow inside a rules engine has no useful message.
    assert.equal(countNodes(node), 20_002);
    assert.equal(depth(node), 20_002);
  });

  it('finds a node and the path that leads to it', () => {
    const options = { ids: sequentialIds() };
    const leaf = condition({ left: field('b'), operator: 'equals', args: [literal(2)] }, options);
    const inner = any([leaf], options);
    const tree = all([inner], options);

    assert.equal(findNode(tree, leaf.id)?.id, leaf.id);
    assert.deepEqual(pathTo(tree, leaf.id).map((node) => node.id), [tree.id, inner.id]);
    assert.deepEqual(pathTo(tree, tree.id), []);
    assert.equal(findNode(tree, 'nope'), undefined);
  });

  it('reports the fields, variables and plugins a rule depends on', () => {
    const options = { ids: sequentialIds() };
    const document = rule(
      {
        name: 'Mixed',
        kind: 'calculation',
        when: all(
          [
            condition(
              {
                left: fn('sum', field('order.items.price'), variable('surcharge')),
                operator: 'greaterThan',
                args: [field('limits.max')],
              },
              options,
            ),
          ],
          options,
        ),
        then: [
          action({ type: 'setField', target: 'order.flagged', value: literal(true) }, options),
        ],
      },
      options,
    );

    assert.deepEqual(collectFields(document), ['limits.max', 'order.flagged', 'order.items.price']);
    assert.deepEqual(collectVariables(document), ['surcharge']);
    assert.deepEqual(collectPluginIds(document), {
      operators: ['greaterThan'],
      functions: ['sum'],
    });
  });
});

describe('editing', () => {
  const options = { ids: sequentialIds() };

  it('replaces a node without touching untouched branches', () => {
    const keep = any([condition({ left: field('b'), operator: 'isEmpty' }, options)], options);
    const target = condition({ left: field('a'), operator: 'equals', args: [literal(1)] }, options);
    const tree = all([target, keep], options);

    const replacement = condition({ left: field('a'), operator: 'notEquals', args: [literal(2)] }, options);
    const next = replaceNode(tree, target.id, replacement);

    assert.notEqual(next, tree, 'a changed tree is a new object');
    assert.equal(findNode(next, replacement.id)?.id, replacement.id);
    assert.equal(findNode(next, target.id), undefined);
    // Identity is preserved on the branch that did not change, so a renderer
    // can skip it.
    assert.equal((next as typeof tree).children[1], keep);
  });

  it('returns the same tree when the id is not there', () => {
    const tree = all([condition({ left: field('a'), operator: 'isEmpty' }, options)], options);
    assert.equal(replaceNode(tree, 'missing', tree), tree);
    assert.equal(removeNode(tree, 'missing'), tree);
    assert.equal(addNode(tree, 'missing', tree), tree);
  });

  it('removes a node and appends to a group', () => {
    const doomed = condition({ left: field('a'), operator: 'isEmpty' }, options);
    const tree = all([doomed], options);

    const pruned = removeNode(tree, doomed.id);
    assert.equal(countNodes(pruned), 1);

    const extra = condition({ left: field('c'), operator: 'isEmpty' }, options);
    const grown = addNode(pruned, tree.id, extra);
    assert.equal(countNodes(grown), 2);
  });

  it('refuses to add to a condition, which has no children', () => {
    const leaf = condition({ left: field('a'), operator: 'isEmpty' }, options);
    const tree = all([leaf], options);
    assert.equal(addNode(tree, leaf.id, leaf), tree);
  });
});

describe('validation', () => {
  it('names the path of the problem, not just the fact of it', () => {
    const broken = sample() as unknown as { when: { children: unknown[] } };
    broken.when.children[0] = { kind: 'condition', id: 'c_x', left: { source: 'nope' }, operator: 'eq', args: [] };

    const result = validateRule(broken);
    assert.equal(result.valid, false);
    assert.equal(result.diagnostics[0]?.code, 'operand_source_unknown');
    assert.equal(result.diagnostics[0]?.path, '$.when.children[0].left.source');
  });

  it('refuses duplicate ids, which would make a trace ambiguous', () => {
    const options = { ids: () => 'same' };
    const tree = all(
      [
        condition({ left: field('a'), operator: 'isEmpty' }, options),
        condition({ left: field('b'), operator: 'isEmpty' }, options),
      ],
      options,
    );
    const document = rule({ name: 'Clashing', kind: 'filter', when: tree }, options);

    const result = validateRule(document);
    assert.equal(result.valid, false);
    assert.ok(result.diagnostics.some((entry) => entry.code === 'node_id_duplicate'));
  });

  it('refuses a document written by a newer engine rather than guessing', () => {
    const ahead = { ...sample(), schemaVersion: 99 };
    const result = validateRule(ahead);
    assert.equal(result.valid, false);
    assert.ok(result.diagnostics.some((entry) => entry.code === 'schema_version_ahead'));
  });

  it('rejects values JSON cannot carry', () => {
    const withFunction = sample() as unknown as { when: { children: unknown[] } };
    withFunction.when.children[0] = {
      kind: 'condition',
      id: 'c_fn',
      left: { source: 'literal', value: () => 1 },
      operator: 'equals',
      args: [],
    };
    assert.equal(validateRule(withFunction).valid, false);

    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    const withCycle = sample() as unknown as { when: { children: unknown[] } };
    withCycle.when.children[0] = {
      kind: 'condition',
      id: 'c_cycle',
      left: { source: 'literal', value: cyclic },
      operator: 'equals',
      args: [],
    };
    assert.equal(validateRule(withCycle).valid, false, 'a cycle cannot be serialised');
  });

  it('rejects a field path that is not one', () => {
    for (const path of ['', 'a..b', '2bad', 'a-b', 'a[x]']) {
      const document = sample();
      document.when.children[0] = condition(
        { left: field(path), operator: 'isEmpty' },
        { ids: sequentialIds() },
      );
      assert.equal(validateRule(document).valid, false, path);
    }

    for (const path of ['a', 'a.b', 'order.items[0].price', '_private.$id']) {
      const document = sample();
      document.when.children[0] = condition(
        { left: field(path), operator: 'isEmpty' },
        { ids: sequentialIds() },
      );
      assert.equal(validateRule(document).valid, true, path);
    }
  });

  it('rejects a rule whose conditions are not a group', () => {
    const document = { ...sample(), when: { kind: 'condition', id: 'c', left: field('a'), operator: 'x', args: [] } };
    const result = validateRule(document);
    assert.equal(result.valid, false);
    assert.ok(result.diagnostics.some((entry) => entry.code === 'when_not_group'));
  });

  it('rejects anything that is not an object at all', () => {
    for (const input of [null, 42, 'rule', [], undefined]) {
      assert.equal(validateRule(input).valid, false);
    }
  });
});

describe('serialising', () => {
  it('round-trips through JSON', () => {
    const original = sample();
    const parsed = parseRule(stringifyRule(original));

    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.deepEqual(parsed.rule, original);
    assert.equal(parsed.migrated, false);
  });

  it('writes keys in a fixed order, so two saves diff to nothing', () => {
    const original = sample();
    // Same logic, keys inserted in a different order.
    const shuffled = JSON.parse(JSON.stringify({ metadata: original.metadata, ...original }));
    assert.equal(stringifyRule(original), stringifyRule(shuffled));
  });

  it('reports why a document could not be read, instead of throwing', () => {
    const notJson = parseRule('{ not json');
    assert.equal(notJson.ok, false);
    assert.equal(notJson.ok === false && notJson.diagnostics[0]?.code, 'not_json');

    const notARule = parseRule('{"hello":"world"}');
    assert.equal(notARule.ok, false);
    assert.ok(notARule.ok === false && notARule.diagnostics.length > 0);
  });

  it('hashes the logic and ignores everything else', () => {
    const original = sample();
    const renamed = { ...original, name: 'Renamed', description: 'different', version: 9 };
    assert.equal(logicHash(original), logicHash(renamed), 'a rename is not a logic change');

    const changed = structuredClone(original);
    changed.when.combinator = 'any';
    assert.notEqual(logicHash(original), logicHash(changed));
  });
});

describe('none, the third combinator', () => {
  it('builds and validates like the others', () => {
    const options = { ids: sequentialIds() };
    const tree = none([condition({ left: field('a'), operator: 'isEmpty' }, options)], options);
    assert.equal(tree.combinator, 'none');
    assert.equal(validateRule(rule({ name: 'n', kind: 'filter', when: tree }, options)).valid, true);
  });
});
