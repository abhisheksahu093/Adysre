import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { PageSnapshot } from './types';
import { extractFacts } from './facts';
import { detectTechnologies } from './technology';
import { evaluateRules, duplicateRuleIds } from './engine';
import { RULES } from './rules';
import { overallScore, scoreByCategory, SCORED_CATEGORIES } from './score';
import { analyzeSnapshot } from './scan';
import { isBlockedHost, validateScanUrl, ScanValidationError } from './validate';

/**
 * The scanning engine's tests. Everything is driven off fixtures - no network -
 * because the whole engine is pure once a page is fetched. `analyzeSnapshot`,
 * the rules and the scorers all take a snapshot or facts and nothing else.
 */

function snapshot(overrides: Partial<PageSnapshot> & { html: string }): PageSnapshot {
  return {
    requestedUrl: overrides.finalUrl ?? 'https://example.com/',
    finalUrl: 'https://example.com/',
    status: 200,
    headers: {},
    setCookies: [],
    htmlBytes: Buffer.byteLength(overrides.html),
    timingMs: 120,
    redirects: [],
    ...overrides,
  };
}

// A page that does everything right - it should earn zero findings.
const CLEAN_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>A perfectly reasonable page title</title>
  <meta name="description" content="A clear, useful meta description that sits comfortably inside the recommended range for search result snippets today.">
  <link rel="canonical" href="https://example.com/">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/app.css">
  <meta property="og:title" content="A perfectly reasonable page title">
  <meta property="og:description" content="A clear, useful meta description.">
  <meta property="og:image" content="https://example.com/og.png">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script>
</head>
<body>
  <h1>Main heading</h1>
  <h2>Section</h2>
  <h3>Subsection</h3>
  <img src="/a.png" alt="A" width="200" height="100" loading="lazy">
  <img src="/b.png" alt="B" width="200" height="100" loading="lazy">
  <script src="/app.js" defer></script>
</body>
</html>`;

const CLEAN_HEADERS = {
  'content-type': 'text/html; charset=utf-8',
  'strict-transport-security': 'max-age=63072000',
  'content-security-policy': "default-src 'self'",
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
};

// A page that gets a lot wrong.
const MESSY_HTML = `<html>
<head></head>
<body>
  <h1>One</h1>
  <h1>Two</h1>
  <h4>Skipped straight to four</h4>
  <img src="/1.png">
  <img src="/2.png">
  <img src="/3.png">
  <img src="/4.png">
  <script src="/a.js"></script>
  <script src="/b.js"></script>
  <link rel="stylesheet" href="/1.css">
  <link rel="stylesheet" href="/2.css">
  <link rel="stylesheet" href="/3.css">
  <link rel="stylesheet" href="/4.css">
  <link rel="stylesheet" href="/5.css">
  <link rel="stylesheet" href="/6.css">
</body>
</html>`;

describe('extractFacts', () => {
  const facts = extractFacts(snapshot({ html: CLEAN_HTML, headers: CLEAN_HEADERS, setCookies: ['s=1; Secure; HttpOnly; SameSite=Lax'] }));

  it('reads the head metadata', () => {
    assert.equal(facts.lang, 'en');
    assert.equal(facts.title, 'A perfectly reasonable page title');
    assert.equal(facts.charset, 'utf-8');
    assert.equal(facts.viewport, 'width=device-width, initial-scale=1');
    assert.equal(facts.canonical, 'https://example.com/');
    assert.equal(facts.favicon, true);
    assert.ok(facts.metaDescriptionLength > 70);
  });

  it('counts and orders headings', () => {
    assert.equal(facts.h1Count, 1);
    assert.equal(facts.headings.length, 3);
    assert.equal(facts.headingOrderOk, true);
  });

  it('reads open graph and json-ld', () => {
    assert.equal(facts.openGraph['og:title'], 'A perfectly reasonable page title');
    assert.equal(facts.jsonLdBlocks, 1);
  });

  it('classifies images and scripts', () => {
    assert.equal(facts.images.total, 2);
    assert.equal(facts.images.missingAlt, 0);
    assert.equal(facts.images.withDimensions, 2);
    assert.equal(facts.images.lazy, 2);
    assert.equal(facts.scripts.blocking, 0);
    assert.equal(facts.scripts.defer, 1);
  });

  it('normalises security headers and cookies', () => {
    assert.equal(facts.security.https, true);
    assert.equal(facts.security.hsts, true);
    assert.equal(facts.security.csp, true);
    assert.equal(facts.security.insecureCookies, 0);
  });

  it('detects a skipped heading level in a messy page', () => {
    const messy = extractFacts(snapshot({ html: MESSY_HTML, finalUrl: 'http://example.com/' }));
    assert.equal(messy.headingOrderOk, false);
    assert.equal(messy.h1Count, 2);
    assert.equal(messy.images.missingAlt, 4);
    assert.equal(messy.scripts.blocking, 2);
    assert.equal(messy.stylesheets.blocking, 6);
    assert.equal(messy.security.https, false);
  });
});

describe('detectTechnologies', () => {
  it('detects a Next.js/React app', () => {
    const tech = detectTechnologies('<div id="__next"></div><script>window.__NEXT_DATA__={}</script>', {});
    assert.ok(tech.includes('Next.js'));
    assert.ok(tech.includes('React'));
  });
  it('detects WordPress, Shopify and analytics', () => {
    assert.ok(detectTechnologies('<link href="/wp-content/themes/x/style.css">', {}).includes('WordPress'));
    assert.ok(detectTechnologies('<script src="https://cdn.shopify.com/s/x.js"></script>', {}).includes('Shopify'));
    assert.ok(detectTechnologies('<script>gtag("config","G-XXX")</script>', {}).includes('Google Analytics'));
  });
  it('detects the server from headers', () => {
    assert.ok(detectTechnologies('', { server: 'nginx/1.25' }).includes('Nginx'));
  });
});

describe('rules', () => {
  it('every rule declares the documented schema', () => {
    for (const rule of RULES) {
      assert.ok(rule.id && typeof rule.id === 'string', 'id');
      assert.ok(rule.category, `${rule.id} category`);
      assert.ok(rule.severity, `${rule.id} severity`);
      assert.ok(rule.description && rule.fix && rule.impact, `${rule.id} prose`);
      assert.equal(typeof rule.test, 'function', `${rule.id} test`);
    }
  });

  it('has no duplicate ids', () => {
    assert.deepEqual(duplicateRuleIds(), []);
  });
});

describe('evaluateRules', () => {
  it('finds nothing wrong with a clean page', () => {
    const facts = extractFacts(snapshot({ html: CLEAN_HTML, headers: CLEAN_HEADERS, setCookies: ['s=1; Secure; HttpOnly'] }));
    assert.deepEqual(evaluateRules(facts), []);
  });

  it('flags the expected problems on a messy page', () => {
    const facts = extractFacts(
      snapshot({ html: MESSY_HTML, finalUrl: 'http://example.com/', setCookies: ['id=1'], redirects: ['http://a/', 'http://b/'] }),
    );
    const ids = new Set(evaluateRules(facts).map((f) => f.ruleId));
    for (const expected of [
      'seo-title-missing',
      'html-viewport-missing',
      'html-h1-multiple',
      'html-heading-order',
      'a11y-image-alt',
      'assets-render-blocking-scripts',
      'assets-many-stylesheets',
      'sec-https',
      'sec-csp',
      'sec-insecure-cookies',
      'bp-excessive-redirects',
    ]) {
      assert.ok(ids.has(expected), `expected finding ${expected}`);
    }
  });
});

describe('scoring', () => {
  it('gives a clean page 100 across the board', () => {
    const facts = extractFacts(snapshot({ html: CLEAN_HTML, headers: CLEAN_HEADERS, setCookies: ['s=1; Secure; HttpOnly'] }));
    const categories = scoreByCategory(evaluateRules(facts));
    assert.ok(categories.every((c) => c.score === 100));
    assert.equal(overallScore(categories), 100);
  });

  it('drives security to zero when https and headers are absent', () => {
    const facts = extractFacts(snapshot({ html: MESSY_HTML, finalUrl: 'http://example.com/', setCookies: ['id=1'] }));
    const categories = scoreByCategory(evaluateRules(facts));
    const security = categories.find((c) => c.category === 'security');
    assert.equal(security?.score, 0);
    assert.ok(overallScore(categories) < 60);
  });

  it('only scores categories that have rules', () => {
    assert.ok(SCORED_CATEGORIES.includes('seo'));
    assert.ok(!SCORED_CATEGORIES.includes('performance'), 'performance needs the browser phase');
  });
});

describe('analyzeSnapshot', () => {
  const result = analyzeSnapshot(
    snapshot({ html: MESSY_HTML, finalUrl: 'http://example.com/', setCookies: ['id=1'] }),
    new Date('2026-07-24T00:00:00Z'),
  );

  it('assembles a complete, deterministic result', () => {
    assert.equal(result.fetchedAt, '2026-07-24T00:00:00.000Z');
    assert.equal(result.finalUrl, 'http://example.com/');
    assert.ok(result.findings.length > 0);
    assert.ok(result.categories.length === SCORED_CATEGORIES.length);
    assert.equal(result.metrics.scripts, 2);
    assert.equal(result.metrics.requestsBlockingRender, 8);
  });

  it('sorts findings worst-first', () => {
    // A critical (sec-https) must lead.
    assert.equal(result.findings[0]?.severity, 'critical');
  });
});

describe('validateScanUrl / SSRF guard', () => {
  it('accepts a bare domain and defaults to https', () => {
    assert.equal(validateScanUrl('example.com').toString(), 'https://example.com/');
  });

  it('rejects non-web schemes', () => {
    assert.throws(() => validateScanUrl('javascript:alert(1)'), ScanValidationError);
    assert.throws(() => validateScanUrl('ftp://example.com'), ScanValidationError);
  });

  it('blocks loopback, private and metadata hosts', () => {
    for (const host of ['localhost', '127.0.0.1', '10.0.0.5', '192.168.1.1', '169.254.169.254', '172.16.0.1']) {
      assert.equal(isBlockedHost(host), true, host);
    }
    assert.equal(isBlockedHost('example.com'), false);
  });

  it('throws a coded error for a blocked url', () => {
    assert.throws(() => validateScanUrl('http://127.0.0.1/'), (e: unknown) => e instanceof ScanValidationError && e.code === 'url_blocked');
  });
});
