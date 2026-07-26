# @adysre/rules-playground

The whole ecosystem, running.

```tsx
<RulePlayground />
```

Builder, debugger, live verdict and JSON over rules that exercise the parts of
the engine that interact. Everything a reader needs to answer "what does this
thing actually do" without installing it.

## The examples check themselves

Every sample declares the verdict the engine must produce:

```ts
{
  id: 'new-customer',
  label: 'A large order from a new customer',
  subject: { order: { total: 2400 }, customer: { tier: 'new' } },
  expect: 'matched',
  expectActions: ['requireApproval'],
}
```

`verifyExamples` runs them all, and the package's test fails if any example
stops being true.

That is the whole design. An example is documentation, and documentation is the
one part of a system nothing else tests: a rule with a screenshot beside it
looks right on the day it is written, and the only thing checking it afterwards
is a reader who assumes it works. If a comparison rule or an operator ever
changes meaning, the example that taught it fails in CI rather than teaching the
wrong thing to everybody who reads it next.

The suite is framework-free, like the storage conformance suite, so it runs in a
unit test, a docs build, or a deployment checking the examples it ships.

Beyond the verdict, the tests also hold each example to being a **valid** rule,
using only plugins it registers, offering a field for every path it reads, and
naming every action it applies — the four ways an example is broken in a way a
verdict alone would not catch.

## What each one teaches

| Example | Shows |
| --- | --- |
| Order approval | a nested `any` inside an `all`, a date function, and the `otherwise` branch people forget exists |
| Access control | list membership, a boolean that is genuinely `false`, and why `all` stopping early matters |
| Discount tier | a field compared to **another field**, a computed operand, and `between` being inclusive at both ends |
| Hidden fault | a rule that answers correctly **by luck** |

The last one is the point of the debugger. Its first condition matches, so `any`
short-circuits and the second never runs — and the second cannot run at all,
because it compares a number to a word. The rule reports `matched`, no
diagnostic is raised, and every report says it is fine. Change the customer's
tier and it reports `errored`.

That example asserts `expectHidden: true`, so it cannot quietly become an
ordinary passing rule — which is exactly how a teaching example stops teaching
without anybody noticing.

## The clock is fixed

Never `Date.now()`. Half of these rules read a date, and a moving clock makes a
declared verdict a lie on a schedule and the server and browser renders
disagree. Each example carries the instant it is evaluated at, and a test
asserts it.

## Editing is the point

The badge above the builder compares the live run to what the example
documents. It agrees until you change something — at which point saying
"now unmatched, documented as matched" is more use than hiding the difference.

Choosing a different example replaces the document, which is the one case
`RuleBuilder` reloads on. Editing then behaves normally: the builder recognises
its own document coming back and keeps the undo stack.

No `theme` prop is needed inside a host with a design system — the builder
inherits its tokens. Pass one to scope a different palette to the sandbox.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
