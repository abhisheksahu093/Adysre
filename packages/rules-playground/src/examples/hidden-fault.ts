import { any, condition, field, literal, rule, sequentialIds } from '@adysre/rules-core';
import type { Example } from '../types.ts';

/**
 * A rule that answers correctly by luck.
 *
 * The teaching example for the debugger, and the one worth reading twice. The
 * first condition matches, so `any` short-circuits and the second never runs -
 * and the second cannot run at all, because it compares a number to a word.
 *
 * The rule therefore reports `matched`, no diagnostic is raised, and every
 * report says it is fine. Reorder the group, or let a customer come along who
 * is not gold, and it reports `errored` instead. That is the fault
 * `shortCircuit: false` exists to surface, and nothing else in the system would
 * ever mention it.
 */
const ids = sequentialIds();
const NOW = Date.parse('2026-07-26T00:00:00.000Z');
const options = { ids, now: () => NOW };

export const hiddenFault: Example = {
  id: 'hidden-fault',
  title: 'A rule that passes for the wrong reason',
  blurb: 'A broken condition behind a passing one. The fast path never sees it.',
  kind: 'validation',
  now: NOW,

  fields: [
    { path: 'customer.tier', label: 'Tier', type: 'string', group: 'Customer' },
    { path: 'order.total', label: 'Order total', type: 'number', group: 'Order' },
  ],

  actions: [{ id: 'flag', labelKey: 'actions.flag', kinds: ['validation'] }],

  rule: rule(
    {
      name: 'Flag gold customers and unusually large orders',
      description:
        'The second condition compares a number to a word. Open the debugger and show what was skipped.',
      kind: 'validation',
      tags: ['debugging'],
      when: any(
        [
          condition(
            { left: field('customer.tier'), operator: 'equals', args: [literal('gold')] },
            options,
          ),
          // Deliberately wrong: the engine refuses to compare a number with a
          // string rather than answering `false`, because that is a mistake in
          // the rule and not a failed test.
          condition(
            { left: field('order.total'), operator: 'greaterThan', args: [literal('a lot')] },
            options,
          ),
        ],
        options,
      ),
      then: [{ id: 'a_flag', type: 'flag' }],
    },
    options,
  ),

  samples: [
    {
      id: 'gold',
      label: 'A gold customer, which hides the fault',
      subject: { customer: { tier: 'gold' }, order: { total: 2400 } },
      expect: 'matched',
      expectActions: ['flag'],
      // The point of the example: the real run is clean, and the exhaustive one
      // is not. `verifyExample` asserts both, so this cannot quietly become an
      // ordinary passing rule.
      expectHidden: true,
    },
    {
      id: 'bronze',
      label: 'A bronze customer, which exposes it',
      subject: { customer: { tier: 'bronze' }, order: { total: 2400 } },
      // Nothing short-circuits now, so the broken row runs and the rule errors.
      // An errored rule applies NO actions, from either branch.
      expect: 'errored',
      expectActions: [],
    },
  ],
};
