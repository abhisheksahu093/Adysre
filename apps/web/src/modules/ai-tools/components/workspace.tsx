'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Ban, Download, ImageOff, Play, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from 'adysre';
import { useGatedAction } from '@/hooks/use-gated-action';
import { UsageBadge } from '@/components/entitlements/usage-badge';
import { useMediaStore, createItem } from '../store/use-media-store';
import { useProcessor } from '../hooks/use-processor';
import { downloadAllResults } from '../engine/download';
import type { RegistryTool } from '../tools/registry';
import { Dropzone } from './dropzone';
import { FileQueue } from './file-queue';
import { CompareView } from './compare-view';

/**
 * The tool workspace: upload + settings + queue on the left, a live preview and
 * before/after comparison on the right. Every action (batch process, cancel,
 * reprocess, download all) operates on the queue in the store.
 */
export function Workspace({ tool }: { tool: RegistryTool }) {
  const t = useTranslations('aiTools');
  const items = useMediaStore((s) => s.items);
  const settings = useMediaStore((s) => s.settings);
  const selectedId = useMediaStore((s) => s.selectedId);
  const running = useMediaStore((s) => s.running);
  const initTool = useMediaStore((s) => s.initTool);
  const addItems = useMediaStore((s) => s.addItems);
  const updateSettings = useMediaStore((s) => s.updateSettings);
  const clear = useMediaStore((s) => s.clear);
  const clearResults = useMediaStore((s) => s.clearResults);
  const { processAll, cancel, previewItem } = useProcessor();

  useEffect(() => {
    initTool(tool.id, tool.defaultSettings);
  }, [tool.id, tool.defaultSettings, initTool]);

  const onFiles = async (files: File[]) => {
    const created = await Promise.all(files.map((file) => createItem(file)));
    addItems(created);
  };

  const selected = items.find((i) => i.id === selectedId) ?? null;
  const doneCount = items.filter((i) => i.result).length;
  const Panel = tool.panel;

  /**
   * Phase-2 tools are metered; phase-1 are not.
   *
   * Phase 1 is plain image manipulation that costs nothing to serve, so a limit
   * on it would be friction with no purpose. Phase 2 is the expensive set
   * (upscaler, enhancer, face blur, smart crop), and the registry's own `phase`
   * field is the source of that distinction rather than a second list here.
   */
  const isMetered = tool.phase === 2;
  const { run, modal: quotaModal } = useGatedAction('ai-tools.phase2.generate');

  /**
   * One unit PER IMAGE, not per click.
   *
   * A batch of twenty images is twenty pieces of work, and charging one for the
   * batch would make the limit meaningless to anyone who queues files before
   * pressing the button. The whole batch is refused when the remaining quota
   * cannot cover it, rather than half-processing it.
   */
  const runProcessing = async () => {
    const pending = items.filter((item) => !item.result).length || items.length;
    if (!isMetered) {
      await processAll();
      return;
    }
    await run(() => processAll(), { quantity: Math.max(1, pending) });
  };

  // Live preview: re-render the selected item shortly after its settings (or
  // rotation) change, so tuning tools like the enhancer and face blur update
  // the preview without a full batch run. Debounced, and skipped while a batch
  // is running.
  const selectedRotation = selected?.rotation;
  useEffect(() => {
    if (!tool.livePreview || !tool.process || running || !selectedId) return;
    const timer = window.setTimeout(() => {
      void previewItem(selectedId);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [tool, settings, selectedId, selectedRotation, running, previewItem]);

  const reprocess = async () => {
    clearResults();
    await runProcessing();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      {/* Left: upload, settings, queue */}
      <div className="space-y-4">
        <Dropzone accept={tool.accept} onFiles={onFiles} hint={t('dropHint')} />

        {Panel && (
          <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">{t('settings')}</h2>
            <Panel settings={settings} onChange={updateSettings} selected={selected} />
          </section>
        )}

        {items.length > 0 && (
          <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              {running ? (
                <Button type="button" variant="outline" size="sm" onClick={cancel} className="gap-1.5">
                  <Ban className="h-4 w-4" aria-hidden />
                  {t('cancel')}
                </Button>
              ) : (
                <Button type="button" size="sm" onClick={() => void runProcessing()} disabled={doneCount === items.length} className="gap-1.5">
                  <Play className="h-4 w-4" aria-hidden />
                  {t('processAll')}
                </Button>
              )}
              <Button type="button" variant="outline" size="sm" onClick={() => void reprocess()} disabled={running || doneCount === 0} className="gap-1.5">
                <RotateCcw className="h-4 w-4" aria-hidden />
                {t('reprocess')}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => void downloadAllResults(items, undefined, typeof settings.exportFormat === 'string' ? settings.exportFormat : undefined)} disabled={doneCount === 0} className="gap-1.5">
                <Download className="h-4 w-4" aria-hidden />
                {t('downloadAll')}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={clear} className="ml-auto gap-1.5 text-muted-foreground">
                <Trash2 className="h-4 w-4" aria-hidden />
                {t('clear')}
              </Button>
            </div>
            {/* Renders nothing for phase-1 tools, which carry no limit. */}
            {isMetered && <UsageBadge feature="ai-tools.phase2.generate" />}
            <FileQueue />
          </section>
        )}
      </div>

      {/* Right: preview / comparison */}
      <div className="min-h-[28rem] overflow-hidden rounded-2xl border border-border bg-card lg:h-[calc(100vh-13rem)]">
        {selected ? (
          <CompareView item={selected} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
            <ImageOff className="h-8 w-8" aria-hidden />
            <p className="text-sm">{t('emptyPreview')}</p>
          </div>
        )}
      </div>

      {/* Opened when a metered run is refused. */}
      {quotaModal}
    </div>
  );
}
