/**
 * ADYSRE API Studio - evaluating structured assertions.
 *
 * Assertions are DATA, not code: a target, an operator and an expected value.
 * That is what lets them be built without writing JavaScript, translated,
 * exported alongside a request and diffed in review, and it is why this file is
 * pure and synchronous while scripts need a sandbox.
 *
 * Three outcomes, kept distinct because they mean different things to a person
 * reading a test report: `passed`, `failed` (the response is wrong), and
 * `errored` (the assertion itself could not be evaluated, so the response has
 * not been judged at all).
 */

import type {
  Assertion,
  AssertionResult,
  ExecutionResponse,
  TestRunResult,
} from '../types';
import { contentTypeOf } from './format';
import { lookupPath, stringify } from './json-path';
import { validateSchema } from './json-schema';

interface Target {
  /** The observed value, or `null` when the target does not exist. */
  actual: string | null;
  /** Set when the target could not be read at all. */
  error?: string;
  /** For numeric comparisons, when the target is a number. */
  numeric?: number;
  /** The parsed value, for schema checks. */
  parsed?: unknown;
}

function readTarget(assertion: Assertion, response: ExecutionResponse): Target {
  switch (assertion.target) {
    case 'status':
      return { actual: String(response.status), numeric: response.status };

    case 'statusText':
      return { actual: response.statusText };

    case 'responseTime':
      return { actual: String(Math.round(response.timings.total)), numeric: response.timings.total };

    case 'contentType':
      return { actual: contentTypeOf(response.headers) };

    case 'header': {
      const wanted = assertion.path.trim().toLowerCase();
      if (wanted === '') return { actual: null, error: 'No header name was given.' };
      // Repeated headers are joined the way HTTP defines, so `contains` sees
      // every value rather than only the first.
      const values = response.headers
        .filter((header) => header.name.toLowerCase() === wanted)
        .map((header) => header.value);
      return { actual: values.length > 0 ? values.join(', ') : null };
    }

    case 'body':
      return { actual: response.body };

    case 'jsonPath':
    case 'jsonSchema': {
      if (response.bodyEncoding !== 'utf8') {
        return { actual: null, error: 'The response body is not text.' };
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(response.body);
      } catch {
        return { actual: null, error: 'The response body is not JSON.' };
      }

      if (assertion.target === 'jsonSchema') return { actual: response.body, parsed };

      const found = lookupPath(parsed, assertion.path);
      if (!found.found) return { actual: null, error: found.reason };
      return {
        actual: stringify(found.value),
        parsed: found.value,
        ...(typeof found.value === 'number' ? { numeric: found.value } : {}),
      };
    }

    default:
      return { actual: null, error: 'Unknown assertion target.' };
  }
}

/** A readable statement of what was checked, for the report. */
function describe(assertion: Assertion): string {
  if (assertion.label.trim() !== '') return assertion.label;
  const subject = assertion.path.trim() === '' ? assertion.target : `${assertion.target} ${assertion.path}`;
  return `${subject} ${assertion.operator} ${assertion.expected}`.trim();
}

function result(
  assertion: Assertion,
  outcome: AssertionResult['outcome'],
  actual: string | null,
  error: string | null = null,
): AssertionResult {
  return {
    id: assertion.id,
    description: describe(assertion),
    outcome,
    actual,
    expected: assertion.expected === '' ? null : assertion.expected,
    error,
  };
}

/** Evaluate one assertion against a response. Never throws. */
export function evaluateAssertion(assertion: Assertion, response: ExecutionResponse): AssertionResult {
  if (!assertion.enabled) return result(assertion, 'skipped', null);

  const target = readTarget(assertion, response);

  // `exists` and `notExists` are the two operators that are ABOUT absence, so
  // they are answered before a missing target becomes an error.
  if (assertion.operator === 'exists') {
    return result(assertion, target.actual !== null ? 'passed' : 'failed', target.actual);
  }
  if (assertion.operator === 'notExists') {
    return result(assertion, target.actual === null ? 'passed' : 'failed', target.actual);
  }

  if (target.error) return result(assertion, 'errored', null, target.error);
  if (target.actual === null) {
    return result(assertion, 'failed', null, null);
  }

  const actual = target.actual;
  const expected = assertion.expected;

  switch (assertion.operator) {
    case 'equals':
      return result(assertion, actual === expected ? 'passed' : 'failed', actual);

    case 'notEquals':
      return result(assertion, actual !== expected ? 'passed' : 'failed', actual);

    case 'contains':
      return result(assertion, actual.includes(expected) ? 'passed' : 'failed', actual);

    case 'notContains':
      return result(assertion, !actual.includes(expected) ? 'passed' : 'failed', actual);

    case 'matches':
      try {
        return result(assertion, new RegExp(expected).test(actual) ? 'passed' : 'failed', actual);
      } catch {
        return result(assertion, 'errored', actual, 'That is not a valid regular expression.');
      }

    case 'isOneOf': {
      // Comma separated, trimmed: `200, 201, 204` is what a person types.
      const allowed = expected.split(',').map((entry) => entry.trim());
      return result(assertion, allowed.includes(actual) ? 'passed' : 'failed', actual);
    }

    case 'lessThan':
    case 'greaterThan': {
      const limit = Number(expected);
      if (Number.isNaN(limit)) {
        return result(assertion, 'errored', actual, `\`${expected}\` is not a number.`);
      }
      const observed = target.numeric ?? Number(actual);
      if (Number.isNaN(observed)) {
        return result(assertion, 'errored', actual, 'The value is not a number.');
      }
      const passed = assertion.operator === 'lessThan' ? observed < limit : observed > limit;
      return result(assertion, passed ? 'passed' : 'failed', actual);
    }

    case 'isValid': {
      if (assertion.target !== 'jsonSchema') {
        return result(assertion, 'errored', actual, '`is valid` only applies to a JSON schema.');
      }
      let schema: unknown;
      try {
        schema = JSON.parse(expected);
      } catch {
        return result(assertion, 'errored', actual, 'The schema is not valid JSON.');
      }

      const verdict = validateSchema(target.parsed, schema);
      if (verdict.ok) return result(assertion, 'passed', actual);

      if ('unsupported' in verdict) {
        // Not judged: saying so beats reporting a pass this cannot vouch for.
        return result(
          assertion,
          'errored',
          actual,
          `This validator does not support: ${verdict.unsupported.join(', ')}.`,
        );
      }

      const first = verdict.violations[0];
      return result(
        assertion,
        'failed',
        first ? `${first.path} ${first.message}` : actual,
      );
    }

    default:
      return result(assertion, 'errored', actual, 'Unknown operator.');
  }
}

/** Evaluate every assertion for one response and total the outcomes. */
export function runAssertions(
  assertions: readonly Assertion[],
  response: ExecutionResponse,
  requestId: string,
): TestRunResult {
  const started = performance.now();
  const results = assertions.map((assertion) => evaluateAssertion(assertion, response));

  return {
    requestId,
    results,
    passed: results.filter((entry) => entry.outcome === 'passed').length,
    failed: results.filter((entry) => entry.outcome === 'failed').length,
    skipped: results.filter((entry) => entry.outcome === 'skipped').length,
    errored: results.filter((entry) => entry.outcome === 'errored').length,
    durationMs: Math.round(performance.now() - started),
  };
}
