import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  action,
  all,
  any,
  builtinPlugins,
  condition,
  createRegistry,
  field,
  fn,
  group,
  literal,
  none,
  rule,
  sequentialIds,
  variable,
} from '@adysre/rules-core';
import type { OperatorPlugin } from '@adysre/rules-types';

import { englishPhrases } from './phrases';
import {
  createNrlRenderer,
  describeCondition,
  describeNode,
  describeRule,
  humanisePath,
  toPlainText,
} from './index';

/**
 * Renderer tests.
 *
 * Two things are being pinned down. The obvious one: the sentences read the way
 * a person would write them. The one that matters more: the STRUCTURE survives -
 * a field stays identifiable as a field after the operator has written a
 * sentence around it, because that is what a builder highlights and a debugger
 * colours, and neither can recover it from prose.
 */

const nextId = sequentialIds();
const ids = () => ({ ids: nextId });
const plugins = createRegistry(builtinPlugins);
const options = { plugins, locale: 'en-GB' };

function textOf(node: Parameters<typeof describeNode>[0]): string {
  return toPlainText(describeNode(node, options), englishPhrases);
}

function sentence(...args: Parameters<typeof describeCondition>): string {
  return describeCondition(...args)
    .map((segment) => segment.text)
    .join('');
}

describe('conditions', () => {
  it('lets the operator write its own sentence', () => {
    const node = condition(
      { left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] },
      ids(),
    );
    assert.equal(sentence(node, options), 'order total is greater than 1,000');
  });

  it('keeps the operands identifiable after the operator has written around them', () => {
    const node = condition(
      { left: field('order.total'), operator: 'between', args: [literal(10), variable('cap')] },
      ids(),
    );
    const segments = describeCondition(node, options);

    assert.deepEqual(
      segments.map((segment) => segment.type),
      ['field', 'text', 'value', 'text', 'variable'],
    );
    assert.deepEqual(
      segments.filter((segment) => segment.type === 'field').map((segment) => segment.path),
      ['order.total'],
    );
    // The words between them belong to the operator, and are not styled.
    assert.equal(segments[1]?.text, ' is between ');
  });

  it('describes an operator with no sentence of its own from its id', () => {
    const quiet: OperatorPlugin = { id: 'sameShapeAs', arity: 1, evaluate: () => true };
    const node = condition(
      { left: field('a'), operator: 'sameShapeAs', args: [literal('x')] },
      ids(),
    );
    assert.equal(
      sentence(node, { plugins: plugins.extend({ operators: [quiet] }) }),
      'a same shape as "x"',
    );
  });

  it('says it cannot describe an operator nobody registered, instead of throwing', () => {
    const node = condition({ left: field('a'), operator: 'isPurple' }, ids());
    const segments = describeCondition(node, options);

    assert.equal(segments.length, 1);
    assert.equal(segments[0]?.type, 'unknown');
    assert.match(segments[0]?.text ?? '', /isPurple/);
  });

  it('negates a condition without asking the operator to', () => {
    const node = condition(
      { left: field('a'), operator: 'isEmpty', negate: true },
      ids(),
    );
    assert.equal(sentence(node, options), 'it is not true that a is empty');
  });

  it('renders nested function operands, and the operands inside them', () => {
    const node = condition(
      {
        left: fn('daysBetween', field('order.placedAt'), fn('today')),
        operator: 'greaterThan',
        args: [literal(30)],
      },
      ids(),
    );
    assert.equal(
      sentence(node, options),
      'days between order placed at and today is greater than 30',
    );

    const segments = describeCondition(node, options);
    // `today` mentions none of its operands, so it stays one labelled thing
    // rather than dissolving into the sentence around it.
    const today = segments.find((segment) => segment.type === 'function');
    assert.equal(today?.text, 'today');
  });

  it('refuses to describe operands nested past the ceiling', () => {
    let operand = field('a');
    for (let level = 0; level < 6; level += 1) operand = fn('lower', operand);

    const node = condition({ left: operand, operator: 'isEmpty' }, ids());
    assert.match(sentence(node, { ...options, maxDepth: 3 }), /nested too deeply/);
  });
});

describe('values', () => {
  const of = (value: Parameters<typeof literal>[0]): string =>
    sentence(condition({ left: field('a'), operator: 'equals', args: [literal(value)] }, ids()), options);

  it('writes numbers, text, booleans and nothing the way a person would', () => {
    assert.equal(of(1234567), 'a is 1,234,567');
    assert.equal(of('gold'), 'a is "gold"');
    assert.equal(of(true), 'a is yes');
    assert.equal(of(null), 'a is nothing');
  });

  it('writes a list as a list', () => {
    assert.equal(of(['new', 'silver', 'gold']), 'a is "new", "silver" or "gold"');
    assert.equal(of([]), 'a is an empty list');
  });

  it('writes a date as a date, in UTC', () => {
    // Formatted in the reader's zone, midnight UTC shows as the previous day to
    // half the world, and the same rule reads differently depending on who
    // opened it.
    assert.equal(of('2026-07-26'), 'a is 26 Jul 2026');
    assert.equal(of('10'), 'a is "10"', 'text that merely looks numeric is still text');
  });

  it('formats for the locale it was given', () => {
    const node = condition({ left: field('a'), operator: 'equals', args: [literal(1234.5)] }, ids());
    assert.equal(sentence(node, { plugins, locale: 'de-DE' }), 'a is 1.234,5');
  });
});

describe('field labels', () => {
  it('humanises the whole path, because two fields can share a last segment', () => {
    assert.equal(humanisePath('order.total'), 'order total');
    assert.equal(humanisePath('customer.placedAt'), 'customer placed at');
    assert.equal(humanisePath('order.items[0].price'), 'order items #1 price');
  });

  it('prefers the labels a host supplies', () => {
    const node = condition(
      { left: field('order.total'), operator: 'isEmpty' },
      ids(),
    );
    assert.equal(
      sentence(node, { ...options, fields: { 'order.total': 'the order value' } }),
      'the order value is empty',
    );
  });
});

describe('groups', () => {
  const total = () =>
    condition({ left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] }, ids());
  const tier = () =>
    condition({ left: field('customer.tier'), operator: 'equals', args: [literal('new')] }, ids());

  it('indents an outline, children under their heading', () => {
    const tree = all([total(), any([tier(), total()], ids())], ids());

    assert.equal(
      textOf(tree),
      [
        'all of these are true:',
        '  - order total is greater than 1,000',
        '  - any of these are true:',
        '    - customer tier is "new"',
        '    - order total is greater than 1,000',
      ].join('\n'),
    );
  });

  it('says nothing about a group that holds one condition', () => {
    // `all(X)` is X, and a heading above a single bullet is noise a reader has
    // to see past.
    assert.equal(textOf(all([total()], ids())), 'order total is greater than 1,000');
    assert.equal(textOf(all([all([any([total()], ids())], ids())], ids())), 'order total is greater than 1,000');
  });

  it('keeps a single-child group when it inverts', () => {
    assert.equal(
      textOf(none([total()], ids())),
      'none of these are true:\n  - order total is greater than 1,000',
    );
    assert.equal(
      textOf(group('all', [total()], { ...ids(), negate: true })),
      'not all of these are true:\n  - order total is greater than 1,000',
    );
  });

  it('applies De Morgan in the words rather than in the logic', () => {
    // `not(any)` really is `none`, and saying so reads better than wrapping the
    // heading in "it is not true that".
    const negatedAny = group('any', [total(), tier()], { ...ids(), negate: true });
    assert.match(textOf(negatedAny), /^none of these are true:/);

    const negatedNone = group('none', [total(), tier()], { ...ids(), negate: true });
    assert.match(textOf(negatedNone), /^any of these are true:/);
  });

  it('describes an empty group as no restriction at all', () => {
    assert.equal(textOf(all([], ids())), 'this rule always applies');
  });

  it('describes a tree deep enough to overflow a recursive renderer', () => {
    const shared = ids();
    let tree = none([total()], shared);
    for (let level = 0; level < 20_000; level += 1) tree = none([tree], shared);

    const lines = describeNode(tree, options);
    assert.equal(lines.length, 20_002);
  });
});

describe('whole rules', () => {
  it('reads as an outline a business user could check', () => {
    const shared = ids();
    const document = rule(
      {
        name: 'Large orders from new customers need approval',
        kind: 'validation',
        when: all(
          [
            condition(
              { left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] },
              shared,
            ),
            any(
              [
                condition(
                  { left: field('customer.tier'), operator: 'equals', args: [literal('new')] },
                  shared,
                ),
                condition(
                  { left: field('order.placedAt'), operator: 'before', args: [fn('today')] },
                  shared,
                ),
              ],
              shared,
            ),
          ],
          shared,
        ),
        then: [action({ type: 'reject', target: 'order.total' }, shared)],
      },
      shared,
    );

    assert.equal(
      describeRule(document, options).text,
      [
        'Large orders from new customers need approval',
        'When all of these are true:',
        '  - order total is greater than 1,000',
        '  - any of these are true:',
        '    - customer tier is "new"',
        '    - order placed at is before today',
        'Then reject order total',
      ].join('\n'),
    );
  });

  it('puts a single condition on the When line', () => {
    const shared = ids();
    const document = rule(
      {
        name: 'Free shipping',
        kind: 'validation',
        when: all(
          [condition({ left: field('order.total'), operator: 'greaterThanOrEqual', args: [literal(50)] }, shared)],
          shared,
        ),
        then: [action({ type: 'setField', target: 'order.shipping', value: literal(0) }, shared)],
      },
      shared,
    );

    assert.equal(
      describeRule(document, options).text,
      [
        'Free shipping',
        'When order total is at least 50',
        'Then set field order shipping to 0',
      ].join('\n'),
    );
  });

  it('lists several actions, and describes the otherwise branch', () => {
    const shared = ids();
    const document = rule(
      {
        name: 'Approval',
        kind: 'workflow',
        when: all([], shared),
        then: [
          action({ type: 'assign', target: 'order.owner', value: variable('manager') }, shared),
          action({ type: 'notify', target: 'customer.email' }, shared),
        ],
        otherwise: [action({ type: 'allow' }, shared)],
      },
      shared,
    );

    assert.equal(
      describeRule(document, options).text,
      [
        'Approval',
        'When this rule always applies',
        'Then all of these happen:',
        '  - assign order owner to manager',
        '  - notify customer email',
        'Otherwise allow',
      ].join('\n'),
    );
  });

  it('keeps every line pointing at the node it describes', () => {
    const shared = ids();
    const leaf = condition({ left: field('a'), operator: 'isEmpty' }, shared);
    const inner = any([leaf, condition({ left: field('b'), operator: 'isEmpty' }, shared)], shared);
    const document = rule({ name: 'Traceable', kind: 'filter', when: inner }, shared);

    const rendered = describeRule(document, options);
    const condition0 = rendered.lines.find((line) => line.nodeId === leaf.id);
    assert.equal(condition0?.role, 'condition');
    assert.equal(condition0?.depth, 1);
    assert.equal(rendered.lines[1]?.nodeId, inner.id, 'the When line is the group it describes');
  });
});

describe('localisation', () => {
  it('takes a whole vocabulary as data, not as a fork of the renderer', () => {
    const shared = ids();
    const document = rule(
      {
        name: 'Grosse Bestellungen',
        kind: 'validation',
        when: all(
          [
            condition({ left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] }, shared),
            condition({ left: field('customer.tier'), operator: 'isEmpty' }, shared),
          ],
          shared,
        ),
      },
      shared,
    );

    const text = describeRule(document, {
      plugins,
      locale: 'de-DE',
      phrases: { when: 'Wenn {conditions}', all: 'alles davon zutrifft:' },
      fields: { 'order.total': 'Bestellwert', 'customer.tier': 'Kundenstufe' },
      operatorText: (id, left, args) =>
        id === 'greaterThan' ? `${left} groesser als ${args[0]} ist` : undefined,
    }).text;

    assert.equal(
      text,
      [
        'Grosse Bestellungen',
        'Wenn alles davon zutrifft:',
        '  - Bestellwert groesser als 1.000 ist',
        // Not overridden, so it falls back to the plugin's own sentence rather
        // than disappearing.
        '  - Kundenstufe is empty',
      ].join('\n'),
    );
  });
});

describe('the renderer as a plugin', () => {
  it('registers under a format, so a host can replace the wording wholesale', () => {
    const renderer = createNrlRenderer(options);
    const registry = createRegistry(builtinPlugins, { renderers: [renderer] });

    const shared = ids();
    const document = rule(
      {
        name: 'Small',
        kind: 'filter',
        when: all([condition({ left: field('a'), operator: 'isEmpty' }, shared)], shared),
      },
      shared,
    );

    assert.equal(registry.renderer('nrl')?.renderRule(document), 'Small\nWhen a is empty');
  });
});
