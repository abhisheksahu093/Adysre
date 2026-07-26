import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  all,
  builtinPlugins,
  condition,
  countNodes,
  createRegistry,
  field,
  findNode,
  literal,
  rule,
  sequentialIds,
  stringifyRule,
  validateRule,
} from '@adysre/rules-core';
import type { FieldProviderPlugin, GroupNode, RuleDocument } from '@adysre/rules-types';

import {
  canRedo,
  canUndo,
  createRuleStore,
  initialState,
  isDirty,
  nodeIdForPath,
  parentOf,
  reduce,
  resolveFields,
  selectedNode,
  validation,
  type BuilderState,
  type ReducerDeps,
} from './index.ts';

/**
 * Builder tests.
 *
 * Every one of these drives the reducer or the store directly: no DOM, no
 * renderer, no act(). That is the point of keeping the logic out of the hooks -
 * a rule builder's behaviour is mostly editing rules rather than drawing them,
 * and behaviour that can only be tested through a renderer is behaviour that
 * mostly is not.
 */

const registry = createRegistry(builtinPlugins);

/**
 * One id sequence for the whole file.
 *
 * A fresh factory per rule would hand two different nodes the same `c_1`, which
 * is exactly the state `validateRule` refuses and `findNode` cannot resolve.
 */
const nextId = sequentialIds();

function deps(): ReducerDeps {
  return { ids: nextId, registry };
}

function sample(): RuleDocument {
  const options = { ids: nextId, now: () => 1_700_000_000_000 };
  return rule(
    {
      name: 'Large orders',
      kind: 'validation',
      when: all(
        [condition({ left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] }, options)],
        options,
      ),
    },
    options,
  );
}

function start(): { state: BuilderState; deps: ReducerDeps } {
  return { state: initialState(sample()), deps: deps() };
}

/** Apply a run of actions, so a test reads as a session rather than a ladder. */
function run(
  state: BuilderState,
  dependencies: ReducerDeps,
  ...actions: Parameters<typeof reduce>[1][]
): BuilderState {
  return actions.reduce((current, action) => reduce(current, action, dependencies), state);
}

describe('editing the tree', () => {
  it('adds a condition to the root and selects it', () => {
    const { state, deps: d } = start();
    const next = reduce(state, { type: 'addCondition' }, d);

    assert.equal(countNodes(next.rule.when), 3);
    assert.ok(next.selectedId);
    assert.equal(findNode(next.rule.when, next.selectedId ?? '')?.kind, 'condition');
    assert.equal(validateRule(next.rule).valid, true);
  });

  it('sizes a condition s values to the operator it was given', () => {
    const { state, deps: d } = start();
    const conditionId = (state.rule.when.children[0] as { id: string }).id;

    // `between` needs two values where `greaterThan` needed one. A builder that
    // did not notice would draw a row that cannot run.
    const widened = reduce(state, { type: 'setOperator', id: conditionId, operator: 'between' }, d);
    const node = findNode(widened.rule.when, conditionId);
    assert.equal(node?.kind === 'condition' && node.args.length, 2);
    assert.deepEqual(node?.kind === 'condition' && node.args[0], literal(1000));

    // And narrowing keeps the values the author did choose, in order.
    const narrowed = reduce(widened, { type: 'setOperator', id: conditionId, operator: 'isEmpty' }, d);
    const narrow = findNode(narrowed.rule.when, conditionId);
    assert.equal(narrow?.kind === 'condition' && narrow.args.length, 0);
  });

  it('leaves a variadic operator s values alone', () => {
    const { state, deps: d } = start();
    const conditionId = (state.rule.when.children[0] as { id: string }).id;
    const next = reduce(state, { type: 'setOperator', id: conditionId, operator: 'isOneOf' }, d);

    const node = findNode(next.rule.when, conditionId);
    assert.equal(node?.kind === 'condition' && node.args.length, 1);
  });

  it('duplicates a branch with fresh ids', () => {
    const { state, deps: d } = start();
    const withGroup = run(
      state,
      d,
      { type: 'addGroup', combinator: 'any' },
    );
    const groupId = withGroup.selectedId ?? '';
    const filled = run(withGroup, d, { type: 'addCondition', parentId: groupId });

    const branch = findNode(filled.rule.when, groupId);
    const copied = reduce(filled, { type: 'duplicate', id: groupId }, d);

    assert.equal(
      countNodes(copied.rule.when),
      countNodes(filled.rule.when) + countNodes(branch as GroupNode),
      'the branch is copied, not the tree',
    );
    // Two nodes sharing an id would make a trace ambiguous, and validation
    // refuses the document outright.
    assert.equal(validateRule(copied.rule).valid, true);
    assert.notEqual(copied.selectedId, groupId);
  });

  it('puts a duplicate next to its original, not at the end', () => {
    const { state, deps: d } = start();
    const first = (state.rule.when.children[0] as { id: string }).id;
    const withSecond = reduce(state, { type: 'addCondition' }, d);
    const copied = reduce(withSecond, { type: 'duplicate', id: first }, d);

    assert.equal(copied.rule.when.children[1]?.id, copied.selectedId);
  });

  it('refuses to remove the root, which is the rule s conditions', () => {
    const { state, deps: d } = start();
    assert.equal(reduce(state, { type: 'remove', id: state.rule.when.id }, d), state);
  });

  it('clears the selection when the selected node is removed', () => {
    const { state, deps: d } = start();
    const added = reduce(state, { type: 'addCondition' }, d);
    const removed = reduce(added, { type: 'remove', id: added.selectedId ?? '' }, d);
    assert.equal(removed.selectedId, null);
  });

  it('drops negate rather than writing false into the document', () => {
    const { state, deps: d } = start();
    const id = (state.rule.when.children[0] as { id: string }).id;

    const negated = reduce(state, { type: 'setNegate', id, negate: true }, d);
    assert.equal(findNode(negated.rule.when, id)?.negate, true);

    const restored = reduce(negated, { type: 'setNegate', id, negate: false }, d);
    assert.equal('negate' in (findNode(restored.rule.when, id) ?? {}), false);
    // Which means it round-trips to exactly the document it started as.
    assert.equal(stringifyRule(restored.rule), stringifyRule(state.rule));
  });
});

describe('moving nodes', () => {
  function threeInARow() {
    const { state, deps: d } = start();
    const next = run(state, d, { type: 'addCondition' }, { type: 'addCondition' });
    return { state: next, deps: d, ids: next.rule.when.children.map((child) => child.id) };
  }

  it('reorders inside one group, to the position asked for', () => {
    // `index` is where the node ends up, which is the only reading that means
    // one thing whichever direction it moved.
    const { state, deps: d, ids } = threeInARow();
    const root = state.rule.when.id;

    const toEnd = reduce(state, { type: 'move', id: ids[0] ?? '', parentId: root, index: 2 }, d);
    assert.deepEqual(toEnd.rule.when.children.map((child) => child.id), [ids[1], ids[2], ids[0]]);

    const toStart = reduce(state, { type: 'move', id: ids[2] ?? '', parentId: root, index: 0 }, d);
    assert.deepEqual(toStart.rule.when.children.map((child) => child.id), [ids[2], ids[0], ids[1]]);

    const nowhere = reduce(state, { type: 'move', id: ids[1] ?? '', parentId: root, index: 1 }, d);
    assert.deepEqual(nowhere.rule.when.children.map((child) => child.id), ids);
  });

  it('moves a node into another group', () => {
    const { state, deps: d, ids } = threeInARow();
    const withGroup = reduce(state, { type: 'addGroup' }, d);
    const groupId = withGroup.selectedId ?? '';

    const moved = reduce(withGroup, { type: 'move', id: ids[0] ?? '', parentId: groupId, index: 0 }, d);
    const target = findNode(moved.rule.when, groupId) as GroupNode;

    assert.deepEqual(target.children.map((child) => child.id), [ids[0]]);
    assert.equal(countNodes(moved.rule.when), countNodes(withGroup.rule.when));
  });

  it('refuses to drop a group inside itself', () => {
    const { state, deps: d } = start();
    const withGroup = reduce(state, { type: 'addGroup' }, d);
    const outer = withGroup.selectedId ?? '';
    const withInner = reduce(withGroup, { type: 'addGroup', parentId: outer }, d);
    const inner = withInner.selectedId ?? '';

    // The result would be a tree that is no longer a tree, and every walker in
    // the system would hang on it.
    assert.equal(reduce(withInner, { type: 'move', id: outer, parentId: inner, index: 0 }, d), withInner);
  });
});

describe('history', () => {
  it('undoes and redoes an edit', () => {
    const { state, deps: d } = start();
    const added = reduce(state, { type: 'addCondition' }, d);

    assert.equal(canUndo(added), true);
    const undone = reduce(added, { type: 'undo' }, d);
    assert.equal(stringifyRule(undone.rule), stringifyRule(state.rule));

    assert.equal(canRedo(undone), true);
    const redone = reduce(undone, { type: 'redo' }, d);
    assert.equal(stringifyRule(redone.rule), stringifyRule(added.rule));
  });

  it('collapses consecutive edits to the same value into one step', () => {
    const { state, deps: d } = start();
    const id = (state.rule.when.children[0] as { id: string }).id;

    // What typing looks like: one action per keystroke.
    let typed = state;
    for (const value of [1, 12, 123, 1234]) {
      typed = reduce(typed, { type: 'setOperand', id, slot: 0, operand: literal(value) }, d);
    }

    assert.equal(typed.past.length, 1, 'one undo step, not four');
    const undone = reduce(typed, { type: 'undo' }, d);
    assert.equal(stringifyRule(undone.rule), stringifyRule(state.rule));
  });

  it('starts a new step for a different value', () => {
    const { state, deps: d } = start();
    const id = (state.rule.when.children[0] as { id: string }).id;

    const edited = run(
      state,
      d,
      { type: 'setOperand', id, slot: 0, operand: literal(1) },
      { type: 'setOperand', id, slot: 'left', operand: field('order.subtotal') },
    );

    assert.equal(edited.past.length, 2);
  });

  it('does not record a selection', () => {
    const { state, deps: d } = start();
    const selected = reduce(state, { type: 'select', id: state.rule.when.id }, d);

    // Pressing undo after clicking a row should give back the last EDIT.
    assert.equal(canUndo(selected), false);
    assert.equal(selectedNode(selected)?.id, state.rule.when.id);
  });

  it('throws away the future when a new edit branches from an undo', () => {
    const { state, deps: d } = start();
    const undone = run(state, d, { type: 'addCondition' }, { type: 'undo' });
    assert.equal(canRedo(undone), true);

    const branched = reduce(undone, { type: 'addGroup' }, d);
    // Offering the old future back is how an editor loses somebody's work.
    assert.equal(canRedo(branched), false);
  });

  it('keeps history bounded', () => {
    const { state } = start();
    const limited: ReducerDeps = { ids: nextId, registry, historyLimit: 5 };

    let current = state;
    for (let step = 0; step < 20; step += 1) {
      current = reduce(current, { type: 'addCondition' }, limited);
    }

    assert.equal(current.past.length, 5, 'an unbounded history is a memory leak');
  });

  it('shares structure between history entries', () => {
    const { state, deps: d } = start();
    const withGroup = reduce(state, { type: 'addGroup' }, d);
    const edited = reduce(withGroup, { type: 'addCondition', parentId: withGroup.selectedId ?? '' }, d);

    // The untouched first condition is the SAME object in both versions, which
    // is why fifty undo steps cost about what one deep clone would.
    assert.equal(edited.rule.when.children[0], withGroup.rule.when.children[0]);
  });

  it('forgets history when a different rule is loaded', () => {
    const { state, deps: d } = start();
    const edited = reduce(state, { type: 'addCondition' }, d);
    const loaded = reduce(edited, { type: 'load', rule: sample() }, d);

    assert.equal(canUndo(loaded), false);
    assert.equal(loaded.selectedId, null);
  });
});

describe('dirtiness', () => {
  it('measures against the last save, and ignores a rename', () => {
    const { state, deps: d } = start();
    assert.equal(isDirty(state), false);

    const renamed = reduce(state, { type: 'setMeta', patch: { name: 'Something else' } }, d);
    // Worth saving, not worth warning somebody they are about to lose. An editor
    // that cries "unsaved changes" at a rename trains people to ignore it.
    assert.equal(isDirty(renamed), false);

    const changed = reduce(renamed, { type: 'addCondition' }, d);
    assert.equal(isDirty(changed), true);

    assert.equal(isDirty(reduce(changed, { type: 'markSaved' }, d)), false);
  });

  it('is clean again when an edit is undone', () => {
    const { state, deps: d } = start();
    const undone = run(state, d, { type: 'addCondition' }, { type: 'undo' });
    assert.equal(isDirty(undone), false);
  });
});

describe('actions', () => {
  it('adds, patches and removes on either branch', () => {
    const { state, deps: d } = start();
    const added = run(
      state,
      d,
      { type: 'addAction', actionType: 'reject' },
      { type: 'addAction', actionType: 'allow', branch: 'otherwise' },
    );

    assert.equal(added.rule.then.length, 1);
    assert.equal(added.rule.otherwise?.length, 1);

    const id = added.rule.then[0]?.id ?? '';
    const patched = reduce(added, { type: 'setAction', id, patch: { target: 'order.total' } }, d);
    assert.equal(patched.rule.then[0]?.target, 'order.total');

    // The branch is worked out from the id, so a caller never has to say.
    const removed = reduce(patched, { type: 'removeAction', id }, d);
    assert.equal(removed.rule.then.length, 0);
    assert.equal(removed.rule.otherwise?.length, 1);
  });

  it('clears a field when a patch names it as undefined', () => {
    const { state, deps: d } = start();
    const added = reduce(state, { type: 'addAction', actionType: 'reject' }, d);
    const id = added.rule.then[0]?.id ?? '';

    const targeted = reduce(added, { type: 'setAction', id, patch: { target: 'a' } }, d);
    const cleared = reduce(targeted, { type: 'setAction', id, patch: { target: undefined } }, d);

    assert.equal('target' in (cleared.rule.then[0] ?? {}), false);
    assert.equal(validateRule(cleared.rule).valid, true);
  });
});

describe('validation for a form', () => {
  it('puts each problem on the row that caused it', () => {
    const broken = sample();
    const conditionId = (broken.when.children[0] as { id: string }).id;
    (broken.when.children[0] as { left: unknown }).left = { source: 'field', path: '2bad' };

    const result = validation(broken);
    assert.equal(result.valid, false);
    // Nobody editing a condition wants to be told about
    // `$.when.children[0].left.path`.
    assert.deepEqual([...result.byNode.keys()], [conditionId]);
  });

  it('resolves an AST path to the closest node above it', () => {
    const document = sample();
    const conditionId = document.when.children[0]?.id;

    assert.equal(nodeIdForPath(document, '$.when'), document.when.id);
    assert.equal(nodeIdForPath(document, '$.when.children[0]'), conditionId);
    assert.equal(nodeIdForPath(document, '$.when.children[0].args[0].value'), conditionId);
    assert.equal(nodeIdForPath(document, '$.name'), null);
    assert.equal(nodeIdForPath(document, undefined), null);
  });
});

describe('the store', () => {
  it('tells subscribers when something changed, and only then', () => {
    const store = createRuleStore(sample(), deps());
    let notified = 0;
    const unsubscribe = store.subscribe(() => {
      notified += 1;
    });

    store.actions.addCondition();
    assert.equal(notified, 1);

    // An edit that changes nothing must not re-render anything.
    store.actions.remove('does-not-exist');
    assert.equal(notified, 1);

    store.actions.undo();
    assert.equal(notified, 2);

    unsubscribe();
    store.actions.addCondition();
    assert.equal(notified, 2);
  });

  it('hands out a new state object per change and never touches the old one', () => {
    const store = createRuleStore(sample(), deps());
    const before = store.getState();
    const childrenBefore = before.rule.when.children.length;

    store.actions.addGroup();

    assert.notEqual(store.getState(), before, 'a snapshot comparison is how React sees the change');
    assert.equal(before.rule.when.children.length, childrenBefore, 'the old snapshot still reads as it did');
    assert.equal(store.getState().rule.when.children.length, childrenBefore + 1);
  });

  it('finds a node s parent, and says so for the root', () => {
    const store = createRuleStore(sample(), deps());
    store.actions.addCondition();
    const state = store.getState();

    assert.equal(parentOf(state.rule.when, state.selectedId ?? '')?.id, state.rule.when.id);
    assert.equal(parentOf(state.rule.when, state.rule.when.id), null);
    assert.equal(parentOf(state.rule.when, 'missing'), null);
  });
});

describe('field providers', () => {
  const provider = (id: string, fields: { path: string; label: string }[]): FieldProviderPlugin => ({
    id,
    fields: () =>
      Promise.resolve(fields.map((entry) => ({ ...entry, type: 'string' as const, group: 'Order' }))),
  });

  it('merges every provider, first claim on a path winning', () => {
    const host = provider('host', [{ path: 'order.total', label: 'Order value' }]);
    const shared = provider('shared', [
      { path: 'order.total', label: 'Total' },
      { path: 'order.id', label: 'Order id' },
    ]);

    return resolveFields([host, shared]).then((resolved) => {
      assert.deepEqual(
        resolved.fields.map((entry) => entry.label),
        ['Order id', 'Order value'],
      );
      assert.deepEqual(resolved.diagnostics, []);
    });
  });

  it('keeps the providers that worked when one fails', () => {
    const working = provider('ok', [{ path: 'a', label: 'A' }]);
    const broken: FieldProviderPlugin = {
      id: 'broken',
      fields: () => Promise.reject(new Error('the schema server is down')),
    };

    return resolveFields([working, broken]).then((resolved) => {
      // Losing one source is a degraded list. Losing all of them because one
      // server was slow is a builder nobody can use.
      assert.deepEqual(resolved.fields.map((entry) => entry.path), ['a']);
      assert.equal(resolved.diagnostics[0]?.code, 'provider_failed');
      assert.match(resolved.diagnostics[0]?.message ?? '', /schema server/);
    });
  });
});
