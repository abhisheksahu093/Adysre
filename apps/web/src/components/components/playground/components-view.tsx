'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Wand2, ArrowRight } from 'lucide-react';
import { Button } from 'adysre';
import type { LocalizedComponent } from '@/data/components';
import { usePlaygroundStore } from '@/stores/playground-store';
import { ComponentGrid } from '../component-grid';
import { PlaygroundView } from './playground-view';

/**
 * Client boundary for the components page: the library grid by default, the
 * playground once entered. `header` is the server-rendered page heading - it
 * belongs to the library view, so it swaps out with it rather than sitting
 * above both.
 */
export function ComponentsView({
  components,
  header,
}: {
  components: LocalizedComponent[];
  header: ReactNode;
}) {
  const active = usePlaygroundStore((s) => s.active);
  const enter = usePlaygroundStore((s) => s.enter);
  const t = useTranslations('components');

  if (active) return <PlaygroundView components={components} />;

  return (
    <div className="space-y-8">
      {header}

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              aria-hidden
            >
              <Wand2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-tight sm:text-base">
                {t('playground.banner.title')}
              </h2>
              <p className="max-w-xl text-xs text-muted-foreground sm:text-sm">
                {t('playground.banner.description')}
              </p>
            </div>
          </div>
          <Button type="button" onClick={enter} className="shrink-0 gap-1.5 self-start sm:self-auto">
            {t('playground.banner.cta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>

      <ComponentGrid components={components} />
    </div>
  );
}
