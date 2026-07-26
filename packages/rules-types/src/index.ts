/**
 * `@adysre/rules-types` - the vocabulary of the ADYSRE Business Rules Engine.
 *
 * Types only, plus the const arrays those types are derived from and the guards
 * that narrow them. No runtime behaviour lives here, and nothing in this package
 * imports anything: it is the layer every other package agrees on, so it cannot
 * be allowed to depend on any of them.
 *
 * The AST in `ast.ts` is the single source of truth. Read that file first.
 */

export * from './ast.ts';
export * from './execution.ts';
export * from './json.ts';
export * from './plugins.ts';
