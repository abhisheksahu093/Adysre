import { getFormatter, getLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, Check, Send, X } from 'lucide-react';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { METHOD_TONES, STATUS_TONES, statusClass } from '@/modules/api-studio/constants/http';
import { toneSoft, toneText } from '@/modules/api-studio/constants/tone';
import { formatBytes, formatDuration } from '@/modules/api-studio/utils/format';
import { runAssertions } from '@/modules/api-studio/utils/assertions';
import {
  API_STUDIO_CAPABILITIES,
  API_STUDIO_PREVIEW,
  API_STUDIO_ROUTE,
  API_STUDIO_STATS,
  PREVIEW_ASSERTIONS,
  PREVIEW_RESPONSE,
} from '@/data/api-studio';
import { highlight } from '@/lib/highlight';
import { CTA_ARROW, ctaClass } from './cta';
import { WorkbenchSection } from './workbench/section';
import { Hud } from './workbench/panel';

/**
 * "API Studio" - the home-page pitch for the self-hosted HTTP client.
 *
 * A stylised preview of the workspace, in the spirit of the hero's
 * `WorkspacePreview`: it is not a live request runner, and it does not pretend
 * to be. What it refuses to do is INVENT anything the module already decides.
 * The method pill and the status pill take their tone from the studio's own
 * `METHOD_TONES` / `STATUS_TONES`, the time and size are formatted by the
 * studio's own `formatBytes` / `formatDuration`, and the three checks under the
 * response are evaluated HERE by the studio's own assertion engine against the
 * fixture response - so a change to how a 201 is coloured, a size is rounded or
 * an assertion is judged reaches this section with everything else.
 *
 * The figures below it are counted from the module's own constants
 * (`data/api-studio.ts`), so the page cannot claim an auth scheme that does not
 * exist.
 *
 * Server Component: assertions are pure and synchronous, and the two code
 * panes are highlighted at render, so the browser gets no part of this.
 */

/** Builder tabs, in the order the studio shows them. */
const BUILDER_TABS = ['params', 'headers', 'body', 'auth', 'tests'] as const;

/** Outcome → the icon and tone the row wears. Never a colour literal. */
const OUTCOME_TONE = {
  passed: { tone: 'success', icon: Check },
  failed: { tone: 'danger', icon: X },
  errored: { tone: 'danger', icon: X },
  skipped: { tone: 'muted', icon: X },
} as const;

export async function ApiStudioSection() {
  const t = await getTranslations('landing.apiStudio');
  const tStudio = await getTranslations('apiStudio');
  const locale = await getLocale();
  const format = await getFormatter();

  const { request, nodes, activeId, collection, environment } = API_STUDIO_PREVIEW;

  const [requestBody, responseBody] = await Promise.all([
    highlight(request.body, 'json'),
    highlight(PREVIEW_RESPONSE.body, 'json'),
  ]);

  // The studio's engine, on the studio's fixture. Whatever it answers is what
  // the strip shows, which is why nothing here counts passes by hand.
  const run = runAssertions(PREVIEW_ASSERTIONS, PREVIEW_RESPONSE, activeId);

  const methodTone = METHOD_TONES[request.method];
  const statusTone = STATUS_TONES[statusClass(PREVIEW_RESPONSE.status)];

  /** Row counts the builder tabs carry, keyed the same way the tabs are. */
  const tabCounts: Partial<Record<(typeof BUILDER_TABS)[number], number>> = {
    params: request.params,
    headers: request.headers,
    tests: PREVIEW_ASSERTIONS.length,
  };

  return (
    <WorkbenchSection label={t('badge')} title={t('title')} description={t('subtitle')}>
      {/* The studio, docked. Same construction as the rules panel so the two
          flagship previews read as one family. */}
      <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-[0_1px_2px_rgb(0_0_0/0.04),0_20px_50px_-36px_rgb(0_0_0/0.6)]">

            {/* Window bar: the open tab, and the environment every `{{variable}}`
                below resolves against. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-muted/40 px-4 py-3">
              <span aria-hidden className="flex shrink-0 items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
              </span>

              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1">
                <span
                  className={cn(
                    'rounded px-1.5 font-mono text-[10px] font-semibold uppercase',
                    toneSoft(methodTone),
                  )}
                >
                  {request.method}
                </span>
                <span className="text-xs font-medium">
                  {nodes.find((node) => node.id === activeId)?.name}
                </span>
              </span>

              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                {environment}
              </span>
            </div>

            <div className="grid lg:grid-cols-[13rem_1fr]">
              {/* Collection rail. Hidden on phones, where the request itself is
                  the whole story and 13rem of tree is not. */}
              <div className="hidden flex-col gap-1 border-r border-border bg-muted/20 p-3 lg:flex">
                <p className="px-1.5 pb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {tStudio('sidebar.collections')}
                </p>
                <p className="truncate px-1.5 py-1 text-xs font-medium">{collection}</p>
                <ul className="flex flex-col gap-0.5">
                  {nodes.map((node) => (
                    <li key={node.id}>
                      <span
                        className={cn(
                          'flex items-center gap-2 rounded-md px-1.5 py-1.5',
                          node.id === activeId && 'bg-background ring-1 ring-inset ring-border',
                        )}
                      >
                        <span
                          className={cn(
                            'w-11 shrink-0 rounded px-1 text-center font-mono text-[10px] font-semibold uppercase',
                            toneSoft(METHOD_TONES[node.method]),
                          )}
                        >
                          {node.method}
                        </span>
                        <span
                          className={cn(
                            'truncate text-xs',
                            node.id === activeId ? 'text-foreground' : 'text-muted-foreground',
                          )}
                        >
                          {node.name}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                {/* The request bar: method, URL with its unresolved variable,
                    and the one button the whole module exists for. */}
                <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
                  <span
                    className={cn(
                      'rounded-md border border-border px-2.5 py-1.5 font-mono text-xs font-semibold',
                      toneText(methodTone),
                    )}
                  >
                    {request.method}
                  </span>

                  <span className="flex min-w-0 flex-1 items-center overflow-hidden rounded-md border border-border bg-background/60 px-3 py-1.5 font-mono text-xs">
                    {request.url.map((segment) => (
                      <span
                        key={segment.text}
                        className={cn(
                          segment.variable
                            ? 'rounded bg-accent/10 px-1 text-accent'
                            : 'truncate text-foreground',
                        )}
                      >
                        {segment.text}
                      </span>
                    ))}
                  </span>

                  <span
                    className={cn(
                      buttonVariants({ size: 'sm' }),
                      // Part of the preview, not a real control: it takes the
                      // filled treatment so it matches the Send button in the
                      // studio, and nothing else.
                      'cta cta-solid pointer-events-none gap-1.5',
                    )}
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden />
                    {tStudio('request.send')}
                  </span>
                </div>

                {/* Builder tabs, with the row counts a real request carries. */}
                <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-3 py-2">
                  {BUILDER_TABS.map((tab) => {
                    const count = tabCounts[tab];

                    return (
                      <span
                        key={tab}
                        className={cn(
                          'inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs',
                          tab === 'body'
                            ? 'bg-muted font-medium text-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        {tStudio(`request.${tab}`)}
                        {count !== undefined && (
                          <span className="rounded-full bg-primary/10 px-1.5 font-mono text-[10px] text-primary">
                            {format.number(count)}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>

                <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
                  {/* What goes out. */}
                  <div className="min-w-0">
                    <p className="border-b border-border/60 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {tStudio('request.body')}
                    </p>
                    <div
                      className="shiki-code code-inset overflow-hidden p-4 text-[11px] leading-relaxed"
                      // Shiki output, generated here from our own fixture.
                      dangerouslySetInnerHTML={{ __html: requestBody }}
                    />
                  </div>

                  {/* What comes back. */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-4 py-2">
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold',
                          toneSoft(statusTone),
                        )}
                      >
                        {format.number(PREVIEW_RESPONSE.status)} {PREVIEW_RESPONSE.statusText}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {tStudio('response.time')} {formatDuration(PREVIEW_RESPONSE.timings.total, locale)}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {tStudio('response.size')} {formatBytes(PREVIEW_RESPONSE.size.total, locale)}
                      </span>
                    </div>
                    <div
                      className="shiki-code code-inset overflow-hidden p-4 text-[11px] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: responseBody }}
                    />
                  </div>
                </div>

                {/* The checks, as the engine answered them. */}
                <div className="flex flex-col gap-2 border-t border-border bg-muted/20 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {tStudio('tests.assertions')}
                    <span className="ml-2 text-success">
                      {format.number(run.passed)}/{format.number(run.results.length)}
                    </span>
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {run.results.map((result) => {
                      const { tone, icon: Icon } = OUTCOME_TONE[result.outcome];

                      return (
                        <li key={result.id} className="flex items-center gap-2">
                          <span
                            className={cn(
                              'grid h-4 w-4 shrink-0 place-items-center rounded-full',
                              toneSoft(tone),
                            )}
                          >
                            <Icon className="h-2.5 w-2.5" aria-hidden />
                          </span>
                          <span className="truncate font-mono text-[11px] text-muted-foreground">
                            {result.description}
                          </span>
                          <span aria-hidden className="h-px flex-1 bg-border" />
                          <span className={cn('shrink-0 font-mono text-[11px]', toneText(tone))}>
                            {result.outcome}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
      </div>

      {/* Counted from the module, never typed by hand. */}
      <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        {API_STUDIO_STATS.map((stat) => (
          <div key={stat.id} className="flex flex-col gap-1 bg-panel px-4 py-3.5">
            <dd className="font-hud text-[19px] font-medium leading-none tabular-nums">
              {format.number(stat.value)}
            </dd>
            <dt>
              <Hud>{t(`stats.${stat.id}`)}</Hud>
            </dt>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link className={ctaClass({ size: 'sm', className: 'gap-1.5' })} href={API_STUDIO_ROUTE}>
          {t('cta')}
          <ArrowRight aria-hidden className={cn('h-4 w-4', CTA_ARROW)} />
        </Link>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {API_STUDIO_CAPABILITIES.map(({ id, icon: Icon }) => (
            <li key={id} className="inline-flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              <Hud>{t(`capabilities.${id}`)}</Hud>
            </li>
          ))}
        </ul>
      </div>
    </WorkbenchSection>
  );
}
