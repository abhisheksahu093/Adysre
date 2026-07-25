'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Ban, Download, ImageOff, Play, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from 'adysre';
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
  const { processAll, cancel } = useProcessor();

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

  const reprocess = async () => {
    clearResults();
    await processAll();
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
                <Button type="button" size="sm" onClick={() => void processAll()} disabled={doneCount === items.length} className="gap-1.5">
                  <Play className="h-4 w-4" aria-hidden />
                  {t('processAll')}
                </Button>
              )}
              <Button type="button" variant="outline" size="sm" onClick={() => void reprocess()} disabled={running || doneCount === 0} className="gap-1.5">
                <RotateCcw className="h-4 w-4" aria-hidden />
                {t('reprocess')}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => void downloadAllResults(items)} disabled={doneCount === 0} className="gap-1.5">
                <Download className="h-4 w-4" aria-hidden />
                {t('downloadAll')}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={clear} className="ml-auto gap-1.5 text-muted-foreground">
                <Trash2 className="h-4 w-4" aria-hidden />
                {t('clear')}
              </Button>
            </div>
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
    </div>
  );
}
