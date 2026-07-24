'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, Loader2, Plus, SendHorizontal, Trash2 } from 'lucide-react';
import { CHANNEL_TYPES, type ChannelType, type NotificationChannel } from '@/lib/website-intel/notify/types';

/**
 * Manage notification channels: add a webhook/Slack/Discord/email destination,
 * list them, delete them, and send a test event to confirm wiring. The test
 * result is shown per channel; email always reports "not delivered" until a
 * provider is configured (the note explains this).
 *
 * All copy is keys under `websiteIntel.notify.*`.
 */
export function NotificationChannels() {
  const t = useTranslations('websiteIntel.notify');
  const tc = useTranslations('websiteIntel.console');
  const [items, setItems] = useState<NotificationChannel[]>([]);
  const [type, setType] = useState<ChannelType>('webhook');
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tested, setTested] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/website-intelligence/notifications/channels');
      const json = (await response.json()) as { success: boolean; data?: NotificationChannel[] };
      if (json.success && json.data) setItems(json.data);
    } catch {
      /* leave list as-is. */
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add(event: FormEvent) {
    event.preventDefault();
    if (!target.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/website-intelligence/notifications/channels', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type, target }),
      });
      const json = (await response.json()) as { success: boolean; code?: string };
      if (!response.ok || !json.success) {
        const code = json.code ?? 'generic';
        setError(tc.has(`errors.${code}`) ? tc(`errors.${code}`) : tc('errors.generic'));
        return;
      }
      setTarget('');
      await load();
    } catch {
      setError(tc('errors.generic'));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      await fetch(`/api/website-intelligence/notifications/channels/${id}`, { method: 'DELETE' });
      await load();
    } catch {
      /* best-effort. */
    }
  }

  async function test(id: string) {
    try {
      const response = await fetch(`/api/website-intelligence/notifications/channels/${id}/test`, { method: 'POST' });
      const json = (await response.json()) as { success: boolean; data?: { ok: boolean } };
      setTested((prev) => ({ ...prev, [id]: Boolean(json.data?.ok) }));
    } catch {
      setTested((prev) => ({ ...prev, [id]: false }));
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="flex flex-col gap-2 sm:flex-row">
        <select
          value={type}
          onChange={(event) => setType(event.target.value as ChannelType)}
          aria-label={t('title')}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary/50"
        >
          {CHANNEL_TYPES.map((value) => (
            <option key={value} value={value}>
              {t(`types.${value}`)}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          placeholder={t('targetPlaceholder')}
          aria-label={t('targetPlaceholder')}
          className="min-w-0 flex-1 rounded-xl border border-border bg-card px-3 py-2.5 font-mono text-sm outline-none focus:border-primary/50"
        />
        <button
          type="submit"
          disabled={busy || target.trim() === ''}
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
      {type === 'email' && <p className="text-xs text-muted-foreground">{t('emailNote')}</p>}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 bg-card px-4 py-3">
              <Bell className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t(`types.${item.type}`)}
                </span>
                <span className="block truncate font-mono text-sm">{item.target}</span>
                {item.id in tested && (
                  <span className={tested[item.id] ? 'text-xs text-success' : 'text-xs text-destructive'}>
                    {tested[item.id] ? t('testOk') : t('testFail')}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => void test(item.id)}
                aria-label={t('test')}
                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <SendHorizontal className="h-3.5 w-3.5" aria-hidden />
                {t('test')}
              </button>
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
    </div>
  );
}
