import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { TEMPLATES, templateSummaries, toSummary } from './index';

/**
 * The paywall.
 *
 * Hiding the Copy and Download buttons is not access control: the summary list
 * is serialised into the RSC payload, so anything left on the object is
 * readable from devtools whatever the UI renders. These assert the redaction
 * happens where the data is produced - if one of them fails, premium prompts
 * are being handed to free visitors even though the dialog looks locked.
 */

const premium = TEMPLATES.find((template) => template.tier === 'premium');
const free = TEMPLATES.find((template) => template.tier === 'free');

describe('template entitlement', () => {
  it('has both tiers registered, or these tests prove nothing', () => {
    assert.ok(premium, 'expected at least one premium template');
    assert.ok(free, 'expected at least one free template');
  });

  it('withholds the prompt of a premium template from a free visitor', () => {
    assert.ok(premium);
    const summary = toSummary(premium, 'free');

    assert.equal(summary.locked, true);
    assert.equal(summary.prompt, null, 'the prompt is the product and must not be serialised');
    assert.deepEqual(summary.downloads, [], 'a locked template must offer no downloads');
  });

  it('releases the prompt and downloads to a premium visitor', () => {
    assert.ok(premium);
    const summary = toSummary(premium, 'premium');

    assert.equal(summary.locked, false);
    assert.equal(summary.prompt, premium.prompt);
    assert.deepEqual(summary.downloads, premium.downloads);
  });

  it('never locks a free template, at either level', () => {
    assert.ok(free);
    for (const level of ['free', 'premium'] as const) {
      const summary = toSummary(free, level);
      assert.equal(summary.locked, false);
      assert.equal(summary.prompt, free.prompt);
      assert.deepEqual(summary.downloads, free.downloads);
    }
  });

  it('leaks no premium prompt anywhere in a free visitor payload', () => {
    const payload = JSON.stringify(templateSummaries('free'));

    for (const template of TEMPLATES) {
      if (template.tier !== 'premium') continue;
      // A distinctive slice of the prompt: if this appears, the redaction leaked.
      const fingerprint = template.prompt.slice(0, 60);
      assert.ok(
        !payload.includes(fingerprint),
        `${template.slug}: premium prompt found in the free payload`,
      );
    }
  });

  it('still lets a free visitor preview everything', () => {
    // Previewing is deliberately ungated - you cannot sell a template nobody is
    // allowed to look at - so every template keeps its name, tagline and pages.
    for (const summary of templateSummaries('free')) {
      assert.ok(summary.name.length > 0);
      assert.ok(summary.taglineKey.length > 0);
      assert.ok(Array.isArray(summary.sections) && summary.sections.length > 0);
    }
  });
});
