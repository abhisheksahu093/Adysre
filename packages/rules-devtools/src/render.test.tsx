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
  rule,
  sequentialIds,
} from '@adysre/rules-core';
import type { GroupNode } from '@adysre/rules-types';
import { renderToStaticMarkup } from 'react-dom/server';

import { RuleDebugger } from './debugger.tsx';
import { debugRule } from './session.ts';

/**
 * Does it draw at all.
 *
 * A smoke test, like the builder's: what the debugger CONCLUDES is tested
 * without a renderer in `debug.test.ts`, and what is left for a renderer to
 * prove is that a real session - a skipped branch, a hidden error, a row that
 * decided - survives being drawn.
 */

const ids = sequentialIds();
const registry = createRegistry(builtinPlugins);
const context = createContext({ order: { total: 2000 }, customer: { tier: 'new' } }, { now: 0 });

const totalOver = (amount: number) =>
  condition(
    { left: field('order.total'), operator: 'greaterThan', args: [literal(amount)] },
    { ids },
  );

const tierIs = (tier: string) =>
  condition({ left: field('customer.tier'), operator: 'equals', args: [literal(tier)] }, { ids });

function sessionFor(when: GroupNode) {
  return debugRule(
    registry,
    rule({ name: 'Test', kind: 'validation', when }, { ids, now: () => 0 }),
    context,
  );
}

describe('the debugger renders', () => {
  it('names the row that decided, and shows what the operator received', () => {
    const failing = totalOver(5000);
    const html = renderToStaticMarkup(
      <RuleDebugger session={sessionFor(all([failing, tierIs('new')], { ids }))} />,
    );

    assert.ok(html.includes('Did not match'));
    assert.ok(html.includes('Decided by'));
    assert.ok(html.includes('greaterThan'));
    // The operands, exactly as the operator saw them.
    assert.ok(html.includes('2000, 5000'));
    // The branch that never ran is drawn rather than omitted.
    assert.ok(html.includes('Never ran'));
  });

  it('refuses to name a row when every condition contributed', () => {
    const html = renderToStaticMarkup(
      <RuleDebugger session={sessionFor(all([totalOver(1000), tierIs('new')], { ids }))} />,
    );

    assert.ok(html.includes('no single one decided'));
    assert.ok(!html.includes('Decided by'));
  });

  it('shouts when short-circuiting hid an error', () => {
    const broken = condition(
      { left: field('order.total'), operator: 'noSuchOperator', args: [] },
      { ids },
    );
    const html = renderToStaticMarkup(
      <RuleDebugger session={sessionFor(any([tierIs('new'), broken], { ids }))} />,
    );

    assert.ok(html.includes('Short-circuiting hid an error'));
    assert.ok(html.includes('The two runs disagree'));
    assert.ok(html.includes(broken.id));
  });

  it('says so when nothing was hidden', () => {
    const html = renderToStaticMarkup(
      <RuleDebugger session={sessionFor(all([totalOver(1000), tierIs('new')], { ids }))} />,
    );

    assert.ok(html.includes('Every branch ran'));
  });
});
