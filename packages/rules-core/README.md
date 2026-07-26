# @adysre/rules-core

The AST, and everything that can be done to it without running it: building,
walking, validating, serialising.

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

The executor, the plugin registry and the renderers are separate packages
precisely so this one is safe to import anywhere: a form that only reads a rule,
a migration that rewrites one, a build step that lints them.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
