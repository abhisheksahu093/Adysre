# @adysre/rules-parser

Rules written somewhere else, brought in here.

```ts
import { importRule } from '@adysre/rules-parser';

const result = importRule({ 'order.total': { $gte: 1000 }, 'customer.tier': 'gold' }, { registry });
// { ok: true, rule: RuleDocument, diagnostics: [] }
```

| Format | Recognised by | Notes |
| --- | --- | --- |
| `ast` | `schemaVersion` and `when` | This engine's own, parsed and migrated by the core |
| `json-rules-engine` | a `conditions` wrapper | Facts, JSONPath suffixes, `not`, and the event as an action |
| `json-logic` | one known operator key | Predicates only, so an imported rule has no actions |
| `mongo` | field names and `$` keywords | Query filters: saved searches, segments, permission filters |

Detection tries them in that order. A query filter is last because "an object
whose keys are field names" describes almost anything, and a permissive detector
that runs first is always right and never correct.

## Two rules

**Nothing throws.** Every importer returns diagnostics carrying the path into
the SOURCE document, because the person fixing it is looking at their file
rather than at ours:

```
$.conditions.all[1].params  fact_params_unsupported
```

**Never a partial import.** If any part of a source rule cannot be converted,
the whole import fails, even when the rest converted perfectly. A rule that
quietly does less than the one it came from is discovered in production; an
import that refused is discovered in the dialog.

## Exact, near, or not at all

Between those two sits the distinction most of this package is about.

- An **exact** equivalent converts silently. `{"<=": [1, x, 10]}` is `between`,
  which is inclusive at both ends, exactly as the source is.
- A **near** equivalent converts with a warning naming the difference.
  `{"!!": x}` becomes `isNotEmpty`, and the warning says that jsonLogic counts
  `0` and `false` as false while this engine counts them as values somebody
  chose.
- **No** equivalent is an error. `$options: "i"` on a pattern is refused rather
  than dropped, because dropping it changes which values match.

Some conversions avoid the middle case entirely by being less obvious.
`{"<": [1, x, 10]}` is exclusive, so it becomes two conditions rather than a
`between` that is nearly right, and a json-rules-engine `priority` is negated,
because that engine runs the highest first and this one runs the lowest: the
number changes so that the order does not.

## What an import guarantees

Every importer validates the tree it produced, and checks it against the
registry when one is given. A rule referring to an operator this deployment does
not have is refused at import, where the message is clear, rather than at
evaluation, where it is a mystery.

Pass `ids` and `now` to make an import reproducible: two imports of one file
then compare equal, which is what makes a stored rule diffable.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
