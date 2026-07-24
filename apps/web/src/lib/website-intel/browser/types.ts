import type { Category, Finding, WebVitals } from '../types';

/**
 * The browser-analyzer seam.
 *
 * The browserless engine cannot measure real performance, Core Web Vitals or do
 * a deep accessibility audit - those need a headless Chromium running the page.
 * That capability lives behind this interface exactly the way persistence lives
 * behind `ScanStore`: a null analyzer by default (so the platform runs with no
 * browser), a real Playwright + Lighthouse + axe-core analyzer when the deps are
 * installed and enabled. Nothing in the scan pipeline knows which it got.
 */

/** What a browser run contributes back to the scan. */
export interface BrowserAnalysis {
  /**
   * Authoritative category scores from Lighthouse (0-100). These override the
   * browserless scores for the categories they cover and add `performance`,
   * which the browserless engine cannot score at all.
   */
  scores: Partial<Record<Category, number>>;
  /** Findings from failed Lighthouse audits and axe-core violations. */
  findings: Finding[];
  /** Measured Core Web Vitals and lab timings. */
  webVitals: WebVitals;
}

export interface BrowserAnalyzer {
  /** True when a real browser run is possible (deps installed and enabled). */
  available(): boolean;
  /** Analyse a URL, or return null when unavailable or on a soft failure. */
  analyze(url: string): Promise<BrowserAnalysis | null>;
}
