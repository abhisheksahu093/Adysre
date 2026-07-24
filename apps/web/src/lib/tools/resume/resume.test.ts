import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { fromJson, toJson, orderedVisibleSections } from './serialize';
import { SAMPLE_RESUME } from './sample';

/**
 * Resume serialize tests: JSON round-trips loss-lessly, importing tolerates
 * partial/garbage input, and the ordered/visible section helper drives the
 * preview.
 */

describe('toJson / fromJson', () => {
  it('round-trips the sample without loss', () => {
    const back = fromJson(toJson(SAMPLE_RESUME));
    assert.deepEqual(back, SAMPLE_RESUME);
  });

  it('returns null for invalid JSON', () => {
    assert.equal(fromJson('{not json'), null);
    assert.equal(fromJson('42'), null);
  });

  it('merges a partial resume onto the defaults', () => {
    const partial = fromJson(JSON.stringify({ contact: { name: 'Sam' } }));
    assert.equal(partial?.contact.name, 'Sam');
    assert.equal(partial?.contact.email, SAMPLE_RESUME.contact.email); // filled from default
    assert.ok(Array.isArray(partial?.sections) && partial!.sections.length > 0);
    assert.deepEqual(partial?.experience, []); // absent array -> empty, not undefined
  });
});

describe('orderedVisibleSections', () => {
  it('keeps only visible sections in order', () => {
    const data = {
      ...SAMPLE_RESUME,
      sections: [
        { id: 'a', type: 'skills' as const, title: 'Skills', visible: true },
        { id: 'b', type: 'projects' as const, title: 'Projects', visible: false },
        { id: 'c', type: 'summary' as const, title: 'Summary', visible: true },
      ],
    };
    assert.deepEqual(orderedVisibleSections(data).map((s) => s.id), ['a', 'c']);
  });
});
