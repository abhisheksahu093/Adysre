'use client';

import { createContext as createEvaluationContext, stringifyRule } from '@adysre/rules-core';
import { RuleDebugger, useDebugSession } from '@adysre/rules-devtools';
import type { RuleDocument, ThemePlugin } from '@adysre/rules-types';
import { RuleBuilder } from '@adysre/rules-ui';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Select, cn } from 'adysre';
import { useMemo, useState } from 'react';
import { EXAMPLES, exampleById } from './examples/index.ts';
import type { Example, ExampleSample } from './types.ts';
import { registryFor } from './verify.ts';

export interface RulePlaygroundProps {
  /** Which examples to offer. All of them by default. */
  examples?: readonly Example[];
  /** Which one to open with. The first otherwise. */
  initialExampleId?: string;
  theme?: ThemePlugin | undefined;
  className?: string;
}

/**
 * The whole ecosystem, running.
 *
 * Builder, debugger, verdict and JSON over one rule, with an example picker and
 * a sample picker above them. Everything a reader needs to answer "what does
 * this engine actually do" without installing anything.
 *
 * Choosing an example REPLACES the document, which is the one case
 * `RuleBuilder` is meant to reload on - a different rule, so a fresh history.
 * Editing then behaves normally: the builder recognises its own document coming
 * back and keeps the undo stack.
 *
 * The clock comes from the example and never from `Date.now()`. Half of these
 * rules read a date, and a moving clock would make a declared verdict a lie on
 * a schedule and the server and browser renders disagree.
 */
export function RulePlayground({
  examples = EXAMPLES,
  initialExampleId,
  theme,
  className,
}: RulePlaygroundProps): React.JSX.Element {
  const first = examples[0];
  const [exampleId, setExampleId] = useState(initialExampleId ?? first?.id ?? '');

  const example = useMemo(
    () => examples.find((entry) => entry.id === exampleId) ?? exampleById(exampleId) ?? first,
    [examples, exampleId, first],
  );

  // Keyed by example, so switching one resets the edited copy back to what the
  // example says rather than carrying somebody's edits into a different lesson.
  const [rule, setRule] = useState<RuleDocument | null>(null);
  const [sampleId, setSampleId] = useState<string | null>(null);

  const active: RuleDocument | undefined = rule ?? example?.rule;
  const sample: ExampleSample | undefined =
    example?.samples.find((entry) => entry.id === sampleId) ?? example?.samples[0];

  const registry = useMemo(
    () => (example === undefined ? undefined : registryFor(example)),
    [example],
  );

  const context = useMemo(
    () =>
      example === undefined || sample === undefined
        ? undefined
        : createEvaluationContext(sample.subject, {
            now: example.now,
            ...(sample.variables === undefined ? {} : { variables: sample.variables }),
          }),
    [example, sample],
  );

  const select = (id: string): void => {
    setExampleId(id);
    // Both cleared: a sample belongs to its example, and carrying an edited
    // rule across would show one example's logic under another's title.
    setRule(null);
    setSampleId(null);
  };

  if (example === undefined || registry === undefined || context === undefined) {
    return <p className="text-sm text-muted-foreground">There are no examples to show.</p>;
  }

  return (
    <PlaygroundBody
      className={className}
      context={context}
      example={example}
      registry={registry}
      rule={active ?? example.rule}
      sample={sample}
      theme={theme}
      onPickExample={select}
      onPickSample={setSampleId}
      onRuleChange={setRule}
      examples={examples}
    />
  );
}

/**
 * Split out so the hooks below run unconditionally.
 *
 * `useDebugSession` cannot sit after the early return above - a hook called in
 * one render and not the next is the bug the rules-of-hooks rule exists for,
 * and "there are no examples" is a real state a host can put this in.
 */
function PlaygroundBody({
  example,
  examples,
  registry,
  rule,
  sample,
  context,
  theme,
  className,
  onPickExample,
  onPickSample,
  onRuleChange,
}: {
  example: Example;
  examples: readonly Example[];
  registry: ReturnType<typeof registryFor>;
  rule: RuleDocument;
  sample: ExampleSample | undefined;
  context: ReturnType<typeof createEvaluationContext>;
  theme: ThemePlugin | undefined;
  className: string | undefined;
  onPickExample: (id: string) => void;
  onPickSample: (id: string) => void;
  onRuleChange: (rule: RuleDocument) => void;
}): React.JSX.Element {
  const [showJson, setShowJson] = useState(false);
  const session = useDebugSession(registry, rule, context);

  const edited = rule !== example.rule;
  const asExpected = sample !== undefined && session.outcome.verdict === sample.expect;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Example
            <Select
              className="w-72"
              value={example.id}
              onChange={(event) => onPickExample(event.target.value)}
            >
              {examples.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </Select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Run against
            <Select
              className="w-72"
              value={sample?.id ?? ''}
              onChange={(event) => onPickSample(event.target.value)}
            >
              {example.samples.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </Select>
          </label>

          {/*
           * Whether the engine still answers what the example claims. It always
           * does until somebody edits the rule - at which point this is the
           * point of the sandbox, and saying "unmatched, and the example said
           * matched" is more use than hiding the difference.
           */}
          {sample !== undefined && (
            <Badge variant={asExpected ? 'success' : 'warning'}>
              {asExpected
                ? `As documented: ${sample.expect}`
                : `Now ${session.outcome.verdict}, documented as ${sample.expect}`}
            </Badge>
          )}

          {edited && <Badge variant="outline">Edited</Badge>}
        </div>

        <p className="text-sm text-muted-foreground">{example.blurb}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <RuleBuilder
            now={example.now}
            registry={registry}
            rule={rule}
            sample={sample?.subject}
            theme={theme}
            onChange={onRuleChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Why this answer</CardTitle>
        </CardHeader>
        <CardContent>
          <RuleDebugger session={session} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">The rule, as JSON</CardTitle>
          <Button size="sm" type="button" variant="outline" onClick={() => setShowJson(!showJson)}>
            {showJson ? 'Hide' : 'Show'}
          </Button>
        </CardHeader>
        {showJson && (
          <CardContent>
            <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 font-mono text-xs">
              {stringifyRule(rule)}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
