import type { Combinator, JsonValue, Operand, RuleDocument } from '@adysre/rules-types';

/**
 * Everything an editing session is.
 *
 * The rule itself is a `RuleDocument` and nothing else - no editor-only fields
 * bolted onto it, no parallel shadow tree. What the editor knows and the
 * document does not lives HERE, beside it: what is selected, what has been
 * undone, what was last saved. That separation is why `state.rule` can be
 * handed straight to `stringifyRule`, `evaluateRule` or `describeRule` without
 * anything being stripped out of it first, and why a bug in the editor cannot
 * corrupt a stored rule with a field the engine has never heard of.
 */

export interface HistoryEntry {
  rule: RuleDocument;
  /**
   * Consecutive edits sharing a key collapse into one undo step.
   *
   * Without it, undo walks back one keystroke at a time and is useless for
   * exactly the edits people make most. `null` never merges, which is what a
   * structural change wants: adding a condition is one step whatever came
   * before it.
   */
  mergeKey: string | null;
}

export interface BuilderState {
  rule: RuleDocument;
  /** The node the editor is focused on. Deliberately NOT undoable. */
  selectedId: string | null;
  past: HistoryEntry[];
  future: HistoryEntry[];
  /** `logicHash` of the last saved version, so "dirty" means what it says. */
  savedHash: string;
}

export type MetaPatch = Partial<
  Pick<
    RuleDocument,
    'name' | 'description' | 'kind' | 'priority' | 'enabled' | 'status' | 'tags' | 'key'
  >
>;

export interface ActionPatch {
  type?: string;
  target?: string | undefined;
  value?: Operand | undefined;
  params?: Record<string, JsonValue> | undefined;
  comment?: string | undefined;
}

/** Which list of actions an edit applies to. */
export type Branch = 'then' | 'otherwise';

/**
 * What a builder can do.
 *
 * One flat union, handled by one pure function. A builder has thirty ways to
 * change a rule and every one of them has to be undoable, validatable and
 * testable; scattering them across component callbacks would put a third of the
 * engine's behaviour somewhere no test can reach.
 */
export type BuilderAction =
  /** Load a different rule. Clears history: undo across two rules is nonsense. */
  | { type: 'load'; rule: RuleDocument }
  /** The rule was persisted. Resets what "dirty" is measured against. */
  | { type: 'markSaved' }
  | { type: 'select'; id: string | null }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'setMeta'; patch: MetaPatch }
  | { type: 'addCondition'; parentId?: string; operator?: string }
  | { type: 'addGroup'; parentId?: string; combinator?: Combinator }
  | { type: 'remove'; id: string }
  | { type: 'duplicate'; id: string }
  | { type: 'setCombinator'; id: string; combinator: Combinator }
  | { type: 'setNegate'; id: string; negate: boolean }
  | { type: 'setOperator'; id: string; operator: string }
  | { type: 'setOperand'; id: string; slot: 'left' | number; operand: Operand }
  | { type: 'setArgCount'; id: string; count: number }
  | { type: 'setComment'; id: string; comment: string }
  /** `index` is where the node ends up, not where it was dropped from. */
  | { type: 'move'; id: string; parentId: string; index: number }
  | { type: 'addAction'; actionType: string; branch?: Branch }
  | { type: 'removeAction'; id: string }
  | { type: 'setAction'; id: string; patch: ActionPatch };
