/**
 * ADYSRE API Studio - variable resolution.
 *
 * `{{name}}` templates are resolved against a stack of layers, least specific
 * first, so a request overrides its folder, which overrides its collection,
 * which overrides the active environment, which overrides globals.
 *
 * Three properties this has to guarantee, because a resolver that lacks any of
 * them fails in a way the user cannot diagnose:
 *
 * 1. It TERMINATES. Values may themselves contain templates, so `a -> b -> a`
 *    is expressible. Cycles are detected on the path being expanded, and depth
 *    is capped independently, so neither a loop nor a deep chain can hang the
 *    tab.
 * 2. It NEVER THROWS. An unknown or looping variable leaves the raw `{{name}}`
 *    in place and reports an issue, so the user sees the request that would
 *    actually be sent instead of an empty field or an error page.
 * 3. It reports PROVENANCE. Which layer supplied each value is what makes
 *    "why is this hitting staging" answerable.
 */

import type {
  ApiVariable,
  ResolvedTemplate,
  VariableContext,
  VariableIssue,
  VariableLayer,
  VariableSource,
} from '../types';
import { MAX_VARIABLE_DEPTH } from '../constants/limits';

/** `{{ name }}`, with optional inner whitespace. */
const TEMPLATE = /\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}/g;

interface Definition {
  variable: ApiVariable;
  source: VariableSource;
}

/**
 * Flatten the stack into a lookup: last enabled definition wins.
 *
 * Built once per resolution pass rather than per template, because a request
 * with fifty headers would otherwise walk five layers fifty times.
 */
function index(context: VariableContext): Map<string, Definition> {
  const found = new Map<string, Definition>();

  for (const layer of context.layers) {
    for (const variable of layer.variables) {
      if (!variable.enabled) continue;
      found.set(variable.key, {
        variable,
        source: { scope: layer.scope, ownerId: layer.ownerId },
      });
    }
  }

  return found;
}

/** Whether a string contains at least one template. */
export function hasTemplate(value: string): boolean {
  TEMPLATE.lastIndex = 0;
  return TEMPLATE.test(value);
}

/** Every variable name referenced by a string, in first-use order. */
export function referencedNames(value: string): string[] {
  const names: string[] = [];
  for (const match of value.matchAll(TEMPLATE)) {
    const name = match[1];
    if (name && !names.includes(name)) names.push(name);
  }
  return names;
}

/**
 * Resolve one template string.
 *
 * @param value - the raw string, e.g. `{{base_url}}/users/{{id}}`.
 * @param context - the layer stack, least specific first.
 */
export function resolveTemplate(value: string, context: VariableContext): ResolvedTemplate {
  return resolveWith(value, index(context));
}

function resolveWith(value: string, definitions: Map<string, Definition>): ResolvedTemplate {
  const used: ResolvedTemplate['used'] = [];
  const issues: VariableIssue[] = [];

  const expanded = expand(value, definitions, [], 0, used, issues);
  return { value: expanded, used, issues };
}

function expand(
  value: string,
  definitions: Map<string, Definition>,
  path: string[],
  depth: number,
  used: ResolvedTemplate['used'],
  issues: VariableIssue[],
): string {
  if (depth > MAX_VARIABLE_DEPTH) {
    issues.push({ code: 'max_depth', name: path[path.length - 1] ?? '' });
    return value;
  }

  return value.replace(TEMPLATE, (raw, rawName: string) => {
    const name = rawName;

    // A variable that is already being expanded on this path closes a loop.
    // Report it once, with the chain, and leave the template in place.
    if (path.includes(name)) {
      if (!issues.some((issue) => issue.code === 'cycle' && issue.name === name)) {
        issues.push({ code: 'cycle', name, chain: [...path, name] });
      }
      return raw;
    }

    const definition = definitions.get(name);
    if (!definition) {
      if (!issues.some((issue) => issue.code === 'unknown_variable' && issue.name === name)) {
        issues.push({ code: 'unknown_variable', name });
      }
      return raw;
    }

    if (!used.some((entry) => entry.name === name)) {
      used.push({ name, source: definition.source });
    }

    return expand(definition.variable.value, definitions, [...path, name], depth + 1, used, issues);
  });
}

/**
 * Resolve many strings against one stack.
 *
 * The index is built once for the whole batch, which is what makes resolving a
 * full request (url, every header, every param, the body) cheap enough to run
 * on each keystroke for the live preview.
 */
export function resolveAll(
  values: readonly string[],
  context: VariableContext,
): ResolvedTemplate[] {
  const definitions = index(context);
  return values.map((value) => resolveWith(value, definitions));
}

/** Combine layers from the outer stores with the ones the edited node carries. */
export function buildContext(
  outer: readonly VariableLayer[],
  inner: readonly VariableLayer[],
): VariableContext {
  return { layers: [...outer, ...inner] };
}

/**
 * Every variable visible at the top of the stack, most specific definition
 * winning. Drives the variable inspector and autocomplete.
 */
export function visibleVariables(context: VariableContext): Definition[] {
  return [...index(context).values()];
}
