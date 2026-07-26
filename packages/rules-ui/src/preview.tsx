'use client';

import { describeRule, type RenderedLine, type Segment } from '@adysre/rules-renderer';
import type { RuleOutcome } from '@adysre/rules-types';
import { Badge, cn } from 'adysre';
import { useMemo } from 'react';
import { useBuilder } from './context.tsx';
import { DiagnosticList } from './diagnostics.tsx';

export interface RulePreviewProps {
  /** The result of running the rule against sample data, when there is one. */
  outcome?: RuleOutcome | undefined;
  className?: string;
}

/**
 * The rule, in a sentence somebody can check.
 *
 * Rendered from the SEGMENTS rather than from `.text`, which is the reason the
 * renderer produces structure first: a string would be enough to print and
 * useless for what this actually does - highlight the field being edited,
 * colour the value that decided a verdict, and let a click on a line select the
 * node it describes. None of that is recoverable from prose afterwards.
 */
export function RulePreview({ outcome, className }: RulePreviewProps): React.JSX.Element {
  const { rule, registry, fields, labels, actions, selectedId } = useBuilder();

  const described = useMemo(
    () =>
      describeRule(rule, {
        plugins: registry,
        // Real labels where a provider offered one; the renderer humanises the
        // path itself for everything else.
        fields: Object.fromEntries(fields.map((field) => [field.path, field.label])),
      }),
    [rule, registry, fields],
  );

  const verdicts = useMemo(
    () => new Map((outcome?.trace ?? []).map((event) => [event.nodeId, event.verdict])),
    [outcome],
  );

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-foreground">{labels.preview}</h3>
        {outcome !== undefined && (
          <Badge
            className={outcome.verdict === 'errored' ? 'text-danger' : undefined}
            variant={
              outcome.verdict === 'matched'
                ? 'success'
                : outcome.verdict === 'errored'
                  ? 'warning'
                  : 'outline'
            }
          >
            {labels.verdicts[outcome.verdict]}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-0.5 rounded-md border border-border bg-muted/30 p-3">
        {described.lines.map((line, index) => (
          <PreviewLine
            key={line.nodeId ?? `${line.role}:${String(index)}`}
            line={line}
            selected={line.nodeId !== undefined && line.nodeId === selectedId}
            verdict={line.nodeId === undefined ? undefined : verdicts.get(line.nodeId)}
            onSelect={
              line.nodeId === undefined ? undefined : () => actions.select(line.nodeId ?? null)
            }
          />
        ))}
      </div>

      {outcome !== undefined && <DiagnosticList diagnostics={outcome.diagnostics} />}
    </div>
  );
}

function PreviewLine({
  line,
  selected,
  verdict,
  onSelect,
}: {
  line: RenderedLine;
  selected: boolean;
  verdict: string | undefined;
  onSelect: (() => void) | undefined;
}): React.JSX.Element {
  const content = (
    <>
      {line.segments.map((segment, index) => (
        <SegmentText key={index} segment={segment} />
      ))}
    </>
  );

  const className = cn(
    'rounded px-1 py-0.5 text-left text-sm',
    line.role === 'title' && 'font-semibold text-foreground',
    line.role === 'heading' && 'text-muted-foreground',
    line.role === 'action' && 'text-foreground',
    selected && 'bg-primary/10',
    // The trace says which branch actually ran, and a line the fast path never
    // reached is not a line that passed.
    verdict === 'matched' && 'text-success',
    verdict === 'unmatched' && 'text-muted-foreground',
    verdict === 'errored' && 'text-danger',
  );

  const style = { paddingLeft: `${String(line.depth * 1.25)}rem` };

  // Only the lines that DESCRIBE a node are clickable. Making the whole preview
  // interactive would put focus stops on headings that go nowhere.
  return onSelect === undefined ? (
    <p className={className} style={style}>
      {content}
    </p>
  ) : (
    <button className={className} style={style} type="button" onClick={onSelect}>
      {content}
    </button>
  );
}

function SegmentText({ segment }: { segment: Segment }): React.JSX.Element {
  switch (segment.type) {
    case 'field':
      return (
        <span className="font-medium text-foreground" title={segment.path}>
          {segment.text}
        </span>
      );
    case 'variable':
      return <span className="font-medium text-accent">{segment.text}</span>;
    case 'value':
      return <span className="font-medium text-primary">{segment.text}</span>;
    case 'function':
      return <span className="text-accent">{segment.text}</span>;
    case 'unknown':
      return (
        <span className="text-danger" title={segment.reason}>
          {segment.text}
        </span>
      );
    default:
      return <span>{segment.text}</span>;
  }
}
