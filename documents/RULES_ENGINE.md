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
| `@adysre/rules-react` | headless store, history and hooks for a builder | **built** |
| `@adysre/rules-storage` | the storage contract, versioning, querying, adapters | **built** |
| `@adysre/rules-ui` | the visual builder, shadcn/ui and Tailwind | **built** |
| `@adysre/rules-next` | Next.js adapters: route handlers, server actions | **built** |
| `@adysre/rules-devtools` | the execution debugger | **built** |
| `@adysre/rules-theme` | design tokens for the builder, and a contrast audit | **built** |
| `@adysre/rules-playground` | a runnable sandbox and the examples, each verified | **built** |

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

## Builder state

`@adysre/rules-react` holds an editing session: the rule, what is selected, and
what can be undone.

**The store has no React in it.** `createRuleStore`, `reduce` and the selectors
import nothing from any framework; the hooks are a thin `useSyncExternalStore`
adapter. A rule builder's behaviour is mostly editing rules rather than drawing
them, and behaviour that can only be tested through a renderer is behaviour that
mostly is not tested. Every test in that package drives the reducer directly.

**The rule in state is a plain `RuleDocument`** with nothing bolted onto it.
What the editor knows and the document does not lives beside it, so `state.rule`
goes straight to `stringifyRule`, `evaluateRule` or `describeRule`, and an editor
bug cannot store a field the engine has never heard of.

Judgement calls that shape how it feels to use:

- **Undo is for edits, not clicks.** Selection is not undoable.
- **Typing is one undo step.** Consecutive edits to the same value collapse;
  structural changes never merge.
- **A new edit after an undo discards the redo stack**, because offering the old
  future back is how an editor loses somebody's work.
- **History is bounded and cheap**: immutable helpers share every untouched
  branch, so an entry is a new root and a few nodes rather than a copy.
- **Dirty ignores a rename**, being measured by `logicHash`. An editor that
  cries "unsaved changes" at a touched-then-untouched field trains people to
  ignore it.
- **Changing an operator resizes its values** to the new arity.
- **Validation is reported per node**: an AST path is right for a file and
  useless for a form, so each one resolves back to the node that shows it.
- **A field provider that fails does not blank the picker.**

## The builder

`@adysre/rules-ui` draws that state. It holds none of its own beyond what a text
box needs between keystrokes, so undo, per-node validation and dirtiness behave
exactly as they do for a host driving the store without a screen.

**Nothing about it is hard-coded per operator.** `arity` decides how many value
boxes a condition draws, `accepts` decides which operators a field is offered,
`returns` types a function operand, `requiresTarget` decides whether an action
shows a target. Registering `withinBusinessHours` puts it in the right rows with
the right number of boxes without the builder hearing about it, which is the
whole point of the plugin contracts carrying that metadata rather than the
executor alone.

**The decisions live outside the components** - which operators fit a type, how
many boxes to draw, what an empty box means - in plain modules beside them. Same
reason the store has no React in it: a decision reachable only by rendering
something is a decision nobody tests. What is left for a renderer to prove is
that the recursion survives a real document, which is one smoke test.

Judgement calls that shape how it feels to use:

- **An empty box is `null`, for every type.** Not `""`, not `0`. A box nobody
  filled in is a value nobody chose, and the validator can see the condition is
  incomplete. `isEmpty` is how somebody says "has no value" on purpose.
- **A typed box never guesses; a list always does.** A string field holding `3`
  stays text, because it was declared. A list has nothing to consult, so
  `gold, 3` becomes `["gold", 3]`.
- **A `null` literal types as `any`.** Every new condition starts as one, and
  reading it as the `null` TYPE would leave a fresh row offering almost nothing.
- **An unknown operator still draws, and keeps its values.** The row says the
  operator is missing rather than silently rewriting the rule to whichever one
  happened to be first in the list.
- **Switching an operand's source starts empty.** A path is not a variable name,
  and a plausible wrong value is worse than an obviously empty slot.
- **Reordering is buttons, not drag and drop.** A tree is reordered from the
  keyboard as often as with a mouse.
- **The preview is rendered from segments**, not from `.text`, so the field being
  edited can be highlighted and a click on a line selects the node it describes.
- **The clock is fixed at mount**, or passed in. A preview whose `today` advanced
  while somebody wrote a condition about it would answer differently by the end
  of the sentence.

English lives in `BuilderLabels`, the counterpart to the renderer's `Phrases`:
plugins carry `labelKey` and never a label, so the words have to live somewhere,
and somewhere is one replaceable record. Overrides merge, so a host adding a
label for its own operator does not lose the twenty-seven that shipped.

**The engine ships in English only.** The record is a seam, not a promise: a host
passes `labels` and gets another language, but `@adysre/rules-*` carries no i18n
dependency and no second catalogue to keep in step. That is a deliberate line
around the ecosystem, whose audience is developers authoring rules rather than
every reader of the app embedding it.

Every part is exported, not just the whole. A host that wants the condition tree
inside its own form should not have to take the toolbar with it.

## The debugger

`@adysre/rules-devtools` turns the trace into an answer. It exists because a
trace is the right thing to PRODUCE and the wrong thing to read: twelve events
in completion order is a list nobody works through when a business user is
waiting.

**It names the row that decided, and refuses to when none did.** `all` matching
means every child matched, and pointing at the last of them would be a debugger
asserting something false about a rule somebody is about to change. So a
decision carries a reason as well as a node - `shortCircuit` and `errored` name
a row, `collective` and `empty` admit that nothing single did - and a caller can
ask which it was rather than inferring it from prose.

A negated group is read through its COMBINATOR's verdict rather than its
reported one. `not(any)` reports the opposite of what its children produced, so
searching for "the child that made this fail" against the reported verdict finds
the wrong child, or none, on every negated group in the tree.

**It runs the rule twice.** Short-circuiting is right, and it means the trace of
a real run is a trace of part of the rule: a condition with a typo'd field sits
behind a passing sibling, never runs, and never reports. So the session also
runs with `shortCircuit: false` - which is what that option is for - and reports
the difference. The finding that matters is a hidden error: a rule answering
`matched` only because the fast path stepped over a broken branch is a rule that
changes its answer the day somebody reorders a group, and nothing else in the
system would ever say so.

**The trace goes back into the shape of the rule**, and from the AST rather than
from the events, because only the AST is complete. A skipped branch leaves no
event, so a tree assembled from events alone would omit exactly the nodes a
debugger exists to ask about; `notRun` has to be a visible state and not an
absence. `treeFromTrace` covers the other case - a stored outcome whose rule is
gone - and it is the one thing in the system that depends on children being
recorded before parents.

**Values are shown, not described.** `previewValue` is JSON with its quotes, not
the renderer's prose: the renderer writes `1,000` for somebody checking a
sentence reads correctly, and a debugger answering "what did the operator
receive" must not add a character that was never in the data. Capped in length,
because a field can hold ten thousand entries and the rule most worth inspecting
should not be the one that hangs the panel.

## Storage

`StoragePlugin` was in the vocabulary from the start. What `@adysre/rules-storage`
adds is everything a store has to DECIDE that the contract cannot say: when a
save makes a version, what a restore does to history, what a tag filter means,
how a list breaks a tie.

**The contract is executable.** "Adapters" is plural, and a plural that only
means "several things with the same method names" is worth nothing - a screen
that lists correctly against the in-memory store and wrongly against the
database is a bug nobody finds until production, because both type-check. So
`runStorageConformance` is a framework-free suite an adapter runs against
itself, and the second adapter exists partly to prove the first one was not
simply defining the contract by accident.

Decisions worth knowing:

- **A save that changes nothing creates no version.** A builder autosaves, a
  form posts twice, a retry lands after the first attempt succeeded, and a
  history padded with identical entries is one nobody scrolls.
- **A rename still makes a version**, because the AST says the version
  increments on each saved change. Whether the LOGIC changed is a different
  question, which `logicHash` already answered and `compareVersions` reports.
- **The stored version wins over the one a client sent.** A stale editor holding
  version 1 must not write 2 over 9.
- **A first save is version 1**, whatever the document claimed. An import
  carries the version it was written with, and honouring it starts a history
  at 7.
- **Restore moves forward.** The old content becomes a new version on top rather
  than rewinding: a history that can be rewritten is one nobody can be asked to
  trust, and "who changed this, and when" is what a version list is for.
- **A tag filter narrows**, taking all of the tags rather than any of them. One
  that returned more as tags were added would read as broken.
- **Search looks at what identifies a rule** - name, key, tags - and not the
  description, because a search that matches prose returns most of the list.
- **Ties are broken by id**, so paging cannot show an item twice or never.
- **An invalid rule is refused rather than stored.** Unlike parsing, where a bad
  document is a message to show, one reaching `save` is a bug in the caller.

Reading goes through `parseRule`, so a stored document written by an older
engine is migrated on the way in and one written by a NEWER engine is refused
rather than half-understood. Storage is where a stored rule meets a different
build, which is what `schemaVersion` was always for.

## Over HTTP

`@adysre/rules-next` puts the storage contract behind route handlers and server
actions. It imports NOTHING from Next: a handler is `(Request) => Response`,
which is all the App Router asks for and all any other Web-standard runtime asks
for either, so the same handlers run under Hono, Deno, Bun or a Worker - and a
change to Next's own helpers cannot break them.

`nextRoute` is the only piece that knows Next exists, and it still does not
import it. The App Router passes dynamic segments as an object in Next 14 and as
a PROMISE in Next 15, so handlers take resolved parameters and the adapter
awaits whichever arrived. Hard-coding either would have made an upgrade this
package has no stake in a breaking change.

**`authorize` is required.** Not optional with a permissive default, because the
way an unauthenticated rules API reaches production is a factory that worked
without being told about auth. A callback that THROWS is a refusal rather than a
pass: the only failure worse than refusing a legitimate request is admitting an
illegitimate one. It is asked about the specific rule, not just the route, so a
host decides per rule and per tenant without this package knowing what either is.

**A body is parsed, never cast.** Every document arrives through `parseRule` -
the same door an import uses - so an older one is migrated, a newer one is
refused, and a rule naming an operator this deployment lacks is turned away with
a message instead of stored to fail at evaluation.

The envelope is the platform's, from `API_STANDARDS.md`. A malformed `page` is
ignored rather than rejected, because a stale bookmark should show page 1 and
not an error screen; a `filter[kind]` naming something that is not a kind IS
rejected, because that is a closed set and answering with the whole list reads
as "the filter does nothing". `total` appears only when an adapter can count
without paging, the alternative being a handler that quietly loads every row.

## Themes

`@adysre/rules-theme` is a token set and an audit, and the audit is why it is a
package rather than a stylesheet.

**Tokens are named after ADYSRE's**, so a host that already has a design system
defines them already and the builder inherits it rather than imposing a second
palette on the page. That is what `ThemePlugin` meant by carrying token names
and never colour literals. The list is derived from what the components use, not
invented: a token nobody uses is a promise a host keeps for nothing, and one the
components use and the list omits is a theme that silently half-applies.

**"WCAG AA" is arithmetic, so it is checked.** `auditTheme` walks the
combinations the builder actually renders - `danger` on a card, `muted-foreground`
on a muted panel - and reports the ratio against the threshold. A theme package
that shipped colours without checking them would be the one place in the system
where an accessibility failure is invisible to every other test.

It does not guess. A token pointing at `var(--brand)` or an `oklch()` comes back
as UNCHECKED rather than assumed to pass, because an audit that quietly skips
what it cannot read is an audit that always passes.

It also earned its keep immediately: white on blue-500 is 3.68:1, so the shipped
dark theme uses a light fill with a dark label. Darkening the fill until white
passes would have put a near-black button on a near-black page, and the audit
turned that from a matter of taste into an answer.

**The defaults are not the brand palette.** A brand palette is chosen for large
surfaces; the builder renders dense small text, and `#f59e0b` reads beautifully
as a filled badge and sits at 2.14:1 as a sentence. Each accent is the text-safe
variant of the same hue.

A theme applies as custom properties, so it scopes to a subtree - two builders
on one page can wear different themes, which a stylesheet cannot do without a
class each. The debugger needs no theme of its own: custom properties inherit.

## The playground

`@adysre/rules-playground` is the capstone: a builder, a debugger, a live
verdict and the JSON over one rule, with an example picker above them. Dropping
`<RulePlayground />` on a page runs the whole ecosystem.

**The examples check themselves, and that is the design.** Every sample declares
the verdict the engine must produce, and `verifyExamples` runs them. An example
is documentation, and documentation is the one part of a system nothing else
tests: a rule with a screenshot beside it looks right on the day it is written,
and the only thing checking it afterwards is a reader who assumes it works. If a
comparison rule or an operator changes meaning, the example that taught it fails
in CI rather than teaching the wrong thing to everybody who reads it next.

The suite is framework-free, like the storage conformance suite, and the tests
go beyond the verdict: each example must be a VALID rule, use only plugins it
registers, offer a field for every path it reads, and name every action it
applies - the four ways an example is broken that a verdict alone would not
catch.

One example exists to fail. `hidden-fault` answers correctly by luck: its first
condition matches, `any` short-circuits, and the second condition - which
compares a number to a word - never runs. It reports `matched` with no
diagnostic, and reports `errored` the moment a different customer arrives. It
asserts `expectHidden`, so it cannot quietly become an ordinary passing rule,
which is how a teaching example stops teaching without anybody noticing.

**The clock is fixed, never `Date.now()`.** Half of these rules read a date, and
a moving clock makes a declared verdict a lie on a schedule and the server and
browser renders disagree.

`/rules` in the web app is now this component and nothing else, so what the page
shows is what any host gets - not a bespoke demo that works in one place, and
not a second set of examples to keep in step with the tested ones.

## The showcase

`/rules` in the web app is the engine's page: what it does, the figures, a live
sandbox, the package matrix and the decisions behind it - in the order a visitor
asks those questions, with the sandbox in the middle so somebody convinced by
the first two sections does not have to scroll past a package list to touch it.

**Every figure derives from the engine.** The operator count is
`builtinOperators.length`, the kinds are `RULE_KINDS`, the packages are read
from their own manifests. Registering a twenty-eighth operator updates the page
with no edit, and the page cannot claim a number the registry does not have.
Package names, versions and one-line summaries come from the manifests for the
same reason: a package that changes what it is changes what the page says it is.

Package summaries ship as data rather than translation keys, the way tech-stack
names already do elsewhere in the app - `@adysre/rules-core` is a proper noun,
and the ecosystem is English by decision. What the PAGE says on its own behalf
is translated in all four catalogues.

Everything above the sandbox is a Server Component. It is a package matrix and
some prose; shipping it to the browser would cost a chunk to achieve nothing,
and the sandbox is the only part that needs to be interactive.

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
| 6 | Headless React state (`rules-react`) | **done** |
| 7 | The visual builder (`rules-ui`) | **done** |
| 8 | Execution debugger (`rules-devtools`) | **done** |
| 9 | Storage adapters and versioning | **done** |
| 10 | Next.js adapters | **done** |
| 11 | Themes | **done** |
| 12 | Playground and examples | **done** |
| 13 | Documentation site | **done** |
| 14 | Publishing: build, exports, versioning | **done** |

## Publishing

The eleven packages publish to npm under `@adysre`, in LOCKSTEP: one version
across the ecosystem. They share the AST and the plugin interfaces, so
`rules-core@0.3` with `rules-types@0.1` is a combination that type-checks and
cannot work. One version makes it unrepresentable, and a test asserts the
versions have not drifted apart.

`exports` points at `src/*.ts` so the workspace consumes source with no build
step; `publishConfig.exports` points at `dist/*.js` for consumers, and pnpm
substitutes one for the other at pack time. `npm publish` IGNORES
`publishConfig`, which is why `prepublishOnly` refuses any client but pnpm -
that mistake shipped once, as `adysre@0.1.0`, and cost a version number.

Preparing this found two more ways to ship a package that installs and cannot
be imported, neither of which `tsc` reports:

- **An extensionless relative import.** `export * from './builders'` emits
  verbatim, and Node's ESM loader does not guess. Every package built cleanly,
  passed every test in the workspace - which resolves through a bundler - and
  would have thrown `ERR_MODULE_NOT_FOUND` on a consumer's first import.
- **A `.ts` extension left in a declaration file.**
  `rewriteRelativeImportExtensions` fixes the JavaScript and leaves the `.d.ts`
  alone, so the runtime resolves and a TypeScript consumer gets `Cannot find
  module './labels.ts'`.

Both are now checked by `verify-dist`, which runs before the tarball is built,
and the second is repaired by `fix-declarations` during the build. Both scripts
live in `@adysre/config` rather than in each package, and both exist because an
end-to-end install caught what the verifier's first draft did not.

The check that matters is the one that is hard to fake: pack the tarballs,
install them into an empty project, and both `node` and `tsc` accept them.

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
