# @adysre/rules-core

The AST and everything that can be done to it: building, walking, validating,
serialising, and running.

**Zero runtime dependencies**, deliberately. A rules engine is embedded, and one
that drags a dependency tree into every bundle that touches it is one teams work
around. That is also why the validator is hand-written rather than delegated to
a schema library.

```ts
import { rule, all, condition, field, literal, validateRule } from '@adysre/rules-core';

const document = rule({
  name: 'Large orders need approval',
  kind: 'validation',
  when: all([
    condition({ left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] }),
  ]),
  then: [action({ type: 'reject', target: 'order.total' })],
});

validateRule(document); // { valid: true, diagnostics: [] }

const evaluator = createEvaluator(createRegistry(builtinPlugins));
const { verdict, actions, trace } = evaluator.evaluate(
  document,
  createContext({ order: { total: 2500 } }),
); // 'matched', the reject action, and a record of how it got there
```

## What is here

| Module | Purpose |
| --- | --- |
| `builders` | Construct an AST in code, with injectable ids and clock so a document is reproducible |
| `walk` | Traverse, search, edit immutably, and report which fields, variables and plugins a rule needs |
| `validate` | Structural validation, reporting the AST path of every problem |
| `serialize` | Parse and stringify with a stable key order, plus a migration path between AST versions |
| `registry` | Immutable plugin registry: duplicate ids throw at registration, lookups never throw |
| `builtins` | 27 operators and 23 functions, offered rather than imposed |
| `errors` | `RuleError`, how a plugin says "I cannot answer that" |
| `resolve` | Operands to values: own-property field reads, bounded function nesting |
| `execute` | The executor: verdicts, actions, diagnostics and a trace |

The renderers, the React state and the visual builder are separate packages
precisely so this one is safe to import anywhere a rule has to run: a server
route, a worker, a build step that lints them. Nothing here needs a DOM.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
