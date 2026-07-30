import { getFormatter, getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileJson2,
  MessageSquareText,
  Timer,
  Zap,
} from 'lucide-react';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import {
  builtinPlugins,
  createContext,
  createRegistry,
  evaluateRule,
  readPath,
  stringifyRule,
  type Verdict,
} from '@adysre/rules-core';
import { describeRule, type Segment } from '@adysre/rules-renderer';
import { EXAMPLES, registryFor } from '@adysre/rules-playground';
import { FUNCTION_COUNT, OPERATOR_COUNT, RULE_KIND_COUNT } from '@/data/rules-engine';
import { highlight } from '@/lib/highlight';
import { CTA_ARROW, ctaClass } from './cta';
import { WorkbenchSection } from './workbench/section';
import { Hud } from './workbench/panel';

/**
 * "Business Rules" — the home-page pitch.
 *
 * The section IS the product claim. The engine says the AST is the single
 * source of truth and everything else is a projection of it, so this shows one
 * rule three ways at once: the JSON, the sentence generated from it, and the
 * verdict from running it. All three are produced HERE, at build time, by the
 * real packages - the JSON by `stringifyRule`, the sentence by `describeRule`,
 * the verdict by `evaluateRule`, down to the milliseconds it took.
 *
 * Nothing is transcribed, so the panel cannot drift from the engine: change an
 * operator's wording and this section changes with it. A hand-written mock of
 * the same three panels would look identical today and be a lie by the next
 * release, which is the usual fate of a marketing screenshot.
 *
 * The three lanes live in ONE slab rather than three loose cards, because the
 * claim is that they are one artefact seen from three sides. The connectors
 * between them carry the direction of the projection, tree first.
 *
 * Server Component, and free: evaluation is synchronous and pure, so all three
 * lanes cost a few microseconds at render. Highlighting is Shiki, server-side,
 * so the browser receives coloured HTML and none of the grammar.
 */

/** Lane accents: a token pair per stage, so the eye can follow the flow. */
const LANE_TONE = {
  tree: 'bg-primary/10 text-primary ring-primary/20',
  words: 'bg-secondary/10 text-secondary ring-secondary/20',
  verdict: 'bg-success/10 text-success ring-success/20',
} as const;

/**
 * What actually produced each lane.
 *
 * The whole section rests on "these three panels are the same rule", so each
 * one signs its own work: the package a reader can install and the call that
 * made what they are looking at. Not decoration - it is the claim, checkable
 * against the imports at the top of this file.
 */
const LANE_SOURCE = {
  tree: { pkg: '@adysre/rules-core', fn: 'stringifyRule()' },
  words: { pkg: '@adysre/rules-renderer', fn: 'describeRule()' },
  verdict: { pkg: '@adysre/rules-core', fn: 'evaluateRule()' },
} as const;

/**
 * Sentence segments, styled by what they ARE.
 *
 * The renderer keeps structure precisely so a UI can do this: a field reads as
 * a name, a value as a literal, a computed operand as a call. Prose could not
 * be coloured this way after the fact.
 */
const SEGMENT_TONE: Record<Segment['type'], string> = {
  text: '',
  field: 'font-medium text-foreground',
  value: 'rounded bg-primary/10 px-1 font-mono text-[0.9em] text-primary',
  variable: 'rounded bg-secondary/10 px-1 font-mono text-[0.9em] text-secondary',
  function: 'rounded bg-accent/10 px-1 font-mono text-[0.9em] text-accent',
  unknown: 'italic text-muted-foreground',
};

/** Every verdict the executor can report, in token colours. */
const VERDICT_TONE: Record<Verdict, string> = {
  matched: 'text-success',
  unmatched: 'text-muted-foreground',
  skipped: 'text-muted-foreground/60',
  errored: 'text-danger',
};

/**
 * Nesting, as a guide rail rather than padding.
 *
 * Static classes because Tailwind only ships what it can see, and a map keeps
 * the depths a rule can reach on one screen; anything deeper reuses the last.
 */
const DEPTH_RAIL = ['', 'ml-1 border-l border-border pl-3', 'ml-4 border-l border-border pl-3'];

export async function RulesSection() {
  const t = await getTranslations('rules');
  const tHome = await getTranslations('landing.rules');
  const format = await getFormatter();

  // The playground's first example, which is the spec's own rule.
  const example = EXAMPLES[0];
  if (example === undefined) return null;

  const registry = registryFor(example);
  const sample = example.samples[0];

  const sentence = describeRule(example.rule, {
    plugins: registry,
    fields: Object.fromEntries(example.fields.map((field) => [field.path, field.label])),
  });

  const outcome =
    sample === undefined
      ? undefined
      : evaluateRule(
          createRegistry(builtinPlugins),
          example.rule,
          createContext(sample.subject, { now: example.now }),
        );

  // The whole document, highlighted. The lane fades out rather than scrolls, so
  // there is no line budget to guess at and no scrollbar across the page.
  const json = stringifyRule(example.rule);
  const code = await highlight(json, 'json');

  const applied = outcome?.actions[0];

  const lanes = [
    { id: 'tree', icon: FileJson2 },
    { id: 'words', icon: MessageSquareText },
    { id: 'verdict', icon: CheckCircle2 },
  ] as const;

  return (
    <WorkbenchSection label={tHome('badge')} title={t('title')} description={tHome('subtitle')}>
      {/* One rule, three ways, one panel. The lanes share a surface because
          they are one artefact seen from three sides, not three features. */}
      <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-[0_1px_2px_rgb(0_0_0/0.04),0_20px_50px_-36px_rgb(0_0_0/0.6)]">

            {/* Title bar: this is a FILE, and the numbers next to it are what
                running it actually cost. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-muted/40 px-4 py-3">
              <span aria-hidden className="flex shrink-0 items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
              </span>

              <span className="font-mono text-xs text-muted-foreground">
                {example.id}.rule.json
              </span>

              {/* Straight off the document: kind, lifecycle, version. */}
              <span className="hidden items-center gap-1.5 sm:flex">
                {[example.rule.kind, example.rule.status, `v${String(example.rule.version)}`].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {chip}
                    </span>
                  ),
                )}
              </span>

              {outcome !== undefined && (
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 font-mono text-[11px] text-success">
                  <Timer className="h-3 w-3" aria-hidden />
                  {format.number(outcome.ms, { maximumFractionDigits: 2 })} ms
                </span>
              )}
            </div>

            <div className="relative grid divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {lanes.map((lane, index) => {
                const Icon = lane.icon;

                return (
                  <div key={lane.id} className="relative flex min-w-0 flex-col">
                    <div className="flex items-center gap-2.5 border-b border-border/60 px-4 py-3">
                      <span
                        className={cn(
                          'grid h-7 w-7 shrink-0 place-items-center rounded-md ring-1 ring-inset',
                          LANE_TONE[lane.id],
                        )}
                      >
                        <Icon aria-hidden className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="truncate text-sm font-medium">{tHome(`panels.${lane.id}`)}</h3>
                      {/* The stage number carries the direction in every
                          language, so it needs no translation. */}
                      <span className="ml-auto font-mono text-[10px] tracking-widest text-muted-foreground/60">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="relative min-h-64 flex-1 lg:min-h-[23rem]">
                      {lane.id === 'tree' && (
                        <div className="absolute inset-0 overflow-hidden">
                          <div
                            // `shiki-code` styles the line numbers and the
                            // light/dark swap; `code-inset` drops the block's
                            // own surface so the lane fades instead of scrolls.
                            className="shiki-code code-inset p-4 text-[11px] leading-relaxed"
                            // Shiki output, generated here from our own example
                            // - nothing in it is user input.
                            dangerouslySetInnerHTML={{ __html: code }}
                          />
                          {/* The file keeps going; say so with light rather
                              than a scrollbar. */}
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent"
                          />
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-transparent"
                          />
                        </div>
                      )}

                      {lane.id === 'words' && (
                        <div className="flex flex-col gap-1.5 p-4">
                          {sentence.lines.map((line, position) => (
                            <p
                              key={line.nodeId ?? `${line.role}-${String(position)}`}
                              className={cn(
                                'text-sm leading-relaxed',
                                DEPTH_RAIL[Math.min(line.depth, DEPTH_RAIL.length - 1)] ?? '',
                                line.role === 'title' &&
                                  'text-base font-semibold text-balance text-foreground',
                                line.role === 'heading' && 'text-muted-foreground',
                                line.role === 'condition' && 'text-muted-foreground',
                                line.role === 'action' && 'font-medium text-foreground',
                              )}
                            >
                              {line.segments.map((segment, at) => (
                                <span key={at} className={SEGMENT_TONE[segment.type]}>
                                  {segment.text}
                                </span>
                              ))}
                            </p>
                          ))}
                        </div>
                      )}

                      {lane.id === 'verdict' && outcome !== undefined && sample !== undefined && (
                        <div className="flex h-full flex-col gap-4 p-4">
                          {/* What it ran against, read out of the sample by the
                              same path resolver the executor uses. */}
                          <dl className="flex flex-col gap-1">
                            <dt className="sr-only">{tHome('input')}</dt>
                            {example.fields.map((field) => {
                              const read = readPath(sample.subject, field.path);
                              if (!read.found) return null;

                              return (
                                <dd
                                  key={field.path}
                                  className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/40 px-2.5 py-1.5"
                                >
                                  <span className="truncate text-xs text-muted-foreground">
                                    {field.label}
                                  </span>
                                  <span className="shrink-0 font-mono text-xs font-medium text-foreground">
                                    {JSON.stringify(read.value)}
                                  </span>
                                </dd>
                              );
                            })}
                          </dl>

                          <div className="flex items-center gap-2">
                            <span className="rules-pulse relative inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success ring-1 ring-inset ring-success/30">
                              <CheckCircle2 aria-hidden className="h-4 w-4" />
                              {tHome('matched')}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                              {tHome('trace')}
                            </p>
                            <ul className="flex flex-col gap-1.5">
                              {outcome.trace.map((event) => (
                                <li key={event.nodeId} className="flex items-center gap-2">
                                  <span
                                    aria-hidden
                                    className={cn(
                                      'h-1.5 w-1.5 shrink-0 rounded-full bg-current',
                                      VERDICT_TONE[event.verdict],
                                    )}
                                  />
                                  <span className="truncate font-mono text-xs text-foreground">
                                    {event.operator ?? event.kind}
                                  </span>
                                  <span aria-hidden className="h-px flex-1 bg-border" />
                                  <span
                                    className={cn(
                                      'shrink-0 font-mono text-[11px]',
                                      VERDICT_TONE[event.verdict],
                                    )}
                                  >
                                    {event.verdict}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {applied !== undefined && (
                            <div className="mt-auto flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                              <Zap aria-hidden className="h-3.5 w-3.5 shrink-0 text-primary" />
                              <span className="text-xs text-muted-foreground">
                                {tHome('applied')}
                              </span>
                              <span className="ml-auto truncate font-mono text-xs font-medium text-primary">
                                {applied.type}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Each lane signs its own work. Package names and call
                        signatures are code, so they read the same in every
                        locale and need no key. */}
                    <div className="flex items-center gap-1.5 border-t border-border/60 bg-muted/20 px-4 py-2.5 font-mono text-[10px] text-muted-foreground">
                      <span className="truncate">{LANE_SOURCE[lane.id].pkg}</span>
                      <span aria-hidden className="text-muted-foreground/40">
                        /
                      </span>
                      <span className="shrink-0 text-foreground/70">{LANE_SOURCE[lane.id].fn}</span>
                    </div>

                    {/* Between the lanes on a wide screen, and nowhere on a
                        narrow one where they already read top to bottom. The
                        pulse travels left to right, which is the direction the
                        projection runs. */}
                    {index < lanes.length - 1 && (
                      <span
                        aria-hidden
                        className={cn(
                          'absolute -right-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-primary shadow-lg lg:grid',
                          'rules-pulse',
                          index === 1 && 'rules-pulse--late',
                        )}
                      >
                        <ChevronRight className="relative h-4 w-4" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
      </div>

      {/* The breadth behind the one example. Counts derive from the registry
          (Rule 6), and are locale-formatted like every other figure. */}
      <dl className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
        {[
          { id: 'operators', value: OPERATOR_COUNT },
          { id: 'functions', value: FUNCTION_COUNT },
          { id: 'kinds', value: RULE_KIND_COUNT },
        ].map((stat) => (
          <div key={stat.id} className="flex flex-col gap-1 bg-panel px-4 py-3.5">
            <dd className="font-hud text-[19px] font-medium leading-none tabular-nums">
              {stat.value}
            </dd>
            <dt>
              <Hud>{t(`stats.${stat.id}`)}</Hud>
            </dt>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        <Link className={ctaClass({ size: 'sm', className: 'gap-1.5' })} href="/rules">
          {tHome('cta')}
          <ArrowRight aria-hidden className={cn('h-4 w-4', CTA_ARROW)} />
        </Link>
      </div>
    </WorkbenchSection>
  );
}
