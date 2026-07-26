/**
 * ADYSRE API Studio - a small JSON Schema validator.
 *
 * Draft 2020-12, restricted to the keywords a response assertion actually uses.
 * The whole specification is a large thing to carry, and most of it (`$ref`,
 * `allOf` composition, dynamic anchors) is about authoring schemas rather than
 * checking a payload.
 *
 * What matters more than coverage is HONESTY about coverage: a keyword this
 * does not implement is reported as unsupported, never quietly ignored. A
 * validator that silently skips `oneOf` would pass a response that violates it,
 * which is worse than having no validator at all.
 */

const SUPPORTED = new Set([
  'type',
  'properties',
  'required',
  'items',
  'enum',
  'const',
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'minLength',
  'maxLength',
  'pattern',
  'minItems',
  'maxItems',
  'uniqueItems',
  'additionalProperties',
  'nullable',
  // Annotations: not constraints, so ignoring them is correct rather than a gap.
  'title',
  'description',
  'examples',
  'default',
  '$schema',
  '$id',
]);

export interface SchemaViolation {
  /** Where in the document, in JSON-path form. */
  path: string;
  message: string;
}

export type SchemaResult =
  | { ok: true }
  | { ok: false; violations: SchemaViolation[] }
  | { ok: false; unsupported: string[] };

type Schema = Record<string, unknown>;

/** Every keyword used anywhere in the schema that this validator cannot honour. */
function unsupportedKeywords(schema: unknown, found = new Set<string>()): Set<string> {
  if (typeof schema !== 'object' || schema === null || Array.isArray(schema)) return found;

  for (const [keyword, value] of Object.entries(schema)) {
    if (!SUPPORTED.has(keyword)) found.add(keyword);

    if (keyword === 'properties' && typeof value === 'object' && value !== null) {
      for (const child of Object.values(value)) unsupportedKeywords(child, found);
    } else if (keyword === 'items' || keyword === 'additionalProperties') {
      unsupportedKeywords(value, found);
    }
  }

  return found;
}

function typeOf(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (Number.isInteger(value)) return 'integer';
  return typeof value;
}

function matchesType(value: unknown, expected: string): boolean {
  const actual = typeOf(value);
  if (expected === 'number') return actual === 'number' || actual === 'integer';
  if (expected === 'integer') return actual === 'integer';
  return actual === expected;
}

/**
 * Validate a parsed document against a schema.
 *
 * @returns `ok`, a list of violations, or the unsupported keywords that make a
 * verdict impossible. The caller reports the third as an errored assertion, not
 * a failed one: the response may well be fine, this cannot say.
 */
export function validateSchema(document: unknown, schema: unknown): SchemaResult {
  const unsupported = [...unsupportedKeywords(schema)];
  if (unsupported.length > 0) return { ok: false, unsupported };

  const violations: SchemaViolation[] = [];
  check(document, schema as Schema, '$', violations);
  return violations.length === 0 ? { ok: true } : { ok: false, violations };
}

function check(value: unknown, schema: Schema, path: string, violations: SchemaViolation[]): void {
  if (typeof schema !== 'object' || schema === null) return;

  const nullable = schema.nullable === true;
  if (value === null && nullable) return;

  if (typeof schema.type === 'string' && !matchesType(value, schema.type)) {
    violations.push({ path, message: `expected ${schema.type}, got ${typeOf(value)}` });
    // Every other keyword assumes the type held, so stop here rather than
    // reporting a cascade of consequences of the same mistake.
    return;
  }

  if (Array.isArray(schema.type) && !schema.type.some((type) => matchesType(value, String(type)))) {
    violations.push({ path, message: `expected one of ${schema.type.join(', ')}, got ${typeOf(value)}` });
    return;
  }

  if (schema.const !== undefined && JSON.stringify(value) !== JSON.stringify(schema.const)) {
    violations.push({ path, message: `expected ${JSON.stringify(schema.const)}` });
  }

  if (Array.isArray(schema.enum) && !schema.enum.some((entry) => JSON.stringify(entry) === JSON.stringify(value))) {
    violations.push({ path, message: `not one of the allowed values` });
  }

  if (typeof value === 'number') {
    if (typeof schema.minimum === 'number' && value < schema.minimum) {
      violations.push({ path, message: `must be at least ${schema.minimum}` });
    }
    if (typeof schema.maximum === 'number' && value > schema.maximum) {
      violations.push({ path, message: `must be at most ${schema.maximum}` });
    }
    if (typeof schema.exclusiveMinimum === 'number' && value <= schema.exclusiveMinimum) {
      violations.push({ path, message: `must be greater than ${schema.exclusiveMinimum}` });
    }
    if (typeof schema.exclusiveMaximum === 'number' && value >= schema.exclusiveMaximum) {
      violations.push({ path, message: `must be less than ${schema.exclusiveMaximum}` });
    }
  }

  if (typeof value === 'string') {
    if (typeof schema.minLength === 'number' && value.length < schema.minLength) {
      violations.push({ path, message: `must be at least ${schema.minLength} characters` });
    }
    if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) {
      violations.push({ path, message: `must be at most ${schema.maxLength} characters` });
    }
    if (typeof schema.pattern === 'string') {
      try {
        if (!new RegExp(schema.pattern).test(value)) {
          violations.push({ path, message: `does not match ${schema.pattern}` });
        }
      } catch {
        violations.push({ path, message: `the schema's pattern is not a valid regular expression` });
      }
    }
  }

  if (Array.isArray(value)) {
    if (typeof schema.minItems === 'number' && value.length < schema.minItems) {
      violations.push({ path, message: `must have at least ${schema.minItems} items` });
    }
    if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) {
      violations.push({ path, message: `must have at most ${schema.maxItems} items` });
    }
    if (schema.uniqueItems === true) {
      const seen = new Set(value.map((entry) => JSON.stringify(entry)));
      if (seen.size !== value.length) violations.push({ path, message: 'items must be unique' });
    }
    if (schema.items && typeof schema.items === 'object') {
      value.forEach((entry, index) =>
        check(entry, schema.items as Schema, `${path}[${index}]`, violations),
      );
    }
  }

  if (typeOf(value) === 'object') {
    const object = value as Record<string, unknown>;
    const properties = (schema.properties ?? {}) as Record<string, Schema>;

    if (Array.isArray(schema.required)) {
      for (const key of schema.required) {
        if (!Object.prototype.hasOwnProperty.call(object, String(key))) {
          violations.push({ path: `${path}.${String(key)}`, message: 'is required' });
        }
      }
    }

    for (const [key, child] of Object.entries(properties)) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        check(object[key], child, `${path}.${key}`, violations);
      }
    }

    if (schema.additionalProperties === false) {
      for (const key of Object.keys(object)) {
        if (!Object.prototype.hasOwnProperty.call(properties, key)) {
          violations.push({ path: `${path}.${key}`, message: 'is not allowed' });
        }
      }
    }
  }
}
