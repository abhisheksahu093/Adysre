'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Save, Send, X } from 'lucide-react';
import { Button, Input, Select, cn } from 'adysre';
import type { ApiTab, RequestDefinition } from '../../types';
import { HTTP_METHODS } from '../../types';
import { COMMON_REQUEST_HEADERS, METHOD_TONES } from '../../constants/http';
import { activeEntries } from '../../utils/entries';
import { looksSendable } from '../../utils/url';
import { KeyValueEditor } from '../key-value-editor';
import { PanePanel, PaneTabs, type PaneTab } from '../pane-tabs';
import { toneText } from '../tone';
import { AuthEditor } from './auth-editor';
import { BodyEditor } from './body-editor';

type RequestPane = 'params' | 'headers' | 'body' | 'auth';

/**
 * The request builder: method, address, send, and the four editing panes.
 *
 * The address bar and the params table are two views of one thing and are kept
 * in step by the store, so this component never syncs them itself; it just
 * hands both edits to `updateDraft` and renders what comes back.
 *
 * Send is disabled only when the URL cannot possibly be sent (empty, or no
 * scheme and no leading template). An in-flight request turns it into Cancel
 * rather than a spinner that cannot be stopped.
 */
export function RequestBuilder({
  tab,
  sending,
  onChange,
  onSend,
  onCancel,
  onSave,
  canSave,
}: {
  tab: ApiTab;
  sending: boolean;
  onChange: (patch: Partial<RequestDefinition>) => void;
  onSend: () => void;
  onCancel: () => void;
  onSave: () => void;
  canSave: boolean;
}) {
  const t = useTranslations('apiStudio');
  const [pane, setPane] = useState<RequestPane>('params');
  const draft = tab.draft;

  const panes: PaneTab<RequestPane>[] = [
    { id: 'params', label: t('request.params'), count: activeEntries(draft.params).length },
    { id: 'headers', label: t('request.headers'), count: activeEntries(draft.headers).length },
    { id: 'body', label: t('request.body') },
    { id: 'auth', label: t('request.auth') },
  ];

  const sendable = looksSendable(draft.url);

  return (
    <div className="flex min-h-0 flex-col">
      <form
        className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row sm:items-center"
        onSubmit={(event) => {
          event.preventDefault();
          if (sendable && !sending) onSend();
        }}
      >
        <div className="flex flex-1 items-center gap-2">
          <Select
            value={draft.method}
            onChange={(event) => onChange({ method: event.target.value as RequestDefinition['method'] })}
            aria-label={t('request.method')}
            className={cn('h-9 w-auto min-w-28 font-mono text-xs font-semibold', toneText(METHOD_TONES[draft.method]))}
          >
            {HTTP_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </Select>

          <Input
            value={draft.url}
            onChange={(event) => onChange({ url: event.target.value })}
            placeholder={t('request.urlPlaceholder')}
            aria-label={t('request.url')}
            spellCheck={false}
            autoComplete="off"
            className="h-9 flex-1 font-mono text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {sending ? (
            <Button type="button" variant="outline" size="sm" onClick={onCancel} className="gap-1.5">
              <X className="h-3.5 w-3.5" aria-hidden />
              {t('request.cancel')}
            </Button>
          ) : (
            <Button type="submit" size="sm" disabled={!sendable} className="gap-1.5">
              <Send className="h-3.5 w-3.5" aria-hidden />
              {t('request.send')}
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={!canSave}
            className="gap-1.5"
            title={t('request.saveHint')}
          >
            {sending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Save className="h-3.5 w-3.5" aria-hidden />
            )}
            {t('request.save')}
          </Button>
        </div>
      </form>

      <div className="flex min-h-0 flex-1 flex-col">
        <PaneTabs
          tabs={panes}
          active={pane}
          onSelect={setPane}
          label={t('request.paneLabel')}
          className="border-b border-border px-2 py-1.5"
        />

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <PanePanel id="params" active={pane === 'params'}>
            <KeyValueEditor
              entries={draft.params}
              onChange={(params) => onChange({ params })}
              keyPlaceholder={t('request.paramKey')}
            />
            {draft.pathVariables.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('request.pathVariables')}
                </h3>
                <KeyValueEditor
                  entries={draft.pathVariables}
                  onChange={(pathVariables) => onChange({ pathVariables })}
                />
              </div>
            )}
          </PanePanel>

          <PanePanel id="headers" active={pane === 'headers'}>
            <KeyValueEditor
              entries={draft.headers}
              onChange={(headers) => onChange({ headers })}
              suggestions={COMMON_REQUEST_HEADERS}
              keyPlaceholder={t('request.headerKey')}
            />
          </PanePanel>

          <PanePanel id="body" active={pane === 'body'}>
            <BodyEditor
              method={draft.method}
              body={draft.body}
              onChange={(body) => onChange({ body })}
            />
          </PanePanel>

          <PanePanel id="auth" active={pane === 'auth'}>
            <AuthEditor auth={draft.auth} onChange={(auth) => onChange({ auth })} />
          </PanePanel>
        </div>
      </div>
    </div>
  );
}
