import { all, condition, field, fn, literal, rule, sequentialIds } from '@adysre/rules-core';
import type { Example } from '../types.ts';

/**
 * A calculation, and the example that shows an operand does not have to be a
 * literal. `order.total is at least basket.threshold` compares two FIELDS, and
 * `daysBetween` computes one - both are the same construct as a typed-in
 * number, which is why the AST has one operand union instead of special cases.
 *
 * `between` is inclusive at both ends, which is what "between" means to
 * everyone but a mathematician - the samples pin both boundaries so that stays
 * true.
 */
const ids = sequentialIds();
const NOW = Date.parse('2026-07-26T00:00:00.000Z');
const options = { ids, now: () => NOW };

export const discountTier: Example = {
  id: 'discount-tier',
  title: 'Loyalty discount for steady, long-standing customers',
  blurb: 'A field compared to another field, a computed value, and an inclusive range.',
  kind: 'calculation',
  now: NOW,

  fields: [
    { path: 'order.total', label: 'Order total', type: 'number', group: 'Order' },
    { path: 'basket.threshold', label: 'Free delivery threshold', type: 'number', group: 'Basket' },
    { path: 'customer.since', label: 'Customer since', type: 'date', group: 'Customer' },
    { path: 'customer.orders', label: 'Orders placed', type: 'number', group: 'Customer' },
  ],

  actions: [
    {
      id: 'setDiscount',
      labelKey: 'actions.setDiscount',
      kinds: ['calculation'],
      requiresTarget: true,
      requiresValue: true,
    },
  ],

  rule: rule(
    {
      name: 'Ten percent for loyal customers spending over the delivery threshold',
      description: 'Two years or more, between five and fifty orders, and over the threshold.',
      kind: 'calculation',
      tags: ['pricing', 'loyalty'],
      when: all(
        [
          // Field against field: no number is written into the rule at all, so
          // moving the threshold is a data change rather than an edit.
          condition(
            {
              left: field('order.total'),
              operator: 'greaterThanOrEqual',
              args: [field('basket.threshold')],
            },
            options,
          ),
          condition(
            {
              left: fn('daysBetween', field('customer.since'), fn('today')),
              operator: 'greaterThanOrEqual',
              args: [literal(730)],
            },
            options,
          ),
          condition(
            {
              left: field('customer.orders'),
              operator: 'between',
              args: [literal(5), literal(50)],
            },
            options,
          ),
        ],
        options,
      ),
      then: [
        {
          id: 'a_discount',
          type: 'setDiscount',
          target: 'order.discountPercent',
          value: { source: 'literal', value: 10 },
        },
      ],
    },
    options,
  ),

  samples: [
    {
      id: 'loyal',
      label: 'Four years, twelve orders, over the threshold',
      subject: {
        order: { total: 80 },
        basket: { threshold: 50 },
        customer: { since: '2022-01-01', orders: 12 },
      },
      expect: 'matched',
      expectActions: ['setDiscount'],
    },
    {
      id: 'lower-boundary',
      label: 'Exactly five orders, and exactly the threshold',
      // Both bounds inclusive, and `greaterThanOrEqual` at the threshold: the
      // two boundaries a range rule is most often wrong about.
      subject: {
        order: { total: 50 },
        basket: { threshold: 50 },
        customer: { since: '2020-01-01', orders: 5 },
      },
      expect: 'matched',
    },
    {
      id: 'upper-boundary',
      label: 'Exactly fifty orders',
      subject: {
        order: { total: 80 },
        basket: { threshold: 50 },
        customer: { since: '2020-01-01', orders: 50 },
      },
      expect: 'matched',
    },
    {
      id: 'wholesale',
      label: 'Fifty-one orders, which is past the band',
      subject: {
        order: { total: 900 },
        basket: { threshold: 50 },
        customer: { since: '2018-01-01', orders: 51 },
      },
      expect: 'unmatched',
    },
    {
      id: 'newcomer',
      label: 'A customer of three months',
      subject: {
        order: { total: 80 },
        basket: { threshold: 50 },
        customer: { since: '2026-04-01', orders: 9 },
      },
      expect: 'unmatched',
    },
  ],
};
