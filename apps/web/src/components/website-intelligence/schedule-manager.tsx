'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarClock, Loader2, Play, Plus, Trash2 } from 'lucide-react';
import { CADENCES, type Cadence, type ScheduleRecord } from '@/lib/website-intel/schedule/types';

/**
 * Manage scheduled scans: create one for a URL and cadence, list them, delete
 * them, and trigger the due ones by hand ("Run due now"). The recurring trigger
 * in production is a cron/queue calling the same run endpoint; this panel is the
 * manual and administrative face of it.
 *
 * All copy is keys under `websiteIntel.schedule.*`.
 */
export function ScheduleManager({ placeholder }: { placeholder: string }) {
  const t = useTranslations('websiteIntel.schedule');
  const tc = useTranslations('websiteIntel.console');
  const [items, setItems] = useState<ScheduleRecord[]>([]);
  const [url, setUrl] = useState('');
  const [cadence, setCadence] = useState<Cadence>('daily');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ranMessage, setRanMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/website-intelligence/schedules');
      const json = (await response.json()) as { success: boolean; data?: ScheduleRecord[] };
      if (json.success && json.data) setItems(json.data);
    } catch {
      /* leave the list as-is on a failed load. */
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add(event: FormEvent) {
    event.preventDefault();
    if (!url.trim() || busy) return;
    setBusy(true);
    setError(null);
    setRanMessage(null);
    try {
      const response = await fetch('/api/website-intelligence/schedules', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url, cadence }),
      });
      const json = (await response.json()) as { success: boolean; code?: string };
      if (!response.ok || !json.success) {
        const code = json.code ?? 'generic';
        setError(tc.has(`errors.${code}`) ? tc(`errors.${code}`) : tc('errors.generic'));
        return;
      }
      setUrl('');
      await load();
    } catch {
      setError(tc('errors.generic'));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      await fetch(`/api/website-intelligence/schedules/${id}`, { method: 'DELETE' });
      await load();
    } catch {
      /* best-effort. */
    }
  }

  async function runDue() {
    setBusy(true);
    setRanMessage(null);
    try {
      const response = await fetch('/api/website-intelligence/schedules/run', { method: 'POST' });
      const json = (await response.json()) as { success: boolean; data?: { ran: string[] } };
      const count = json.data?.ran.length ?? 0;
      setRanMessage(count === 0 ? t('ranNone') : t('ranSome', { count }));
      await load();
    } catch {
      setRanMessage(tc('errors.generic'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={placeholder}
          aria-label={t('urlPlaceholder')}
          className="min-w-0 flex-1 rounded-xl border border-border bg-card px-3 py-2.5 font-mono text-sm outline-none focus:border-primary/50"
        />
        <select
          value={cadence}
          onChange={(event) => setCadence(event.target.value as Cadence)}
          aria-label={t('title')}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary/50"
        >
          {CADENCES.map((value) => (
            <option key={value} value={value}>
              {t(`cadences.${value}`)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={busy || url.trim() === ''}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
          {t('add')}
        </button>
      </form>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 bg-card px-4 py-3">
              <CalendarClock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{item.url}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {t(`cadences.${item.cadence}`)} · {t('next')} {new Date(item.nextRunAt).toLocaleString()}
                </span>
              </span>
              <button
                type="button"
                onClick={() => void remove(item.id)}
                aria-label={t('delete')}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void runDue()}
          disabled={busy || items.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Play className="h-3.5 w-3.5" aria-hidden />
          {t('runDue')}
        </button>
        {ranMessage && <span className="text-sm text-muted-foreground" aria-live="polite">{ranMessage}</span>}
      </div>
    </div>
  );
}
