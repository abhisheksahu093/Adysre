import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildSignatureHtml, escapeHtml, safeUrl } from './build';
import { SAMPLE_SIGNATURE } from './sample';
import type { SignatureData } from './types';

/**
 * Signature engine tests. The builder is the load-bearing part: it must emit
 * email-safe HTML (table layout, inline styles) and must never let user input
 * break out of an attribute or inject markup.
 */

function sig(over: Partial<SignatureData> = {}): SignatureData {
  return { ...SAMPLE_SIGNATURE, ...over };
}

describe('escapeHtml / safeUrl', () => {
  it('escapes the five HTML-significant characters', () => {
    assert.equal(escapeHtml(`<a href="x" o='y'>&`), '&lt;a href=&quot;x&quot; o=&#39;y&#39;&gt;&amp;');
  });
  it('keeps safe schemes and upgrades bare values', () => {
    assert.equal(safeUrl('https://a.com'), 'https://a.com');
    assert.equal(safeUrl('a@b.com'), 'mailto:a@b.com');
    assert.equal(safeUrl('+1 555 010 2040'), 'tel:+15550102040');
    assert.equal(safeUrl('example.com/x'), 'https://example.com/x');
  });
  it('neutralises a javascript: URL', () => {
    // Not an allowed scheme, not an email/phone -> treated as a bare host and https-prefixed.
    assert.match(safeUrl('javascript:alert(1)'), /^https:\/\//);
  });
});

describe('buildSignatureHtml', () => {
  it('emits a table with the name and contacts', () => {
    const html = buildSignatureHtml(sig());
    assert.match(html, /^<table /);
    assert.match(html, /Ravi Sharma/);
    assert.match(html, /Head of Product/);
    assert.match(html, /mailto:ravi@acme\.studio/);
    assert.match(html, /role="presentation"/);
  });
  it('renders each social as a self-contained colored chip (no external icon)', () => {
    const html = buildSignatureHtml(sig());
    assert.match(html, /background:#0A66C2/); // LinkedIn chip
    assert.equal(/https?:\/\/[^"']*\.(png|svg|gif)/i.test(html), false); // no external icon requests
  });
  it('escapes injection attempts in fields', () => {
    const html = buildSignatureHtml(sig({ name: '<script>alert(1)</script>', company: 'A" onmouseover="x' }));
    assert.equal(html.includes('<script>'), false);
    assert.match(html, /&lt;script&gt;/);
    assert.equal(html.includes('onmouseover="x'), false);
  });
  it('omits empty blocks (no logo, no banner, no CTA)', () => {
    const html = buildSignatureHtml(sig({ logo: '', photo: '', banner: '', cta: { label: '', url: '' } }));
    assert.equal(html.includes('<img'), false);
    assert.equal(html.includes('Book a call'), false);
  });
});
