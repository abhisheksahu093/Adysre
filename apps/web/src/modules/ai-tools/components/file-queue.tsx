'use client';

import { Check, FileText, Loader2, Trash2, TriangleAlert, X } from 'lucide-react';
import { cn } from 'adysre';
import { useMediaStore } from '../store/use-media-store';
import { humanSize } from '../engine/format';
import type { ItemStatus } from '../types';

function StatusIcon({ status }: { status: ItemStatus }) {
  if (status === 'processing' || status === 'queued') return <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" aria-hidden />;
  if (status === 'done') return <Check className="h-3.5 w-3.5 text-success" aria-hidden />;
  if (status === 'error') return <TriangleAlert className="h-3.5 w-3.5 text-danger" aria-hidden />;
  if (status === 'canceled') return <X className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />;
  return null;
}

/** The processing queue: every uploaded file with its live status and progress. */
export function FileQueue() {
  const items = useMediaStore((s) => s.items);
  const selectedId = useMediaStore((s) => s.selectedId);
  const select = useMediaStore((s) => s.select);
  const removeItem = useMediaStore((s) => s.removeItem);

  if (items.length === 0) return null;

  return (
    <ul className="space-y-1.5">
      {items.map((item) => {
        const active = item.id === selectedId;
        return (
          <li key={item.id}>
            <div
              className={cn(
                'group flex items-center gap-2.5 rounded-lg border p-2 transition-colors',
                active ? 'border-primary/50 bg-primary/5' : 'border-border hover:bg-muted/50',
              )}
            >
              <button type="button" onClick={() => select(item.id)} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
                {item.mime === 'application/pdf' || /\.pdf$/i.test(item.name) ? (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-muted/30 text-muted-foreground">
                    <FileText className="h-4 w-4" aria-hidden />
                  </span>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.srcUrl} alt="" className="h-10 w-10 shrink-0 rounded-md border border-border object-cover" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <StatusIcon status={item.status} />
                    <span className="truncate text-xs font-medium">{item.name}</span>
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {item.width > 0 ? `${item.width}×${item.height} · ` : ''}
                    {item.result ? humanSize(item.result.size) : humanSize(item.size)}
                  </span>
                  {(item.status === 'processing' || item.status === 'queued') && (
                    <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-primary transition-all" style={{ width: `${Math.round(item.progress * 100)}%` }} />
                    </span>
                  )}
                  {item.status === 'error' && <span className="mt-0.5 block truncate text-[11px] text-danger">{item.error}</span>}
                </span>
              </button>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => removeItem(item.id)}
                className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-danger group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
