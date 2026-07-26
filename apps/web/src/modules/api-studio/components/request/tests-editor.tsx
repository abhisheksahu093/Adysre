'use client';

import { useTranslations } from 'next-intl';
import { Plus, Trash2 } from 'lucide-react';
import { Input, Select, Textarea, cn } from 'adysre';
import type { Assertion, RequestScripts } from '../../types';
import { ASSERTION_OPERATORS, ASSERTION_TARGETS } from '../../types';
import { createId } from '../../utils/ids';

/** Targets that address something by name or path; the rest ignore it. */
const NEEDS_PATH = new Set(['header', 'jsonPath']);
/** Operators that are about presence and take no expected value. */
const NO_VALUE = new Set(['exists', 'notExists']);

/**
 * The tests pane: structured assertions, then scripts.
 *
 * Assertions come first because they are what most checks need and they are
 * data - buildable without writing code, translatable, exportable and diffable.
 * Scripts sit underneath as the escape hatch for the rest, and they say plainly
 * that they run in a sandbox with no network.
 */
export function TestsEditor({
  assertions,
  scripts,
  onAssertions,
  onScripts,
}: {
  assertions: Assertion[];
  scripts: RequestScripts;
  onAssertions: (assertions: Assertion[]) => void;
  onScripts: (scripts: RequestScripts) => void;
}) {
  const t = useTranslations('apiStudio');

  function update(id: string, patch: Partial<Assertion>): void {
    onAssertions(assertions.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function add(): void {
    onAssertions([
      ...assertions,
      {
        id: createId(),
        enabled: true,
        target: 'status',
        path: '',
        operator: 'equals',
        expected: '200',
        label: '',
      },
    ]);
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {t('tests.assertions')}
        </h3>

        {assertions.length === 0 && (
          <p className="text-xs text-muted-foreground">{t('tests.noAssertions')}</p>
        )}

        <ul className="space-y-1.5">
          {assertions.map((entry) => (
            <li key={entry.id} className="flex flex-wrap items-center gap-1.5">
              <input
                type="checkbox"
                checked={entry.enabled}
                onChange={(event) => update(entry.id, { enabled: event.target.checked })}
                aria-label={t('table.enableRow', { name: entry.target })}
                className="h-3.5 w-3.5 shrink-0 rounded border-input accent-primary"
              />

              <Select
                value={entry.target}
                onChange={(event) =>
                  update(entry.id, { target: event.target.value as Assertion['target'] })
                }
                aria-label={t('tests.target')}
                className={cn('h-8 w-auto min-w-32 text-xs', !entry.enabled && 'opacity-50')}
              >
                {ASSERTION_TARGETS.map((target) => (
                  <option key={target} value={target}>
                    {t(`tests.targets.${target}`)}
                  </option>
                ))}
              </Select>

              {NEEDS_PATH.has(entry.target) && (
                <Input
                  value={entry.path}
                  onChange={(event) => update(entry.id, { path: event.target.value })}
                  placeholder={entry.target === 'header' ? 'content-type' : '$.data[0].id'}
                  aria-label={t('tests.path')}
                  className="h-8 w-40 font-mono text-xs"
                />
              )}

              <Select
                value={entry.operator}
                onChange={(event) =>
                  update(entry.id, { operator: event.target.value as Assertion['operator'] })
                }
                aria-label={t('tests.operator')}
                className={cn('h-8 w-auto min-w-32 text-xs', !entry.enabled && 'opacity-50')}
              >
                {ASSERTION_OPERATORS.map((operator) => (
                  <option key={operator} value={operator}>
                    {t(`tests.operators.${operator}`)}
                  </option>
                ))}
              </Select>

              {!NO_VALUE.has(entry.operator) && (
                <Input
                  value={entry.expected}
                  onChange={(event) => update(entry.id, { expected: event.target.value })}
                  aria-label={t('tests.expected')}
                  className="h-8 min-w-24 flex-1 font-mono text-xs"
                />
              )}

              <button
                type="button"
                onClick={() => onAssertions(assertions.filter((item) => item.id !== entry.id))}
                aria-label={t('table.removeRow', { name: entry.target })}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          {t('tests.addAssertion')}
        </button>
      </section>

      <section className="space-y-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {t('tests.scripts')}
        </h3>
        <p className="text-xs text-muted-foreground">{t('tests.sandboxNote')}</p>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground" htmlFor="script-pre">
              {t('tests.preRequest')}
            </label>
            <Textarea
              id="script-pre"
              value={scripts.preRequest}
              onChange={(event) => onScripts({ ...scripts, preRequest: event.target.value })}
              spellCheck={false}
              placeholder={"pm.environment.set('stamp', String(Date.now()));"}
              className="min-h-32 font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground" htmlFor="script-test">
              {t('tests.testScript')}
            </label>
            <Textarea
              id="script-test"
              value={scripts.test}
              onChange={(event) => onScripts({ ...scripts, test: event.target.value })}
              spellCheck={false}
              placeholder={"pm.test('ok', function () {\n  pm.expect(pm.response.code).to.equal(200);\n});"}
              className="min-h-32 font-mono text-xs"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
