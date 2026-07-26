import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import { collectPluginIds, missingPlugins, validateRule } from '@adysre/rules-core';

import {
  EXAMPLES,
  exampleById,
  exampleReport,
  registryFor,
  runSample,
  verifyExample,
  verifyExamples,
} from './index.ts';

/**
 * The examples, held to what they claim.
 *
 * This is the test that makes documentation trustworthy. Everything else in the
 * ecosystem is checked by its own package's tests; an example is prose plus a
 * rule, and prose is the one thing nothing else in the system verifies.
 */

describe('every example does what it says', () => {
  it('answers the verdict it declares, on every sample', () => {
    const findings = verifyExamples(EXAMPLES);
    assert.equal(exampleReport(findings), '', 'example failures');
  });

  it('is a valid rule', () => {
    for (const example of EXAMPLES) {
      const result = validateRule(example.rule);
      assert.ok(result.valid, `${example.id}: ${result.diagnostics[0]?.message ?? ''}`);
    }
  });

  it('only uses plugins its own registry has', () => {
    for (const example of EXAMPLES) {
      const missing = missingPlugins(registryFor(example), collectPluginIds(example.rule));
      assert.deepEqual(
        [...missing.operators, ...missing.functions],
        [],
        `${example.id} refers to plugins it does not register`,
      );
    }
  });

  it('offers a field for every path its rule reads', () => {
    for (const example of EXAMPLES) {
      const offered = new Set(example.fields.map((field) => field.path));
      // A rule reading a path the picker never offers is a rule nobody can edit
      // in the builder without typing the path from memory.
      for (const path of new Set(collectFieldPaths(example.rule))) {
        assert.ok(offered.has(path), `${example.id} reads ${path}, which it does not offer`);
      }
    }
  });

  it('names every action its rule applies', () => {
    for (const example of EXAMPLES) {
      const declared = new Set(example.actions.map((action) => action.id));
      const used = [...example.rule.then, ...(example.rule.otherwise ?? [])];

      for (const action of used) {
        assert.ok(declared.has(action.type), `${example.id} applies an undeclared ${action.type}`);
      }
    }
  });

  it('fixes its clock, so it does not answer differently tomorrow', () => {
    for (const example of EXAMPLES) {
      assert.ok(Number.isFinite(example.now), `${example.id} has no fixed clock`);
      // A date-dependent example evaluated at `Date.now()` makes its declared
      // verdict a lie on a schedule, and its rendering unstable between the
      // server and the browser.
      assert.ok(example.now > 0);
    }
  });

  it('has a unique id, since that is what a picker selects by', () => {
    const ids = EXAMPLES.map((example) => example.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(exampleById('order-approval')?.id, 'order-approval');
    assert.equal(exampleById('nothing-by-that-name'), undefined);
  });
});

describe('the verifier can fail', () => {
  it('catches an example that claims the wrong verdict', () => {
    const example = EXAMPLES[0];
    assert.ok(example);

    const lying = {
      ...example,
      samples: example.samples.map((sample) => ({ ...sample, expect: 'skipped' as const })),
    };

    const findings = verifyExample(lying);
    assert.ok(findings.length > 0);
    assert.ok(exampleReport(findings).includes('the example says skipped'));
  });

  it('catches an example that claims the wrong actions', () => {
    const example = EXAMPLES[0];
    assert.ok(example);
    const first = example.samples[0];
    assert.ok(first);

    const findings = verifyExample({
      ...example,
      samples: [{ ...first, expectActions: ['somethingElse'] }],
    });

    assert.ok(exampleReport(findings).includes('somethingElse'));
  });

  it('catches a hidden fault nobody announced', () => {
    // An unannounced hidden error is a broken example rather than a lesson.
    const broken = EXAMPLES.find((example) => example.id === 'hidden-fault');
    assert.ok(broken);
    const gold = broken.samples.find((sample) => sample.id === 'gold');
    assert.ok(gold);

    const { expectHidden: _dropped, ...silent } = gold;
    const findings = verifyExample({ ...broken, samples: [silent] });

    assert.ok(exampleReport(findings).includes('never mentions'));
  });

  it('catches an example with nothing to check', () => {
    const example = EXAMPLES[0];
    assert.ok(example);

    assert.ok(exampleReport(verifyExample({ ...example, samples: [] })).includes('no samples'));
  });
});

describe('running one sample', () => {
  it('is the same run the playground shows', () => {
    const example = EXAMPLES[0];
    assert.ok(example);
    const sample = example.samples[0];
    assert.ok(sample);

    const outcome = runSample(example, sample);
    assert.equal(outcome.verdict, sample.expect);
    assert.ok(outcome.trace.length > 0, 'a run with no trace explains nothing');
  });
});

/** Every field path a rule reads, including inside function arguments. */
function collectFieldPaths(rule: Parameters<typeof validateRule>[0]): string[] {
  const paths: string[] = [];

  const walkOperand = (operand: unknown): void => {
    if (typeof operand !== 'object' || operand === null) return;
    const node = operand as { source?: string; path?: string; args?: unknown[] };
    if (node.source === 'field' && typeof node.path === 'string') paths.push(node.path);
    for (const arg of node.args ?? []) walkOperand(arg);
  };

  const walkNode = (value: unknown): void => {
    if (typeof value !== 'object' || value === null) return;
    const node = value as {
      kind?: string;
      children?: unknown[];
      left?: unknown;
      args?: unknown[];
    };

    if (node.kind === 'group') {
      for (const child of node.children ?? []) walkNode(child);
      return;
    }
    if (node.kind === 'condition') {
      walkOperand(node.left);
      for (const arg of node.args ?? []) walkOperand(arg);
    }
  };

  walkNode((rule as { when?: unknown }).when);
  return paths;
}
