import { all, any, condition, field, fn, literal, rule, sequentialIds } from '@adysre/rules-core';
import type { Example } from '../types.ts';

/**
 * The spec's own example, so the natural-language panel can be read against
 * `documents/RULES_ENGINE.md` without translating anything.
 *
 * It exercises the parts that interact: a nested `any` inside an `all`, a
 * function operand (`today`), and two outcomes. The date condition is why the
 * clock is fixed - `order.placedAt is before today` answers differently every
 * morning otherwise.
 */
const ids = sequentialIds();
const NOW = Date.parse('2026-07-26T00:00:00.000Z');
const options = { ids, now: () => NOW };

export const orderApproval: Example = {
  id: 'order-approval',
  title: 'Large orders from new customers need approval',
  blurb: 'A nested group, a date function, and two outcomes on one rule.',
  kind: 'validation',
  now: NOW,

  fields: [
    { path: 'order.total', label: 'Order total', type: 'number', group: 'Order' },
    { path: 'order.placedAt', label: 'Placed at', type: 'date', group: 'Order' },
    {
      path: 'customer.tier',
      label: 'Tier',
      type: 'string',
      group: 'Customer',
      options: [
        { value: 'new', label: 'New' },
        { value: 'bronze', label: 'Bronze' },
        { value: 'gold', label: 'Gold' },
      ],
    },
  ],

  actions: [
    { id: 'requireApproval', labelKey: 'actions.requireApproval', kinds: ['validation'] },
    { id: 'autoApprove', labelKey: 'actions.autoApprove', kinds: ['validation'] },
  ],

  rule: rule(
    {
      name: 'Large orders from new customers need approval',
      description: 'Anything over 1,000 from a new customer, or backdated, is held for a human.',
      kind: 'validation',
      tags: ['orders', 'approval'],
      when: all(
        [
          condition(
            { left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] },
            options,
          ),
          any(
            [
              condition(
                { left: field('customer.tier'), operator: 'equals', args: [literal('new')] },
                options,
              ),
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
      then: [{ id: 'a_hold', type: 'requireApproval' }],
      otherwise: [{ id: 'a_auto', type: 'autoApprove' }],
    },
    options,
  ),

  samples: [
    {
      id: 'new-customer',
      label: 'A large order from a new customer',
      subject: { order: { total: 2400, placedAt: '2026-07-26' }, customer: { tier: 'new' } },
      expect: 'matched',
      expectActions: ['requireApproval'],
    },
    {
      id: 'trusted-customer',
      label: 'The same order from a gold customer, placed today',
      subject: { order: { total: 2400, placedAt: '2026-07-26' }, customer: { tier: 'gold' } },
      // Both branches of the `any` fail, so the `all` fails - and the OTHERWISE
      // actions apply, which is the half of a rule people forget exists.
      expect: 'unmatched',
      expectActions: ['autoApprove'],
    },
    {
      id: 'backdated',
      label: 'A backdated order from a gold customer',
      subject: { order: { total: 2400, placedAt: '2026-07-01' }, customer: { tier: 'gold' } },
      expect: 'matched',
      expectActions: ['requireApproval'],
    },
    {
      id: 'small-order',
      label: 'A small order',
      // `all` short-circuits here: the second group never runs at all, which is
      // what the debugger's "show what was skipped" is for.
      subject: { order: { total: 40, placedAt: '2026-07-01' }, customer: { tier: 'new' } },
      expect: 'unmatched',
      expectActions: ['autoApprove'],
    },
  ],
};
