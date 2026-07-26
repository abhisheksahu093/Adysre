/**
 * ADYSRE API Studio - assertions and test runs.
 *
 * Assertions come in two forms and both produce the same {@link AssertionResult},
 * so the runner, the report and the collection runner never care which was used:
 *
 * - Structured: a target (status, header, JSON path, timing) plus an operator.
 *   These are data, which means they can be built without writing code,
 *   translated, exported to OpenAPI examples and diffed in review.
 * - Script: arbitrary JavaScript, executed in a sandboxed worker with no DOM,
 *   no network and no access to the host page. Scripts are the escape hatch,
 *   not the default.
 */

export const ASSERTION_TARGETS = [
  'status',
  'statusText',
  'responseTime',
  'contentType',
  'header',
  'body',
  'jsonPath',
  'jsonSchema',
] as const;
export type AssertionTarget = (typeof ASSERTION_TARGETS)[number];

export const ASSERTION_OPERATORS = [
  'equals',
  'notEquals',
  'contains',
  'notContains',
  'matches',
  'exists',
  'notExists',
  'lessThan',
  'greaterThan',
  'isOneOf',
  'isValid',
] as const;
export type AssertionOperator = (typeof ASSERTION_OPERATORS)[number];

/**
 * One structured assertion.
 *
 * `path` is the target's addressing argument: a header name for `header`, a
 * JSON path for `jsonPath`, unused elsewhere. `expected` is always a string so
 * assertions stay serialisable and template-able (`{{expected_status}}`); the
 * operator decides how it is coerced.
 */
export interface Assertion {
  id: string;
  enabled: boolean;
  target: AssertionTarget;
  path: string;
  operator: AssertionOperator;
  expected: string;
  /** Overrides the generated description in reports when set. */
  label: string;
}

export type AssertionOutcome = 'passed' | 'failed' | 'skipped' | 'errored';

export interface AssertionResult {
  id: string;
  /** Human-readable statement of what was checked, built from the assertion. */
  description: string;
  outcome: AssertionOutcome;
  /** The value actually observed, stringified for display. */
  actual: string | null;
  expected: string | null;
  /** Set when `outcome` is `errored`: the assertion itself blew up. */
  error: string | null;
}

/** The result of evaluating every assertion and script for one response. */
export interface TestRunResult {
  requestId: string;
  results: AssertionResult[];
  passed: number;
  failed: number;
  skipped: number;
  errored: number;
  durationMs: number;
}

/**
 * What a sandboxed script produced.
 *
 * A script cannot return a value: it runs in a worker, so everything it wants
 * to say has to be data. Logs, test outcomes and variable changes are that
 * data, and `error` is how a script that threw reports itself rather than
 * disappearing.
 */
export interface ScriptOutcome {
  logs: { level: 'log' | 'warn' | 'error'; message: string }[];
  /** Results from `pm.test(...)` calls, in the order they ran. */
  tests: { name: string; passed: boolean; error: string | null }[];
  /** Variables the script set, to be applied to the active environment. */
  setVariables: Record<string, string>;
  /** Variables the script removed. */
  unsetVariables: string[];
  /** The script threw, or the sandbox stopped it. `null` when it completed. */
  error: string | null;
}

/** What a script is allowed to see. Nothing here is a live object. */
export interface ScriptContext {
  request: {
    method: string;
    url: string;
    headers: { name: string; value: string }[];
    body: string;
  };
  response?: {
    status: number;
    statusText: string;
    responseTime: number;
    headers: { name: string; value: string }[];
    body: string;
  };
  /** The resolved variable stack, flattened. */
  variables: Record<string, string>;
}
