import { astImporter } from './importers/ast';
import { jsonLogicImporter } from './importers/json-logic';
import { jsonRulesEngineImporter } from './importers/json-rules-engine';
import { mongoImporter } from './importers/mongo';
import { Report, type Importer, type ImportOptions, type ImportResult } from './types';

/**
 * Choosing an importer, and running it.
 *
 * The order is deliberate and is the whole of the detection logic: each format
 * is tried before any format that could also claim its documents. This engine's
 * own AST is unmistakable, json-rules-engine is recognised by its `conditions`
 * wrapper, jsonLogic by its single operator key, and a query filter LAST -
 * because "an object whose keys are field names" describes almost anything, and
 * a permissive detector that runs first is a detector that is always right and
 * never correct.
 */
export const builtinImporters: readonly Importer[] = [
  astImporter,
  jsonRulesEngineImporter,
  jsonLogicImporter,
  mongoImporter,
];

/** Which format this looks like, or null when nothing claims it. */
export function detectFormat(
  input: unknown,
  importers: readonly Importer[] = builtinImporters,
): string | null {
  const parsed = typeof input === 'string' ? tryParse(input) : input;
  if (parsed === undefined) return null;

  for (const importer of importers) {
    // The AST importer is the only one that reads a string, since it is the
    // only format this engine also WRITES.
    if (importer.detect(importer.format === 'ast' ? input : parsed)) return importer.format;
  }

  return null;
}

export interface DispatchOptions extends ImportOptions {
  /** Force a format instead of detecting one. */
  format?: string;
  /** Replace the set of importers, for a host that adds its own. */
  importers?: readonly Importer[];
}

/**
 * Import a rule from whatever it happens to be.
 *
 * @returns diagnostics rather than throwing, always, including when nothing
 * recognised the input. "I do not know what this is" is a message a person can
 * act on; an exception from inside a detector is not.
 */
export function importRule(input: unknown, options: DispatchOptions = {}): ImportResult {
  const importers = options.importers ?? builtinImporters;

  if (options.format !== undefined) {
    const chosen = importers.find((importer) => importer.format === options.format);
    if (chosen === undefined) {
      const report = new Report();
      report.error(
        'format_unknown',
        `No importer handles the format "${options.format}".`,
        '$',
      );
      return { ok: false, diagnostics: report.diagnostics };
    }
    return chosen.import(prepare(chosen, input), options);
  }

  const format = detectFormat(input, importers);
  if (format === null) {
    const report = new Report();
    report.error(
      'format_unrecognised',
      'This does not look like a rule in any format this engine can read.',
      '$',
    );
    return { ok: false, diagnostics: report.diagnostics };
  }

  const chosen = importers.find((importer) => importer.format === format);
  /* The format came from this same list, so it is there. */
  return chosen === undefined
    ? { ok: false, diagnostics: [] }
    : chosen.import(prepare(chosen, input), options);
}

/** Every importer but the AST one works on parsed JSON, not on text. */
function prepare(importer: Importer, input: unknown): unknown {
  if (importer.format === 'ast' || typeof input !== 'string') return input;
  return tryParse(input);
}

function tryParse(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}
