import {
  collectPluginIds,
  findNode,
  logicHash,
  missingPlugins,
  validateRule,
  type PluginPresence,
} from '@adysre/rules-core';
import type { Diagnostic, RuleDocument, RuleNode } from '@adysre/rules-types';
import type { BuilderState } from './state';

/**
 * What the editor needs to know that the state does not literally hold.
 *
 * All pure functions of the state, so a component can call one during render
 * and a test can call the same one without a component. Nothing here is cached:
 * caching belongs to whoever knows how often it is asked, which is the hook,
 * not the selector.
 */

export function canUndo(state: BuilderState): boolean {
  return state.past.length > 0;
}

export function canRedo(state: BuilderState): boolean {
  return state.future.length > 0;
}

/**
 * Whether the rule differs from the last saved version.
 *
 * Compared by `logicHash`, which ignores the name, the description and the
 * timestamps. Renaming a rule is a change worth saving but not one worth
 * warning somebody they are about to lose, and an editor that says "unsaved
 * changes" for a touched-then-untouched field trains people to ignore it.
 */
export function isDirty(state: BuilderState): boolean {
  return logicHash(state.rule) !== state.savedHash;
}

export function selectedNode(state: BuilderState): RuleNode | null {
  if (state.selectedId === null) return null;
  return findNode(state.rule.when, state.selectedId) ?? null;
}

export interface Validation {
  valid: boolean;
  diagnostics: Diagnostic[];
  /** Diagnostics keyed by the node they belong to, for a row to show its own. */
  byNode: ReadonlyMap<string, Diagnostic[]>;
}

/**
 * Validate, and put each problem on the row that caused it.
 *
 * `validateRule` reports an AST PATH, which is right for a file and useless for
 * a form: nobody editing a condition wants to be told about
 * `$.when.children[1].args[0]`. Resolving the path back to a node id is what
 * turns a list of problems into a red outline in the right place.
 */
export function validation(rule: RuleDocument): Validation {
  const result = validateRule(rule);
  const byNode = new Map<string, Diagnostic[]>();

  for (const diagnostic of result.diagnostics) {
    const id = nodeIdForPath(rule, diagnostic.path);
    if (id === null) continue;
    const existing = byNode.get(id);
    if (existing === undefined) byNode.set(id, [diagnostic]);
    else existing.push(diagnostic);
  }

  return { valid: result.valid, diagnostics: [...result.diagnostics], byNode };
}

/** Which plugins this rule needs that the deployment does not have. */
export function missingFor(
  rule: RuleDocument,
  registry: PluginPresence,
): { operators: string[]; functions: string[] } {
  return missingPlugins(registry, collectPluginIds(rule));
}

/**
 * The node an AST path points into, or the closest one above it.
 *
 * `$.when.children[1].left.source` is a problem with an operand, and the row
 * that has to show it is the condition holding that operand, so the walk
 * remembers the last node it passed through rather than requiring the path to
 * end on one.
 */
export function nodeIdForPath(rule: RuleDocument, path: string | undefined): string | null {
  if (path === undefined || path === '') return null;

  let cursor: unknown = rule;
  let lastId: string | null = null;

  for (const token of tokensOf(path)) {
    if (cursor === null || typeof cursor !== 'object') return lastId;

    cursor =
      typeof token === 'number'
        ? (cursor as unknown[])[token]
        : (cursor as Record<string, unknown>)[token];

    const id = idOf(cursor);
    if (id !== null) lastId = id;
  }

  return lastId;
}

function idOf(value: unknown): string | null {
  if (value === null || typeof value !== 'object') return null;
  const node = value as { kind?: unknown; id?: unknown };
  if (node.kind !== 'group' && node.kind !== 'condition') return null;
  return typeof node.id === 'string' ? node.id : null;
}

/** `$.when.children[1].left` becomes `when`, `children`, 1, `left`. */
function* tokensOf(path: string): Generator<string | number> {
  for (const segment of path.replace(/^\$\.?/, '').split('.')) {
    if (segment === '') continue;

    const name = segment.replace(/\[\d+\]/g, '');
    if (name !== '') yield name;

    for (const match of segment.matchAll(/\[(\d+)\]/g)) yield Number(match[1]);
  }
}
