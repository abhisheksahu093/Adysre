'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { builtinPlugins, createContext, createRegistry, stringifyRule } from '@adysre/rules-core';
import type { RuleDocument } from '@adysre/rules-types';
import { RuleDebugger, useDebugSession } from '@adysre/rules-devtools';
import { createWebStorage } from '@adysre/rules-storage';
import { RuleBuilder } from '@adysre/rules-ui';
import { Button, Card, CardContent, CardHeader, CardTitle } from 'adysre';
import {
  EVALUATED_AT,
  ORDER_ACTIONS,
  RULES_STORAGE_KEY,
  SAMPLE_ORDER,
  orderFields,
  starterRule,
} from '../data/sample-schema';

/**
 * The rule builder, running against a sample order.
 *
 * A sandbox rather than a module: it saves to the browser rather than to the
 * database, because the Next.js adapters that would put this behind a route are
 * the phase after storage. What it exists to show is that the AST is the only
 * source of truth, and that the sentence, the verdict, the JSON and the stored
 * document are all projections of it that move together as somebody edits.
 *
 * The registry is built ONCE. It is immutable by design, and rebuilding it per
 * render would hand the executor a new object on every keystroke and defeat
 * every memo below it.
 */
export function RulesPlayground() {
  const t = useTranslations('rules');

  const registry = useMemo(
    () => createRegistry(builtinPlugins, { fields: [orderFields], actions: ORDER_ACTIONS }),
    [],
  );

  const [rule, setRule] = useState<RuleDocument>(starterRule);
  const [showJson, setShowJson] = useState(false);
  const [saved, setSaved] = useState<number | null>(null);

  // Fixed at mount, like the builder's own preview clock: a debugger whose
  // `today` advanced while somebody read it would explain a different run from
  // the one on screen.
  const context = useMemo(() => createContext(SAMPLE_ORDER, { now: EVALUATED_AT }), []);
  const session = useDebugSession(registry, rule, context);

  /*
   * A real store, not a mock. The web adapter passes the same conformance suite
   * a database adapter has to, so what this page exercises is the contract
   * rather than a sandbox-shaped approximation of it.
   *
   * Built once, and NOT during render on the server: it reads `localStorage`,
   * which does not exist there. The adapter tolerates that by forgetting rather
   * than failing, and building it lazily keeps the server render honest anyway.
   */
  const storage = useMemo(() => createWebStorage({ key: RULES_STORAGE_KEY }), []);

  // The last save's version, so the page can say what happened rather than
  // leaving somebody guessing whether the button did anything.
  const persist = (document: RuleDocument): void => {
    void storage.save(document).then((stored) => {
      setRule(stored);
      setSaved(stored.version);
    });
  };

  // Whatever was stored wins over the starter rule, once there is a browser to
  // ask. An effect and not a render, because the server has no answer to give.
  useEffect(() => {
    void storage.list().then(async (summaries) => {
      const first = summaries[0];
      if (first === undefined) return;
      const stored = await storage.get(first.id);
      if (stored !== null) {
        setRule(stored);
        setSaved(stored.version);
      }
    });
  }, [storage]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        {/* Announced, because Save is otherwise a button with no visible
            consequence: the rule on screen is the rule that was already there. */}
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {saved === null ? t('notSaved') : t('savedVersion', { version: saved })}
        </p>
      </header>

      <Card>
        <CardContent className="pt-6">
          {/*
           * `onChange` feeds straight back into `rule`, which is the wiring the
           * builder is built to survive: it recognises its own document coming
           * back and does not reload it, so the history stays intact.
           */}
          <RuleBuilder
            now={EVALUATED_AT}
            registry={registry}
            rule={rule}
            sample={SAMPLE_ORDER}
            onChange={setRule}
            onSave={persist}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('debugger')}</CardTitle>
        </CardHeader>
        <CardContent>
          {/*
           * The same rule, run twice: as it really runs, and with
           * short-circuiting off. Edit a condition into something broken and put
           * it behind a passing sibling to see what the second run is for.
           */}
          <RuleDebugger session={session} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">{t('json')}</CardTitle>
          <Button size="sm" type="button" variant="outline" onClick={() => setShowJson(!showJson)}>
            {showJson ? t('hideJson') : t('showJson')}
          </Button>
        </CardHeader>
        {showJson && (
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">{t('jsonHint')}</p>
            {/* `stringifyRule` and not `JSON.stringify`: the engine's own
                serialiser is what a stored rule goes through. */}
            <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 font-mono text-xs">
              {stringifyRule(rule)}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
