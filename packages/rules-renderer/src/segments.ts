import type { JsonValue } from '@adysre/rules-types';

/**
 * A sentence, before it is a string.
 *
 * The renderer produces STRUCTURE first and text second, and that order is the
 * whole design. A string is enough for a tooltip and useless for everything
 * else the engine needs: a builder that highlights the field a user is editing,
 * a debugger that colours the condition that decided a verdict, a diff that
 * shows which value changed between two versions of a rule. None of those can
 * be recovered from prose after the fact.
 *
 * So the text form is a projection of the segments, exactly as everything else
 * in this engine is a projection of the AST.
 */

export type Segment =
  /** Connective words: the parts a translator owns and a UI does not style. */
  | { type: 'text'; text: string }
  /** A value read from the subject. Carries its path, for highlighting. */
  | { type: 'field'; text: string; path: string }
  /** A value the host supplies at evaluation time. */
  | { type: 'variable'; text: string; name: string }
  /** A value written into the rule. */
  | { type: 'value'; text: string; value: JsonValue }
  /** A computed value, named by its plugin id. */
  | { type: 'function'; text: string; id: string }
  /** Something the renderer could not describe. Never an exception. */
  | { type: 'unknown'; text: string; reason: string };

/** One line of the outline: a heading, a condition, or an action. */
export interface RenderedLine {
  /** The AST node this line describes, when it describes one. */
  nodeId?: string;
  /** What the line is, so a UI can style headings differently from conditions. */
  role: 'title' | 'heading' | 'condition' | 'action';
  /** Nesting level. 0 is the outermost. */
  depth: number;
  segments: Segment[];
}

export interface RenderedRule {
  ruleId: string;
  title: string;
  lines: RenderedLine[];
  /** The plain-text projection, for a log, a diff or a code comment. */
  text: string;
}

/** The text of one line, ignoring its structure. */
export function lineText(line: RenderedLine): string {
  return line.segments.map((segment) => segment.text).join('');
}

// Unicode private-use characters: they cannot occur in a sentence anyone
// wrote, so a marker is never mistaken for content.
const OPEN = '\uE000';
const CLOSE = '\uE001';
const SLOT = /\uE000(\d+)\uE001/;

/**
 * A stand-in for an operand inside a plugin's sentence.
 *
 * `OperatorPlugin.toText` takes strings and returns a string, which is what
 * makes it cheap to write and impossible to keep structure through. So the
 * renderer hands it private-use markers instead of rendered text, and splits
 * the answer back apart afterwards.
 *
 * The plugin writes the sentence; the renderer recovers the structure from it.
 * A plugin that drops a marker has dropped that operand from the sentence,
 * which is its right - `isEmpty` never mentions its arguments either.
 */
export function slot(index: number): string {
  return `${OPEN}${index}${CLOSE}`;
}

/** Split a plugin's sentence back into segments, splicing the operands in. */
export function weave(template: string, parts: readonly Segment[][]): Segment[] {
  const segments: Segment[] = [];
  let rest = template;

  for (;;) {
    const match = SLOT.exec(rest);
    if (match === null || match.index === undefined) break;

    if (match.index > 0) segments.push({ type: 'text', text: rest.slice(0, match.index) });

    const part = parts[Number(match[1])];
    if (part !== undefined) segments.push(...part);

    rest = rest.slice(match.index + match[0].length);
  }

  if (rest !== '') segments.push({ type: 'text', text: rest });
  return segments;
}
