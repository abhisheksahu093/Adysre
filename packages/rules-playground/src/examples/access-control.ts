import { all, condition, field, literal, rule, sequentialIds } from '@adysre/rules-core';
import type { Example } from '../types.ts';

/**
 * A permission rule, which is where `none` and a negated condition earn their
 * place: "has none of the blocked roles" is one row, and writing it as a chain
 * of `notEquals` is how a list of three becomes a list of nine.
 *
 * It is also the example that shows `0` and `false` are values. A suspended
 * account is `suspended: false`, not an absent field, and an engine that
 * treated the two the same would let a suspended user through.
 */
const ids = sequentialIds();
const NOW = Date.parse('2026-07-26T00:00:00.000Z');
const options = { ids, now: () => NOW };

export const accessControl: Example = {
  id: 'access-control',
  title: 'Who may export the customer list',
  blurb: 'List membership, a boolean that is really false, and a negated condition.',
  kind: 'permission',
  now: NOW,

  fields: [
    { path: 'user.roles', label: 'Roles', type: 'array', group: 'User' },
    { path: 'user.suspended', label: 'Suspended', type: 'boolean', group: 'User' },
    { path: 'user.mfaEnabled', label: 'Two-factor enabled', type: 'boolean', group: 'User' },
    { path: 'workspace.plan', label: 'Plan', type: 'string', group: 'Workspace' },
  ],

  actions: [
    { id: 'allow', labelKey: 'actions.allow', kinds: ['permission'] },
    { id: 'deny', labelKey: 'actions.deny', kinds: ['permission'] },
  ],

  rule: rule(
    {
      name: 'Export requires an unsuspended admin with two-factor',
      description: 'Every clause has to hold, which is what makes this readable as one sentence.',
      kind: 'permission',
      tags: ['security', 'export'],
      when: all(
        [
          condition(
            {
              left: field('user.roles'),
              operator: 'hasAnyOf',
              args: [literal(['owner', 'admin'])],
            },
            options,
          ),
          condition({ left: field('user.suspended'), operator: 'isFalse', args: [] }, options),
          condition({ left: field('user.mfaEnabled'), operator: 'isTrue', args: [] }, options),
          condition(
            {
              left: field('workspace.plan'),
              operator: 'isOneOf',
              args: [literal(['pro', 'enterprise'])],
            },
            options,
          ),
        ],
        options,
      ),
      then: [{ id: 'a_allow', type: 'allow' }],
      otherwise: [{ id: 'a_deny', type: 'deny' }],
    },
    options,
  ),

  samples: [
    {
      id: 'admin',
      label: 'An admin on pro, with two-factor',
      subject: {
        user: { roles: ['admin'], suspended: false, mfaEnabled: true },
        workspace: { plan: 'pro' },
      },
      expect: 'matched',
      expectActions: ['allow'],
    },
    {
      id: 'suspended-admin',
      label: 'The same admin, suspended',
      subject: {
        user: { roles: ['admin'], suspended: true, mfaEnabled: true },
        workspace: { plan: 'pro' },
      },
      expect: 'unmatched',
      expectActions: ['deny'],
    },
    {
      id: 'no-mfa',
      label: 'An owner without two-factor',
      subject: {
        user: { roles: ['owner'], suspended: false, mfaEnabled: false },
        workspace: { plan: 'enterprise' },
      },
      expect: 'unmatched',
      expectActions: ['deny'],
    },
    {
      id: 'member',
      label: 'A member, who is neither',
      // `all` stops at the first row, so nothing after it runs. The debugger
      // names this row as the one that decided.
      subject: {
        user: { roles: ['member'], suspended: false, mfaEnabled: true },
        workspace: { plan: 'enterprise' },
      },
      expect: 'unmatched',
      expectActions: ['deny'],
    },
  ],
};
