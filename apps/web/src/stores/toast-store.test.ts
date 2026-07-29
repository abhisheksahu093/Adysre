import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { DEFAULT_TOAST_DURATION, useToastStore } from './toast-store';

/**
 * The toast queue.
 *
 * Worth testing because every rule here exists to stop a specific failure the
 * view cannot recover from: duplicate ids make React reuse a running dismiss
 * timer for the wrong message, an uncapped queue covers the page it is
 * commenting on, and a de-duplicated toast that does not bump `seq` leaves the
 * refreshed message counting down on the original toast's clock.
 */

const reset = () => useToastStore.setState({ toasts: [] });
const push = useToastStore.getState().push;
const toasts = () => useToastStore.getState().toasts;

describe('toast store', () => {
  beforeEach(reset);

  it('gives every toast a distinct id, even within one tick', () => {
    const a = push({ title: 'first' });
    const b = push({ title: 'second' });
    assert.notEqual(a, b);
    assert.equal(new Set(toasts().map((t) => t.id)).size, 2);
  });

  it('defaults to info at the standard duration', () => {
    push({ title: 'plain' });
    const [toast] = toasts();
    assert.equal(toast?.variant, 'info');
    assert.equal(toast?.duration, DEFAULT_TOAST_DURATION);
  });

  it('keeps an explicit duration of zero rather than defaulting it', () => {
    // `0` means "pin this open". Treating it as missing (a falsy `??` would
    // not, but a `||` would) turns a message meant to stay into one that
    // vanishes after four seconds.
    push({ title: 'pinned', duration: 0 });
    assert.equal(toasts()[0]?.duration, 0);
  });

  it('caps the stack at three, dropping the oldest', () => {
    push({ title: 'one' });
    push({ title: 'two' });
    push({ title: 'three' });
    push({ title: 'four' });
    assert.deepEqual(
      toasts().map((t) => t.title),
      ['two', 'three', 'four'],
    );
  });

  it('replaces a toast with the same dedupe key instead of stacking it', () => {
    const first = push({ title: '2 downloads left', dedupeKey: 'quota:download' });
    const second = push({ title: '1 download left', dedupeKey: 'quota:download' });

    assert.equal(toasts().length, 1);
    // Same id, so the view updates the row in place rather than remounting it
    // and replaying the enter animation.
    assert.equal(first, second);
    assert.equal(toasts()[0]?.title, '1 download left');
  });

  it('bumps seq on a duplicate so the view restarts the dismiss timer', () => {
    push({ title: 'first', dedupeKey: 'k' });
    assert.equal(toasts()[0]?.seq, 0);
    push({ title: 'second', dedupeKey: 'k' });
    assert.equal(toasts()[0]?.seq, 1);
  });

  it('treats toasts without a dedupe key as unrelated', () => {
    push({ title: 'same words' });
    push({ title: 'same words' });
    assert.equal(toasts().length, 2);
  });

  it('dismisses by id and leaves the rest alone', () => {
    const keep = push({ title: 'keep' });
    const drop = push({ title: 'drop' });
    useToastStore.getState().dismiss(drop);
    assert.deepEqual(
      toasts().map((t) => t.id),
      [keep],
    );
  });

  it('clears everything', () => {
    push({ title: 'one' });
    push({ title: 'two' });
    useToastStore.getState().clear();
    assert.equal(toasts().length, 0);
  });
});
