import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import {
  all,
  any,
  builtinPlugins,
  condition,
  createRegistry,
  field,
  fn,
  literal,
  rule,
  sequentialIds,
} from '@adysre/rules-core';
import type { ActionPlugin, FieldProviderPlugin, RuleDocument } from '@adysre/rules-types';
import { renderToStaticMarkup } from 'react-dom/server';

import { RuleBuilder } from './rule-builder.tsx';

/**
 * Does it draw at all.
 *
 * Deliberately a SMOKE test and not a behaviour test. What the builder does
 * lives in the reducer and in the pure modules beside this one, and both are
 * tested without a renderer; what is left for a renderer to prove is that the
 * components can survive a real document - a nested group, a variadic operator,
 * a function operand, an action, an operator nobody registered - without
 * throwing.
 *
 * That is worth one test because this package recurses. A group renders groups
 * and an operand renders operands, so a mistake in either is a mistake that
 * only appears for a rule shaped a particular way, and rendering one such rule
 * end to end catches it where reading the code does not.
 */

const ids = sequentialIds();

const fields: FieldProviderPlugin = {
  id: 'test.fields',
  fields: () => [
    { path: 'order.total', label: 'Order total', type: 'number', group: 'Order' },
    { path: 'order.placedAt', label: 'Placed at', type: 'date', group: 'Order' },
    {
      path: 'customer.tier',
      label: 'Tier',
      type: 'string',
      group: 'Customer',
      options: [
        { value: 'new', label: 'New' },
        { value: 'gold', label: 'Gold' },
      ],
    },
  ],
};

const reject: ActionPlugin = { id: 'reject', kinds: ['validation'], requiresTarget: true };

const registry = createRegistry(builtinPlugins, { fields: [fields], actions: [reject] });

function sample(): RuleDocument {
  return rule(
    {
      name: 'Large orders from new customers need approval',
      description: 'Everything a row has to be able to draw, in one document.',
      kind: 'validation',
      when: all(
        [
          condition(
            {
              left: field('order.total'),
              operator: 'greaterThan',
              args: [literal(1000)],
            },
            { ids },
          ),
          any(
            [
              condition(
                { left: field('customer.tier'), operator: 'isOneOf', args: [literal(['new'])] },
                { ids },
              ),
              condition(
                { left: field('order.placedAt'), operator: 'before', args: [fn('today')] },
                { ids },
              ),
              // An operator this registry does not have. The row still draws,
              // and says so, rather than the builder falling over.
              condition({ left: field('order.total'), operator: 'noSuchOperator' }, { ids }),
            ],
            { ids },
          ),
        ],
        { ids },
      ),
      then: [{ id: 'a_1', type: 'reject', target: 'order.total' }],
      otherwise: [{ id: 'a_2', type: 'somethingUnregistered' }],
    },
    { ids },
  );
}

describe('the builder renders', () => {
  it('draws a rule with groups, functions, actions and an unknown operator', () => {
    const html = renderToStaticMarkup(
      <RuleBuilder
        now={Date.parse('2026-07-26T00:00:00.000Z')}
        registry={registry}
        rule={sample()}
        sample={{ order: { total: 2000, placedAt: '2026-01-01' }, customer: { tier: 'new' } }}
      />,
    );

    assert.ok(html.includes('Large orders from new customers need approval'));
    // The natural-language preview, rendered from segments rather than text.
    assert.ok(html.includes('is greater than'));
    // The unknown operator is named rather than silently rewritten.
    assert.ok(html.includes('noSuchOperator'));
    // The sample data matched, and the verdict says so.
    assert.ok(html.includes('Matched'));
  });

  it('draws a brand new rule, which is an empty group', () => {
    const html = renderToStaticMarkup(
      <RuleBuilder
        registry={registry}
        rule={rule({ name: 'Untitled', kind: 'validation' }, { ids })}
      />,
    );

    // An empty group matches, and a builder that said nothing would leave an
    // author assuming the opposite.
    assert.ok(html.includes('matches everything'));
  });

  it('disables every control when it is read only', () => {
    const count = (html: string): number => html.split('disabled=""').length - 1;

    const editable = renderToStaticMarkup(<RuleBuilder registry={registry} rule={sample()} />);
    const locked = renderToStaticMarkup(
      <RuleBuilder readOnly registry={registry} rule={sample()} />,
    );

    assert.ok(count(locked) > count(editable), 'read only disabled nothing');
  });

  it('renders the parts on their own, for a host that wants its own layout', () => {
    const html = renderToStaticMarkup(
      <RuleBuilder
        registry={registry}
        rule={sample()}
        showActions={false}
        showMeta={false}
        showPreview={false}
      />,
    );

    // The condition tree is still there; the panels around it are not.
    assert.ok(html.includes('Order total') || html.includes('order.total'));
    assert.ok(!html.includes('In words'), 'the preview was not asked for');
    assert.ok(!html.includes('Description'), 'the metadata panel was not asked for');
  });
});

describe('theming', () => {
  it('scopes a theme to the builder rather than the page', async () => {
    // Custom properties on the root, so two builders on one page can wear
    // different themes - which a stylesheet cannot do without a class each.
    const { darkRulesTheme } = await import('@adysre/rules-theme');
    const html = renderToStaticMarkup(
      <RuleBuilder registry={registry} rule={sample()} theme={darkRulesTheme} />,
    );

    assert.ok(html.includes('--background:#09090b'), 'the theme was not applied inline');
    assert.ok(html.includes('--primary-foreground:#0a0a0a'));
  });

  it('inherits the host when no theme is given', () => {
    const html = renderToStaticMarkup(<RuleBuilder registry={registry} rule={sample()} />);

    // No inline variables at all: a host with a design system already defines
    // these names, and overriding them would impose a second palette.
    assert.ok(!html.includes('--background:'));
  });
});
