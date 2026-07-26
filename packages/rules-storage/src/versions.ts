import { logicHash, stringifyRule } from '@adysre/rules-core';
import type { RuleDocument } from '@adysre/rules-types';

/**
 * What a version is, and when a save makes a new one.
 *
 * The AST already says `version` is "incremented on each saved change". The
 * decisions left are the ones a store has to make and the document cannot:
 * whether a save that changed nothing counts, what a restore does to history,
 * and how a reader tells a rename from a real edit.
 */

/**
 * Whether two documents differ in any way worth recording.
 *
 * Compared through `stringifyRule`, which emits keys in a FIXED order, so two
 * documents that differ only in how they were built compare equal. Comparing
 * `JSON.stringify` output directly would make a save look like a change
 * whenever an editor happened to assign fields in a different order.
 *
 * `version` and `updatedAt` are excluded because they are what a save PRODUCES.
 * Including them would make every document differ from its successor by
 * definition, which is a comparison that always says yes and therefore says
 * nothing.
 */
export function isUnchanged(previous: RuleDocument, incoming: RuleDocument): boolean {
  return stringifyRule(stripStamps(previous)) === stringifyRule(stripStamps(incoming));
}

function stripStamps(rule: RuleDocument): RuleDocument {
  return {
    ...rule,
    version: 0,
    metadata: { ...rule.metadata, updatedAt: '' },
  };
}

export interface SaveOptions {
  /** Epoch milliseconds. Injectable, so a stored history is reproducible. */
  now?: (() => number) | undefined;
  /** Who is saving, for `metadata.updatedBy`. */
  actor?: string | undefined;
}

export interface SaveResult {
  rule: RuleDocument;
  /** False when the save changed nothing and no version was created. */
  created: boolean;
}

/**
 * The document to store, given what is already there.
 *
 * A save that changes NOTHING creates no version and returns what was already
 * stored. A rule builder autosaves, a form posts twice, a retry lands after the
 * first attempt succeeded - and a history padded with identical entries is a
 * history nobody scrolls, which defeats the point of keeping one.
 *
 * Everything else bumps the version, INCLUDING a rename. The AST says version
 * increments on each saved change, and a rename is a change somebody made and
 * may want back. Whether it changed the LOGIC is a separate question, which
 * `logicHash` answers and `compareVersions` reports.
 */
export function nextVersion(
  previous: RuleDocument | null,
  incoming: RuleDocument,
  options: SaveOptions = {},
): SaveResult {
  const now = new Date(options.now?.() ?? Date.now()).toISOString();

  if (previous === null) {
    return {
      created: true,
      rule: {
        ...incoming,
        // A first save is version 1 whatever the caller sent. A document
        // arriving from an import or a fixture carries whatever version it was
        // written with, and honouring that would start a fresh history at 7.
        version: 1,
        metadata: {
          ...incoming.metadata,
          createdAt: incoming.metadata.createdAt,
          updatedAt: now,
          ...(options.actor === undefined ? {} : { updatedBy: options.actor }),
        },
      },
    };
  }

  if (isUnchanged(previous, incoming)) return { created: false, rule: previous };

  return {
    created: true,
    rule: {
      ...incoming,
      // From the STORED version, not the incoming one. A client editing an old
      // copy would otherwise write version 4 over version 9 and lose the count.
      version: previous.version + 1,
      metadata: {
        ...incoming.metadata,
        // Creation belongs to the first save, and a later one must not move it.
        createdAt: previous.metadata.createdAt,
        updatedAt: now,
        ...(options.actor === undefined ? {} : { updatedBy: options.actor }),
      },
    },
  };
}

export interface VersionDifference {
  logicChanged: boolean;
  renamed: boolean;
  statusChanged: boolean;
  enabledChanged: boolean;
  tagsChanged: boolean;
}

/**
 * What changed between two versions.
 *
 * `RuleSummary` has nowhere to say "this revision only renamed it", and
 * extending the plugin contract to carry it would break every adapter. So a
 * caller holding two documents asks here instead, and a history list can grey
 * out the cosmetic revisions without the contract growing a field.
 */
export function compareVersions(before: RuleDocument, after: RuleDocument): VersionDifference {
  return {
    logicChanged: logicHash(before) !== logicHash(after),
    renamed: before.name !== after.name,
    statusChanged: before.status !== after.status,
    enabledChanged: before.enabled !== after.enabled,
    tagsChanged: !sameTags(before.tags, after.tags),
  };
}

/**
 * The same tags, in any order.
 *
 * Compared element by element rather than by joining them into a string. A
 * separator is only safe when it cannot appear in a tag, and nothing stops one
 * containing a space - which would make `['a b']` and `['a', 'b']` compare
 * equal, so a real tag change would report as none.
 */
function sameTags(before: readonly string[], after: readonly string[]): boolean {
  if (before.length !== after.length) return false;

  const left = [...before].sort();
  const right = [...after].sort();
  return left.every((tag, index) => tag === right[index]);
}

/**
 * An older version, prepared to be saved as the newest one.
 *
 * A restore moves FORWARD. The old content becomes a new version on top of the
 * history rather than rewinding it, because a history that can be rewritten is
 * a history nobody can be asked to trust - and "who changed this and when" is
 * the question a version list exists to answer.
 */
export function restoreFrom(
  current: RuleDocument,
  target: RuleDocument,
  options: SaveOptions = {},
): SaveResult {
  // The key is dropped before the current one is put back, so a key the rule
  // used to carry and no longer does is not resurrected by a restore.
  const { key: _formerKey, ...content } = target;

  return nextVersion(
    current,
    {
      ...content,
      // The identity stays the CURRENT one: restoring old content must not
      // resurrect an id or a key that something else may since have taken.
      id: current.id,
      ...(current.key === undefined ? {} : { key: current.key }),
    },
    options,
  );
}
