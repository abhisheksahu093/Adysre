import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { EntitlementError, describeRemaining, describeReset } from './client';
import type { FeatureUsage } from './types';

/**
 * The browser-side helpers.
 *
 * Pure, so the copy a user actually reads is testable without a render. The
 * cases that matter are the ones where a plausible-looking string would be a
 * lie: "1 downloads left", or "resets soon" for a quota that never resets.
 */

function feature(overrides: Partial<FeatureUsage> = {}): FeatureUsage {
  return {
    key: 'tools.qr.download',
    module: 'tools',
    name: 'QR code downloads',
    description: null,
    meterKind: 'flow',
    enforcement: 'client-reported',
    unit: 'download',
    limit: 5,
    used: 2,
    remaining: 3,
    windowKind: 'lifetime',
    windowSeconds: null,
    resetsAt: null,
    allowed: true,
    locked: false,
    ...overrides,
  };
}

describe('describeRemaining', () => {
  it('counts what is left', () => {
    assert.equal(describeRemaining(feature()), '3 downloads left');
  });

  it('does not say "1 downloads"', () => {
    assert.equal(describeRemaining(feature({ remaining: 1 })), '1 download left');
  });

  it('says unlimited rather than a number', () => {
    // A large number here would read as a real quota and invite someone to
    // count down toward it.
    assert.equal(describeRemaining(feature({ limit: null, remaining: null })), 'Unlimited');
  });

  it('distinguishes locked from spent', () => {
    // Zero-limit means the feature is not on this tier at all, which is an
    // upgrade prompt rather than a wait.
    assert.equal(
      describeRemaining(feature({ limit: 0, remaining: 0, locked: true })),
      'Not in your plan',
    );
  });

  it('says zero left rather than a negative', () => {
    assert.equal(describeRemaining(feature({ used: 9, remaining: 0 })), '0 downloads left');
  });
});

describe('describeReset', () => {
  const now = new Date('2026-07-27T12:00:00Z');

  it('says nothing for a quota that never resets', () => {
    // Implying that waiting helps sends a user away to wait for something that
    // will never happen.
    assert.equal(describeReset(feature({ resetsAt: null }), now), null);
  });

  it('counts minutes, hours and days', () => {
    assert.equal(describeReset(feature({ resetsAt: '2026-07-27T12:30:00Z' }), now), 'in 30 minutes');
    assert.equal(describeReset(feature({ resetsAt: '2026-07-27T18:00:00Z' }), now), 'in 6 hours');
    assert.equal(describeReset(feature({ resetsAt: '2026-07-30T12:00:00Z' }), now), 'in 3 days');
  });

  it('does not say "1 minutes"', () => {
    assert.equal(describeReset(feature({ resetsAt: '2026-07-27T12:00:30Z' }), now), 'in 1 minute');
    assert.equal(describeReset(feature({ resetsAt: '2026-07-27T13:00:00Z' }), now), 'in 1 hour');
  });

  it('handles a reset that has already passed', () => {
    // The cached snapshot can outlive its own window. "shortly" is honest;
    // "in -3 minutes" is not.
    assert.equal(describeReset(feature({ resetsAt: '2026-07-27T11:57:00Z' }), now), 'shortly');
  });
});

describe('EntitlementError', () => {
  it('separates a quota refusal from an outage', () => {
    // Treating a 503 as a spent quota would show an upgrade prompt for our own
    // downtime, which is the worst possible moment to ask for money.
    const quota = new EntitlementError('QUOTA_EXCEEDED', 'spent', { featureKey: 'x', limit: 5 });
    assert.equal(quota.isQuota, true);
    assert.equal(quota.denial?.limit, 5);

    const outage = new EntitlementError('PERSISTENCE_UNAVAILABLE', 'down');
    assert.equal(outage.isQuota, false);
    assert.equal(outage.denial, null);
  });
});
