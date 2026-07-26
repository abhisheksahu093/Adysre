# @adysre/rules-types

The type vocabulary of the ADYSRE Business Rules Engine. Types, the const arrays
they derive from, and the guards that narrow them. Nothing else.

This package imports nothing, including from the rest of the ecosystem: it is
the layer every other package agrees on, so it cannot be allowed to depend on
any of them.

```ts
import type { RuleDocument, OperatorPlugin } from '@adysre/rules-types';
```

Read [`src/ast.ts`](./src/ast.ts) first. The AST is the single source of truth;
everything else in the engine is a projection of it.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md) for the
architecture and the phase plan.
