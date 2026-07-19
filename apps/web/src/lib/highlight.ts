import 'server-only';
import { codeToHtml } from 'shiki';

/**
 * Server-side syntax highlighting.
 *
 * Runs at render, never in the browser: Shiki's grammars and themes are ~MBs,
 * and shipping them to highlight static code would dwarf the page itself. The
 * client receives plain HTML.
 *
 * Both themes are emitted at once via Shiki's dual-theme support, so the code
 * block follows the app's light/dark toggle through CSS alone - no re-highlight
 * on theme change, and no flash.
 */
export async function highlight(code: string, lang: string): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    });
  } catch {
    // An unknown grammar must not take the page down - fall back to plain text.
    return await codeToHtml(code, {
      lang: 'text',
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    });
  }
}
