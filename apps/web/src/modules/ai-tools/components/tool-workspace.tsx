'use client';

import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import { AI_TOOL_BY_ID } from '../tools/registry';
import { Workspace } from './workspace';

/**
 * Client entry for a single tool page. The registry (with its `process`/panel
 * functions, which can't cross the server boundary) is resolved here from the
 * route's tool id. Ready tools render the workspace; upcoming tools show a clear
 * placeholder rather than a broken editor.
 */
export function ToolWorkspace({ toolId }: { toolId: string }) {
  const t = useTranslations('aiTools');
  const tool = AI_TOOL_BY_ID[toolId];

  if (!tool) return null;

  if (tool.status !== 'ready' || !tool.process) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {t('soon')}
        </span>
        <p className="max-w-md text-sm text-muted-foreground">{t('soonHint')}</p>
      </div>
    );
  }

  return <Workspace tool={tool} />;
}
