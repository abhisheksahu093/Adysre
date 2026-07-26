# @adysre/rules-devtools

Why a rule answered what it answered.

```tsx
const session = useDebugSession(registry, rule, createContext(order));

<RuleDebugger session={session} onSelectNode={select} />
```

## It names the row that decided, and refuses to when none did

The question a rules engine exists to answer in the moment it matters most: a
business user insists the rule is wrong and somebody has to show the one
condition that produced the answer.

But there is not always one. `all` matching means every child matched, and
naming the last of them would be a debugger asserting something false about a
rule somebody is about to change. So `decisionFor` reports a **reason** as well
as a node, and `isSingleCause` says whether one row really settled it:

| Reason | What it means |
| --- | --- |
| `shortCircuit` | this row settled the group on its own, so nothing after it ran |
| `errored` | this could not be evaluated, and an error outranks any combinator |
| `sole` | the group had one child |
| `collective` | every condition contributed; no single one decided |
| `empty` | no conditions, which matches |

A negated group is read through its **combinator's** verdict, not its reported
one. `not(any)` reports the opposite of what its children produced, so looking
for "the child that made this fail" against the reported verdict finds the wrong
child, or none, on every negated group in the tree.

## It runs the rule twice

Short-circuiting is right, and it means the trace of a real run is a trace of
*part* of the rule. A condition with a typo'd field or an unregistered operator
sits behind a passing sibling, never runs, and never reports.

So the session runs it once as it really runs and once with
`shortCircuit: false`, and `compareRuns` reports the difference. The finding
that matters is `hiddenErrors`:

> A rule that answers `matched` only because the fast path stepped over a broken
> branch is a rule that changes its answer the day somebody reorders a group,
> and it is invisible in every report until then.

## The trace, back in the shape of the rule

`traceTree(rule, trace)` puts each event on the node it came from. Built from
the **AST**, not from the trace, because only the AST is complete: a
short-circuited branch leaves no event, and a tree assembled from events alone
would silently omit exactly the nodes a debugger exists to ask about. `notRun`
is a visible state rather than an absence.

`treeFromTrace(trace)` exists for a stored outcome whose rule is gone. It works
only because the executor records children before parents and puts `children` on
every group event, which is the one thing in the engine that depends on that.

## Values are shown, not described

`previewValue` is JSON with quotes, not the renderer's prose. The renderer turns
`"gold"` into `gold` and `1000` into `1,000` because it is writing a sentence
for somebody checking the rule reads correctly. A debugger answers the opposite
question — what did the operator literally receive — and a thousand separator
there is a character that was never in the data.

Values are length-capped. A field can hold ten thousand entries, and a row that
renders all of them is a debugger that hangs on the rule most in need of
inspection.

## What is here

| Module | Purpose |
| --- | --- |
| `session` | `debugRule`: both runs, the trees, the decision, the comparison |
| `tree` | the flat trace, back in the shape of the rule |
| `decide` | which row decided, and whether one really did |
| `compare` | what the fast path skipped, and what it hid |
| `format` | values and durations as a debugger shows them |
| `labels` | every word it says, in one replaceable record |

The analysis is pure and tested without a renderer; the components draw it.
English only, like the rest of the ecosystem: the record is a seam, not an i18n
dependency.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
