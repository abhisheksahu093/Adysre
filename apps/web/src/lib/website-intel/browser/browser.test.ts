import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { CategoryScore, ScanResult } from '../types';
import {
  axeFindings,
  lighthouseFindings,
  lighthouseScores,
  webVitalsFrom,
  type AxeReport,
  type LighthouseReport,
} from './bridge';
import { applyBrowserAnalysis } from './merge';
import { NullBrowserAnalyzer } from './null-analyzer';

/**
 * Browser-phase tests. The real Playwright adapter needs a headless Chromium and
 * is not exercised here; what IS tested is everything that does not need a
 * browser - the pure bridge from Lighthouse/axe JSON to findings and scores, the
 * merge into a scan result, and that the default (null) analyzer degrades
 * cleanly. Those are the parts that decide the numbers a user sees.
 */

const LHR: LighthouseReport = {
  categories: {
    performance: { id: 'performance', score: 0.42, auditRefs: [{ id: 'largest-contentful-paint' }, { id: 'unused-css' }] },
    accessibility: { id: 'accessibility', score: 0.9, auditRefs: [{ id: 'color-contrast' }] },
    'best-practices': { id: 'best-practices', score: 0.75, auditRefs: [{ id: 'errors-in-console' }] },
    seo: { id: 'seo', score: 1, auditRefs: [{ id: 'meta-description' }] },
    pwa: { id: 'pwa', score: 0.3, auditRefs: [] }, // unmapped ⇒ dropped
  },
  audits: {
    'largest-contentful-paint': { id: 'largest-contentful-paint', title: 'LCP is slow', description: 'Improve LCP', score: 0.3, scoreDisplayMode: 'numeric', numericValue: 4200, displayValue: '4.2 s' },
    'unused-css': { id: 'unused-css', title: 'Reduce unused CSS', description: 'See [the docs](https://x) for more', score: 0.5, scoreDisplayMode: 'numeric', displayValue: '120 KB' },
    'color-contrast': { id: 'color-contrast', title: 'Contrast', description: 'd', score: 1, scoreDisplayMode: 'binary' },
    'errors-in-console': { id: 'errors-in-console', title: 'Console errors', description: 'Fix errors', score: 0, scoreDisplayMode: 'binary' },
    'meta-description': { id: 'meta-description', title: 'Has description', description: 'd', score: 1, scoreDisplayMode: 'binary' },
    'unminified-js': { id: 'unminified-js', title: 'Manual', description: 'd', score: null, scoreDisplayMode: 'informative' },
    'first-contentful-paint': { id: 'first-contentful-paint', title: 'FCP', description: 'd', score: 0.8, scoreDisplayMode: 'numeric', numericValue: 1800 },
    'total-blocking-time': { id: 'total-blocking-time', title: 'TBT', description: 'd', score: 0.6, scoreDisplayMode: 'numeric', numericValue: 350 },
    'cumulative-layout-shift': { id: 'cumulative-layout-shift', title: 'CLS', description: 'd', score: 0.9, scoreDisplayMode: 'numeric', numericValue: 0.1234 },
    'server-response-time': { id: 'server-response-time', title: 'TTFB', description: 'd', score: 0.7, scoreDisplayMode: 'numeric', numericValue: 210 },
  },
};

const AXE: AxeReport = {
  violations: [
    { id: 'image-alt', impact: 'critical', help: 'Images must have alternate text', description: 'Add alt to images', helpUrl: 'https://dequeuniversity.com/rules/axe/image-alt', nodes: [{}, {}] },
    { id: 'label', impact: null, help: 'Form elements must have labels', description: 'Label the field', nodes: [{}] },
  ],
};

describe('lighthouse bridge', () => {
  it('maps category scores and drops unmapped ones', () => {
    assert.deepEqual(lighthouseScores(LHR), { performance: 42, accessibility: 90, bestPractices: 75, seo: 100 });
  });

  it('turns failing scored audits into findings and skips passes/informational', () => {
    const findings = lighthouseFindings(LHR);
    const ids = findings.map((f) => f.ruleId).sort();
    assert.deepEqual(ids, ['lh-errors-in-console', 'lh-largest-contentful-paint', 'lh-unused-css']);

    const lcp = findings.find((f) => f.ruleId === 'lh-largest-contentful-paint');
    assert.equal(lcp?.category, 'performance');
    assert.equal(lcp?.severity, 'serious'); // score 0.3 < 0.5
    assert.equal(lcp?.estimatedSavings, '4.2 s');

    const css = findings.find((f) => f.ruleId === 'lh-unused-css');
    assert.equal(css?.severity, 'moderate'); // score 0.5
    assert.equal(css?.fix, 'See the docs for more'); // markdown link stripped

    const console = findings.find((f) => f.ruleId === 'lh-errors-in-console');
    assert.equal(console?.category, 'bestPractices');
  });

  it('extracts web vitals', () => {
    assert.deepEqual(webVitalsFrom(LHR), { lcp: 4200, fcp: 1800, tbt: 350, ttfb: 210, cls: 0.123 });
  });
});

describe('axe bridge', () => {
  it('maps violations to accessibility findings', () => {
    const findings = axeFindings(AXE);
    assert.equal(findings.length, 2);
    assert.equal(findings[0]?.ruleId, 'axe-image-alt');
    assert.equal(findings[0]?.severity, 'critical');
    assert.equal(findings[0]?.category, 'accessibility');
    assert.match(findings[0]?.impact ?? '', /2 elements/);
    assert.equal(findings[1]?.severity, 'minor'); // null impact defaults to minor
    assert.match(findings[1]?.impact ?? '', /1 element\b/);
  });
});

describe('applyBrowserAnalysis', () => {
  function baseResult(): ScanResult {
    const categories: CategoryScore[] = [
      { category: 'seo', score: 80, findings: [] },
      { category: 'accessibility', score: 100, findings: [] },
      { category: 'bestPractices', score: 100, findings: [] },
    ];
    return {
      url: 'https://a.com/',
      finalUrl: 'https://a.com/',
      fetchedAt: '2026-07-24T00:00:00.000Z',
      status: 200,
      timingMs: 100,
      redirects: [],
      overallScore: 93,
      categories,
      findings: [{ ruleId: 'seo-x', category: 'seo', severity: 'minor', description: 'd', fix: 'f', impact: 'i' }],
      technologies: [],
      metrics: { htmlBytes: 0, images: 0, scripts: 0, stylesheets: 0, requestsBlockingRender: 0, headings: 0, links: 0, externalLinks: 0, jsonLdBlocks: 0 },
    };
  }

  it('merges scores, findings, vitals and recomputes overall', () => {
    const merged = applyBrowserAnalysis(baseResult(), {
      scores: { performance: 40, accessibility: 90 },
      findings: [
        { ruleId: 'axe-image-alt', category: 'accessibility', severity: 'critical', description: 'd', fix: 'f', impact: 'i' },
        { ruleId: 'lh-lcp', category: 'performance', severity: 'serious', description: 'd', fix: 'f', impact: 'i' },
      ],
      webVitals: { lcp: 4200 },
    });

    const byCat = new Map(merged.categories.map((c) => [c.category, c]));
    assert.equal(byCat.get('performance')?.score, 40); // added
    assert.equal(byCat.get('accessibility')?.score, 90); // overridden
    assert.equal(byCat.get('seo')?.score, 80); // untouched

    // Findings merged and sorted worst-first.
    assert.equal(merged.findings.length, 3);
    assert.equal(merged.findings[0]?.severity, 'critical');
    assert.equal(byCat.get('performance')?.findings[0]?.ruleId, 'lh-lcp');

    // Overall = mean(80, 90, 100, 40) = 77.5 → 78.
    assert.equal(merged.overallScore, 78);
    assert.equal(merged.metrics.webVitals?.lcp, 4200);
  });
});

describe('NullBrowserAnalyzer', () => {
  it('reports unavailable and analyses to null', async () => {
    const analyzer = new NullBrowserAnalyzer();
    assert.equal(analyzer.available(), false);
    assert.equal(await analyzer.analyze(), null);
  });
});
