'use client';

import { useTranslations } from 'next-intl';
import { Check, CloudOff, Loader2, TriangleAlert } from 'lucide-react';
import { cn } from '@adysre/ui';
import { useDesignDocumentStore } from '@/stores/design-document-store';

/**
 * Where the user's work currently lives.
 *
 * Autosave is invisible by definition, which is fine while it works and awful
 * when it does not: without this, a document failing to reach the server looks
 * exactly like one that saved. "Offline" is stated plainly, along with the fact
 * that edits are still held locally.
 */
export function SaveStatus() {
  const t = useTranslations('designPlayground');
  const sync = useDesignDocumentStore((s) => s.sync);
  const dirty = useDesignDocumentStore((s) => s.dirty);

  if (sync === 'idle' && !dirty) return null;

  const state =
    sync === 'saving'
      ? { icon: Loader2, key: 'saving', tone: 'text-muted-foreground', spin: true }
      : sync === 'offline'
        ? { icon: CloudOff, key: 'offline', tone: 'text-warning', spin: false }
        : sync === 'error'
          ? { icon: TriangleAlert, key: 'error', tone: 'text-danger', spin: false }
          : { icon: Check, key: 'saved', tone: 'text-muted-foreground', spin: false };

  const Icon = state.icon;

  return (
    <span
      // Polite, not assertive: a save indicator must never interrupt a screen
      // reader mid-sentence while someone is drawing.
      aria-live="polite"
      className={cn('hidden items-center gap-1.5 text-[11px] md:flex', state.tone)}
    >
      <Icon className={cn('h-3.5 w-3.5', state.spin && 'animate-spin motion-reduce:animate-none')} />
      {t(`sync.${state.key}`)}
    </span>
  );
}
