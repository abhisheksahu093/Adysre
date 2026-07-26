import 'server-only';
import type { BrowserAnalysis, BrowserAnalyzer } from './types';
import {
  axeFindings,
  lighthouseFindings,
  lighthouseScores,
  webVitalsFrom,
  type AxeReport,
  type LighthouseReport,
} from './bridge';

/**
 * The real browser analyzer: Chrome + Lighthouse for performance, Core Web
 * Vitals, best-practices and SEO scores; Playwright + axe-core for a deep
 * accessibility audit. Its output is translated back into the platform's shape
 * by the pure {@link bridge}, which is where the tested logic lives.
 *
 * ─── Status: reference implementation, unverified in this repo's CI ─────────
 * This adapter is written and wired, but it is OFF by default and NOT exercised
 * by the test suite, because it needs a headless Chromium and heavy optional
 * dependencies that are not installed here. To enable it in a deployment:
 *
 *   1. `pnpm add -w lighthouse chrome-launcher playwright axe-core`
 *      and `npx playwright install chromium`.
 *   2. Set `WEBSITE_INTEL_BROWSER=on`.
 *
 * The dependencies are imported through variable specifiers so this file
 * compiles and ships with them absent; the factory only ever constructs this
 * class when the flag is on, and falls back to the null analyzer if the imports
 * fail. Treat the orchestration below as the integration point to validate
 * against real Chromium before relying on it in production.
 */

/* ── Minimal shapes of the optional dependencies we call ───────────────────── */

interface ChromeLauncher {
  launch(opts: { chromeFlags: string[] }): Promise<{ port: number; kill(): Promise<void> }>;
}
type LighthouseFn = (
  url: string,
  flags: { port: number; output: 'json'; logLevel: string; onlyCategories: string[] },
) => Promise<{ lhr: LighthouseReport }>;
interface PlaywrightPage {
  goto(url: string, opts: { waitUntil: string; timeout: number }): Promise<unknown>;
  addScriptTag(opts: { content: string }): Promise<unknown>;
  evaluate(expression: string): Promise<unknown>;
}
interface PlaywrightBrowser {
  newPage(): Promise<PlaywrightPage>;
  close(): Promise<void>;
}
interface PlaywrightModule {
  chromium: { launch(): Promise<PlaywrightBrowser> };
}

/** Load an optional dependency without a static module reference. */
async function loadModule<T>(specifier: string): Promise<T> {
  const mod: unknown = await import(specifier);
  return mod as T;
}

const LH_CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const NAV_TIMEOUT_MS = 30_000;

export class PlaywrightLighthouseAnalyzer implements BrowserAnalyzer {
  available(): boolean {
    return true;
  }

  async analyze(url: string): Promise<BrowserAnalysis | null> {
    let chrome: Awaited<ReturnType<ChromeLauncher['launch']>> | undefined;
    let browser: PlaywrightBrowser | undefined;

    try {
      // ── Lighthouse over a launched Chrome ──────────────────────────────────
      const { launch } = await loadModule<ChromeLauncher>('chrome-launcher');
      chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
      const lighthouse = (await loadModule<{ default: LighthouseFn }>('lighthouse')).default;
      const { lhr } = await lighthouse(url, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: LH_CATEGORIES,
      });

      // ── axe-core over a Playwright page ────────────────────────────────────
      const { chromium } = await loadModule<PlaywrightModule>('playwright');
      browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: NAV_TIMEOUT_MS });
      const axeSource = (await loadModule<{ source: string }>('axe-core')).source;
      await page.addScriptTag({ content: axeSource });
      const axe = (await page.evaluate('window.axe.run(document)')) as AxeReport;

      return {
        scores: lighthouseScores(lhr),
        findings: [...lighthouseFindings(lhr), ...axeFindings(axe)],
        webVitals: webVitalsFrom(lhr),
      };
    } catch {
      // A browser failure degrades the scan to browserless rather than failing it.
      return null;
    } finally {
      await browser?.close().catch(() => undefined);
      await chrome?.kill().catch(() => undefined);
    }
  }
}
