import { builtinPlugins, createContext, createRegistry, type Registry } from '@adysre/rules-core';
import { debugRule } from '@adysre/rules-devtools';
import type { FieldProviderPlugin, RuleOutcome } from '@adysre/rules-types';
import type { Example, ExampleSample } from './types.ts';

/**
 * Examples that check themselves.
 *
 * Same idea as the storage conformance suite, aimed at a different failure: an
 * example is documentation, and documentation is the part of a system nothing
 * else tests. A rule and some data with a screenshot beside them looks right on
 * the day it is written, and the only thing checking it afterwards is a reader
 * who assumes it works.
 *
 * So every sample declares its verdict, and this runs them. If a comparison
 * rule or an operator ever changes meaning, the example that taught it fails in
 * CI rather than teaching the wrong thing to everybody who reads it next.
 *
 * Framework-free, like the conformance suite, so it runs in a unit test, in a
 * docs build, or in a deployment checking the examples it ships.
 */

/** The registry an example needs: the built-ins, plus its own fields and actions. */
export function registryFor(example: Example): Registry {
  const fields: FieldProviderPlugin = {
    id: `playground.${example.id}`,
    fields: () => [...example.fields],
  };

  return createRegistry(builtinPlugins, {
    fields: [fields],
    actions: [...example.actions],
  });
}

/** Run one sample exactly as the playground runs it. */
export function runSample(example: Example, sample: ExampleSample): RuleOutcome {
  return debugRule(
    registryFor(example),
    example.rule,
    createContext(sample.subject, {
      now: example.now,
      ...(sample.variables === undefined ? {} : { variables: sample.variables }),
    }),
  ).outcome;
}

export interface ExampleFinding {
  exampleId: string;
  sampleId: string;
  /** What was wrong, in a sentence somebody can act on. */
  problem: string;
}

export function verifyExample(example: Example): ExampleFinding[] {
  const findings: ExampleFinding[] = [];
  const registry = registryFor(example);

  const fail = (sampleId: string, problem: string): void => {
    findings.push({ exampleId: example.id, sampleId, problem });
  };

  if (example.samples.length === 0) {
    fail('', 'has no samples, so nothing about it is checked');
  }

  for (const sample of example.samples) {
    const session = debugRule(
      registry,
      example.rule,
      createContext(sample.subject, {
        now: example.now,
        ...(sample.variables === undefined ? {} : { variables: sample.variables }),
      }),
    );

    if (session.outcome.verdict !== sample.expect) {
      fail(sample.id, `answered ${session.outcome.verdict}, and the example says ${sample.expect}`);
    }

    if (sample.expectActions !== undefined) {
      const applied = session.outcome.actions.map((action) => action.type);
      if (applied.join(',') !== sample.expectActions.join(',')) {
        fail(
          sample.id,
          `applied [${applied.join(', ')}], and the example says [${sample.expectActions.join(', ')}]`,
        );
      }
    }

    // The exhaustive run, which is what makes a hidden fault assertable at all.
    const hidden = session.comparison.hiddenErrors.length > 0;
    if (sample.expectHidden === true && !hidden) {
      fail(sample.id, 'was supposed to hide a fault behind a short circuit, and hides nothing');
    }
    if (sample.expectHidden !== true && hidden) {
      // An unannounced hidden error is a broken example rather than a lesson.
      fail(sample.id, 'hides a fault behind a short circuit that the example never mentions');
    }
  }

  return findings;
}

export function verifyExamples(examples: readonly Example[]): ExampleFinding[] {
  return examples.flatMap((example) => verifyExample(example));
}

/** The findings, as lines. Empty when every example does what it claims. */
export function exampleReport(findings: readonly ExampleFinding[]): string {
  return findings
    .map((finding) => `${finding.exampleId}/${finding.sampleId}: ${finding.problem}`)
    .join('\n');
}
