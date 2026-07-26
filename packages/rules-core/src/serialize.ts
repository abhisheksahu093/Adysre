import { AST_SCHEMA_VERSION, type RuleDocument } from '@adysre/rules-types';
import { validateRule, type ValidationResult } from './validate';

/**
 * Rules crossing a boundary.
 *
 * A rule leaves this process constantly: into a database, a file, a request
 * body, a clipboard. Every one of those is a place it can come back WRONG -
 * hand-edited, truncated, written by an older build, or produced by something
 * that is not this engine at all.
 *
 * So parsing is one function that validates, and stringifying is one function
 * that writes a stable shape. Nothing else in the ecosystem should call
 * `JSON.parse` on a rule.
 */

export type ParseResult =
  | { ok: true; rule: RuleDocument; migrated: boolean }
  | { ok: false; diagnostics: ValidationResult['diagnostics'] };

/**
 * A migration from one AST version to the next.
 *
 * Registered rather than hard-coded so the upgrade path is data: each entry
 * moves a document forward exactly one version, and `parseRule` composes them.
 * Version 1 is the first, so the table is empty - it exists now because adding
 * the mechanism later would mean every stored rule predates it.
 */
export type Migration = (document: Record<string, unknown>) => Record<string, unknown>;

export const MIGRATIONS: Readonly<Record<number, Migration>> = {};

/**
 * Read a rule from JSON text or a parsed value.
 *
 * @param input - JSON text, or an already-parsed value.
 * @returns the rule, or the diagnostics explaining why it is not one. Never
 * throws: a bad import is a message to show, not an exception to escape with.
 */
export function parseRule(input: string | unknown): ParseResult {
  let raw: unknown;

  if (typeof input === 'string') {
    try {
      raw = JSON.parse(input);
    } catch {
      return {
        ok: false,
        diagnostics: [
          { severity: 'error', code: 'not_json', message: 'That is not valid JSON.', path: '$' },
        ],
      };
    }
  } else {
    raw = input;
  }

  const migrated = migrate(raw);
  const result = validateRule(migrated.document);

  return result.valid
    ? { ok: true, rule: migrated.document as RuleDocument, migrated: migrated.applied > 0 }
    : { ok: false, diagnostics: result.diagnostics };
}

/** Walk a document forward through the migration table. */
function migrate(raw: unknown): { document: unknown; applied: number } {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { document: raw, applied: 0 };
  }

  let document = raw as Record<string, unknown>;
  let applied = 0;
  let version = typeof document.schemaVersion === 'number' ? document.schemaVersion : 0;

  while (version < AST_SCHEMA_VERSION) {
    const migration = MIGRATIONS[version];
    // No migration for this step means the document cannot be brought forward.
    // It is handed on unchanged so validation reports the real problem rather
    // than this loop inventing one.
    if (!migration) break;
    document = migration(document);
    version += 1;
    applied += 1;
    document.schemaVersion = version;
  }

  return { document, applied };
}

/**
 * Write a rule as JSON.
 *
 * Keys are emitted in a FIXED order rather than insertion order, so the same
 * rule always produces byte-identical text. That is what makes a stored rule
 * diffable in review, comparable in a test, and stable in version control -
 * none of which survives a serializer that reorders keys between saves.
 */
export function stringifyRule(rule: RuleDocument, pretty = true): string {
  return JSON.stringify(orderKeys(rule), null, pretty ? 2 : 0);
}

const RULE_KEY_ORDER = [
  'schemaVersion',
  'id',
  'key',
  'name',
  'description',
  'kind',
  'status',
  'version',
  'priority',
  'enabled',
  'tags',
  'when',
  'then',
  'otherwise',
  'metadata',
];

const NODE_KEY_ORDER = [
  'kind',
  'id',
  'combinator',
  'negate',
  'left',
  'operator',
  'args',
  'children',
  'source',
  'path',
  'name',
  'value',
  'target',
  'type',
  'params',
  'comment',
];

function orderKeys(value: unknown, order: string[] = RULE_KEY_ORDER): unknown {
  if (Array.isArray(value)) return value.map((entry) => orderKeys(entry, NODE_KEY_ORDER));
  if (typeof value !== 'object' || value === null) return value;

  const source = value as Record<string, unknown>;
  const known = order.filter((key) => source[key] !== undefined);
  // Anything the order does not mention keeps its own relative order at the
  // end, so an unknown key is preserved rather than dropped.
  const rest = Object.keys(source).filter((key) => !order.includes(key));

  const out: Record<string, unknown> = {};
  for (const key of [...known, ...rest]) {
    out[key] = orderKeys(source[key], NODE_KEY_ORDER);
  }
  return out;
}

/** A stable fingerprint of a rule's LOGIC, ignoring names and timestamps. */
export function logicHash(rule: RuleDocument): string {
  const logic = JSON.stringify(
    orderKeys(
      { kind: rule.kind, when: rule.when, then: rule.then, otherwise: rule.otherwise },
      RULE_KEY_ORDER,
    ),
  );

  // FNV-1a: small, dependency-free, and enough to answer "did the logic
  // change?" - which is all this is for. Not a cryptographic claim.
  let hash = 0x811c9dc5;
  for (let index = 0; index < logic.length; index += 1) {
    hash ^= logic.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}
