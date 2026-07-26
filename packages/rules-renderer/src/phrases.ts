/**
 * Where the English lives.
 *
 * Deliberately in ONE object, and deliberately not in the plugins. A plugin
 * carries `labelKey`, never a label, because a plugin that shipped English
 * would be a plugin nobody could localise. The renderer is the opposite: it
 * exists to produce a sentence, so it has to know words, and the honest place
 * to keep them is a single replaceable record rather than scattered through the
 * code that walks the tree.
 *
 * A locale is therefore a data change - `describeRule(rule, { phrases: de })` -
 * not a fork of the renderer.
 *
 * `{name}` placeholders are filled by `fill`. Anything unrecognised is left
 * alone, so a translation with a stray brace produces a visible oddity rather
 * than a crash.
 */
export interface Phrases {
  /** Introduces the conditions. */
  when: string;
  /**
   * Introduces the actions taken when the rule matches. Two forms, because one
   * action reads as a sentence and several read as a list, and which punctuation
   * separates them is a fact about a language rather than about a rule.
   */
  then: string;
  thenHeading: string;
  /** The same, for the actions taken when it does not match. */
  otherwise: string;
  otherwiseHeading: string;
  /** A rule with no conditions at all. */
  always: string;
  /** Group headings, one per combinator. */
  all: string;
  any: string;
  none: string;
  /**
   * Negated headings. De Morgan, done in the phrase rather than in the logic:
   * `not(any)` really is `none`, and saying so reads better than "it is not
   * true that any of these are true".
   */
  notAll: string;
  notAny: string;
  notNone: string;
  /** A negated condition, which has no such shortcut. */
  notCondition: string;
  /** Joins the parts of a list value. */
  listSeparator: string;
  listLast: string;
  /** Values with no natural words of their own. */
  yes: string;
  no: string;
  nothing: string;
  emptyList: string;
  /** Actions, when no host override describes them. */
  actionPlain: string;
  actionWithTarget: string;
  actionWithValue: string;
  actionWithTargetAndValue: string;
  /** What the renderer says instead of throwing. */
  unknownOperator: string;
  unknownFunction: string;
  unknownSource: string;
  tooDeep: string;
  /** Layout, for the plain-text form. */
  indent: string;
  bullet: string;
}

export const englishPhrases: Phrases = {
  when: 'When {conditions}',
  then: 'Then {actions}',
  thenHeading: 'Then all of these happen:',
  otherwise: 'Otherwise {actions}',
  otherwiseHeading: 'Otherwise all of these happen:',
  always: 'this rule always applies',
  all: 'all of these are true:',
  any: 'any of these are true:',
  none: 'none of these are true:',
  notAll: 'not all of these are true:',
  notAny: 'none of these are true:',
  notNone: 'any of these are true:',
  notCondition: 'it is not true that {condition}',
  listSeparator: ', ',
  listLast: ' or ',
  yes: 'yes',
  no: 'no',
  nothing: 'nothing',
  emptyList: 'an empty list',
  actionPlain: '{action}',
  actionWithTarget: '{action} {target}',
  actionWithValue: '{action} {value}',
  actionWithTargetAndValue: '{action} {target} to {value}',
  unknownOperator: '{left} (no operator named "{id}" is registered)',
  unknownFunction: 'no function named "{id}" is registered',
  unknownSource: 'a value of an unknown kind',
  tooDeep: 'a value nested too deeply to describe',
  indent: '  ',
  bullet: '- ',
};

/** Fill `{name}` placeholders. Unknown names are left in place, visibly. */
export function fill(template: string, values: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.hasOwn(values, name) ? (values[name] ?? '') : match,
  );
}

export function phrasesWith(overrides: Partial<Phrases> | undefined): Phrases {
  return overrides === undefined ? englishPhrases : { ...englishPhrases, ...overrides };
}
