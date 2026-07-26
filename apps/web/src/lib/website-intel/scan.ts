import type { PageFacts, PageSnapshot, ScanInput, ScanMetrics, ScanResult } from './types';
import { collectPage, type CollectOptions } from './collect';
import { extractFacts } from './facts';
import { evaluateRules } from './engine';
import { overallScore, scoreByCategory } from './score';
import type { BrowserAnalyzer } from './browser/types';
import { getBrowserAnalyzer } from './browser/analyzer';
import { applyBrowserAnalysis } from './browser/merge';

/**
 * The scan orchestrator.
 *
 * `analyzeSnapshot` is the whole pipeline minus the network: facts, rules,
 * scores, metrics. It is pure, so a test can drive the entire engine off a
 * fixture with no HTTP. `runScan` is the thin wrapper that fetches first.
 */

function metricsFrom(facts: PageFacts): ScanMetrics {
  return {
    htmlBytes: facts.htmlBytes,
    images: facts.images.total,
    scripts: facts.scripts.total,
    stylesheets: facts.stylesheets.total,
    requestsBlockingRender: facts.scripts.blocking + facts.stylesheets.blocking,
    headings: facts.headings.length,
    links: facts.links.total,
    externalLinks: facts.links.external,
    jsonLdBlocks: facts.jsonLdBlocks,
  };
}

/** Run the full analysis over an already-fetched page. Pure - no network. */
export function analyzeSnapshot(snapshot: PageSnapshot, fetchedAt = new Date()): ScanResult {
  const facts = extractFacts(snapshot);
  const findings = evaluateRules(facts);
  const categories = scoreByCategory(findings);

  // Findings surface worst-first, so the report leads with what matters.
  const order = { critical: 0, serious: 1, moderate: 2, minor: 3, info: 4 };
  const sorted = [...findings].sort((a, b) => order[a.severity] - order[b.severity]);

  return {
    url: facts.url,
    finalUrl: facts.finalUrl,
    fetchedAt: fetchedAt.toISOString(),
    status: facts.status,
    timingMs: facts.timingMs,
    redirects: facts.redirects,
    overallScore: overallScore(categories),
    categories,
    findings: sorted,
    technologies: facts.technologies,
    metrics: metricsFrom(facts),
  };
}

export interface RunScanOptions extends CollectOptions {
  /** Injectable browser analyzer; defaults to the env-gated factory. */
  browserAnalyzer?: BrowserAnalyzer;
}

/**
 * Fetch and analyse a URL. The one call the API route makes.
 *
 * The browserless analysis always runs. If a browser analyzer is available
 * (Playwright/Lighthouse, off by default), its performance, Core Web Vitals and
 * deep accessibility results are merged in; a failure there degrades to the
 * browserless result rather than failing the scan.
 */
export async function runScan(input: ScanInput, options: RunScanOptions = {}): Promise<ScanResult> {
  const snapshot = await collectPage(input.url, options);
  const result = analyzeSnapshot(snapshot);

  const analyzer = options.browserAnalyzer ?? (await getBrowserAnalyzer());
  if (!analyzer.available()) return result;

  try {
    const analysis = await analyzer.analyze(result.finalUrl);
    return analysis ? applyBrowserAnalysis(result, analysis) : result;
  } catch {
    return result;
  }
}
