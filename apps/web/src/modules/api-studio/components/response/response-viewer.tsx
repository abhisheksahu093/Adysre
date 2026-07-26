'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AlertTriangle, Check, Copy, Loader2, ShieldAlert } from 'lucide-react';
import { cn } from 'adysre';
import type { ExecutionEntry } from '../../stores';
import { STATUS_TONES, statusClass } from '../../constants/http';
import { contentTypeOf, formatBytes, formatDuration, prettyPrint, previewKind } from '../../utils/format';
import { PanePanel, PaneTabs, type PaneTab } from '../pane-tabs';
import { TonePill, toneFill } from '../tone';

type ResponsePane = 'body' | 'headers' | 'cookies' | 'timings';
type BodyView = 'pretty' | 'raw' | 'preview';

/**
 * The response pane.
 *
 * Renders one of four states, and never blurs them together: nothing sent yet,
 * in flight, a failed exchange, a response. A failure is shown here rather than
 * as a toast because it is the ANSWER to what the user did, and it belongs
 * where the answer goes.
 */
export function ResponseViewer({ entry }: { entry: ExecutionEntry }) {
  const t = useTranslations('apiStudio');
  const locale = useLocale();
  const [pane, setPane] = useState<ResponsePane>('body');

  if (entry.status === 'idle') {
    return (
      <Centered>
        <p className="text-sm text-muted-foreground">{t('response.empty')}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t('response.emptyHint')}</p>
      </Centered>
    );
  }

  if (entry.status === 'sending') {
    return (
      <Centered>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
        <p className="mt-2 text-sm text-muted-foreground">{t('response.sending')}</p>
      </Centered>
    );
  }

  if (entry.status === 'cancelled') {
    return (
      <Centered>
        <p className="text-sm text-muted-foreground">{t('response.cancelled')}</p>
      </Centered>
    );
  }

  if (entry.status === 'error' || !entry.response) {
    const code = entry.error?.code ?? 'network';
    return (
      <Centered>
        <AlertTriangle className="h-5 w-5 text-danger" aria-hidden />
        <p className="mt-2 text-sm font-medium">{t(`errors.${code}`)}</p>
        {entry.error?.message && (
          <p className="mt-1 max-w-md text-xs text-muted-foreground">{entry.error.message}</p>
        )}
      </Centered>
    );
  }

  const response = entry.response;
  const panes: PaneTab<ResponsePane>[] = [
    { id: 'body', label: t('response.body') },
    { id: 'headers', label: t('response.headers'), count: response.headers.length },
    { id: 'cookies', label: t('response.cookies'), count: response.cookies.length },
    { id: 'timings', label: t('response.timings') },
  ];

  const tone = STATUS_TONES[statusClass(response.status)];

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border px-3 py-2 text-xs">
        <TonePill tone={tone} className="text-[11px]">
          {response.status} {response.statusText}
        </TonePill>
        <Metric label={t('response.time')} value={formatDuration(response.timings.total, locale)} />
        <Metric label={t('response.size')} value={formatBytes(response.size.total, locale)} />
        {response.redirects.length > 0 && (
          <Metric label={t('response.redirects')} value={String(response.redirects.length)} />
        )}
        {response.insecure && (
          <span className="inline-flex items-center gap-1 text-warning" title={t('response.insecureHint')}>
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
            {t('response.insecure')}
          </span>
        )}
        {response.truncated && (
          <span className="text-warning" title={t('response.truncatedHint')}>
            {t('response.truncated')}
          </span>
        )}
      </div>

      <PaneTabs
        tabs={panes}
        active={pane}
        onSelect={setPane}
        label={t('response.paneLabel')}
        className="border-b border-border px-2 py-1.5"
      />

      <div className="min-h-0 flex-1 overflow-auto">
        <PanePanel id="body" active={pane === 'body'} className="h-full">
          <ResponseBody response={response} />
        </PanePanel>

        <PanePanel id="headers" active={pane === 'headers'}>
          <HeaderTable rows={response.headers} empty={t('response.noHeaders')} />
        </PanePanel>

        <PanePanel id="cookies" active={pane === 'cookies'}>
          {response.cookies.length === 0 ? (
            <Empty>{t('response.noCookies')}</Empty>
          ) : (
            <table className="w-full text-xs">
              <thead className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">{t('response.cookieName')}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t('response.cookieValue')}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t('response.cookieDomain')}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{t('response.cookieFlags')}</th>
                </tr>
              </thead>
              <tbody>
                {response.cookies.map((cookie) => (
                  <tr key={`${cookie.domain}-${cookie.path}-${cookie.name}`} className="border-t border-border">
                    <td className="px-3 py-1.5 font-mono">{cookie.name}</td>
                    <td className="max-w-xs truncate px-3 py-1.5 font-mono">{cookie.value}</td>
                    <td className="px-3 py-1.5 font-mono text-muted-foreground">{cookie.domain}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">
                      {[
                        cookie.secure ? 'Secure' : null,
                        cookie.httpOnly ? 'HttpOnly' : null,
                        cookie.sameSite ? `SameSite=${cookie.sameSite}` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </PanePanel>

        <PanePanel id="timings" active={pane === 'timings'}>
          <Timings timings={response.timings} />
        </PanePanel>
      </div>
    </div>
  );
}

function ResponseBody({ response }: { response: NonNullable<ExecutionEntry['response']> }) {
  const t = useTranslations('apiStudio');
  const [view, setView] = useState<BodyView>('pretty');
  const [copied, setCopied] = useState(false);

  const contentType = contentTypeOf(response.headers);
  const kind = previewKind(contentType);
  const isText = response.bodyEncoding === 'utf8';

  const pretty = useMemo(
    () => (isText ? prettyPrint(response.body, contentType) : response.body),
    [isText, response.body, contentType],
  );

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(view === 'pretty' ? pretty : response.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1_500);
    } catch {
      // Clipboard permission denied. The body is selectable; nothing to say.
    }
  }

  const views: BodyView[] = kind ? ['pretty', 'raw', 'preview'] : ['pretty', 'raw'];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 px-3 py-1.5">
        <div className="flex items-center gap-1">
          {views.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              aria-pressed={view === option}
              className={cn(
                'rounded px-2 py-1 text-[11px] font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                view === option
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(`response.views.${option}`)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => void copy()}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
          {copied ? t('response.copied') : t('response.copy')}
        </button>
      </div>

      {response.body === '' ? (
        <Empty>{t('response.noBody')}</Empty>
      ) : view === 'preview' && kind ? (
        <Preview kind={kind} body={response.body} contentType={contentType} isText={isText} />
      ) : (
        <pre className="min-h-0 flex-1 overflow-auto px-3 pb-3 font-mono text-xs leading-relaxed">
          <code>{view === 'pretty' ? pretty : response.body}</code>
        </pre>
      )}
    </div>
  );
}

/**
 * Rendered previews.
 *
 * HTML goes into a sandboxed iframe with NO `allow-same-origin`: the response
 * came from somewhere else and must not be able to read this document, its
 * cookies or its storage. That also means the frame cannot run scripts against
 * us, which is the point.
 */
function Preview({
  kind,
  body,
  contentType,
  isText,
}: {
  kind: 'html' | 'image' | 'pdf';
  body: string;
  contentType: string | null;
  isText: boolean;
}) {
  const t = useTranslations('apiStudio');

  if (kind === 'image') {
    const source = isText
      ? `data:${contentType ?? 'image/svg+xml'};utf8,${encodeURIComponent(body)}`
      : `data:${contentType ?? 'image/png'};base64,${body}`;
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4">
        {/* A response body is arbitrary bytes, so next/image (which optimises
            known files at build time) does not apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={source} alt={t('response.previewAlt')} className="max-h-full max-w-full" />
      </div>
    );
  }

  if (kind === 'pdf') {
    return (
      <object
        data={`data:application/pdf;base64,${body}`}
        type="application/pdf"
        aria-label={t('response.previewAlt')}
        className="min-h-0 flex-1"
      >
        <Empty>{t('response.noPreview')}</Empty>
      </object>
    );
  }

  return (
    <iframe
      title={t('response.previewAlt')}
      srcDoc={body}
      sandbox=""
      className="min-h-0 flex-1 border-0 bg-background"
    />
  );
}

function HeaderTable({ rows, empty }: { rows: readonly { name: string; value: string }[]; empty: string }) {
  if (rows.length === 0) return <Empty>{empty}</Empty>;
  return (
    <dl className="divide-y divide-border text-xs">
      {rows.map((row, index) => (
        <div key={`${row.name}-${index}`} className="grid grid-cols-1 gap-1 px-3 py-1.5 sm:grid-cols-[14rem_1fr]">
          <dt className="font-mono font-medium text-muted-foreground">{row.name}</dt>
          <dd className="break-all font-mono">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The waterfall. Phases the runtime could not measure are absent, not zero. */
function Timings({ timings }: { timings: NonNullable<ExecutionEntry['response']>['timings'] }) {
  const t = useTranslations('apiStudio');
  const locale = useLocale();

  const phases = [
    { id: 'dns', value: timings.dns },
    { id: 'tcp', value: timings.tcp },
    { id: 'tls', value: timings.tls },
    { id: 'firstByte', value: timings.firstByte },
    { id: 'download', value: timings.download },
  ] as const;

  const total = Math.max(timings.total, 1);

  return (
    <div className="space-y-2 px-3 py-3 text-xs">
      {phases.map((phase) => (
        <div key={phase.id} className="grid grid-cols-[6rem_1fr_5rem] items-center gap-2">
          <span className="text-muted-foreground">{t(`timings.${phase.id}`)}</span>
          {phase.value === null ? (
            <span className="text-[11px] text-muted-foreground">{t('timings.unavailable')}</span>
          ) : (
            <span className="h-1.5 rounded-full bg-muted" aria-hidden>
              <span
                className={cn('block h-full rounded-full', toneFill('primary'))}
                style={{ width: `${Math.min(100, (phase.value / total) * 100)}%` }}
              />
            </span>
          )}
          <span className="text-right tabular-nums">
            {phase.value === null ? '' : formatDuration(phase.value, locale)}
          </span>
        </div>
      ))}
      <div className="grid grid-cols-[6rem_1fr_5rem] items-center gap-2 border-t border-border pt-2 font-medium">
        <span>{t('timings.total')}</span>
        <span />
        <span className="text-right tabular-nums">{formatDuration(timings.total, locale)}</span>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-muted-foreground">
      {label} <span className="font-medium tabular-nums text-foreground">{value}</span>
    </span>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col items-center justify-center p-6 text-center">{children}</div>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-3 py-8 text-center text-xs text-muted-foreground">{children}</p>;
}
