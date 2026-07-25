import type { ProjectFile } from '../types';

/**
 * Project-wide search and replace, in memory.
 *
 * A single RegExp drives both find and replace so the two never disagree about
 * what a match is. Case sensitivity and regex mode are flags on top of that;
 * a plain query is escaped so characters like `.` are literal.
 */

export interface SearchOptions {
  caseSensitive: boolean;
  regex: boolean;
}

export interface SearchMatch {
  line: number;
  column: number;
  /** The full source line, for a result preview. */
  preview: string;
}

export interface FileMatches {
  fileId: string;
  path: string;
  matches: SearchMatch[];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Build the matcher, or null when the query is empty or an invalid pattern. */
export function buildMatcher(query: string, options: SearchOptions): RegExp | null {
  if (!query) return null;
  const source = options.regex ? query : escapeRegExp(query);
  const flags = `g${options.caseSensitive ? '' : 'i'}`;
  try {
    return new RegExp(source, flags);
  } catch {
    return null;
  }
}

export function searchProject(files: ProjectFile[], query: string, options: SearchOptions): FileMatches[] {
  const matcher = buildMatcher(query, options);
  if (!matcher) return [];

  const results: FileMatches[] = [];
  for (const file of files) {
    const lines = file.content.split('\n');
    const matches: SearchMatch[] = [];
    lines.forEach((text, index) => {
      matcher.lastIndex = 0;
      let hit: RegExpExecArray | null;
      while ((hit = matcher.exec(text)) !== null) {
        matches.push({ line: index + 1, column: hit.index + 1, preview: text.trim().slice(0, 200) });
        if (hit.index === matcher.lastIndex) matcher.lastIndex += 1; // zero-width guard
      }
    });
    if (matches.length > 0) results.push({ fileId: file.id, path: file.path, matches });
  }
  return results;
}

/** Replace every match in one file's content; returns the new content. */
export function replaceInContent(
  content: string,
  query: string,
  replacement: string,
  options: SearchOptions,
): string {
  const matcher = buildMatcher(query, options);
  if (!matcher) return content;
  return content.replace(matcher, replacement);
}

export function countMatches(results: FileMatches[]): number {
  return results.reduce((total, file) => total + file.matches.length, 0);
}
