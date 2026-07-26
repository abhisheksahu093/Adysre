import type {
  ActionPlugin,
  FieldDescriptor,
  JsonValue,
  RuleDocument,
  RuleKind,
  Verdict,
} from '@adysre/rules-types';

/**
 * A worked example, and what it is supposed to answer.
 *
 * The `expect` on every sample is the whole design. An example that is only a
 * rule and some data is a screenshot: it looks right the day it is written and
 * nobody notices when a change to the engine makes it wrong, because the only
 * thing checking it is a reader who assumes it works.
 *
 * Declaring the verdict makes each example a test. `verifyExamples` runs them
 * all, so the documentation cannot drift from the engine that runs it - and if
 * a comparison rule or an operator ever changes meaning, the example that
 * taught it fails in CI rather than teaching the wrong thing.
 */

export interface ExampleSample {
  id: string;
  label: string;
  /** What the rule is run against. */
  subject: JsonValue;
  variables?: Record<string, JsonValue>;
  /** What the engine MUST answer. This is what stops an example from rotting. */
  expect: Verdict;
  /**
   * Action types the outcome must carry, in order.
   *
   * Optional because not every sample is about the actions, and asserting an
   * empty list on the ones that are not would be a test that breaks whenever
   * somebody adds a second outcome to an example for teaching reasons.
   */
  expectActions?: readonly string[];
  /**
   * Whether running every branch reveals a fault the fast path stepped over.
   *
   * Asserted so an example whose whole point is a hidden error cannot quietly
   * become an ordinary passing rule - which is exactly the way a teaching
   * example stops teaching without anybody noticing.
   */
  expectHidden?: boolean;
}

export interface Example {
  id: string;
  title: string;
  /** One sentence: what this teaches. */
  blurb: string;
  kind: RuleKind;
  rule: RuleDocument;
  /** What the builder's field picker offers for this example. */
  fields: readonly FieldDescriptor[];
  /** The outcomes this example's rule may produce. */
  actions: readonly ActionPlugin[];
  samples: readonly ExampleSample[];
  /**
   * The instant the example is evaluated at.
   *
   * Fixed, never `Date.now()`. An example using `today` would otherwise answer
   * differently tomorrow, which makes its declared verdict a lie on a schedule
   * and its rendering unstable between the server and the browser.
   */
  now: number;
}
