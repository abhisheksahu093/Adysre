'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { builtinPlugins, createRegistry, stringifyRule } from '@adysre/rules-core';
import type { RuleDocument } from '@adysre/rules-types';
import { RuleBuilder } from '@adysre/rules-ui';
import { Button, Card, CardContent, CardHeader, CardTitle } from 'adysre';
import { ORDER_ACTIONS, SAMPLE_ORDER, orderFields, starterRule } from '../data/sample-schema';

/**
 * The rule builder, running against a sample order.
 *
 * A sandbox rather than a module: nothing here persists, because storage
 * adapters are a later phase of the engine. What it exists to show is the part
 * that is finished - that the AST is the only source of truth, and that the
 * sentence, the verdict and the JSON are all projections of it that move
 * together as somebody edits.
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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </header>

      <Card>
        <CardContent className="pt-6">
          {/*
           * `onChange` feeds straight back into `rule`, which is the wiring the
           * builder is built to survive: it recognises its own document coming
           * back and does not reload it, so the history stays intact.
           */}
          <RuleBuilder
            registry={registry}
            rule={rule}
            sample={SAMPLE_ORDER}
            onChange={setRule}
            onSave={setRule}
          />
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
