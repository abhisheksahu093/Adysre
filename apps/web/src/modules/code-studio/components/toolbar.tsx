'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Check,
  ChevronDown,
  Download,
  FilePlus2,
  Play,
  RotateCcw,
  Save,
  Settings2,
  SquareCode,
} from 'lucide-react';
import { cn } from 'adysre';
import { useStudioStore } from '../store/use-studio-store';
import { TEMPLATES, templateFiles, type StudioTemplate } from '../templates';
import { downloadProjectZip } from '../services/download';
import { createId } from '../utils/files';
import type { SaveState } from '../hooks/use-autosave';
import { SettingsPanel } from './settings-panel';

function useDismiss(onDismiss: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) onDismiss();
  };
  return { ref, onBlur };
}

export function Toolbar({ saveState, onSave, onRun }: { saveState: SaveState; onSave: () => void; onRun: () => void }) {
  const t = useTranslations('codeStudio');
  const project = useStudioStore((s) => s.project);
  const loadProject = useStudioStore((s) => s.loadProject);
  const renameProject = useStudioStore((s) => s.renameProject);
  const clearConsole = useStudioStore((s) => s.clearConsole);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const templatesMenu = useDismiss(() => setTemplatesOpen(false));
  const settingsMenu = useDismiss(() => setSettingsOpen(false));

  const startTemplate = (template: StudioTemplate) => {
    loadProject({
      id: createId('proj'),
      name: t(`templates.${template.labelKey}`),
      files: templateFiles(template),
      ...(template.entry ? { entry: template.entry } : {}),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setTemplatesOpen(false);
  };

  const reset = () => {
    clearConsole();
    onRun();
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card/40 px-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <SquareCode className="h-5 w-5 text-primary" aria-hidden />
        <span className="hidden sm:inline">{t('title')}</span>
      </div>

      <div className="mx-1 h-5 w-px bg-border" aria-hidden />

      <input
        value={project?.name ?? ''}
        onChange={(e) => renameProject(e.target.value)}
        aria-label={t('projectName')}
        className="w-40 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-medium hover:border-border focus:border-primary/50 focus:outline-none"
      />

      <div className="ml-auto flex items-center gap-1">
        {/* New from template */}
        <div ref={templatesMenu.ref} onBlur={templatesMenu.onBlur} className="relative">
          <button
            type="button"
            onClick={() => setTemplatesOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <FilePlus2 className="h-4 w-4" aria-hidden />
            <span className="hidden md:inline">{t('newProject')}</span>
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          </button>
          {templatesOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-56 rounded-lg border border-border bg-card p-1.5 shadow-lg">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('templatesLabel')}
              </p>
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => startTemplate(template)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {t(`templates.${template.labelKey}`)}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onRun}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Play className="h-4 w-4" aria-hidden />
          <span className="hidden md:inline">{t('run')}</span>
        </button>

        <button
          type="button"
          onClick={reset}
          aria-label={t('reset')}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
        </button>

        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {saveState === 'saved' ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
          <span className="hidden md:inline">{saveState === 'saving' ? t('saving') : saveState === 'saved' ? t('saved') : t('save')}</span>
        </button>

        <button
          type="button"
          onClick={() => project && downloadProjectZip(project)}
          aria-label={t('downloadZip')}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Download className="h-4 w-4" aria-hidden />
        </button>

        <div ref={settingsMenu.ref} onBlur={settingsMenu.onBlur} className="relative">
          <button
            type="button"
            aria-label={t('settings')}
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((v) => !v)}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              settingsOpen ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Settings2 className="h-4 w-4" aria-hidden />
          </button>
          {settingsOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-72 rounded-lg border border-border bg-card p-3 shadow-lg">
              <SettingsPanel />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
