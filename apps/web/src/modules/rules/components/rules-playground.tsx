'use client';

import { RulePlayground } from '@adysre/rules-playground';

/**
 * The sandbox, mounted.
 *
 * Thin on purpose. The sandbox is `@adysre/rules-playground`, so what this page
 * shows is the same thing any host gets by dropping one component on a page -
 * not a bespoke demo that works here and nowhere else, and not a second set of
 * examples to keep in step with the tested ones.
 *
 * No `theme` prop: ADYSRE defines every token the builder uses, so the sandbox
 * inherits the app's palette and its dark mode toggle. Passing a theme would
 * impose a second palette on a page that already has one.
 *
 * A Client Component because the builder is an editor. The page around it is a
 * Server Component, so this is the only chunk that reaches the browser.
 */
export function RulesPlayground() {
  return <RulePlayground />;
}
