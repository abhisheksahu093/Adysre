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
| `@adysre/rules-core` | builders, traversal, validation, serialisation. Zero dependencies | **built** |
| `@adysre/rules-parser` | importers: JSON, and other engines' formats | planned |
| `@adysre/rules-renderer` | AST to natural language, and other output formats | planned |
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

## Results carry their reasoning

A rules engine whose answer is a bare `true` is unusable in the moment it
matters most: when a business user insists the rule is wrong and someone has to
show which condition decided it. Every node that runs leaves a `TraceEvent`
recording what it saw and what it concluded, so the trace is part of the result
rather than a debugging mode bolted on later.

## Rule kinds

`validation`, `filter`, `transformation`, `workflow`, `calculation`,
`permission`, `visibility`. The kind says what a rule is FOR; what it DOES is
its actions. Hard-coding one action shape per kind would make every new kind a
change to the AST rather than a plugin.

## Phases

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Monorepo, core types, the AST | **done** |
| 2 | Plugin registry and the built-in operator and function set | next |
| 3 | Executor: evaluation, short-circuiting, tracing, timeouts | |
| 4 | Natural-language renderer | |
| 5 | Parser and importers | |
| 6 | Headless React state (`rules-react`) | |
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
