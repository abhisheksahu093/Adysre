/**
 * `@adysre/rules-react` - everything a rule builder does, except drawing it.
 *
 * The store, the reducer and the selectors have NO framework in them. The hooks
 * are a thin `useSyncExternalStore` adapter over that, which is what makes this
 * package testable without a renderer and usable outside React at all.
 *
 * The rule in state is a plain `RuleDocument` with nothing bolted onto it, so
 * it can be handed straight to `stringifyRule`, `evaluateRule` or `describeRule`
 * without being stripped first, and a bug in the editor cannot store a field the
 * engine has never heard of.
 */

export * from './hooks';
export * from './providers';
export * from './reducer';
export * from './selectors';
export * from './state';
export * from './store';
