/**
 * `@adysre/rules-playground` - the sandbox, and the worked examples.
 *
 * The capstone: a builder, a debugger, a live verdict and the JSON, over rules
 * that exercise the parts of the engine that interact. Drop `<RulePlayground />`
 * on a page and the whole ecosystem is running.
 *
 * The examples are DATA, and they check themselves. Every sample declares the
 * verdict the engine must produce, and `verifyExamples` runs them - because an
 * example is documentation, and documentation is the one part of a system
 * nothing else tests. A rule with a screenshot beside it looks right on the day
 * it is written, and the only thing checking it afterwards is a reader who
 * assumes it works.
 */

export * from './examples/index.ts';
export * from './playground.tsx';
export * from './types.ts';
export * from './verify.ts';
