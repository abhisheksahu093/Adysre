# @adysre/rules-theme

The builder's colours, and proof they can be read.

```tsx
<RuleBuilder theme={darkRulesTheme} … />
```

```ts
const audit = auditTheme(myTokens);
if (!audit.passes) throw new Error(auditReport(audit));
// "warning on card (a warning) is 2.14:1, needs 4.5:1"
```

## The audit is the point

"WCAG AA" is otherwise a claim somebody makes in a pull request. It is
arithmetic, so it can be checked — and a theme package that shipped colours
without checking them would be the one place in the system where an
accessibility failure is invisible to every other test.

`CONTRAST_PAIRS` lists the combinations the builder **actually renders** —
`text-danger` on a card, `text-muted-foreground` on a muted panel — so a failure
is something you can point at on screen rather than a theoretical clash between
two tokens that never meet.

It found one in this package's own dark theme: white on blue-500 is 3.68:1, and
darkening the fill until white passes puts a near-black button on a near-black
page. The dark theme uses a light fill with a dark label because the audit made
that an answer instead of a matter of taste.

**It does not guess.** A token pointing at `var(--brand)` or an `oklch()` is
reported as `unchecked` rather than assumed to pass. An audit that quietly skips
what it cannot read is an audit that always passes.

**Borders are not audited.** WCAG 1.4.11 holds interface parts to 3:1, and
`input` and `ring` are here because both carry information you need to operate
the thing: where a text box begins, and what has focus. The decorative outline
around a condition row is not — a row is identified by what is written in it,
and holding a subtle separator to a control's standard forces every theme into
heavy grey outlines to satisfy a rule that does not apply.

## Tokens are named after ADYSRE's

Deliberately. A host that already has a design system defines
`--background`, `--muted-foreground` and the rest already, so the builder
**inherits** it rather than imposing a second palette on the page. That is what
`ThemePlugin` meant by carrying token names and never colour literals.

A host with no design system imports the stylesheet and gets a readable default:

```css
@import '@adysre/rules-theme/tokens.css';
```

The list comes from what the components use — every `bg-`, `text-`, `border-`
and `ring-` class in `rules-ui` and `rules-devtools`. A token nobody uses is a
promise a host keeps for nothing; one the components use and the list omits is a
theme that silently half-applies.

## The defaults are not a brand palette

A brand palette is chosen for large surfaces — a button, a banner, a chart. The
builder renders dense small text. `#f59e0b` reads beautifully as a filled badge
and sits at **2.14:1** as a sentence, which is a fail. So each accent here is the
text-safe variant of the same hue, and the audit proves it rather than a comment
claiming it.

## Applying one

`themeStyle` returns custom properties, so a theme **scopes to a subtree**: two
builders on one page can wear different themes, which a stylesheet cannot do
without a class per theme. The debugger needs no theme prop — custom properties
inherit, so a `RuleDebugger` inside a themed builder is already themed.

`createRulesTheme` fills gaps from a base, so "ADYSRE, but a different accent"
does not mean restating eighteen values. It **throws** on a token this build has
no name for: a typo in a theme is a programming error, and the moment to find it
is when the theme is declared rather than when somebody notices one panel is the
wrong colour.

## Drift

`tokens.css` restates what `themes.ts` holds, because a stylesheet cannot import
a TypeScript record. A test parses the CSS and compares all three blocks —
light, `.dark`, and the `prefers-color-scheme` copy — against the audited sets.
Without it the audit would keep passing against the TS values while the CSS a
host actually loads had gone stale.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
