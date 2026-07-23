'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { cn } from 'adysre';
import type { FeatureModule } from '@/data/landing';
import { ACCENT_ICON } from './accent';

/** Token class per accent family, so the swatch strip re-tints with the theme. */
const ACCENT_BG: Record<FeatureModule['accent'], string> = {
  primary: 'bg-primary/80',
  secondary: 'bg-secondary/80',
  accent: 'bg-accent/80',
};

/**
 * A stylised, non-interactive snapshot of the workspace: sidebar rail plus a
 * content canvas of swatches, a gradient tile and resource cards. It exists to
 * show the product at a glance, so the whole thing is `aria-hidden` - the real
 * navigation lives in the app shell, and a screen reader should not meet a
 * second copy of it here. Every surface is a theme token, never a hex value.
 */
export function WorkspacePreview({ modules }: { modules: FeatureModule[] }) {
  const tNav = useTranslations('nav');

  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5 ring-1 ring-border/50"
    >
      {/* Window chrome */}
      <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/40 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <div className="ml-3 hidden h-5 flex-1 items-center gap-2 rounded-md border border-border bg-background px-2 text-[11px] text-muted-foreground sm:flex">
          <Search className="h-3 w-3" />
          adysre.app/components
        </div>
      </div>

      <div className="flex">
        {/* Sidebar rail */}
        <div className="hidden w-44 shrink-0 flex-col gap-1 border-r border-border bg-muted/20 p-3 sm:flex">
          {modules.map((m, i) => {
            const Icon = m.icon;
            const active = i === 0;
            return (
              <div
                key={m.id}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium',
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{tNav(m.id)}</span>
              </div>
            );
          })}
        </div>

        {/* Content canvas */}
        <div className="flex-1 space-y-4 p-4 sm:p-5">
          {/* Palette strip */}
          <div className="flex gap-1.5">
            {modules.map((m) => (
              <span key={m.id} className={cn('h-8 flex-1 rounded-md', ACCENT_BG[m.accent])} />
            ))}
          </div>

          {/* Gradient tile + stat cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 h-24 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent opacity-90" />
            <div className="flex flex-col justify-between rounded-lg border border-border bg-background p-3">
              <div className="h-2 w-10 rounded-full bg-muted-foreground/30" />
              <div className="h-6 w-14 rounded bg-muted-foreground/15" />
              <div className="h-2 w-8 rounded-full bg-muted-foreground/20" />
            </div>
          </div>

          {/* Resource card grid */}
          <div className="grid grid-cols-3 gap-3">
            {modules.slice(0, 3).map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className="space-y-2 rounded-lg border border-border bg-background p-3"
                >
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-md',
                      ACCENT_ICON[m.accent],
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="h-2 w-3/4 rounded-full bg-muted-foreground/25" />
                  <div className="h-2 w-1/2 rounded-full bg-muted-foreground/15" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
