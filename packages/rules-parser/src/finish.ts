import {
  all,
  collectPluginIds,
  missingPlugins,
  rule,
  validateRule,
  type BuilderOptions,
} from '@adysre/rules-core';
import type { ActionNode, GroupNode, RuleKind, RuleNode } from '@adysre/rules-types';
import type { ImportOptions, ImportResult, Report } from './types';

/**
 * The last step every importer takes.
 *
 * Three checks, in this order, and each one exists because the alternative is a
 * failure discovered somewhere worse.
 *
 * 1. The converted tree is VALIDATED. An importer is code, code has bugs, and
 *    an importer bug that produces a malformed tree should be caught here
 *    rather than by the executor at three in the morning.
 * 2. The rule is checked against the deployment's plugins, when one was given.
 *    A rule referring to an operator nobody registered is a rule that will
 *    error at evaluation.
 * 3. Any error at all fails the whole import. Never a partial rule.
 */

export interface Converted {
  when: RuleNode | null;
  then?: ActionNode[];
  name?: string | undefined;
  kind?: RuleKind | undefined;
  key?: string | undefined;
  description?: string | undefined;
  priority?: number | undefined;
}

export function builderOptions(options: ImportOptions | undefined): BuilderOptions {
  return {
    ...(options?.ids === undefined ? {} : { ids: options.ids }),
    ...(options?.now === undefined ? {} : { now: options.now }),
  };
}

/** A condition at the root becomes a group, because `when` always is one. */
function asGroup(node: RuleNode, builder: BuilderOptions): GroupNode {
  return node.kind === 'group' ? node : all([node], builder);
}

export function finish(
  converted: Converted,
  report: Report,
  options: ImportOptions | undefined,
): ImportResult {
  if (report.failed || converted.when === null) {
    // `when` being null without a recorded error would be an importer that gave
    // up silently, which is the one thing this package must never do.
    if (!report.failed) {
      report.error('import_failed', 'The source could not be converted into a rule.', '$');
    }
    return { ok: false, diagnostics: report.diagnostics };
  }

  const builder = builderOptions(options);
  const document = rule(
    {
      name: converted.name ?? options?.name ?? 'Imported rule',
      kind: converted.kind ?? options?.kind ?? 'validation',
      when: asGroup(converted.when, builder),
      then: converted.then ?? [],
      ...(converted.key === undefined ? {} : { key: converted.key }),
      ...(converted.description === undefined ? {} : { description: converted.description }),
      ...(converted.priority === undefined ? {} : { priority: converted.priority }),
    },
    builder,
  );

  const validation = validateRule(document);
  if (!validation.valid) {
    for (const problem of validation.diagnostics) {
      report.error(
        `converted_${problem.code}`,
        `The import produced an invalid rule: ${problem.message}`,
        problem.path,
      );
    }
    return { ok: false, diagnostics: report.diagnostics };
  }

  if (options?.registry !== undefined) {
    const missing = missingPlugins(options.registry, collectPluginIds(document));
    for (const id of missing.operators) {
      report.error('operator_not_registered', `This deployment has no operator "${id}".`, '$');
    }
    for (const id of missing.functions) {
      report.error('function_not_registered', `This deployment has no function "${id}".`, '$');
    }
    if (report.failed) return { ok: false, diagnostics: report.diagnostics };
  }

  return { ok: true, rule: document, diagnostics: report.diagnostics };
}
