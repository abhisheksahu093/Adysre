import { humaniseId } from '@adysre/rules-renderer';
import type {
  Combinator,
  Operand,
  Plugin,
  RuleKind,
  RuleStatus,
  Verdict,
} from '@adysre/rules-types';

/**
 * Every word the builder says.
 *
 * The same decision as the renderer's `Phrases`, for the same reason. A plugin
 * carries `labelKey` and never a label, because a plugin that shipped English
 * would be a plugin nobody could localise - so the English has to live
 * somewhere, and somewhere is one replaceable record rather than scattered
 * through thirty components.
 *
 * A locale is therefore `<RuleBuilder labels={de} />` and not a fork of the
 * builder, and a host that calls a "field" an "attribute" changes one string.
 */
export interface BuilderLabels {
  /** Headings for the three parts of a rule. */
  conditions: string;
  thenActions: string;
  otherwiseActions: string;
  details: string;
  preview: string;

  /** What the builder can be told to do. */
  addCondition: string;
  addGroup: string;
  addAction: string;
  addOtherwiseAction: string;
  addValue: string;
  duplicate: string;
  remove: string;
  undo: string;
  redo: string;
  save: string;

  /** The rule's own fields. */
  name: string;
  namePlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  kind: string;
  status: string;
  priority: string;
  enabled: string;
  tags: string;
  tagsPlaceholder: string;
  comment: string;
  commentPlaceholder: string;

  /** A condition, part by part. */
  operator: string;
  value: string;
  negate: string;
  negated: string;
  actionType: string;
  actionTarget: string;
  actionValue: string;

  /** Where an operand's value comes from. */
  source: string;
  /**
   * What an EMPTY field box says.
   *
   * Never an example path. `order.total` reads as a value somebody chose, so an
   * empty box looked filled while the row underneath reported "A field needs a
   * path" - a screen contradicting itself, and the reader assuming the error
   * was wrong rather than the box empty. A placeholder has to be impossible to
   * mistake for data.
   */
  fieldPlaceholder: string;
  /** The same, for a comma-separated list of values. */
  listPlaceholder: string;
  variablePlaceholder: string;
  functionPlaceholder: string;
  chooseField: string;
  chooseFunction: string;

  /** States that are not an error. */
  loading: string;
  noFields: string;
  noActions: string;
  emptyGroup: string;
  unsavedChanges: string;
  saved: string;
  tooDeep: string;
  moveUp: string;
  moveDown: string;
  unknownOperator: string;

  /** Things the builder has to name that the AST does not spell out. */
  combinators: Readonly<Record<Combinator, string>>;
  kinds: Readonly<Record<RuleKind, string>>;
  statuses: Readonly<Record<RuleStatus, string>>;
  sources: Readonly<Record<Operand['source'], string>>;
  verdicts: Readonly<Record<Verdict, string>>;
  booleanTrue: string;
  booleanFalse: string;

  /**
   * Plugin labels, keyed by `labelKey`.
   *
   * Separate from the chrome above because it is the half a host replaces on its
   * own: registering `withinBusinessHours` means adding one entry here, and
   * nothing else about the builder changes.
   */
  plugins: Readonly<Record<string, string>>;
}

/**
 * The operator labels read as sentence fragments (`is greater than`, not
 * `greaterThan`), and deliberately match the fragments the operators' own
 * `toText` produces. A picker that said "gt" above a preview that said "is
 * greater than" would make an author check twice which one the rule meant.
 */
const englishPlugins: Readonly<Record<string, string>> = {
  'operators.equals': 'is',
  'operators.notEquals': 'is not',
  'operators.greaterThan': 'is greater than',
  'operators.greaterThanOrEqual': 'is at least',
  'operators.lessThan': 'is less than',
  'operators.lessThanOrEqual': 'is at most',
  'operators.between': 'is between',
  'operators.notBetween': 'is not between',
  'operators.isOneOf': 'is one of',
  'operators.isNotOneOf': 'is not one of',
  'operators.contains': 'contains',
  'operators.notContains': 'does not contain',
  'operators.startsWith': 'starts with',
  'operators.endsWith': 'ends with',
  'operators.equalsIgnoreCase': 'is, ignoring case',
  'operators.matches': 'matches the pattern',
  'operators.before': 'is before',
  'operators.after': 'is after',
  'operators.isEmpty': 'is empty',
  'operators.isNotEmpty': 'is not empty',
  'operators.isNull': 'is not set',
  'operators.isNotNull': 'is set',
  'operators.isTrue': 'is true',
  'operators.isFalse': 'is false',
  'operators.hasSize': 'has exactly',
  'operators.hasAnyOf': 'includes any of',
  'operators.hasAllOf': 'includes all of',

  'functions.now': 'right now',
  'functions.today': 'today',
  'functions.daysAgo': 'days ago',
  'functions.daysFromNow': 'days from now',
  'functions.daysBetween': 'days between',
  'functions.yearsSince': 'years since',
  'functions.length': 'length of',
  'functions.lower': 'lower case',
  'functions.upper': 'upper case',
  'functions.trim': 'trimmed',
  'functions.concat': 'joined together',
  'functions.sum': 'sum',
  'functions.min': 'smallest',
  'functions.max': 'largest',
  'functions.average': 'average',
  'functions.round': 'rounded',
  'functions.absolute': 'absolute value',
  'functions.count': 'count',
  'functions.first': 'first',
  'functions.last': 'last',
  'functions.coalesce': 'first value that is set',
  'functions.toNumber': 'as a number',
  'functions.toText': 'as text',
};

export const englishLabels: BuilderLabels = {
  conditions: 'When',
  thenActions: 'Then',
  otherwiseActions: 'Otherwise',
  details: 'Details',
  preview: 'In words',

  addCondition: 'Add condition',
  addGroup: 'Add group',
  addAction: 'Add action',
  addOtherwiseAction: 'Add fallback action',
  addValue: 'Add value',
  duplicate: 'Duplicate',
  remove: 'Remove',
  undo: 'Undo',
  redo: 'Redo',
  save: 'Save',

  name: 'Name',
  namePlaceholder: 'What this rule is called',
  description: 'Description',
  descriptionPlaceholder: 'What this rule is for',
  kind: 'Kind',
  status: 'Status',
  priority: 'Priority',
  enabled: 'Enabled',
  tags: 'Tags',
  tagsPlaceholder: 'Comma separated',
  comment: 'Note',
  commentPlaceholder: 'Why this condition is here',

  operator: 'Operator',
  value: 'Value',
  negate: 'Invert',
  negated: 'inverted',
  actionType: 'Action',
  actionTarget: 'Target',
  actionValue: 'Value',

  source: 'Source',
  fieldPlaceholder: 'Choose or type a field',
  listPlaceholder: 'Comma separated values',
  variablePlaceholder: 'Variable name',
  functionPlaceholder: 'Function',
  chooseField: 'Choose a field',
  chooseFunction: 'Choose a function',

  loading: 'Loading',
  noFields: 'No fields on offer, type a path instead',
  noActions: 'Nothing happens yet',
  emptyGroup: 'No conditions yet, so this matches everything',
  unsavedChanges: 'Unsaved changes',
  saved: 'Saved',
  tooDeep: 'Nested too deeply to edit here',
  moveUp: 'Move up',
  moveDown: 'Move down',
  unknownOperator: 'This deployment has no operator by that name',

  combinators: {
    all: 'all of these are true',
    any: 'any of these are true',
    none: 'none of these are true',
  },
  kinds: {
    validation: 'Validation',
    filter: 'Filter',
    transformation: 'Transformation',
    workflow: 'Workflow',
    calculation: 'Calculation',
    permission: 'Permission',
    visibility: 'Visibility',
  },
  statuses: {
    draft: 'Draft',
    active: 'Active',
    archived: 'Archived',
  },
  sources: {
    literal: 'A value',
    field: 'A field',
    variable: 'A variable',
    function: 'A calculation',
  },
  verdicts: {
    matched: 'Matched',
    unmatched: 'Did not match',
    skipped: 'Skipped',
    errored: 'Could not be evaluated',
  },
  booleanTrue: 'Yes',
  booleanFalse: 'No',

  plugins: englishPlugins,
};

export function labelsWith(overrides: Partial<BuilderLabels> | undefined): BuilderLabels {
  if (overrides === undefined) return englishLabels;
  return {
    ...englishLabels,
    ...overrides,
    // Merged rather than replaced: a host adding a label for its own operator
    // is not asking to lose the twenty-seven that shipped.
    plugins: { ...englishLabels.plugins, ...overrides.plugins },
  };
}

/**
 * What to call a plugin in a picker.
 *
 * Falls back to the id as words rather than to the raw id, because a registry
 * holds the host's plugins as well as ours and an unlabelled `withinBusinessHours`
 * reads better as "within business hours" than as nothing at all. Falling back
 * to an empty string would produce a picker with blank rows, which is the one
 * outcome worse than an imperfect label.
 */
export function labelFor(plugin: Pick<Plugin, 'id' | 'labelKey'>, labels: BuilderLabels): string {
  const key = plugin.labelKey;
  const label = key === undefined ? undefined : labels.plugins[key];
  return label ?? humaniseId(plugin.id);
}
