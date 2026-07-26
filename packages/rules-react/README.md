# @adysre/rules-react

Everything a rule builder does, except drawing it.

```tsx
const { rule, actions, validation, canUndo, isDirty } = useRuleBuilder(document, { registry });

actions.addCondition();
actions.setOperator(id, 'between');   // the values resize to fit
actions.undo();
```

## The store has no React in it

`createRuleStore`, `reduce` and the selectors import nothing from any framework.
The hooks are a thin `useSyncExternalStore` adapter over that.

That is not tidiness. A rule builder's behaviour is mostly editing rules rather
than drawing them, and behaviour that can only be tested through a renderer is
behaviour that mostly is not tested. Every assertion in this package's tests
calls the reducer or the store directly: no DOM, no `act()`. The same store also
drives a builder written in anything else.

```ts
const store = createRuleStore(document, { ids, registry });
store.subscribe(render);
store.actions.addGroup();
```

## The rule in state is just a rule

A `RuleDocument` with nothing bolted onto it. What the editor knows and the
document does not - selection, history, what was last saved - lives beside it.
So `state.rule` goes straight to `stringifyRule`, `evaluateRule` or
`describeRule` without being stripped first, and an editor bug cannot store a
field the engine has never heard of.

## Decisions worth knowing

**Undo is for edits, not for clicks.** Selecting a node is not undoable: a user
pressing undo wants their last change back, not their last click.

**Typing is one undo step.** Consecutive edits to the same value collapse, so
undo does not walk back a keystroke at a time. Structural changes never merge.

**A new edit after an undo discards the redo stack.** Offering the old future
back is how an editor loses somebody's work.

**History is bounded** (100 by default) and cheap: the core's helpers return the
same object for branches that did not change, so an entry is a new root and a
few new nodes rather than a copy of the tree.

**Dirty ignores a rename.** It compares `logicHash`, so a name change is worth
saving but not worth a warning. An editor that cries "unsaved changes" at a
touched-then-untouched field trains people to ignore it.

**Changing an operator resizes its values.** `equals` to `between` leaves a
condition needing two values where it had one; padding is honest and truncating
keeps the values already chosen, in order.

**Validation is reported per node.** `validateRule` gives an AST path, which is
right for a file and useless for a form, so `validation()` resolves each path
back to the node id that has to show the error.

**A field provider that fails does not blank the picker.** Failures come back
beside the results and the editor decides what to say.

## What is here

| Module | Purpose |
| --- | --- |
| `reducer` | Every edit a builder can make, as one pure function |
| `store` | Subscribe, dispatch, and named actions. No framework |
| `selectors` | Undo state, dirtiness, per-node validation, the selected node |
| `providers` | Field and variable providers resolved, merged and deduped |
| `hooks` | `useRuleBuilder`, `useFields`, `useVariables`, `useRulePreview` |

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
