import type { IdFactory, PluginPresence } from '@adysre/rules-core';
import type { Diagnostic, RuleDocument, RuleKind } from '@adysre/rules-types';

/**
 * Importing a rule written somewhere else.
 *
 * Two rules govern everything in this package.
 *
 * **Nothing throws.** A bad import is a message to show a person, not an
 * exception to escape with, so every importer returns diagnostics carrying the
 * path INTO THE SOURCE document - `$.conditions.all[1].operator`, not a line
 * number - because the person fixing it is looking at their file, not at ours.
 *
 * **Never a partial import.** If any part of a source rule cannot be converted,
 * the whole import fails. A rule that quietly does less than the one it came
 * from is worse than an import that refused: the first is discovered in
 * production, the second in the import dialog.
 *
 * Between those two sits the distinction that most of this package is about.
 * A construct with an EXACT equivalent converts silently. A construct with an
 * equivalent that differs in some case converts with a WARNING naming the
 * difference. A construct with no equivalent is an ERROR. Guessing in the third
 * case is how an imported rule ends up meaning something nobody chose.
 */

export interface ImportOptions {
  /** Injected so an import is reproducible. See `sequentialIds`. */
  ids?: IdFactory;
  now?: () => number;
  /** Used when the source format carries no name of its own. */
  name?: string;
  /** Used when the source format carries no notion of what a rule is for. */
  kind?: RuleKind;
  /**
   * Extra or replacement operator mappings, keyed by the SOURCE format's
   * operator name. A host with custom operators maps them here rather than
   * forking an importer.
   */
  operators?: Readonly<Record<string, string>>;
  /**
   * Checked after conversion. An import that produces a rule referring to
   * plugins this deployment does not have is an import that would fail at
   * evaluation, and saying so now is the difference between a clear message and
   * a mystery in production.
   */
  registry?: PluginPresence;
}

export type ImportResult =
  | {
      ok: true;
      rule: RuleDocument;
      /** Warnings only. Errors would have made this `ok: false`. */
      diagnostics: Diagnostic[];
    }
  | { ok: false; diagnostics: Diagnostic[] };

/**
 * One source format.
 *
 * A plugin shape rather than a switch statement, for the same reason operators
 * are: the next format somebody needs is one this package has never heard of.
 */
export interface Importer {
  /** e.g. `ast`, `json-logic`, `json-rules-engine`, `mongo`. */
  format: string;
  labelKey: string;
  /**
   * Whether this input looks like this format. Cheap and structural: detection
   * decides which importer runs, and the importer decides whether it works.
   */
  detect: (input: unknown) => boolean;
  import: (input: unknown, options?: ImportOptions) => ImportResult;
}

/** Collects what went wrong, with where. */
export class Report {
  readonly diagnostics: Diagnostic[] = [];
  private errors = 0;

  error(code: string, message: string, path?: string): void {
    this.errors += 1;
    this.diagnostics.push({
      severity: 'error',
      code,
      message,
      ...(path === undefined ? {} : { path }),
    });
  }

  /** An exact-enough conversion whose difference the importer has to name. */
  warn(code: string, message: string, path?: string): void {
    this.diagnostics.push({
      severity: 'warning',
      code,
      message,
      ...(path === undefined ? {} : { path }),
    });
  }

  get failed(): boolean {
    return this.errors > 0;
  }
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
