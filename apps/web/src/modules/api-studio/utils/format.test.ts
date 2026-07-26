import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { contentTypeOf, formatBytes, formatDuration, prettyPrint, previewKind } from './format';

/**
 * Formatting tests. These run on every response the user looks at, and the
 * pretty printer in particular has to survive input that is not what its
 * content type claims: a malformed body is exactly when someone is reading it.
 */

describe('formatBytes', () => {
  it('scales the unit and the precision with the number', () => {
    assert.equal(formatBytes(0, 'en'), '0 B');
    assert.equal(formatBytes(512, 'en'), '512 B');
    assert.equal(formatBytes(2_048, 'en'), '2 KB');
    assert.equal(formatBytes(1_536, 'en'), '1.5 KB');
    assert.equal(formatBytes(5 * 1_024 * 1_024, 'en'), '5 MB');
  });
});

describe('formatDuration', () => {
  it('switches to seconds past a thousand milliseconds', () => {
    assert.equal(formatDuration(0, 'en'), '0 ms');
    assert.equal(formatDuration(12.4, 'en'), '12 ms');
    assert.equal(formatDuration(1_500, 'en'), '1.5 s');
  });
});

describe('prettyPrint', () => {
  it('formats JSON, by content type or by shape', () => {
    assert.equal(prettyPrint('{"a":1}', 'application/json'), '{\n  "a": 1\n}');
    assert.equal(prettyPrint('[1,2]', null), '[\n  1,\n  2\n]');
  });

  it('returns malformed input untouched instead of hiding it', () => {
    assert.equal(prettyPrint('{"a":', 'application/json'), '{"a":');
    assert.equal(prettyPrint('not json at all', 'application/json'), 'not json at all');
  });

  it('indents markup one tag per line', () => {
    assert.equal(
      prettyPrint('<a><b>x</b></a>', 'text/html'),
      '<a>\n  <b>\n    x\n  </b>\n</a>',
    );
  });

  it('leaves plain text alone', () => {
    assert.equal(prettyPrint('hello', 'text/plain'), 'hello');
  });
});

describe('content type', () => {
  it('drops parameters and finds the header case-insensitively', () => {
    assert.equal(
      contentTypeOf([{ name: 'content-type', value: 'application/json; charset=utf-8' }]),
      'application/json',
    );
    assert.equal(contentTypeOf([{ name: 'X-Other', value: 'a' }]), null);
  });

  it('knows what can be previewed', () => {
    assert.equal(previewKind('text/html'), 'html');
    assert.equal(previewKind('image/png'), 'image');
    assert.equal(previewKind('application/pdf'), 'pdf');
    assert.equal(previewKind('application/json'), null);
    assert.equal(previewKind(null), null);
  });
});
