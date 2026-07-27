import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { soonestReset, windowResetsAt, windowStart } from './windows';

/**
 * Window arithmetic.
 *
 * Pure with the clock injected, which is the only reason a month boundary, a
 * leap day and a rolling week are testable at all rather than something you
 * find out about on the first of the month.
 */

const at = (iso: string) => new Date(iso);

describe('windowStart', () => {
  it('counts everything for lifetime and stock', () => {
    // Null means "no lower bound", not "now". Returning a date here would make
    // every lifetime quota reset silently.
    assert.equal(windowStart('lifetime', null, at('2026-07-27T12:00:00Z')), null);
    assert.equal(windowStart('none', null, at('2026-07-27T12:00:00Z')), null);
  });

  it('starts a day at UTC midnight', () => {
    const start = windowStart('day', null, at('2026-07-27T23:59:59Z'));
    assert.equal(start?.toISOString(), '2026-07-27T00:00:00.000Z');
  });

  it('starts a week on Monday', () => {
    // 2026-07-27 is a Monday, so it is its own start.
    assert.equal(
      windowStart('week', null, at('2026-07-27T09:00:00Z'))?.toISOString(),
      '2026-07-27T00:00:00.000Z',
    );
    // Sunday belongs to the week that began the PREVIOUS Monday. getUTCDay()
    // returns 0 for Sunday, so the naive version puts it at the start of the
    // next week and hands out a fresh quota a day early.
    assert.equal(
      windowStart('week', null, at('2026-08-02T23:00:00Z'))?.toISOString(),
      '2026-07-27T00:00:00.000Z',
    );
  });

  it('starts a month on the first', () => {
    assert.equal(
      windowStart('month', null, at('2026-07-27T12:00:00Z'))?.toISOString(),
      '2026-07-01T00:00:00.000Z',
    );
  });

  it('walks a rolling window back from now', () => {
    const start = windowStart('rolling', 24 * 3600, at('2026-07-27T12:00:00Z'));
    assert.equal(start?.toISOString(), '2026-07-26T12:00:00.000Z');
  });

  it('refuses a rolling window with no length', () => {
    // Left unchecked this counts over all time and never denies anything, while
    // looking exactly like a working limit.
    assert.throws(() => windowStart('rolling', null, at('2026-07-27T12:00:00Z')), /positive/);
    assert.throws(() => windowStart('rolling', 0, at('2026-07-27T12:00:00Z')), /positive/);
  });
});

describe('windowResetsAt', () => {
  it('never resets a lifetime quota', () => {
    // Null tells the UI to say "upgrade" rather than imply that waiting helps.
    assert.equal(windowResetsAt('lifetime', null, at('2026-07-27T12:00:00Z')), null);
    assert.equal(windowResetsAt('none', null, at('2026-07-27T12:00:00Z')), null);
  });

  it('resets a day at the next UTC midnight', () => {
    assert.equal(
      windowResetsAt('day', null, at('2026-07-27T23:59:00Z'))?.toISOString(),
      '2026-07-28T00:00:00.000Z',
    );
  });

  it('resets a month on the first of the next one', () => {
    assert.equal(
      windowResetsAt('month', null, at('2026-07-27T12:00:00Z'))?.toISOString(),
      '2026-08-01T00:00:00.000Z',
    );
  });

  it('rolls December into January without a special case', () => {
    // Date.UTC normalises month 12, which is why there is no branch for it.
    assert.equal(
      windowResetsAt('month', null, at('2026-12-15T12:00:00Z'))?.toISOString(),
      '2027-01-01T00:00:00.000Z',
    );
  });

  it('resets a week on the following Monday', () => {
    assert.equal(
      windowResetsAt('week', null, at('2026-07-29T12:00:00Z'))?.toISOString(),
      '2026-08-03T00:00:00.000Z',
    );
  });

  it('frees a rolling slot when the OLDEST event falls out', () => {
    // Not when the whole window resets. Telling someone to wait a week when a
    // slot frees in an hour loses a user for no reason.
    const oldest = at('2026-07-27T08:00:00Z');
    assert.equal(
      windowResetsAt('rolling', 24 * 3600, at('2026-07-27T12:00:00Z'), oldest)?.toISOString(),
      '2026-07-28T08:00:00.000Z',
    );
  });

  it('has no reset for a rolling window with nothing in it', () => {
    assert.equal(windowResetsAt('rolling', 3600, at('2026-07-27T12:00:00Z'), null), null);
  });
});

describe('soonestReset', () => {
  it('picks the limit that frees first', () => {
    const chosen = soonestReset([
      { id: 'week', resetsAt: at('2026-08-03T00:00:00Z') },
      { id: 'day', resetsAt: at('2026-07-28T00:00:00Z') },
    ]);
    assert.equal(chosen?.id, 'day');
  });

  it('prefers a limit that resets over one that never does', () => {
    // "Wait an hour" is a better answer to lead with than "upgrade" whenever
    // both are true.
    const chosen = soonestReset([
      { id: 'lifetime', resetsAt: null },
      { id: 'day', resetsAt: at('2026-07-28T00:00:00Z') },
    ]);
    assert.equal(chosen?.id, 'day');
  });

  it('falls back to the first when nothing ever resets', () => {
    const chosen = soonestReset([{ id: 'lifetime', resetsAt: null }]);
    assert.equal(chosen?.id, 'lifetime');
  });

  it('returns null for no limits', () => {
    assert.equal(soonestReset([]), null);
  });
});
