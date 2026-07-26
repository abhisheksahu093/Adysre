import type { BrowserAnalyzer } from './types';
import { NullBrowserAnalyzer } from './null-analyzer';

/**
 * The browser-analyzer factory - the one place that decides whether a real
 * browser run happens.
 *
 * Off by default: without `WEBSITE_INTEL_BROWSER=on` this returns the null
 * analyzer and the platform stays browserless, so no Chromium and no heavy
 * dependency is ever needed just to run the app. When enabled, the Playwright +
 * Lighthouse + axe adapter is imported LAZILY, so its optional dependencies are
 * only required by the deployments that opt in.
 *
 * The instance is memoised so a browser (expensive to stand up) is reused.
 */
let instance: BrowserAnalyzer | null = null;

export async function getBrowserAnalyzer(): Promise<BrowserAnalyzer> {
  if (instance) return instance;

  if ((process.env.WEBSITE_INTEL_BROWSER ?? 'off') === 'on') {
    try {
      const { PlaywrightLighthouseAnalyzer } = await import('./playwright-analyzer');
      instance = new PlaywrightLighthouseAnalyzer();
      return instance;
    } catch {
      // The adapter or its deps are missing; degrade to browserless rather than
      // failing every scan.
      instance = new NullBrowserAnalyzer();
      return instance;
    }
  }

  instance = new NullBrowserAnalyzer();
  return instance;
}

/** Reset the memoised analyzer. Tests only. */
export function resetBrowserAnalyzerForTests(): void {
  instance = null;
}
