'use client';

import { useCallback, useEffect, useState } from 'react';
import { BarChart3, ExternalLink, Loader2, QrCode, Star, Trash2 } from 'lucide-react';
import { Button, cn } from 'adysre';
import type { QrRecord } from '@/lib/tools/qr/store/types';
import type { Breakdown, ScanAnalytics } from '@/lib/tools/qr/dynamic/analytics';

/**
 * "My QR codes" - the saved dynamic-QR library and its analytics.
 *
 * Lists the tenant's codes (tenant-scoped API), lets each be favourited or
 * deleted, and expands a compact analytics panel (totals, a 14-day sparkline and
 * the device/browser/country/referrer breakdowns) fetched on demand. Refreshes
 * whenever the generator dispatches `qr:saved`.
 */
export function SavedCodes() {
  const [codes, setCodes] = useState<QrRecord[] | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Record<string, ScanAnalytics | 'loading'>>({});

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/tools/qr/codes');
      if (res.status === 401) {
        setNeedsAuth(true);
        setCodes([]);
        return;
      }
      const json = (await res.json()) as { success: boolean; data?: QrRecord[] };
      setNeedsAuth(false);
      setCodes(json.success && json.data ? json.data : []);
    } catch {
      setCodes([]);
    }
  }, []);

  useEffect(() => {
    void load();
    const onSaved = () => void load();
    window.addEventListener('qr:saved', onSaved);
    return () => window.removeEventListener('qr:saved', onSaved);
  }, [load]);

  async function toggleFavorite(code: QrRecord) {
    setCodes((prev) => prev?.map((c) => (c.id === code.id ? { ...c, favorite: !c.favorite } : c)) ?? prev);
    await fetch(`/api/tools/qr/codes/${code.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ favorite: !code.favorite }),
    }).catch(() => void load());
  }

  async function remove(id: string) {
    setCodes((prev) => prev?.filter((c) => c.id !== id) ?? prev);
    await fetch(`/api/tools/qr/codes/${id}`, { method: 'DELETE' }).catch(() => void load());
  }

  async function toggleAnalytics(id: string) {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next && !analytics[id]) {
      setAnalytics((prev) => ({ ...prev, [id]: 'loading' }));
      try {
        const res = await fetch(`/api/tools/qr/codes/${id}/analytics`);
        const json = (await res.json()) as { success: boolean; data?: ScanAnalytics };
        setAnalytics((prev) => ({ ...prev, [id]: json.success && json.data ? json.data : blankAnalytics() }));
      } catch {
        setAnalytics((prev) => ({ ...prev, [id]: blankAnalytics() }));
      }
    }
  }

  if (codes === null) {
    return <div className="h-24 animate-pulse rounded-2xl border border-border bg-card" />;
  }

  return (
    <section className="space-y-4">
      <header className="max-w-2xl space-y-1">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">My QR codes</h2>
        <p className="text-sm text-muted-foreground">
          Saved codes with tracked short links and scan analytics.
        </p>
      </header>

      {needsAuth ? (
        <p className="rounded-xl border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
          Sign in to save QR codes and track their scans.
        </p>
      ) : codes.length === 0 ? (
        <p className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
          <QrCode className="h-4 w-4" aria-hidden />
          No saved codes yet. Create one above and click Save.
        </p>
      ) : (
        <ul className="space-y-3">
          {codes.map((code) => {
            const shortUrl =
              code.targetUrl && typeof window !== 'undefined'
                ? `${window.location.origin}/q/${code.slug}`
                : null;
            return (
              <li key={code.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void toggleFavorite(code)}
                    aria-pressed={code.favorite}
                    aria-label={code.favorite ? 'Unfavourite' : 'Favourite'}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Star className={cn('h-4 w-4', code.favorite && 'fill-warning text-warning')} aria-hidden />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{code.name}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                        {code.type}
                      </span>
                      {shortUrl && (
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 truncate font-mono text-xs text-primary hover:underline"
                        >
                          /q/{code.slug}
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      )}
                    </div>
                  </div>

                  {shortUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-expanded={openId === code.id}
                      onClick={() => void toggleAnalytics(code.id)}
                    >
                      <BarChart3 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                      Analytics
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Delete"
                    onClick={() => void remove(code.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                </div>

                {openId === code.id && <AnalyticsPanel state={analytics[code.id]} />}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function blankAnalytics(): ScanAnalytics {
  return {
    total: 0,
    today: 0,
    week: 0,
    month: 0,
    byDevice: [],
    byBrowser: [],
    byOs: [],
    byCountry: [],
    byReferrer: [],
    timeline: [],
  };
}

function AnalyticsPanel({ state }: { state: ScanAnalytics | 'loading' | undefined }) {
  if (state === undefined || state === 'loading') {
    return (
      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Loading analytics…
      </div>
    );
  }

  const max = Math.max(1, ...state.timeline.map((d) => d.count));

  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      <dl className="grid grid-cols-4 gap-3">
        {(
          [
            ['Total', state.total],
            ['Today', state.today],
            ['7 days', state.week],
            ['30 days', state.month],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-background p-3 text-center">
            <dd className="text-xl font-bold tabular-nums">{value}</dd>
            <dt className="mt-0.5 text-[11px] text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>

      {/* 14-day sparkline */}
      <div className="flex h-16 items-end gap-1" aria-hidden>
        {state.timeline.map((d) => (
          <div
            key={d.date}
            title={`${d.date}: ${d.count}`}
            className="flex-1 rounded-t bg-primary/70"
            style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
          />
        ))}
      </div>

      {state.total === 0 ? (
        <p className="text-xs text-muted-foreground">
          No scans yet. Open the short link on a phone to record one.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BreakdownList title="Devices" rows={state.byDevice} />
          <BreakdownList title="Browsers" rows={state.byBrowser} />
          <BreakdownList title="Countries" rows={state.byCountry} />
          <BreakdownList title="Referrers" rows={state.byReferrer} />
        </div>
      )}
    </div>
  );
}

function BreakdownList({ title, rows }: { title: string; rows: Breakdown[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground">{title}</h4>
      {rows.length === 0 ? (
        <p className="mt-1 text-xs text-muted-foreground">None</p>
      ) : (
        <ul className="mt-1.5 space-y-1">
          {rows.slice(0, 4).map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-2 text-xs">
              <span className="min-w-0 truncate">{row.label}</span>
              <span className="shrink-0 font-medium tabular-nums text-muted-foreground">{row.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
