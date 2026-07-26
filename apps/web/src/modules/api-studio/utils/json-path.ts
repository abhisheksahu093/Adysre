/**
 * ADYSRE API Studio - JSON path lookup.
 *
 * A deliberately small subset: `$.users[0].name`, `users.0.name`, `["odd key"]`.
 * No wildcards, no filters, no recursive descent. Those turn a path into a query
 * language, and a query language needs a parser, an evaluator and a story about
 * what a filter that throws means for an assertion. What people actually write
 * in a test is a path to one value, and that is what this resolves.
 *
 * Unsupported syntax is reported rather than guessed at, so an assertion using
 * `$..name` fails with "that path syntax is not supported" instead of silently
 * comparing against `undefined` and passing.
 */

export type PathSegment = { kind: 'key'; value: string } | { kind: 'index'; value: number };

export type ParsedPath =
  | { ok: true; segments: PathSegment[] }
  | { ok: false; reason: string };

/** Syntax this subset knows it cannot do, named so the message can say which. */
const UNSUPPORTED: [RegExp, string][] = [
  [/\.\./, 'recursive descent (`..`)'],
  [/\*/, 'wildcards (`*`)'],
  [/\?\(/, 'filter expressions (`?()`)'],
  [/\(/, 'script expressions'],
];

export function parsePath(path: string): ParsedPath {
  const trimmed = path.trim();
  if (trimmed === '') return { ok: false, reason: 'The path is empty.' };

  for (const [pattern, name] of UNSUPPORTED) {
    if (pattern.test(trimmed)) return { ok: false, reason: `Paths using ${name} are not supported.` };
  }

  // A leading `$` is optional: both `$.a` and `a` mean the same thing.
  let rest = trimmed.startsWith('$') ? trimmed.slice(1) : trimmed;
  const segments: PathSegment[] = [];

  while (rest.length > 0) {
    if (rest.startsWith('.')) {
      rest = rest.slice(1);
      continue;
    }

    if (rest.startsWith('[')) {
      const close = rest.indexOf(']');
      if (close === -1) return { ok: false, reason: 'The path has an unclosed bracket.' };

      const inner = rest.slice(1, close).trim();
      rest = rest.slice(close + 1);

      const quoted = /^'(.*)'$|^"(.*)"$/.exec(inner);
      if (quoted) {
        segments.push({ kind: 'key', value: quoted[1] ?? quoted[2] ?? '' });
        continue;
      }

      const index = Number(inner);
      if (!Number.isInteger(index) || index < 0) {
        return { ok: false, reason: `\`${inner}\` is not an array index.` };
      }
      segments.push({ kind: 'index', value: index });
      continue;
    }

    const next = rest.search(/[.[]/);
    const key = next === -1 ? rest : rest.slice(0, next);
    rest = next === -1 ? '' : rest.slice(next);

    if (key === '') continue;
    // `users.0` is how most people write an index outside brackets.
    const index = Number(key);
    segments.push(
      Number.isInteger(index) && key.trim() !== '' && /^\d+$/.test(key)
        ? { kind: 'index', value: index }
        : { kind: 'key', value: key },
    );
  }

  return segments.length > 0
    ? { ok: true, segments }
    : { ok: false, reason: 'The path selects nothing.' };
}

export type Lookup =
  | { found: true; value: unknown }
  | { found: false; reason: string };

/**
 * Read a value out of a parsed document.
 *
 * `found: false` distinguishes "the path leads nowhere" from "the value is
 * null", which an assertion needs: `exists` must fail for the first and pass
 * for the second.
 */
export function lookupPath(document: unknown, path: string): Lookup {
  const parsed = parsePath(path);
  if (!parsed.ok) return { found: false, reason: parsed.reason };

  let current = document;

  for (const segment of parsed.segments) {
    if (current === null || current === undefined) {
      return { found: false, reason: `\`${path}\` leads nowhere.` };
    }

    if (segment.kind === 'index') {
      if (!Array.isArray(current)) return { found: false, reason: `\`${path}\` is not an array.` };
      if (segment.value >= current.length) {
        return { found: false, reason: `\`${path}\` is past the end of the array.` };
      }
      current = current[segment.value];
      continue;
    }

    if (typeof current !== 'object' || Array.isArray(current)) {
      return { found: false, reason: `\`${path}\` leads nowhere.` };
    }
    if (!Object.prototype.hasOwnProperty.call(current, segment.value)) {
      return { found: false, reason: `\`${path}\` leads nowhere.` };
    }
    current = (current as Record<string, unknown>)[segment.value];
  }

  return { found: true, value: current };
}

/** A value as an assertion displays and compares it. */
export function stringify(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === undefined) return 'undefined';
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}
