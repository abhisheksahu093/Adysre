/**
 * `@adysre/rules-renderer` - a rule, in language a person can check.
 *
 * One direction only: the AST is generated INTO prose and never parsed back out
 * of it. A rule builder that also read prose would be two authorities on the
 * same rule, and the one that loses is always the tree.
 *
 * The renderer produces STRUCTURE first and text second. A string is enough for
 * a tooltip and useless for a builder that highlights the field being edited or
 * a debugger that colours the condition that decided a verdict, and neither can
 * be recovered from prose afterwards.
 */

export * from './format';
export * from './phrases';
export * from './plugin';
export * from './render';
export * from './segments';
