import { getTranslations } from 'next-intl/server';
import { ArrowRight, CheckCircle2, FileJson2, GitBranch, MessageSquareText } from 'lucide-react';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import {
  builtinPlugins,
  createContext,
  createRegistry,
  evaluateRule,
  stringifyRule,
} from '@adysre/rules-core';
import { describeRule } from '@adysre/rules-renderer';
import { EXAMPLES, registryFor } from '@adysre/rules-playground';
import { FUNCTION_COUNT, OPERATOR_COUNT, RULE_KIND_COUNT } from '@/data/rules-engine';
import { SectionHeading } from './section-heading';

/**
 * "Business Rules" — the home-page pitch.
 *
 * The section IS the product claim. The engine says the AST is the single
 * source of truth and everything else is a projection of it, so this shows one
 * rule three ways at once: the JSON, the sentence generated from it, and the
 * verdict from running it. All three are produced HERE, at build time, by the
 * real packages - the JSON by `stringifyRule`, the sentence by `describeRule`,
 * the verdict by `evaluateRule`.
 *
 * Nothing is transcribed, so the panel cannot drift from the engine: change an
 * operator's wording and this section changes with it. A hand-written mock of
 * the same three panels would look identical today and be a lie by the next
 * release, which is the usual fate of a marketing screenshot.
 *
 * Server Component, and free: evaluation is synchronous and pure, so all three
 * panels cost a few microseconds at render.
 */
export async function RulesSection() {
  const t = await getTranslations('rules');
  const tHome = await getTranslations('landing.rules');

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

  // Trimmed to the condition tree: the whole document is forty lines, and the
  // point here is the shape rather than the metadata.
  const json = stringifyRule(example.rule).split('\n').slice(0, 18).join('\n');

  const panels = [
    { id: 'tree', icon: FileJson2 },
    { id: 'words', icon: MessageSquareText },
    { id: 'verdict', icon: CheckCircle2 },
  ] as const;

  return (
    <section className="relative overflow-hidden border-y border-border bg-muted/20">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={
            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="h-4 w-4" aria-hidden />
              {tHome('badge')}
            </span>
          }
          title={t('title')}
          subtitle={tHome('subtitle')}
          className="max-w-3xl"
        />

        {/* One rule, three ways. The arrows carry the claim: everything is a
            projection of the tree, and the tree is the only source of truth. */}
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {panels.map((panel, index) => {
            const Icon = panel.icon;

            return (
              <div key={panel.id} className="relative flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Icon aria-hidden className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">{tHome(`panels.${panel.id}`)}</h3>
                </div>

                <div className="min-h-56 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm">
                  {panel.id === 'tree' && (
                    <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground">
                      {json}
                    </pre>
                  )}

                  {panel.id === 'words' && (
                    <div className="flex flex-col gap-1">
                      {sentence.lines.map((line, position) => (
                        <p
                          key={line.nodeId ?? `${line.role}-${String(position)}`}
                          className={cn(
                            'text-sm',
                            line.role === 'title' && 'font-medium text-foreground',
                            line.role !== 'title' && 'text-muted-foreground',
                          )}
                          style={{ paddingLeft: `${String(line.depth * 0.9)}rem` }}
                        >
                          {line.segments.map((segment, at) => (
                            <span
                              key={at}
                              className={cn(
                                segment.type === 'field' && 'font-medium text-foreground',
                                segment.type === 'value' && 'font-medium text-primary',
                              )}
                            >
                              {segment.text}
                            </span>
                          ))}
                        </p>
                      ))}
                    </div>
                  )}

                  {panel.id === 'verdict' && outcome !== undefined && (
                    <div className="flex flex-col gap-3">
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                        <CheckCircle2 aria-hidden className="h-4 w-4" />
                        {tHome('matched')}
                      </span>

                      <dl className="flex flex-col gap-1.5 font-mono text-xs text-muted-foreground">
                        {outcome.trace.slice(0, 4).map((event) => (
                          <div
                            key={event.nodeId}
                            className="flex items-center justify-between gap-3"
                          >
                            <dt className="truncate">{event.operator ?? event.kind}</dt>
                            <dd className={cn(event.verdict === 'matched' && 'text-success')}>
                              {event.verdict}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>

                {/* Between the panels on a wide screen, and nowhere on a narrow
                    one where the panels already read top to bottom. */}
                {index < panels.length - 1 && (
                  <ArrowRight
                    aria-hidden
                    className="absolute -right-3 top-32 hidden h-5 w-5 text-muted-foreground lg:block"
                  />
                )}
              </div>
            );
          })}
        </div>

        <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4">
          {[
            { id: 'operators', value: OPERATOR_COUNT },
            { id: 'functions', value: FUNCTION_COUNT },
            { id: 'kinds', value: RULE_KIND_COUNT },
          ].map((stat) => (
            <div key={stat.id} className="text-center">
              <dt className="text-2xl font-semibold tabular-nums">{stat.value}</dt>
              <dd className="text-xs text-muted-foreground">{t(`stats.${stat.id}`)}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex justify-center">
          <Link className={cn(buttonVariants({ size: 'lg' }), 'gap-2')} href="/rules">
            {tHome('cta')}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
