import type { EvaluationContext, JsonValue, Operand } from '@adysre/rules-types';
import { RuleError, arityMismatch } from './errors';
import type { Registry } from './registry';

/**
 * Turning an operand into a value.
 *
 * Three decisions here, and each one is a place where a rules engine can
 * quietly become untrustworthy.
 *
 * **A field that is not there resolves to `null`, not to an error.** Rules are
 * written against optional data, and a customer without a `tier` is ordinary
 * rather than exceptional: `tier isEmpty` should match, not blow up. But the
 * absence is REPORTED - a typo'd path is the single most common reason a rule
 * "does not work", and an engine that silently answers `null` to
 * `custmoer.tier` forever is one nobody can debug. So the value is `null` and a
 * warning names the path.
 *
 * **Paths never reach through the prototype chain.** A path comes out of a
 * stored document, and `constructor.prototype` is a path. Only own properties
 * are read, so the worst a malicious rule can learn about the subject is what
 * the subject actually contains.
 *
 * **Nesting is bounded.** Function operands nest without limit in the AST, and
 * an imported tree was not authored by anyone you know.
 */

/** How deep function operands may nest before the engine gives up. */
export const DEFAULT_MAX_DEPTH = 32;

/**
 * Keys a field path may never traverse.
 *
 * Not a denylist standing in for real safety - the own-property check below is
 * what actually holds - but these are the names that make a reader stop and
 * check, so refusing them explicitly is cheaper than proving it every time.
 */
const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

/** What was not there. */
export type MissingKind = 'field' | 'variable';

export interface ResolveScope {
  registry: Registry;
  context: EvaluationContext;
  maxDepth: number;
  /** Told about every path or variable that was not there. */
  onMissing: (kind: MissingKind, name: string) => void;
}

export interface PathRead {
  found: boolean;
  value: JsonValue;
}

const NOT_FOUND: PathRead = { found: false, value: null };

/** `a.b[0].c` as the segments to walk. Anything malformed yields no segments. */
function segmentsOf(path: string): string[] {
  if (path === '') return [];
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter((segment) => segment !== '');
}

/**
 * Read a dotted path out of a JSON value.
 *
 * @returns `found: false` when any step of the path is missing, so a caller can
 * tell "the field is absent" from "the field holds null" - a distinction the
 * resolved value alone cannot carry.
 */
export function readPath(data: JsonValue, path: string): PathRead {
  const segments = segmentsOf(path);
  if (segments.length === 0) return NOT_FOUND;

  let current: JsonValue = data;

  for (const segment of segments) {
    if (current === null || typeof current !== 'object') return NOT_FOUND;

    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length) return NOT_FOUND;
      current = current[index] ?? null;
      continue;
    }

    if (FORBIDDEN_KEYS.has(segment) || !Object.hasOwn(current, segment)) return NOT_FOUND;
    current = current[segment] ?? null;
  }

  return { found: true, value: current };
}

/**
 * Resolve one operand.
 *
 * @throws {RuleError} when a function is unknown, given the wrong number of
 * arguments, nested too deeply, or unable to answer. Everything a CALLER can be
 * expected to survive - a missing field, an absent variable - resolves to
 * `null` and is reported through `onMissing` instead.
 */
export function resolveOperand(operand: Operand, scope: ResolveScope, depth = 0): JsonValue {
  switch (operand.source) {
    case 'literal':
      return operand.value;

    case 'field': {
      const read = readPath(scope.context.data, operand.path);
      if (!read.found) scope.onMissing('field', operand.path);
      return read.value;
    }

    case 'variable': {
      const variables = scope.context.variables;
      if (!Object.hasOwn(variables, operand.name)) {
        scope.onMissing('variable', operand.name);
        return null;
      }
      return variables[operand.name] ?? null;
    }

    case 'function': {
      if (depth >= scope.maxDepth) {
        throw new RuleError(
          'limit_exceeded',
          `Function operands nest more than ${scope.maxDepth} deep.`,
          operand.name,
        );
      }

      const plugin = scope.registry.function(operand.name);
      if (plugin === undefined) {
        throw new RuleError(
          'unknown_plugin',
          `No function named "${operand.name}" is registered.`,
          operand.name,
        );
      }

      const args = operand.args.map((argument) => resolveOperand(argument, scope, depth + 1));

      // Checked here rather than in every plugin: arity is declared data, and a
      // check the registry can do is a check twenty-three functions do not have
      // to remember. Variadic functions decide for themselves what "enough"
      // means, because `concat()` is empty text and `min()` is a mistake.
      if (plugin.arity !== null && args.length !== plugin.arity) {
        throw arityMismatch(operand.name, plugin.arity, args.length);
      }

      return plugin.evaluate(args, scope.context);
    }

    default: {
      // Unreachable given the union, and reachable given untrusted JSON.
      const unknown = operand as { source?: unknown };
      throw new RuleError(
        'invalid_argument',
        `An operand has an unknown source "${String(unknown.source)}".`,
      );
    }
  }
}
