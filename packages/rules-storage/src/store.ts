import { RuleError, validateRule } from '@adysre/rules-core';
import type { RuleDocument, RuleQuery, RuleSummary, StoragePlugin } from '@adysre/rules-types';
import { applyQuery, summarise } from './query.ts';
import { nextVersion, restoreFrom, type SaveOptions } from './versions.ts';

/**
 * Every semantic the storage contract has, over a port that only has to hold
 * bytes.
 *
 * The versioning, the validation, the query rules and the restore behaviour are
 * the same whether rules live in a `Map`, in a browser's Web Storage or in a
 * table. Writing them once and swapping only the persistence is what keeps two
 * adapters from drifting into two subtly different products - and it is why a
 * new adapter is a `HistoryPort` and not a re-read of this file.
 *
 * A database adapter is the exception and should stay one: it will translate
 * the querying into SQL rather than load every rule to filter it in memory. The
 * conformance suite is what holds it to the same answers.
 */

/** All versions of every rule, oldest first. The last of each is current. */
export type History = Map<string, RuleDocument[]>;

/**
 * Somewhere to keep the history.
 *
 * Synchronous, because both ports that use it are: a `Map` and Web Storage.
 * An asynchronous store implements `StoragePlugin` directly rather than
 * pretending its writes are instant.
 */
export interface HistoryPort {
  read: () => History;
  write: (history: History) => void;
}

export interface StoreOptions extends SaveOptions {
  id?: string;
  /** Rules to start with, when the port is empty. Each becomes its version 1. */
  seed?: readonly RuleDocument[];
}

export function createStorage(port: HistoryPort, options: StoreOptions = {}): StoragePlugin {
  const saveOptions: SaveOptions = {
    ...(options.now === undefined ? {} : { now: options.now }),
    ...(options.actor === undefined ? {} : { actor: options.actor }),
  };

  const seed = options.seed ?? [];
  if (seed.length > 0) {
    const history = port.read();
    // Seeded only into an EMPTY store. A seed that reapplied itself on every
    // construction would resurrect a rule somebody deliberately deleted, every
    // time the page reloaded.
    if (history.size === 0) {
      for (const rule of seed) {
        history.set(rule.id, [nextVersion(null, rule, saveOptions).rule]);
      }
      port.write(history);
    }
  }

  const currentOf = (history: History, id: string): RuleDocument | null => {
    const versions = history.get(id);
    return versions === undefined ? null : (versions[versions.length - 1] ?? null);
  };

  return {
    id: options.id ?? 'storage',

    list: (query?: RuleQuery): Promise<RuleSummary[]> => {
      const history = port.read();
      const summaries: RuleSummary[] = [];

      for (const id of history.keys()) {
        const rule = currentOf(history, id);
        if (rule !== null) summaries.push(summarise(rule));
      }

      return Promise.resolve(applyQuery(summaries, query));
    },

    get: (id: string): Promise<RuleDocument | null> => Promise.resolve(currentOf(port.read(), id)),

    save: (rule: RuleDocument): Promise<RuleDocument> => {
      // A store that trusts its input hands back something the executor cannot
      // run. Unlike parsing, where a bad document is a message to show, an
      // invalid one reaching `save` is a bug in the caller: a builder validates
      // before it offers a Save button.
      const validation = validateRule(rule);
      if (!validation.valid) {
        const first = validation.diagnostics[0]?.message ?? 'It is not a valid rule.';
        return Promise.reject(
          new RuleError('invalid_argument', `That rule cannot be stored. ${first}`),
        );
      }

      const history = port.read();
      const result = nextVersion(currentOf(history, rule.id), rule, saveOptions);

      // An unchanged save creates no version, so nothing is written at all.
      if (!result.created) return Promise.resolve(result.rule);

      const versions = history.get(rule.id);
      if (versions === undefined) history.set(rule.id, [result.rule]);
      else versions.push(result.rule);

      port.write(history);
      return Promise.resolve(result.rule);
    },

    remove: (id: string): Promise<void> => {
      const history = port.read();
      // History goes with it. The contract has no undelete, so keeping the
      // versions would leave `versions()` answering for a rule `get` says does
      // not exist. Removing something absent is not an error, so a retry after
      // a lost response is safe.
      if (history.delete(id)) port.write(history);
      return Promise.resolve();
    },

    versions: (id: string): Promise<RuleSummary[]> => {
      const versions = port.read().get(id) ?? [];
      // Newest first: a version list is read from the top, and the entry
      // somebody wants is nearly always the one before the mistake.
      return Promise.resolve([...versions].reverse().map(summarise));
    },

    restore: (id: string, version: number): Promise<RuleDocument> => {
      const history = port.read();
      const versions = history.get(id);
      const live = currentOf(history, id);

      if (versions === undefined || live === null) {
        return Promise.reject(new RuleError('invalid_argument', `No rule with the id "${id}".`));
      }

      const target = versions.find((entry) => entry.version === version);
      if (target === undefined) {
        return Promise.reject(
          new RuleError('invalid_argument', `Rule "${id}" has no version ${String(version)}.`),
        );
      }

      const result = restoreFrom(live, target, saveOptions);
      if (result.created) {
        versions.push(result.rule);
        port.write(history);
      }

      return Promise.resolve(result.rule);
    },
  };
}
