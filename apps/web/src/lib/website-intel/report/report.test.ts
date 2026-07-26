import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { ScanRecord } from '../history/types';
import { toCsvReport } from './csv';
import { toMarkdownReport } from './markdown';
import { buildReport } from './build';
import { isReportFormat } from './types';

/** A record with a couple of findings and a comma-laden one for CSV escaping. */
function record(): ScanRecord {
  return {
    id: 'id-1',
    tenantId: 'tenant-1',
    createdAt: '2026-07-24T09:30:00.000Z',
    host: 'example.com',
    result: {
      url: 'https://example.com/',
      finalUrl: 'https://example.com/',
      fetchedAt: '2026-07-24T09:30:00.000Z',
      status: 200,
      timingMs: 120,
      redirects: [],
      overallScore: 84,
      categories: [
        { category: 'seo', score: 68, findings: [] },
        { category: 'security', score: 41, findings: [] },
      ],
      findings: [
        { ruleId: 'sec-https', category: 'security', severity: 'critical', description: 'Not served over HTTPS', fix: 'Serve over TLS', impact: 'Traffic can be read' },
        { ruleId: 'seo-title', category: 'seo', severity: 'minor', description: 'Title has a comma, a "quote" and\na newline', fix: 'Rewrite it', impact: 'Truncation', estimatedSavings: '~10 chars' },
      ],
      technologies: ['Cloudflare'],
      metrics: { htmlBytes: 1000, images: 1, scripts: 1, stylesheets: 1, requestsBlockingRender: 1, headings: 1, links: 1, externalLinks: 0, jsonLdBlocks: 0, webVitals: { lcp: 2400, cls: 0.05 } },
    },
  };
}

describe('isReportFormat', () => {
  it('accepts supported formats and rejects others', () => {
    assert.ok(isReportFormat('json') && isReportFormat('csv') && isReportFormat('markdown'));
    assert.equal(isReportFormat('pdf'), false);
    assert.equal(isReportFormat('xml'), false);
  });
});

describe('toCsvReport', () => {
  const csv = toCsvReport(record().result);
  const lines = csv.trimEnd().split('\r\n');

  it('has a header and one row per finding', () => {
    assert.equal(lines.length, 3);
    assert.equal(lines[0], 'ruleId,category,severity,description,fix,impact,estimatedSavings');
  });

  it('escapes commas, quotes and newlines per RFC 4180', () => {
    // The messy description must be wrapped and its quote doubled.
    assert.ok(csv.includes('"Title has a comma, a ""quote"" and\na newline"'));
    // A clean cell stays unquoted.
    assert.ok(lines[1]?.startsWith('sec-https,security,critical,'));
  });
});

describe('toMarkdownReport', () => {
  const md = toMarkdownReport(record());

  it('includes header, scores, technologies, vitals and findings', () => {
    assert.ok(md.startsWith('# Website Intelligence report'));
    assert.ok(md.includes('**Overall score:** 84 / 100'));
    assert.ok(md.includes('| seo | 68 |'));
    assert.ok(md.includes('- Cloudflare'));
    assert.ok(md.includes('## Core Web Vitals'));
    assert.ok(md.includes('| LCP | 2400 ms |'));
    assert.ok(md.includes('## Recommendations (2)'));
    assert.ok(md.includes('### CRITICAL — Not served over HTTPS'));
  });
});

describe('buildReport', () => {
  it('dispatches format to filename, content-type and body', () => {
    const rec = record();
    const json = buildReport(rec, 'json');
    assert.equal(json.filename, 'website-intel-example.com-2026-07-24.json');
    assert.ok(json.contentType.startsWith('application/json'));
    assert.equal(JSON.parse(json.body).id, 'id-1');

    assert.ok(buildReport(rec, 'csv').contentType.startsWith('text/csv'));
    assert.equal(buildReport(rec, 'csv').filename.endsWith('.csv'), true);

    assert.ok(buildReport(rec, 'markdown').contentType.startsWith('text/markdown'));
    assert.equal(buildReport(rec, 'markdown').filename.endsWith('.md'), true);
  });
});
