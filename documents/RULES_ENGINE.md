# Business Rules Engine

A framework-agnostic, plugin-based rules engine published as a package
ecosystem under `@adysre`. Reusable in any project, with **no paid APIs, no
cloud services and no third-party rule engine** underneath it.

> Rule 0 still applies: read this before touching anything under
> `packages/rules-*`.

## The shape of it

```
UI  ──edits──►  JSON AST  ──executes──►  Result (verdict + actions + trace)
                    │
                    └──renders──►  natural language, SQL, whatever a plugin adds
```

**The AST is the single source of truth.** Everything else is a projection of
it: the visual builder edits it, the executor walks it, the renderer describes
it, storage persists it, the debugger annotates it. Natural language is
generated FROM the AST and never parsed back into it.

That direction is the whole architecture. The alternative - a text format that
is also authored by hand - produces two systems that disagree: prose that no
longer matches the tree, or a tree that cannot express what somebody typed.

## Packages

| Package | Holds | State |
| --- | --- | --- |
| `@adysre/rules-types` | the vocabulary: AST, execution contracts, plugin interfaces | **built** |
| `@adysre/rules-core` | builders, traversal, validation, serialisation, the registry, the built-in plugins, the executor. Zero dependencies | **built** |
| `@adysre/rules-parser` | importers: this AST, jsonLogic, json-rules-engine, query filters | **built** |
| `@adysre/rules-renderer` | AST to natural language, and other output formats | **built** |
| `@adysre/rules-react` | headless hooks and state for a builder | planned |
| `@adysre/rules-ui` | the visual builder, shadcn/ui and Tailwind | planned |
| `@adysre/rules-next` | Next.js adapters: route handlers, server actions | planned |
| `@adysre/rules-devtools` | the execution debugger | planned |
| `@adysre/rules-theme` | design tokens for the builder | planned |
| `@adysre/rules-playground` | a runnable sandbox and the examples | planned |

Planned packages do not exist yet. Ten directories each holding a `package.json`
and an empty `index.ts` would be ten placeholders, and each one lands with the
phase that gives it something to do.

## The AST

Three shape decisions carry everything else.

**A condition's right-hand side is an array.** Operators have different arity -
`isEmpty` takes none, `equals` takes one, `between` takes two, `isOneOf` takes
many - and `args: Operand[]` covers all of them. The alternative is `right` plus
`right2` plus `values`, and a reader that has to know which operator uses which.

**An operand is a union of sources.** `literal`, `field`, `variable`,
`function`. "Compare the field to another field" and "compare it to today"
become the same construct rather than special cases, and function arguments are
operands too, so they nest.

**Operators and functions are referenced by id.** The AST names `equals`; which
code answers is a registry decision the stored document knows nothing about.
That is what makes them plugins, and it is why an id is a permanent contract:
renaming one breaks every rule that used it.

```jsonc
{
  "schemaVersion": 1,
  "kind": "validation",
  "when": {
    "kind": "group", "id": "g_1", "combinator": "all",
    "children": [
      { "kind": "condition", "id": "c_1",
        "left": { "source": "field", "path": "order.total" },
        "operator": "greaterThan",
        "args": [{ "source": "literal", "value": 1000 }] }
    ]
  },
  "then": [{ "id": "a_1", "type": "reject", "target": "order.total" }]
}
```

## Plugins

Everything the engine can DO is a plugin: comparing values (`OperatorPlugin`),
computing them (`FunctionPlugin`), applying outcomes (`ActionPlugin`), offering
fields to the builder (`FieldProviderPlugin`), storing rules (`StoragePlugin`),
describing them (`RendererPlugin`), checking them (`ValidatorPlugin`), styling
the builder (`ThemePlugin`).

The core knows the AST and the registry, and nothing else. A team adds
`withinBusinessHours` as an operator and `taxFor` as a function without touching
the engine, and their rules stay plain JSON that the same builder edits and the
same debugger explains.

**Actions describe intent and are never performed by the engine.** A validation
rule's `reject` becomes a form error in one app and a queue message in another.
An engine that performed side effects could not be run twice, in a preview, or
in a test.

## The registry

Immutable. `extend` returns a NEW registry rather than mutating one, so an
executor holding a registry cannot have the ground move under it mid-evaluation,
and two tenants or two tests can hold different capabilities at once without one
leaking into the other. A registry that could be mutated globally is one where
the answer to a rule depends on what else the process happened to load.

Registering a duplicate id **throws, at registration**: two plugins claiming
`equals` is a programming error, and the moment to find it is at startup rather
than when a rule runs at three in the morning and silently gets the wrong one.
Lookups never throw - an unknown operator is a fact about a stored rule, which
the executor reports as a diagnostic pointing at the node.

`createRegistry()` starts EMPTY. What rules may do is the host's choice, and
"everything that ships with the engine" is a choice rather than a default:

```ts
const registry = createRegistry(builtinPlugins, { operators: [withinBusinessHours] });
missingPlugins(registry, collectPluginIds(rule)); // check before saving an import
```

## Comparison semantics

Defined once, in `builtins/compare`, because the alternative is twenty-seven
operators each making their own small decision and a rules engine whose answers
depend on which operator you happened to pick.

- Numbers compare numerically, strings lexicographically, booleans `false < true`.
- An ISO-8601 string compares as a **date**, but only when it looks like one.
  `"2026-07-26"` is a date; `"10"` is text. Guessing more eagerly is how `"12"`
  sorts before `"9"` in one place and after it in another.
- Different kinds are **not comparable**. `5 > "apple"` raises rather than
  answering `false`, because it is a mistake in the rule and not a failed test.
- Equality is deep and JSON-shaped: key order never matters, list order does.
- `0`, `false` and `"0"` are **not empty**. They are values someone chose, and
  treating them as absent is the classic bug that makes a rule ignore a
  legitimate zero.

A plugin that cannot answer throws `RuleError`, which the executor turns into an
`errored` verdict with a diagnostic. Returning `false` would make a broken
comparison look like a failed one - a rule that silently stops firing, with
nothing to show why.

**`matches` is bounded and optional.** The pattern comes from a rule author and
runs in the engine's process, and JavaScript cannot interrupt a regular
expression mid-execution, so a catastrophically backtracking pattern is a denial
of service no timeout above can rescue. Pattern and subject are length-capped;
a deployment that lets untrusted third parties author rules should leave the
operator unregistered, which is possible precisely because it is a plugin.

## The executor

```ts
const evaluator = createEvaluator(createRegistry(builtinPlugins));
const outcome = evaluator.evaluate(rule, createContext(order, { now }));
// { verdict, actions, diagnostics, trace, ms }
```

**An error is not a `false`.** A condition that cannot be evaluated - unknown
operator, type mismatch, a function that threw - is `errored`, and so is every
group containing it, and so is the rule. An errored rule applies **no actions**,
from neither branch: the engine does not know which one was right. Error even
wins over a combinator that had already decided, because a rule you could not
fully evaluate does not get to claim it matched.

The alternative is the failure that makes people stop trusting a rules engine: a
rule that silently stops firing because one branch is broken, and a report that
says `unmatched` with nothing to show why.

**An empty group matches** - all three combinators. Not the mathematical
convention for an empty `any`, deliberately: an empty group means "nothing has
been said yet", and every rule starts as one. A brand-new rule that matches
nothing is worse than one consistent answer that reads as "no restriction".

**A missing field is `null`, and says so.** Rules are written against optional
data, so `tier isEmpty` on a customer without a tier should match rather than
raise. But a typo'd path is the most common reason a rule "does not work", so
the absence produces a warning naming the path - once per path, not once per
mention. Field paths read **own properties only**: a path comes out of a stored
document, and `constructor.prototype` is a path.

**Short-circuiting is on, and visible.** `all` stops at the first unmatched
child, `any` and `none` at the first matched one, and the trace lists only the
children that ran, so nobody mistakes a skipped branch for a passing one. A
debugger sets `shortCircuit: false` and sees the branches the fast path never
reached - including errors it stepped over.

**The tree is walked iteratively**, with an explicit stack and one frame per
group. Same reason as `walk`: an imported tree was not authored by anyone you
know, and a stack overflow inside a rules engine has no useful message.

**Timeouts bound a tree, not a plugin.** `timeoutMs` is checked between nodes,
which stops a pathological document; it cannot interrupt a synchronous call,
which is why `matches` bounds its own inputs instead of trusting it. The clock
is injectable, because a timeout only reachable by waiting is a timeout nobody
tests.

## Results carry their reasoning

A rules engine whose answer is a bare `true` is unusable in the moment it
matters most: when a business user insists the rule is wrong and someone has to
show which condition decided it. Every node that runs leaves a `TraceEvent`
recording what it saw, what the operator actually received, and what it
concluded - children before parents, so a reader can rebuild the tree. The trace
is part of the result rather than a debugging mode bolted on later.

Sets run their rules in `priority` order, low first, ties in the order written:
a set whose behaviour depends on an unstable sort behaves differently on two
machines. `first-match` stops at the first rule that matched; `all-matches`
collects every one.

## Natural language

```
Large orders from new customers need approval
When all of these are true:
  - order total is greater than 1,000
  - any of these are true:
    - customer tier is "new"
    - order placed at is before today
Then reject order total
```

**Structure first, text second.** `describeRule` returns lines of typed
segments and `.text` is a projection of them. A string is enough for a tooltip
and useless for a builder that highlights the field being edited or a debugger
that colours the condition that decided a verdict, and neither can be recovered
from prose afterwards. Same principle as the AST: the readable form is the
projection, never the source.

**The operator writes its own sentence.** `toText` lives on the plugin, so the
renderer holds no second implementation of the operator set that has to be kept
in step with the first. It hands the plugin private-use markers instead of
rendered text and splits the answer back apart, so the plugin writes the words
and the renderer recovers the structure. A plugin that drops a marker has
dropped that operand from the sentence, which is its right: `isEmpty` never
mentions its arguments either.

**A group holding one child says nothing its child does not.** `all(X)` renders
as X, because a heading above a single bullet is noise a reader has to see past.
`none` and negated groups are excluded, since both invert.

**De Morgan happens in the words.** A negated `any` renders as "none of these
are true", which is exactly what it means and reads better than wrapping a
heading in "it is not true that".

**English lives in one object.** `Phrases` is the whole vocabulary, so a locale
is a data change rather than a fork, and `operatorText` overrides one operator's
sentence while keeping its operands identifiable. That is the counterpart to
"no English in a plugin": the words have to live somewhere, and somewhere is
one replaceable record.

## Importing

| Format | Recognised by |
| --- | --- |
| `ast` | `schemaVersion` and `when`: this engine's own |
| `json-rules-engine` | a `conditions` wrapper |
| `json-logic` | one known operator key |
| `mongo` | field names and `$` keywords: saved searches, segments, filters |

Tried in that order. A query filter is last because "an object whose keys are
field names" describes almost anything, and a permissive detector that runs
first is always right and never correct.

**Nothing throws, and nothing imports halfway.** Diagnostics carry the path into
the SOURCE document, because the person fixing it is looking at their file
rather than at ours. And if any part of a rule cannot be converted, the whole
import fails: a rule that quietly does less than the one it came from is
discovered in production, while an import that refused is discovered in the
dialog.

Between those sits the distinction the importers are mostly about:

- An **exact** equivalent converts silently.
- A **near** equivalent converts with a WARNING naming the difference.
  jsonLogic's `{"!!": x}` becomes `isNotEmpty`, and the warning says that
  jsonLogic counts `0` and `false` as false while this engine counts them as
  values somebody chose.
- **No** equivalent is an ERROR. `$options: "i"` is refused rather than dropped,
  because dropping it changes which values match.

Some conversions dodge the middle case by being less obvious. `{"<": [1, x, 10]}`
is exclusive, so it becomes two conditions rather than a `between` that is
nearly right; a json-rules-engine `priority` is negated, because that engine runs
the highest first and this one runs the lowest, so the number changes in order
that the order does not.

Every import is validated and, when a registry is given, checked against it. A
rule referring to an operator this deployment lacks is refused where the message
is clear rather than where it is a mystery.

## Rule kinds

`validation`, `filter`, `transformation`, `workflow`, `calculation`,
`permission`, `visibility`. The kind says what a rule is FOR; what it DOES is
its actions. Hard-coding one action shape per kind would make every new kind a
change to the AST rather than a plugin.

## Phases

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Monorepo, core types, the AST | **done** |
| 2 | Plugin registry and the built-in operator and function set | **done** |
| 3 | Executor: evaluation, short-circuiting, tracing, timeouts | **done** |
| 4 | Natural-language renderer | **done** |
| 5 | Parser and importers | **done** |
| 6 | Headless React state (`rules-react`) | next |
| 7 | The visual builder (`rules-ui`) | |
| 8 | Execution debugger (`rules-devtools`) | |
| 9 | Storage adapters and versioning | |
| 10 | Next.js adapters | |
| 11 | Themes | |
| 12 | Playground and examples | |
| 13 | Documentation site | |
| 14 | Publishing: build, exports, versioning | |

## Conventions

- **TypeScript strict, no `any`.** The AST is the contract; a loose type here
  becomes a runtime check everywhere else.
- **Nothing throws across a boundary.** Validation and parsing return
  diagnostics, because a bad import is a message to show rather than an
  exception to escape with.
- **Everything is injectable that a test needs to fix**: ids, the clock. A rule
  built twice from the same input must compare equal, or nothing downstream can
  be snapshot-tested.
- **No English in a plugin.** Plugins carry `labelKey`, not `label`: a plugin
  that carried English is a plugin that cannot be localised.
