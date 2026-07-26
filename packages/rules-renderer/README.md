# @adysre/rules-renderer

A rule, in language a person can check.

```ts
import { describeRule } from '@adysre/rules-renderer';
import { builtinPlugins, createRegistry } from '@adysre/rules-core';

describeRule(document, { plugins: createRegistry(builtinPlugins), locale: 'en-GB' }).text;
```

```
Large orders from new customers need approval
When all of these are true:
  - order total is greater than 1,000
  - any of these are true:
    - customer tier is "new"
    - order placed at is before today
Then reject order total
```

**One direction only.** The AST is generated INTO prose and never parsed back
out of it. A builder that also read prose would be two authorities on the same
rule, and the one that loses is always the tree, because prose is what people
edit.

**Structure first, text second.** `describeRule` returns lines of typed
segments; `.text` is a projection of them. A string is enough for a tooltip and
useless for a builder that highlights the field being edited or a debugger that
colours the condition that decided a verdict, and neither can be recovered from
prose afterwards.

```ts
describeCondition(node, { plugins });
// [ { type: 'field', text: 'order total', path: 'order.total' },
//   { type: 'text',  text: ' is greater than ' },
//   { type: 'value', text: '1,000', value: 1000 } ]
```

**The operator writes its own sentence.** `toText` lives on the plugin, so this
package holds no second implementation of the operator set to keep in step with
the first. What lives here is everything the plugins deliberately do not know:
connective words, value formatting, field labels, and the shape of the outline.

## What is here

| Module | Purpose |
| --- | --- |
| `render` | `describeRule`, `describeNode`, `describeCondition`, `toPlainText` |
| `segments` | The typed sentence, and the marker trick that recovers it from a plugin's string |
| `format` | Numbers, dates and lists as a reader expects them, for a given locale |
| `phrases` | Every English word the renderer uses, in one replaceable record |
| `plugin` | `createNrlRenderer`, so a host can register it under the `nrl` format |

## Localising

Phrases are data, so a locale is a `phrases` object rather than a fork:

```ts
describeRule(document, {
  plugins,
  locale: 'de-DE',
  phrases: { when: 'Wenn {conditions}', all: 'alles davon zutrifft:' },
  fields: { 'order.total': 'Bestellwert' },
  operatorText: (id, left, args) => (id === 'greaterThan' ? `${left} groesser als ${args[0]} ist` : undefined),
});
```

`operatorText` receives markers rather than text and returns a template with
them still in it, so the operands stay identifiable through a translation.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
