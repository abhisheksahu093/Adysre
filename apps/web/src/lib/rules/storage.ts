import 'server-only';

import { RuleError, validateRule } from '@adysre/rules-core';
import { nextVersion, restoreFrom } from '@adysre/rules-storage';
import type { RuleDocument, RuleQuery, RuleSummary, StoragePlugin } from '@adysre/rules-types';
import type { PrismaClient } from '@adysre/database';
import { RuleRepository } from './repositories/rules';

/**
 * Rules in Postgres, behind the engine's own storage contract.
 *
 * The third adapter, and the one the conformance suite was written for. The
 * versioning rules - when a save makes a version, what a restore does to
 * history, that the stored version wins over the one a client sent - are NOT
 * reimplemented here. They come from `@adysre/rules-storage`, so this adapter
 * and the in-memory one cannot drift into two subtly different products; what
 * is local to Postgres is only where the bytes go.
 *
 * Tenant-scoped by construction. The `StoragePlugin` interface has no tenant
 * parameter and never should: an adapter is built for one tenant from a
 * verified session, so there is no request shape that reaches another's rows.
 */

export interface PrismaRulesStorageOptions {
  prisma: PrismaClient;
  tenantId: string;
  actor?: string | undefined;
  /** Injectable, so a stored history is reproducible in a test. */
  now?: (() => number) | undefined;
}

export function createPrismaRulesStorage(
  options: PrismaRulesStorageOptions,
): StoragePlugin & { count: (query?: RuleQuery) => Promise<number> } {
  const repository = new RuleRepository({
    prisma: options.prisma,
    tenantId: options.tenantId,
    actor: options.actor,
  });

  const saveOptions = {
    ...(options.now === undefined ? {} : { now: options.now }),
    ...(options.actor === undefined ? {} : { actor: options.actor }),
  };

  return {
    id: 'storage.prisma',

    list: (query?: RuleQuery): Promise<RuleSummary[]> => repository.list(query),

    // The count the API standard's pagination meta needs. Answered by the
    // database rather than by loading every row to length it.
    count: (query?: RuleQuery): Promise<number> => repository.count(query),

    get: (id: string): Promise<RuleDocument | null> => repository.findByRuleId(id),

    save: async (rule: RuleDocument): Promise<RuleDocument> => {
      // A store that trusts its input hands back something the executor cannot
      // run. The same check the in-memory adapter makes, for the same reason.
      const validation = validateRule(rule);
      if (!validation.valid) {
        throw new RuleError(
          'invalid_argument',
          `That rule cannot be stored. ${validation.diagnostics[0]?.message ?? ''}`,
        );
      }

      const previous = await repository.findByRuleId(rule.id);
      const result = nextVersion(previous, rule, saveOptions);

      // An unchanged save creates no version, so nothing is written at all -
      // not even an `updated_at` touch, which would make every autosave look
      // like a change in the audit trail.
      if (!result.created) return result.rule;

      return repository.save(result.rule);
    },

    remove: (id: string): Promise<void> => repository.remove(id),

    versions: (id: string): Promise<RuleSummary[]> => repository.versions(id),

    restore: async (id: string, version: number): Promise<RuleDocument> => {
      const [live, target] = await Promise.all([
        repository.findByRuleId(id),
        repository.versionAt(id, version),
      ]);

      if (live === null) throw new RuleError('invalid_argument', `No rule with the id "${id}".`);
      if (target === null) {
        throw new RuleError('invalid_argument', `Rule "${id}" has no version ${String(version)}.`);
      }

      const result = restoreFrom(live, target, saveOptions);
      return result.created ? repository.save(result.rule) : result.rule;
    },
  };
}
