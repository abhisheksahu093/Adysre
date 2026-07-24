import type { BrowserAnalyzer } from './types';

/**
 * The default browser analyzer: none.
 *
 * With no headless browser installed or enabled, the platform still runs - the
 * scan is simply the browserless one. `available()` returns false, so the
 * pipeline never even calls `analyze`, and `analyze` returns null defensively.
 */
export class NullBrowserAnalyzer implements BrowserAnalyzer {
  available(): boolean {
    return false;
  }

  async analyze(): Promise<null> {
    return null;
  }
}
