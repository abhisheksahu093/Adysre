import { all, condition, field, literal, rule, sequentialIds } from '@adysre/rules-core';
import type {
  ActionPlugin,
  FieldProviderPlugin,
  JsonValue,
  RuleDocument,
} from '@adysre/rules-types';

/**
 * What the playground gives the builder to work with.
 *
 * Kept out of the component on purpose: the schema, the sample subject and the
 * starter rule are data, and a component that held them inline would be a
 * component nobody could point at a different domain. Swapping an order for a
 * support ticket is a change to this file alone.
 *
 * It is also what a REAL host supplies. A field provider is normally a JSON
 * Schema, a database table or a form definition; this one is a literal list,
 * which is the same plugin contract with the least ceremony.
 */

/**
 * The instant the sample is evaluated at.
 *
 * Fixed rather than `Date.now()`, and passed to both the builder's preview and
 * the debugger. Two reasons, and both matter: the page is rendered on the server
 * and again on the client, so a moving clock is a hydration mismatch; and the
 * order below was placed on a specific day, so `today` has to be a specific day
 * too or a rule about `placedAt` explains nothing.
 */
export const EVALUATED_AT = Date.parse('2026-07-26T00:00:00.000Z');

/**
 * Where the playground keeps what somebody saved.
 *
 * Namespaced rather than the adapter's default, so a sandbox cannot collide
 * with whatever a real rules module stores at the same origin later.
 */
export const RULES_STORAGE_KEY = 'adysre.rules.playground';

/** The subject a rule here is written against. */
export const SAMPLE_ORDER: JsonValue = {
  order: {
    total: 2400,
    currency: 'EUR',
    placedAt: '2026-07-20',
    itemCount: 3,
    tags: ['express', 'gift'],
  },
  customer: {
    tier: 'new',
    country: 'DE',
    lifetimeValue: 2400,
    verified: false,
  },
};

export const orderFields: FieldProviderPlugin = {
  id: 'playground.order',
  fields: () => [
    { path: 'order.total', label: 'Order total', type: 'number', group: 'Order' },
    { path: 'order.currency', label: 'Currency', type: 'string', group: 'Order' },
    { path: 'order.placedAt', label: 'Placed at', type: 'date', group: 'Order' },
    { path: 'order.itemCount', label: 'Item count', type: 'number', group: 'Order' },
    { path: 'order.tags', label: 'Tags', type: 'array', group: 'Order' },
    {
      path: 'customer.tier',
      label: 'Tier',
      type: 'string',
      group: 'Customer',
      // A closed set, so the builder draws a select instead of a text box and
      // nobody can typo one of the four values that mean anything.
      options: [
        { value: 'new', label: 'New' },
        { value: 'bronze', label: 'Bronze' },
        { value: 'silver', label: 'Silver' },
        { value: 'gold', label: 'Gold' },
      ],
    },
    { path: 'customer.country', label: 'Country', type: 'string', group: 'Customer' },
    { path: 'customer.lifetimeValue', label: 'Lifetime value', type: 'number', group: 'Customer' },
    { path: 'customer.verified', label: 'Verified', type: 'boolean', group: 'Customer' },
  ],
};

/**
 * Outcomes this playground understands.
 *
 * Nothing ships with the engine, deliberately: what a matching rule DOES is the
 * one thing a rules engine cannot know, so a host declares it. These carry no
 * `apply` for the same reason - the engine reports the intent and the host
 * decides whether `reject` is a form error or a message on a queue.
 */
export const ORDER_ACTIONS: ActionPlugin[] = [
  { id: 'reject', kinds: ['validation'], requiresTarget: true },
  { id: 'requireApproval', kinds: ['validation', 'workflow'] },
  { id: 'setField', requiresTarget: true, requiresValue: true },
  { id: 'addTag', requiresValue: true },
];

/**
 * When the starter rule claims to have been written.
 *
 * Fixed, because `rule()` stamps `createdAt` from the clock and this document is
 * built on the server AND again on the client. Two different timestamps is two
 * different documents, which is a hydration mismatch waiting for the first
 * person who looks at the page on a slow connection.
 */
const AUTHORED_AT = Date.parse('2026-01-01T00:00:00.000Z');

/**
 * The rule the playground opens with.
 *
 * Built rather than written as a literal, so it carries real ids and passes
 * `validateRule` exactly as a stored document would. It is also the spec's own
 * example, which makes the natural-language panel immediately checkable against
 * the sentence in `documents/RULES_ENGINE.md`.
 *
 * Ids come from `sequentialIds` and the clock is fixed, so two calls produce
 * the SAME document. That is the engine's own convention - "everything is
 * injectable that a test needs to fix" - and here it is what makes server and
 * client agree.
 */
export function starterRule(): RuleDocument {
  const options = { ids: sequentialIds(), now: () => AUTHORED_AT };

  return rule(
    {
      name: 'Large orders from new customers need approval',
      description:
        'A starting point. Edit anything, and watch the sentence and the verdict follow.',
      kind: 'validation',
      tags: ['orders', 'approval'],
      when: all(
        [
          condition(
            { left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] },
            options,
          ),
          condition(
            { left: field('customer.tier'), operator: 'equals', args: [literal('new')] },
            options,
          ),
        ],
        options,
      ),
      then: [{ id: 'a_require_approval', type: 'requireApproval' }],
    },
    options,
  );
}
