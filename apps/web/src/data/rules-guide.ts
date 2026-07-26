import { RULES_PACKAGES } from '@/data/rules-engine';

/**
 * How to set up and work with the rules engine.
 *
 * ─── One source for the page and the download ───────────────────────────────
 * The guide is DATA, and the downloadable Markdown is generated from it by
 * `guideAsMarkdown`. A separate file to download is a second copy of the same
 * instructions, and the copy nobody re-reads is the one that goes stale: the
 * page gets fixed and the download keeps telling people to call a function that
 * was renamed two releases ago.
 *
 * Prose lives in the message catalogues under `rules.guide.<id>` so it
 * translates; CODE ships here as data, because a snippet is not prose. A
 * translated `createRegistry` would be a snippet that does not run.
 */

export interface GuideStep {
  /** Key under `rules.guide.steps.<id>.title` and `.body`. */
  id: string;
  /** Shown above the snippet. A filename, or the shell it runs in. */
  filename: string;
  code: string;
}

const INSTALL = `# the engine and its vocabulary
pnpm add @adysre/rules-core @adysre/rules-types

# the visual builder, when you want one
pnpm add @adysre/rules-ui @adysre/rules-react @adysre/rules-theme`;

const AUTHOR = `import { all, condition, field, literal, rule } from '@adysre/rules-core';

// A rule is plain JSON. The builders exist so ids and timestamps are handled
// for you, but nothing stops you writing the object by hand.
const largeOrders = rule({
  name: 'Large orders from new customers need approval',
  kind: 'validation',
  when: all([
    condition({
      left: field('order.total'),
      operator: 'greaterThan',
      args: [literal(1000)],
    }),
  ]),
  then: [{ id: 'a_hold', type: 'requireApproval' }],
});`;

const EVALUATE = `import { builtinPlugins, createContext, createRegistry, evaluateRule } from '@adysre/rules-core';

// The registry starts EMPTY: what rules may do is your choice. Pass the
// built-ins for the usual twenty-seven operators and twenty-three functions.
const registry = createRegistry(builtinPlugins);

const outcome = evaluateRule(registry, largeOrders, createContext(order));

outcome.verdict;      // 'matched' | 'unmatched' | 'skipped' | 'errored'
outcome.actions;      // what to do — the engine never does it for you
outcome.trace;        // every node that ran, and what it concluded`;

const EXTEND = `import { createRegistry, builtinPlugins, RuleError } from '@adysre/rules-core';
import type { OperatorPlugin } from '@adysre/rules-types';

// Your own operator. The builder picks it up, the debugger explains it, and
// your rules stay plain JSON — no change to the engine.
const withinBusinessHours: OperatorPlugin = {
  id: 'withinBusinessHours',
  labelKey: 'operators.withinBusinessHours',
  arity: 0,
  accepts: ['date'],
  evaluate: (left) => {
    if (typeof left !== 'string') {
      // Not \`false\`: a broken comparison must not look like a failed one.
      throw new RuleError('type_mismatch', 'withinBusinessHours needs a date.');
    }
    const hour = new Date(left).getHours();
    return hour >= 9 && hour < 17;
  },
};

const registry = createRegistry(builtinPlugins, { operators: [withinBusinessHours] });`;

const EXPLAIN = `import { describeRule } from '@adysre/rules-renderer';

describeRule(largeOrders, { plugins: registry }).text;
// When order total is greater than 1,000
// Then require approval

// Structure first, text second: \`.lines\` gives typed segments, so a UI can
// highlight the field being edited or colour the condition that decided it.`;

const BUILD = `'use client';

import { RuleBuilder } from '@adysre/rules-ui';

export function Editor({ rule, onChange }) {
  return (
    <RuleBuilder
      rule={rule}
      registry={registry}
      sample={sampleOrder}   // runs the rule as you type
      onChange={onChange}
    />
  );
}`;

const DEBUG = `import { debugRule } from '@adysre/rules-devtools';

const session = debugRule(registry, largeOrders, createContext(order));

session.decision;                  // which row decided, or that several did
session.comparison.hiddenErrors;   // faults a short circuit stepped over`;

const STORE = `import { createMemoryStorage, runStorageConformance } from '@adysre/rules-storage';

const storage = createMemoryStorage();
await storage.save(largeOrders);          // version 1
await storage.restore(largeOrders.id, 1); // a NEW version holding version 1

// Writing your own adapter? Check it against the same contract:
const results = await runStorageConformance(() => createMyAdapter());`;

/** The guide, in the order somebody works through it. */
export const GUIDE_STEPS: GuideStep[] = [
  { id: 'install', filename: 'terminal', code: INSTALL },
  { id: 'author', filename: 'rules/large-orders.ts', code: AUTHOR },
  { id: 'evaluate', filename: 'rules/run.ts', code: EVALUATE },
  { id: 'explain', filename: 'rules/explain.ts', code: EXPLAIN },
  { id: 'extend', filename: 'rules/registry.ts', code: EXTEND },
  { id: 'build', filename: 'app/editor.tsx', code: BUILD },
  { id: 'debug', filename: 'rules/debug.ts', code: DEBUG },
  { id: 'store', filename: 'rules/storage.ts', code: STORE },
];

/** Translated headings the download needs, resolved by the caller. */
export interface GuideCopy {
  title: string;
  intro: string;
  steps: Record<string, { title: string; body: string }>;
  packagesTitle: string;
}

/**
 * The same guide, as a Markdown file.
 *
 * Generated rather than written, so the page and the download cannot disagree.
 * Takes its prose as an argument because the strings live in the catalogues:
 * a visitor reading the page in Japanese downloads the Japanese guide, with the
 * same untranslated code in it.
 */
export function guideAsMarkdown(copy: GuideCopy): string {
  const lines: string[] = [`# ${copy.title}`, '', copy.intro, ''];

  for (const [index, step] of GUIDE_STEPS.entries()) {
    const text = copy.steps[step.id];
    lines.push(
      `## ${String(index + 1)}. ${text?.title ?? step.id}`,
      '',
      text?.body ?? '',
      '',
      `\`\`\`${step.filename === 'terminal' ? 'bash' : 'ts'}`,
      step.code,
      '```',
      '',
    );
  }

  lines.push(`## ${copy.packagesTitle}`, '');
  for (const entry of RULES_PACKAGES) {
    lines.push(`- \`${entry.name}\` — ${entry.description}`);
  }
  lines.push('');

  return lines.join('\n');
}
