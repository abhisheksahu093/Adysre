/**
 * `@adysre/rules-storage` - where rules live.
 *
 * The `StoragePlugin` contract has always been in `@adysre/rules-types`. What
 * was missing is everything a store has to DECIDE and the contract cannot say:
 * when a save makes a new version, what a restore does to history, what a tag
 * filter means, how a list orders ties.
 *
 * Those decisions live here once, as plain functions, so that "storage
 * adapters" is a plural that means something. An adapter backed by a database
 * will translate most of the querying into SQL rather than call it - and then
 * run `runStorageConformance` to find out whether it arrived at the same
 * answers, instead of its author reading a document and believing they did.
 *
 * Zero runtime dependencies, like the core. A rules engine is embedded, and a
 * storage layer that dragged a client library into every bundle that touched it
 * would be one teams work around.
 */

export * from './conformance.ts';
export * from './memory.ts';
export * from './query.ts';
export * from './store.ts';
export * from './versions.ts';
export * from './web.ts';
