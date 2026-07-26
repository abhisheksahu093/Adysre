'use client';

import type { Registry } from '@adysre/rules-core';
import type { EvaluationContext, EvaluationOptions, RuleDocument } from '@adysre/rules-types';
import { Badge, Button, cn } from 'adysre';
import { useMemo, useState } from 'react';
import { isSingleCause } from './decide.ts';
import { Findings } from './findings.tsx';
import { previewDuration } from './format.ts';
import { debuggerLabelsWith, type DebuggerLabels } from './labels.ts';
import { debugRule, type DebugSession } from './session.ts';
import { TraceView } from './trace-view.tsx';

/**
 * A debugging session, recomputed as the rule changes.
 *
 * A `useMemo` and not a request, because evaluation is synchronous and pure.
 * Two runs of a rule cost microseconds, so there is no reason to make a host
 * decide when to refresh a debugger.
 */
export function useDebugSession(
  registry: Registry,
  rule: RuleDocument,
  context: EvaluationContext,
  options?: EvaluationOptions,
): DebugSession {
  return useMemo(
    () => debugRule(registry, rule, context, options),
    [registry, rule, context, options],
  );
}

export interface RuleDebuggerProps {
  session: DebugSession;
  labels?: Partial<DebuggerLabels> | undefined;
  onSelectNode?: ((nodeId: string) => void) | undefined;
  className?: string;
}

/**
 * Why the rule answered what it answered.
 *
 * Takes a session rather than computing one, so a host that already ran the
 * rule for a preview does not run it twice more to explain it, and so this
 * component stays a pure function of what it is given.
 *
 * The order is the order somebody asks in: the verdict, then which row produced
 * it, then anything the fast path hid, then the whole trace for when the
 * summary is not enough.
 */
export function RuleDebugger({
  session,
  labels,
  onSelectNode,
  className,
}: RuleDebuggerProps): React.JSX.Element {
  const text = useMemo(() => debuggerLabelsWith(labels), [labels]);
  const [showSkipped, setShowSkipped] = useState(false);

  const { outcome, decision, comparison } = session;
  const single = isSingleCause(decision);

  // Showing the exhaustive tree is what makes a skipped branch inspectable.
  // It is not the default, because the tree somebody is asking about is the one
  // that really ran.
  const tree = showSkipped ? session.fullTree : session.tree;

  return (
    <section className={cn('flex flex-col gap-4 text-foreground', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-medium">{text.title}</h3>
        <Badge
          variant={
            outcome.verdict === 'matched'
              ? 'success'
              : outcome.verdict === 'errored'
                ? 'warning'
                : 'outline'
          }
        >
          {text.verdicts[outcome.verdict]}
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">
          {text.duration} {previewDuration(outcome.ms)}
        </span>
      </div>

      {/*
       * The sentence a business user came for. It names a row only when one
       * really settled it; `all` matching means every condition mattered, and
       * pointing at the last of them would be a confident lie.
       */}
      <p className="text-sm text-muted-foreground">
        {single ? (
          <>
            {text.decidedBy}{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              {decision.node.node.kind === 'condition'
                ? decision.node.node.operator
                : text.combinators[decision.node.node.combinator]}
            </code>{' '}
            {text.reasons[decision.reason]}
          </>
        ) : (
          text.reasons[decision.reason]
        )}
      </p>

      <Findings comparison={comparison} labels={text} />

      <div className="flex items-center gap-2">
        <Button
          disabled={comparison.skipped.length === 0}
          size="sm"
          type="button"
          variant="outline"
          onClick={() => setShowSkipped(!showSkipped)}
        >
          {showSkipped ? text.hideSkipped : text.showSkipped}
        </Button>
      </div>

      <TraceView
        decidedId={single ? decision.node.node.id : undefined}
        labels={text}
        tree={tree}
        onSelectNode={onSelectNode}
      />

      {outcome.diagnostics.length > 0 && (
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-medium text-muted-foreground">{text.diagnostics}</h4>
          <ul className="flex list-none flex-col gap-1 p-0">
            {outcome.diagnostics.map((diagnostic, index) => (
              <li
                key={`${diagnostic.code}:${String(index)}`}
                className={cn(
                  'text-xs',
                  diagnostic.severity === 'error' ? 'text-danger' : 'text-muted-foreground',
                )}
              >
                {diagnostic.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
