'use client';

import { useTranslations } from 'next-intl';
import { cn } from 'adysre';
import { useStudioStore } from '../store/use-studio-store';
import type { EditorTheme } from '../types';

const THEMES: EditorTheme[] = ['dark', 'light', 'system'];
const FONT_SIZES = [12, 13, 14, 16, 18];
const TAB_SIZES = [2, 4];

/** Editor + preview preferences, persisted with the project (see useAutosave). */
export function SettingsPanel() {
  const t = useTranslations('codeStudio');
  const settings = useStudioStore((s) => s.settings);
  const update = useStudioStore((s) => s.updateSettings);

  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('theme')}</p>
        <div className="grid grid-cols-3 gap-1">
          {THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => update({ theme })}
              className={cn(
                'rounded-md border px-2 py-1.5 text-xs capitalize transition-colors',
                settings.theme === theme
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {t(`themes.${theme}`)}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center justify-between">
        <span className="text-muted-foreground">{t('fontSize')}</span>
        <select
          value={settings.fontSize}
          onChange={(e) => update({ fontSize: Number(e.target.value) })}
          className="rounded border border-border bg-background px-2 py-1 text-xs outline-none"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center justify-between">
        <span className="text-muted-foreground">{t('tabSize')}</span>
        <select
          value={settings.tabSize}
          onChange={(e) => update({ tabSize: Number(e.target.value) })}
          className="rounded border border-border bg-background px-2 py-1 text-xs outline-none"
        >
          {TAB_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <Toggle label={t('wordWrap')} value={settings.wordWrap} onChange={(v) => update({ wordWrap: v })} />
      <Toggle label={t('minimap')} value={settings.minimap} onChange={(v) => update({ minimap: v })} />
      <Toggle label={t('autosave')} value={settings.autosave} onChange={(v) => update({ autosave: v })} />
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between"
    >
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('relative h-5 w-9 rounded-full transition-colors', value ? 'bg-primary' : 'bg-muted')}>
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            value ? 'left-0.5 translate-x-4' : 'left-0.5',
          )}
        />
      </span>
    </button>
  );
}
