/**
 * `@adysre/rules-theme` - the builder's colours, and proof they can be read.
 *
 * Two things, and the second is the reason the first is worth a package.
 *
 * A TOKEN SET named after ADYSRE's, so a host that already has a design system
 * defines these variables already and the builder inherits it rather than
 * imposing a second palette on the page. A host with none imports `tokens.css`
 * and gets a readable default.
 *
 * A CONTRAST AUDIT, because "WCAG AA" is otherwise a claim somebody makes in a
 * pull request. It is arithmetic, so it can be checked - and a theme package
 * that shipped colours without checking them would be the one place in the
 * system where an accessibility failure is invisible to every other test.
 *
 * What the audit will not do is guess. A token pointing at `var(--brand)` or an
 * `oklch()` is reported as UNCHECKED rather than assumed to pass, because an
 * audit that quietly skips what it cannot read is an audit that always passes.
 */

export * from './contrast.ts';
export * from './themes.ts';
export * from './tokens.ts';
