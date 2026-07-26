import { parseRule } from '@adysre/rules-core';
import { collectPluginIds, missingPlugins } from '@adysre/rules-core';
import { isPlainObject, Report, type Importer, type ImportOptions, type ImportResult } from '../types.ts';

/**
 * This engine's own format.
 *
 * A thin layer over `parseRule`, which already parses, validates and migrates.
 * It is here so that "import a rule" is ONE call whatever the source, and so
 * that a rule from this engine gets the same registry check as a rule from any
 * other: a document exported from a deployment with custom operators is exactly
 * as likely to be unusable here as a jsonLogic file is.
 */
export function importAst(input: unknown, options?: ImportOptions): ImportResult {
  const report = new Report();
  const text = typeof input === 'string' ? input : JSON.stringify(input);

  if (text === undefined) {
    report.error('not_a_rule', 'A rule has to be an object or a JSON string.', '$');
    return { ok: false, diagnostics: report.diagnostics };
  }

  const parsed = parseRule(text);
  if (!parsed.ok) {
    for (const problem of parsed.diagnostics) {
      report.error(problem.code, problem.message, problem.path);
    }
    return { ok: false, diagnostics: report.diagnostics };
  }

  if (parsed.migrated) {
    report.warn(
      'migrated',
      'This rule was written by an older version of the engine and has been brought up to date.',
      '$.schemaVersion',
    );
  }

  if (options?.registry !== undefined) {
    const missing = missingPlugins(options.registry, collectPluginIds(parsed.rule));
    for (const id of missing.operators) {
      report.error('operator_not_registered', `This deployment has no operator "${id}".`, '$');
    }
    for (const id of missing.functions) {
      report.error('function_not_registered', `This deployment has no function "${id}".`, '$');
    }
    if (report.failed) return { ok: false, diagnostics: report.diagnostics };
  }

  return { ok: true, rule: parsed.rule, diagnostics: report.diagnostics };
}

export const astImporter: Importer = {
  format: 'ast',
  labelKey: 'importers.ast',
  detect: (input) => {
    const value = typeof input === 'string' ? tryParse(input) : input;
    return isPlainObject(value) && typeof value['schemaVersion'] === 'number' && 'when' in value;
  },
  import: importAst,
};

function tryParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
