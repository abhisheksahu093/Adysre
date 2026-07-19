'use server';

import { highlight } from '@/lib/highlight';

/**
 * Highlight playground-assembled code on the server.
 *
 * Static snippets are highlighted at render time, but the playground's combined
 * source only exists after the user picks sections in the browser - and Shiki
 * is deliberately never shipped to the client (grammars are megabytes). So the
 * client sends the assembled text back here and receives finished HTML.
 *
 * Server actions are public POST endpoints: the input is untrusted even though
 * our UI only ever sends registry code. Shiki escapes everything into inert
 * `<span>`s, so arbitrary input can't smuggle markup - the only real risk is
 * burning CPU on huge payloads, hence the size cap.
 */
const MAX_HIGHLIGHT_CHARS = 200_000;

export async function highlightCode(code: string, lang: string): Promise<string | null> {
  if (typeof code !== 'string' || code.length === 0 || code.length > MAX_HIGHLIGHT_CHARS) {
    // Callers fall back to a plain <pre> - never worth failing the dialog over.
    return null;
  }
  return highlight(code, lang);
}
