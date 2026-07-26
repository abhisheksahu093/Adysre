/**
 * ADYSRE API Studio - display formatting.
 *
 * Pure, and deliberately locale-aware through `Intl`: a response time and a
 * payload size are numbers a person reads, and reading them in their own
 * number format is the difference between a tool that was translated and one
 * that was localised.
 */

/** Bytes as B, KB or MB. Never more precision than the number deserves. */
export function formatBytes(bytes: number, locale: string): string {
  const units: [number, string, number][] = [
    [1, 'B', 0],
    [1_024, 'KB', 1],
    [1_024 * 1_024, 'MB', 2],
  ];
  const [divisor, unit, digits] =
    bytes >= 1_024 * 1_024 ? units[2]! : bytes >= 1_024 ? units[1]! : units[0]!;

  const value = bytes / divisor;
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value)} ${unit}`;
}

/** Milliseconds as ms or s. A sub-millisecond call still reads as `0 ms`. */
export function formatDuration(ms: number, locale: string): string {
  if (ms >= 1_000) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(ms / 1_000)} s`;
  }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(ms)} ms`;
}

/**
 * Pretty-print a body when its type says it can be.
 *
 * Returns the input unchanged when it is not the type it claims or cannot be
 * parsed: a half-typed JSON response is still worth reading, and reformatting
 * it into an error message would take away the only clue about what is wrong.
 */
export function prettyPrint(body: string, contentType: string | null): string {
  const type = (contentType ?? '').toLowerCase();

  if (type.includes('json') || looksLikeJson(body)) {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  }

  if (type.includes('xml') || type.includes('html')) return indentMarkup(body);

  return body;
}

function looksLikeJson(body: string): boolean {
  const trimmed = body.trim();
  return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'));
}

/**
 * Indent markup one tag per line.
 *
 * A parser-free reformat on purpose: this runs on responses that may be
 * malformed, and a real parser would refuse them exactly when the user most
 * needs to look. Text inside a tag pair is left on its own line rather than
 * being reflowed, so nothing that was significant whitespace is invented or
 * destroyed inside an element.
 */
function indentMarkup(markup: string): string {
  const tokens = markup.replace(/>\s*</g, '><').split(/(<[^>]*>)/).filter((part) => part.trim() !== '');
  const lines: string[] = [];
  let depth = 0;

  for (const token of tokens) {
    const isClosing = token.startsWith('</');
    const isSelfClosing = token.endsWith('/>') || /^<(\?|!)/.test(token);
    const isOpening = token.startsWith('<') && !isClosing && !isSelfClosing;

    if (isClosing) depth = Math.max(0, depth - 1);
    lines.push(`${'  '.repeat(depth)}${token.trim()}`);
    if (isOpening) depth += 1;
  }

  return lines.join('\n');
}

/** The `Content-Type` of a response, without its parameters. */
export function contentTypeOf(headers: readonly { name: string; value: string }[]): string | null {
  const header = headers.find((entry) => entry.name.toLowerCase() === 'content-type');
  return header ? (header.value.split(';')[0]?.trim() ?? null) : null;
}

/** Whether a content type is something an iframe or img can display. */
export function previewKind(contentType: string | null): 'html' | 'image' | 'pdf' | null {
  if (!contentType) return null;
  if (contentType.startsWith('image/')) return 'image';
  if (contentType === 'application/pdf') return 'pdf';
  if (contentType === 'text/html' || contentType === 'application/xhtml+xml') return 'html';
  return null;
}
