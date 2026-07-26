import { collectPage, type CollectOptions } from '../collect';
import { extractFacts } from '../facts';
import type { PageSnapshot } from '../types';
import { auditSeo, type SeoExtra, type SeoReport } from './audit';

/**
 * Run a full SEO audit for a URL. Reuses the website-intel collector (the same
 * SSRF-safe fetch the scanner uses) and fact extractor, then adds the couple of
 * text stats the audit needs and hands everything to the pure `auditSeo`. No
 * external SEO API; everything is derived from the fetched HTML.
 */

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'for', 'with', 'at', 'by', 'from', 'is', 'are',
  'was', 'were', 'be', 'been', 'it', 'this', 'that', 'these', 'those', 'as', 'if', 'you', 'your', 'we', 'our',
  'i', 'he', 'she', 'they', 'them', 'his', 'her', 'its', 'not', 'no', 'do', 'does', 'can', 'will', 'would',
]);

/** Strip tags, scripts and styles to plain text. */
export function plainText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function textStats(text: string): SeoExtra {
  const words = text.toLowerCase().match(/[a-z][a-z'-]{1,}/g) ?? [];
  const wordCount = words.length;
  const counts = new Map<string, number>();
  for (const w of words) {
    if (w.length < 3 || STOPWORDS.has(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  const keywords = [...counts.entries()]
    .map(([word, count]) => ({ word, count, density: wordCount ? Math.round((count / wordCount) * 1000) / 10 : 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  return { wordCount, keywords };
}

/** Build a report from an already-fetched snapshot (pure once the HTML is in). */
export function auditSnapshot(snapshot: PageSnapshot, now = new Date()): SeoReport {
  const facts = extractFacts(snapshot);
  const report = auditSeo(facts, textStats(plainText(snapshot.html)));
  return { ...report, fetchedAt: now.toISOString() };
}

export async function runSeoAudit(url: string, options: CollectOptions = {}): Promise<SeoReport> {
  const snapshot = await collectPage(url, options);
  return auditSnapshot(snapshot);
}
