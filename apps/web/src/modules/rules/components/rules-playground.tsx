'use client';

import { useTranslations } from 'next-intl';
import { RulePlayground } from '@adysre/rules-playground';

/**
 * The rules engine, running.
 *
 * Thin on purpose. The sandbox is `@adysre/rules-playground`, so what this page
 * shows is the same thing any host gets by dropping one component on a page -
 * not a bespoke demo that works here and nowhere else, and not a second set of
 * examples to keep in step with the tested ones.
 *
 * Everything it used to hold - the sample order, the field list, the starter
 * rule - moved into the package as an EXAMPLE, where every sample declares the
 * verdict the engine must produce and a test proves it. A demo nobody verifies
 * is a screenshot that stops being true quietly.
 */
export function RulesPlayground() {
  const t = useTranslations('rules');

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </header>

      {/*
       * No `theme` prop: ADYSRE defines every token the builder uses, so the
       * sandbox inherits the app's palette and its dark mode toggle. Passing a
       * theme here would impose a second palette on a page that already has one.
       */}
      <RulePlayground />
    </div>
  );
}
