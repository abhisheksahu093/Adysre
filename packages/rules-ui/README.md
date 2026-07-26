# @adysre/rules-ui

The visual builder. A projection of the AST, like everything else in this
engine.

```tsx
const registry = createRegistry(builtinPlugins, { fields: [schema], actions: [reject] });

<RuleBuilder
  rule={document}
  registry={registry}
  sample={order}          // runs the rule as it is edited
  onChange={setDocument}
  onSave={save}
/>
```

## It edits the tree and nothing else

No state of its own beyond what a text box needs between keystrokes. Every edit
is a dispatch into `@adysre/rules-react`, so undo, per-node validation and
dirtiness behave here exactly as they do for a host driving the store without a
screen, and `state.rule` still goes straight to `stringifyRule`,
`evaluateRule` or `describeRule`.

## Everything it can do comes from a plugin

The builder holds no table of what `between` needs or which operators suit a
date. `arity` says how many value boxes to draw, `accepts` says which operators
to offer for the type on the left, `returns` types a function operand, and
`requiresTarget` decides whether an action shows a target. Register
`withinBusinessHours` and it appears in the right rows, with the right number of
boxes, without this package hearing about it.

## The decisions live outside the components

| Module | Answers |
| --- | --- |
| `labels` | every word the builder says, and what to call a plugin |
| `operators` | which operators fit a type, how many boxes each draws |
| `operands` | what type an operand produces, what changing its source does |
| `values` | text in a box to JSON and back |
| `actions` | which actions suit a rule kind, which boxes each one shows |

All plain functions, all tested without a renderer. A decision that can only be
reached by rendering something is a decision nobody tests.

## Decisions worth knowing

**An empty box is `null`, for every type.** Not `""` and not `0`. A box nobody
filled in is a value nobody chose, `validateRule` can see the condition is
incomplete, and an untouched row never looks like a deliberate comparison
against the empty string. Someone who means "has no value" has `isEmpty`.

**A typed box never guesses; a list always does.** A string field holding `3`
stays text. A list has no declared element type to consult, so `gold, 3` becomes
`["gold", 3]` and `isOneOf` can match either.

**A `null` literal types as `any`.** Every new condition starts as one, and
reading it as the `null` type would leave a fresh row offering almost no
operators.

**An unknown operator still draws, and keeps its values.** The row says this
deployment has no such operator; it does not silently rewrite the rule to
whichever operator happened to be first in the list.

**Switching an operand's source starts empty.** A path is not a variable name.
Carrying text across would put a plausible wrong value where an obviously empty
slot belongs.

**Reordering is buttons, not drag and drop.** A tree is reordered from the
keyboard as often as with a mouse, and dragging with no keyboard equivalent is
where a builder's accessibility usually goes.

**The preview is rendered from segments.** `describeRule` returns typed pieces,
so the field being edited can be highlighted, the verdict that decided a
condition can be coloured, and clicking a line can select the node it describes.
None of that survives being flattened to a string first.

**The clock is fixed at mount.** A preview whose `today` advanced on every
keystroke would mean something different halfway through writing a condition
about it. Pass `now` to fix it yourself.

## English lives in one record

Plugins carry `labelKey` and never a label. `BuilderLabels` is the whole
vocabulary, so a locale is `labels={de}` rather than a fork, and a host that
calls a field an attribute changes one string. Overrides merge, so adding a
label for your own operator does not lose the ones that shipped.

**ADYSRE ships the builder in English only, deliberately.** The seam is a `labels`
prop and not a translation runtime: the engine has no i18n dependency, and a host
that needs another language supplies one record. Wiring it to the app's
catalogues would put a hundred keys per locale in front of a package whose
audience is developers authoring rules, so it stays a capability rather than a
commitment.

## Composition

Every part is exported, not just the whole: `GroupRow`, `ConditionRow`,
`OperandEditor`, `ActionList`, `RulePreview`, `MetaEditor`, `RuleToolbar`. A
host that wants the condition tree inside its own form should not have to take
the toolbar with it. They read the builder's context, so they belong inside a
`RuleBuilder`.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
