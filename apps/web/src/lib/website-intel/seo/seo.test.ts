import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { PageFacts } from '../types';
import { auditSeo } from './audit';
import { plainText, textStats, auditSnapshot } from './run';

/**
 * SEO audit tests. The engine is pure over PageFacts, so a good and a poor page
 * are asserted to the check level, and the score/grade bands are pinned. The
 * text helpers are checked for word count and keyword density.
 */

function facts(over: Partial<PageFacts> = {}): PageFacts {
  return {
    url: 'https://a.com',
    finalUrl: 'https://a.com',
    status: 200,
    redirects: [],
    timingMs: 100,
    htmlBytes: 40_000,
    lang: 'en',
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1',
    title: 'A great page about widgets and gadgets',
    titleLength: 40,
    metaDescription: 'A helpful description of the widgets and gadgets we make, long enough to be useful.',
    metaDescriptionLength: 84,
    canonical: 'https://a.com',
    favicon: true,
    h1Count: 1,
    headings: [{ level: 1, text: 'Widgets' }],
    headingOrderOk: true,
    images: { total: 4, missingAlt: 0, lazy: 2, withDimensions: 4 },
    links: { total: 15, external: 3 },
    scripts: { total: 3, blocking: 0, async: 2, defer: 1 },
    stylesheets: { total: 2, blocking: 1 },
    openGraph: { 'og:title': 'A', 'og:description': 'B', 'og:image': 'https://a.com/x.png' },
    twitter: { 'twitter:card': 'summary' },
    jsonLdBlocks: 1,
    security: { https: true, hsts: true, csp: true, xFrameOptions: true, xContentTypeOptions: true, referrerPolicy: true, permissionsPolicy: false, cookies: [], insecureCookies: 0 },
    technologies: [],
    ...over,
  } as PageFacts;
}

const extra = { wordCount: 800, keywords: [] };

describe('auditSeo', () => {
  it('grades a well-optimised page A/A+', () => {
    const r = auditSeo(facts(), extra);
    assert.ok(r.score >= 90, `score ${r.score}`);
    assert.match(r.grade, /^A/);
    assert.equal(r.summary.fail, 0);
    assert.equal(r.checks.find((c) => c.id === 'title')?.status, 'pass');
  });

  it('fails the core checks on a poor page', () => {
    const r = auditSeo(
      facts({
        title: null,
        titleLength: 0,
        metaDescription: null,
        metaDescriptionLength: 0,
        h1Count: 0,
        viewport: null,
        security: { https: false } as never,
        images: { total: 6, missingAlt: 6, lazy: 0, withDimensions: 0 },
      }),
      { wordCount: 40, keywords: [] },
    );
    assert.ok(r.score < 60, `score ${r.score}`);
    assert.equal(r.grade, 'F');
    assert.equal(r.checks.find((c) => c.id === 'title')?.status, 'fail');
    assert.equal(r.checks.find((c) => c.id === 'https')?.status, 'fail');
    assert.equal(r.checks.find((c) => c.id === 'h1')?.status, 'fail');
  });

  it('warns (not fails) on borderline title length', () => {
    const r = auditSeo(facts({ title: 'Short', titleLength: 5 }), extra);
    assert.equal(r.checks.find((c) => c.id === 'title-length')?.status, 'warn');
  });
});

describe('text helpers', () => {
  it('plainText strips scripts, styles and tags', () => {
    const t = plainText('<style>.a{}</style><h1>Hello</h1><script>x()</script><p>world here</p>');
    assert.equal(t, 'Hello world here');
  });
  it('textStats counts words and ranks keywords without stopwords', () => {
    const s = textStats('widgets widgets widgets gadgets the the and a page about widgets');
    assert.ok(s.wordCount >= 8);
    assert.equal(s.keywords[0]?.word, 'widgets');
    assert.equal(s.keywords.some((k) => k.word === 'the'), false);
  });
});

describe('auditSnapshot', () => {
  it('stamps fetchedAt and produces a report from a snapshot', () => {
    const html = '<html lang="en"><head><title>Hello World Page Title Here</title><meta name="viewport" content="w"></head><body><h1>Hi</h1><p>' + 'word '.repeat(400) + '</p></body></html>';
    const report = auditSnapshot(
      { requestedUrl: 'https://a.com', finalUrl: 'https://a.com', status: 200, redirects: [], timingMs: 10, htmlBytes: html.length, html, headers: {}, setCookies: [] } as never,
      new Date('2026-07-24T00:00:00Z'),
    );
    assert.equal(report.fetchedAt, '2026-07-24T00:00:00.000Z');
    assert.ok(report.score > 0);
    assert.ok(report.stats.wordCount >= 400);
  });
});
