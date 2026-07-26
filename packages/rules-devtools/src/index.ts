/**
 * `@adysre/rules-devtools` - why a rule answered what it answered.
 *
 * A rules engine whose answer is a bare verdict is unusable in the moment it
 * matters most: when somebody insists the rule is wrong and a person has to
 * show which condition decided it. The trace was built for that; this package
 * is what turns it into an answer.
 *
 * Two things it does that reading a trace by hand does not:
 *
 * It names THE ROW THAT DECIDED, when one did, and refuses to when none did.
 * `all` matching means every child matched, and pointing at the last of them
 * would be a debugger asserting something false.
 *
 * It runs the rule TWICE - once as it really runs, once with short-circuiting
 * off - and reports the difference. A condition with a typo'd field sitting
 * behind a passing sibling never runs and never reports, and a rule that passes
 * only because the fast path stepped over a broken branch is a rule that
 * changes its answer the day somebody reorders a group.
 *
 * The analysis is pure and tested without a renderer. The components draw it.
 */

export * from './compare.ts';
export * from './decide.ts';
export * from './format.ts';
export * from './labels.ts';
export * from './session.ts';
export * from './tree.ts';

export * from './debugger.tsx';
export * from './findings.tsx';
export * from './trace-view.tsx';
