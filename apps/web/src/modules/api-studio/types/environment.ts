/**
 * ADYSRE API Studio - variables, environments and secrets.
 *
 * A variable is a `{{name}}` template resolved at send time against a stack of
 * layers. The stack is ordered least to most specific and the most specific
 * definition wins, so a request can override its folder, which overrides its
 * collection, which overrides the active environment, which overrides globals.
 *
 * Secrets are not a separate entity: a variable flagged `secret` is stored
 * encrypted at rest, masked in the UI behind a reveal toggle, redacted from
 * history and never written to an export. Keeping one entity means auth fields,
 * headers and bodies reference secrets with the same `{{name}}` syntax they use
 * for everything else, so no part of the app has to special-case them.
 */

import type { BaseEntity } from '@adysre/types';

/**
 * Variable layers, least specific first. Resolution walks this array backwards
 * and takes the first enabled definition it finds.
 */
export const VARIABLE_SCOPES = [
  'global',
  'environment',
  'collection',
  'folder',
  'request',
] as const;

export type VariableScope = (typeof VARIABLE_SCOPES)[number];

export interface ApiVariable {
  id: string;
  key: string;
  /** Current value. Empty string is a legitimate value, never a "missing". */
  value: string;
  /**
   * The value the environment ships with. Kept apart from `value` so a shared
   * environment can be exported without the local session's edits (and without
   * anyone's token).
   */
  initialValue: string;
  /** Encrypted at rest, masked in the UI, redacted from history and exports. */
  secret: boolean;
  enabled: boolean;
  description: string;
}

/** A named set of variables the user switches between (dev, staging, prod). */
export interface ApiEnvironment extends BaseEntity {
  workspaceId: string;
  name: string;
  /** Semantic token id, never a colour literal. See `NODE_COLORS`. */
  color: string | null;
  variables: ApiVariable[];
}

/** Where a resolved value came from. Drives the "defined in" hint in the UI. */
export interface VariableSource {
  scope: VariableScope;
  /** Id of the environment / collection / folder / request that defined it. */
  ownerId: string | null;
}

/** One layer of the resolution stack. */
export interface VariableLayer {
  scope: VariableScope;
  ownerId: string | null;
  variables: readonly ApiVariable[];
}

/** The full stack handed to the resolver, ordered as {@link VARIABLE_SCOPES}. */
export interface VariableContext {
  layers: readonly VariableLayer[];
}

export const VARIABLE_ERROR_CODES = ['unknown_variable', 'cycle', 'max_depth'] as const;
export type VariableErrorCode = (typeof VARIABLE_ERROR_CODES)[number];

/**
 * A template that could not be fully resolved. Resolution never throws: it
 * reports and leaves the raw `{{name}}` in place, so the user still sees the
 * request that would be sent instead of a blank field.
 */
export interface VariableIssue {
  code: VariableErrorCode;
  /** The variable name at fault, e.g. `base_url`. */
  name: string;
  /** For `cycle`, the chain that closed the loop. */
  chain?: string[];
}

/** Result of resolving one template string. */
export interface ResolvedTemplate {
  value: string;
  /** Variables that were substituted, in first-use order. */
  used: { name: string; source: VariableSource }[];
  issues: VariableIssue[];
}
