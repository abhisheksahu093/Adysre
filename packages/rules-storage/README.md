# @adysre/rules-storage

Where rules live.

```ts
const storage = createMemoryStorage();

await storage.save(rule);            // version 1
await storage.save(edited);          // version 2
await storage.restore(rule.id, 1);   // version 3, holding version 1's content
```

## The contract is executable

"Storage adapters" is plural, and a plural that only means "several things with
the same method names" is worth nothing: a screen that lists rules correctly
against the in-memory store and wrongly against the database is a bug nobody
finds until production, because both adapters type-check.

So an adapter is checked rather than trusted:

```ts
const results = await runStorageConformance(() => createMyAdapter());
if (conformanceReport(results) !== '') throw new Error(conformanceReport(results));
```

It is framework-free — no vitest, no `node:test` — so the same suite runs in a
unit test, in CI against a real database, or in a deployment's own health check.
It never stops at the first failure, because an adapter's author wants the whole
list rather than one problem per run.

## Decisions a store has to make

**A save that changes nothing creates no version.** A builder autosaves, a form
posts twice, a retry lands after the first attempt succeeded. A history padded
with identical entries is a history nobody scrolls, which defeats the point of
keeping one. Compared through `stringifyRule`, so two documents that differ only
in the order their fields were assigned compare equal.

**A rename still makes a version.** The AST says the version increments on each
saved change, and a rename is a change somebody made and may want back. Whether
the *logic* changed is a separate question, and `compareVersions` answers it —
so a history list can grey out the cosmetic revisions without the plugin
contract growing a field.

**The stored version wins over the one a client sent.** A stale editor holding
version 1 must not write 2 over 9.

**A first save is version 1**, whatever the document claimed. An imported
document carries whatever version it was written with, and honouring that would
start a fresh history at 7.

**Restore moves forward.** The old content becomes a new version on top of the
history rather than rewinding it: a history that can be rewritten is one nobody
can be asked to trust, and "who changed this, and when" is the question a
version list exists to answer. The identity stays the current one, so restoring
never resurrects a key something else may since have taken.

**A tag filter narrows.** All of the given tags, not any — a filter that
returned *more* as tags were added would read as broken long before it read as a
union.

**Search looks at what identifies a rule**: name, business key, tags. Not the
description. A search that matches prose returns most of the list for most
words, which teaches people the box does not work.

**Ties are broken by id.** Two rules saved in the same millisecond is ordinary,
and a list whose order depends on iteration order pages differently on two
machines — so an item appears twice across two pages, or never.

**An invalid rule is refused, not stored.** Unlike parsing, where a bad document
is a message to show, an invalid one reaching `save` is a bug in the caller: a
builder validates before it offers a Save button.

## Adapters

| Adapter | For |
| --- | --- |
| `createMemoryStorage` | tests, previews, the reference semantics |
| `createWebStorage` | a browser, so a sandbox survives a refresh |

Both are `createStorage` over a `HistoryPort`, so the versioning, validation and
query rules exist once. A new synchronous adapter is a port. An asynchronous one
— a database — implements `StoragePlugin` directly and translates the querying
into SQL rather than loading every rule to filter it, then runs the conformance
suite to find out whether it arrived at the same answers.

The web adapter reads through `parseRule`, so a document written by an older
engine is migrated on the way in and one written by a **newer** engine is refused
rather than half-understood. Storage is where a stored rule meets a different
build, which is what `schemaVersion` was always for.

Zero runtime dependencies, like the core.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
