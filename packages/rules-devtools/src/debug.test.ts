import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import {
  all,
  any,
  builtinPlugins,
  condition,
  createContext,
  createRegistry,
  field,
  literal,
  none,
  rule,
  sequentialIds,
} from '@adysre/rules-core';
import type { JsonValue, RuleDocument, RuleNode } from '@adysre/rules-types';

import { compareRuns, hasFindings } from './compare.ts';
import { decisionFor, isSingleCause } from './decide.ts';
import { previewDuration, previewOperands, previewValue } from './format.ts';
import { debugRule } from './session.ts';
import { NOT_RUN, findTraceNode, flatten, traceTree, treeFromTrace } from './tree.ts';

/**
 * The debugger's answers, tested without a debugger.
 *
 * Same discipline as the builder: the components draw, and everything that had
 * to be DECIDED - which row settled the verdict, what the fast path skipped,
 * whether an error was hidden behind a short circuit - is a pure function a
 * test can call. These are also the assertions that would otherwise be made by
 * a person staring at a panel, which is the least reliable test there is.
 */

const registry = createRegistry(builtinPlugins);
const ids = sequentialIds();

const SUBJECT: JsonValue = { order: { total: 2000 }, customer: { tier: 'new' } };

function ruleOf(when: RuleNode): RuleDocument {
  return rule(
    { name: 'Test', kind: 'validation', when: when as never },
    { ids, now: () => Date.parse('2026-01-01T00:00:00.000Z') },
  );
}

function debug(when: RuleNode, subject: JsonValue = SUBJECT) {
  return debugRule(registry, ruleOf(when), createContext(subject, { now: 0 }));
}

const totalOver = (amount: number) =>
  condition(
    { left: field('order.total'), operator: 'greaterThan', args: [literal(amount)] },
    { ids },
  );

const tierIs = (tier: string) =>
  condition({ left: field('customer.tier'), operator: 'equals', args: [literal(tier)] }, { ids });

/** An operator this registry does not have, which is how a node errors. */
const broken = () =>
  condition({ left: field('order.total'), operator: 'noSuchOperator', args: [] }, { ids });

describe('the trace, back in the shape of the rule', () => {
  it('puts each event on its node and names what never ran', () => {
    // `all` stops at the first failure, so the second condition never runs.
    const first = totalOver(5000);
    const second = tierIs('new');
    const session = debug(all([first, second], { ids }));

    const tree = session.tree;
    assert.equal(tree.state, 'unmatched');
    assert.equal(findTraceNode(tree, first.id)?.state, 'unmatched');
    // The absence is VISIBLE. A tree built from events alone would simply not
    // have this node, which is the one a reader is asking about.
    assert.equal(findTraceNode(tree, second.id)?.state, NOT_RUN);
    assert.equal(findTraceNode(tree, second.id)?.event, undefined);
  });

  it('keeps every node of the rule, run or not', () => {
    const session = debug(all([totalOver(5000), tierIs('new'), tierIs('gold')], { ids }));
    // Root plus three conditions, whatever the executor got round to.
    assert.equal(flatten(session.tree).length, 4);
  });

  it('carries what the operator actually received', () => {
    const node = totalOver(1000);
    const event = findTraceNode(debug(all([node], { ids })).tree, node.id)?.event;

    assert.equal(event?.left, 2000);
    assert.deepEqual(event?.args, [1000]);
    assert.equal(event?.operator, 'greaterThan');
  });

  it('rebuilds a tree from a trace with no rule to hand', () => {
    const session = debug(all([totalOver(1000), tierIs('new')], { ids }));

    // Possible only because the executor records children before parents.
    const rebuilt = treeFromTrace(session.full.trace);
    assert.ok(rebuilt);
    assert.equal(rebuilt.children.length, 2);
    assert.equal(rebuilt.node.id, session.tree.node.id);
    assert.equal(rebuilt.depth, 0);
    assert.equal(rebuilt.children[0]?.depth, 1);
  });
});

describe('which row decided it', () => {
  it('names the condition an `all` stopped at', () => {
    const failing = totalOver(5000);
    const decision = decisionFor(debug(all([failing, tierIs('new')], { ids })).tree);

    assert.equal(decision.node.node.id, failing.id);
    assert.equal(decision.reason, 'shortCircuit');
    assert.ok(isSingleCause(decision));
    // Root first, deciding row last.
    assert.equal(decision.path.length, 2);
  });

  it('names the condition an `any` succeeded on', () => {
    const matching = tierIs('new');
    const decision = decisionFor(debug(any([totalOver(5000), matching], { ids })).tree);

    assert.equal(decision.node.node.id, matching.id);
    assert.equal(decision.reason, 'shortCircuit');
  });

  it('refuses to name one when every row contributed', () => {
    // `all` matching means all of them mattered. Naming the last would be the
    // debugger asserting something false about a rule somebody is about to edit.
    const decision = decisionFor(debug(all([totalOver(1000), tierIs('new')], { ids })).tree);

    assert.equal(decision.reason, 'collective');
    assert.ok(!isSingleCause(decision));
    assert.equal(decision.node, decision.path[0], 'stopped at the group');
  });

  it('walks through a group holding one child', () => {
    const only = totalOver(1000);
    const decision = decisionFor(debug(all([only], { ids })).tree);

    assert.equal(decision.node.node.id, only.id);
    assert.equal(decision.reason, 'sole');
  });

  it('follows a negated group to the child that really settled it', () => {
    // The group reports `matched` because `any` failed and negate flipped it.
    // Looking for the decider against the REPORTED verdict finds nothing; the
    // combinator's own verdict is what has to be read.
    const inner = any([totalOver(5000), tierIs('gold')], { ids });
    const negated: RuleNode = { ...inner, negate: true };
    const decision = decisionFor(debug(all([negated], { ids })).tree);

    assert.equal(decision.path[1]?.node.id, negated.id);
    assert.equal(decision.path[1]?.state, 'matched');
    // Nothing short-circuited inside: both children failed, so all contributed.
    assert.equal(decision.reason, 'collective');
  });

  it('lets an error outrank a combinator that had already decided', () => {
    const bad = broken();
    const decision = decisionFor(debug(all([bad, tierIs('new')], { ids })).tree);

    assert.equal(decision.node.node.id, bad.id);
    assert.equal(decision.reason, 'errored');
    assert.ok(isSingleCause(decision));
  });

  it('says so when there is nothing to decide', () => {
    const decision = decisionFor(debug(all([], { ids })).tree);

    // An empty group matches, all three combinators. Every rule starts here.
    assert.equal(decision.reason, 'empty');
    assert.equal(decision.node.state, 'matched');
  });

  it('handles `none`, where a match is what makes it fail', () => {
    const matching = tierIs('new');
    const decision = decisionFor(debug(none([matching], { ids })).tree);

    assert.equal(decision.node.node.id, matching.id);
    // A match is what makes `none` false, so this row settled it on its own -
    // which is a short circuit, and a more useful answer than "it was the only
    // one here" even though that is also true.
    assert.equal(decision.reason, 'shortCircuit');
    assert.ok(isSingleCause(decision));
  });
});

describe('what short-circuiting hid', () => {
  it('reports the branches the fast path never reached', () => {
    const skipped = tierIs('new');
    const session = debug(all([totalOver(5000), skipped], { ids }));

    assert.deepEqual(
      session.comparison.skipped.map((entry) => entry.nodeId),
      [skipped.id],
    );
    assert.equal(session.comparison.skipped[0]?.verdict, 'matched');
  });

  it('finds an error a passing sibling was hiding', () => {
    // This is the fault the second run exists for: the rule answers `matched`,
    // and the moment somebody reorders the group it answers `errored` instead.
    const session = debug(any([tierIs('new'), broken()], { ids }));

    assert.equal(session.outcome.verdict, 'matched');
    assert.equal(session.comparison.hiddenErrors.length, 1);
    assert.equal(session.comparison.agreed, false);
    assert.equal(session.comparison.fullVerdict, 'errored');
    assert.ok(hasFindings(session.comparison));
    assert.ok(session.comparison.hiddenErrors[0]?.error);
  });

  it('says nothing when nothing was skipped', () => {
    const session = debug(all([totalOver(1000), tierIs('new')], { ids }));

    assert.deepEqual(session.comparison.skipped, []);
    assert.equal(session.comparison.agreed, true);
    assert.ok(!hasFindings(session.comparison));
  });

  it('compares two outcomes on their own', () => {
    const session = debug(all([totalOver(5000), tierIs('new')], { ids }));
    const comparison = compareRuns(session.outcome, session.full);

    assert.equal(comparison.skipped.length, 1);
    assert.equal(comparison.fastVerdict, 'unmatched');
  });
});

describe('the run a debugger explains', () => {
  it('is the real one, with the exhaustive pass beside it', () => {
    const session = debug(all([totalOver(5000), tierIs('new')], { ids }));

    // The fast trace is short. The full one has everything.
    assert.ok(session.outcome.trace.length < session.full.trace.length);
    // And the tree of the full run leaves nothing unexplained.
    assert.ok(flatten(session.fullTree).every((entry) => entry.state !== NOT_RUN));
  });

  it('traces even when a caller asked for no trace', () => {
    const session = debugRule(
      registry,
      ruleOf(all([totalOver(1000)], { ids })),
      createContext(SUBJECT, { now: 0 }),
      { trace: false },
    );

    assert.ok(session.outcome.trace.length > 0, 'a session with no trace has nothing to show');
  });
});

describe('values, as a debugger shows them', () => {
  it('shows what was there, not a sentence about it', () => {
    // The renderer would say `gold` and `1,000`. A debugger answering "what did
    // the operator receive" must not invent a character that was not in the data.
    assert.equal(previewValue('gold'), '"gold"');
    assert.equal(previewValue(1000), '1000');
    assert.equal(previewValue(null), 'null');
    assert.equal(previewValue(false), 'false');
    assert.equal(previewValue(undefined), '');
    assert.equal(previewValue(['a', 'b']), '["a","b"]');
  });

  it('caps a value that would hang the row rendering it', () => {
    const long = previewValue(
      Array.from({ length: 500 }, (_, index) => index),
      40,
    );

    assert.ok(long.length <= 40, `${String(long.length)} exceeded the cap`);
    assert.ok(long.endsWith('…'));
  });

  it('puts the operands on one line', () => {
    assert.equal(previewOperands(2000, [1000]), '2000, 1000');
    assert.equal(previewOperands('gold', []), '"gold"');
    assert.equal(previewOperands(undefined, undefined), '');
  });

  it('keeps a decimal only where the fraction is the story', () => {
    // Most nodes are far under a millisecond, and `0ms` on every row tells a
    // reader nothing about which one was slow.
    assert.equal(previewDuration(0.125), '0.13ms');
    assert.equal(previewDuration(0), '0.00ms');
    assert.equal(previewDuration(12.4), '12ms');
    assert.equal(previewDuration(-1), '');
  });
});

describe('traceTree on its own', () => {
  it('takes a trace and a rule and needs nothing else', () => {
    const node = totalOver(1000);
    const document = ruleOf(all([node], { ids }));
    const session = debugRule(registry, document, createContext(SUBJECT, { now: 0 }));

    const tree = traceTree(document, session.outcome.trace);
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0]?.node.id, node.id);
    assert.equal(tree.children[0]?.depth, 1);
  });
});
