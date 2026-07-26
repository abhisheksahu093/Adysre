'use client';

import { useTranslations } from 'next-intl';
import { Select, Textarea, cn } from 'adysre';
import type { RequestBody } from '../../types';
import { BODY_TYPES, RAW_LANGUAGES } from '../../types';
import { METHODS_WITHOUT_BODY } from '../../constants/http';
import type { HttpMethod } from '../../types';
import { KeyValueEditor } from '../key-value-editor';

/**
 * The body pane.
 *
 * Switching type keeps what was typed under the old one: a person toggling
 * between JSON and form data mid-debug expects their JSON to still be there
 * when they come back, so each variant is stored rather than overwritten by the
 * switch. That is why this holds all variants in one state object and the
 * builder replaces the whole `body`.
 */
export function BodyEditor({
  method,
  body,
  onChange,
}: {
  method: HttpMethod;
  body: RequestBody;
  onChange: (body: RequestBody) => void;
}) {
  const t = useTranslations('apiStudio');

  if (METHODS_WITHOUT_BODY.includes(method)) {
    return (
      <p className="px-1 py-6 text-center text-xs text-muted-foreground">
        {t('body.notAllowed', { method })}
      </p>
    );
  }

  function switchType(type: RequestBody['type']): void {
    switch (type) {
      case 'none':
        onChange({ type: 'none' });
        return;
      case 'raw':
        onChange({ type: 'raw', language: 'json', content: '' });
        return;
      case 'graphql':
        onChange({ type: 'graphql', query: '', variables: '', operationName: null });
        return;
      case 'multipart':
        onChange({ type: 'multipart', entries: [] });
        return;
      case 'urlencoded':
        onChange({ type: 'urlencoded', entries: [] });
        return;
      case 'binary':
        onChange({ type: 'binary', fileId: null, fileName: null, contentType: null });
        return;
      default:
        onChange({ type: 'none' });
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-muted-foreground" htmlFor="body-type">
          {t('body.type')}
        </label>
        <Select
          id="body-type"
          value={body.type}
          onChange={(event) => switchType(event.target.value as RequestBody['type'])}
          className="h-8 w-auto min-w-32 text-xs"
        >
          {BODY_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`body.types.${type}`)}
            </option>
          ))}
        </Select>

        {body.type === 'raw' && (
          <>
            <label className="text-xs text-muted-foreground" htmlFor="body-language">
              {t('body.language')}
            </label>
            <Select
              id="body-language"
              value={body.language}
              onChange={(event) =>
                onChange({ ...body, language: event.target.value as typeof body.language })
              }
              className="h-8 w-auto min-w-28 text-xs"
            >
              {RAW_LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {t(`body.languages.${language}`)}
                </option>
              ))}
            </Select>
          </>
        )}
      </div>

      {body.type === 'none' && (
        <p className="px-1 py-6 text-center text-xs text-muted-foreground">{t('body.none')}</p>
      )}

      {body.type === 'raw' && (
        <Textarea
          value={body.content}
          onChange={(event) => onChange({ ...body, content: event.target.value })}
          spellCheck={false}
          aria-label={t('body.content')}
          placeholder={t('body.placeholder')}
          className={cn('min-h-48 font-mono text-xs leading-relaxed')}
        />
      )}

      {body.type === 'graphql' && (
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground" htmlFor="graphql-query">
              {t('body.query')}
            </label>
            <Textarea
              id="graphql-query"
              value={body.query}
              onChange={(event) => onChange({ ...body, query: event.target.value })}
              spellCheck={false}
              className="min-h-48 font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground" htmlFor="graphql-variables">
              {t('body.variables')}
            </label>
            <Textarea
              id="graphql-variables"
              value={body.variables}
              onChange={(event) => onChange({ ...body, variables: event.target.value })}
              spellCheck={false}
              placeholder="{}"
              className="min-h-48 font-mono text-xs"
            />
          </div>
        </div>
      )}

      {body.type === 'urlencoded' && (
        <KeyValueEditor
          entries={body.entries}
          onChange={(entries) => onChange({ ...body, entries })}
        />
      )}

      {/* Multipart and binary need the file store; saying so beats a control
          that looks ready and silently sends nothing. */}
      {(body.type === 'multipart' || body.type === 'binary') && (
        <p className="rounded-md border border-border bg-muted/40 px-3 py-4 text-center text-xs text-muted-foreground">
          {t('body.uploadsPending')}
        </p>
      )}
    </div>
  );
}
