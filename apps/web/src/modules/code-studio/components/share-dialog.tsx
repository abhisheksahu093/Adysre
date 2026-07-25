'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy, Link2, Loader2 } from 'lucide-react';
import { Button, Dialog, cn } from 'adysre';
import { useStudioStore } from '../store/use-studio-store';
import { createShareUrl } from '../services/share';

/**
 * Share dialog: compresses the whole project into a link (URL hash, no server).
 * A read-only link opens the project locked; either way, opening it forks a
 * fresh local copy so the recipient's edits are their own.
 */
export function ShareDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('codeStudio');
  const project = useStudioStore((s) => s.project);
  const [readOnly, setReadOnly] = useState(false);
  const [url, setUrl] = useState('');
  const [building, setBuilding] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !project) return;
    let alive = true;
    setBuilding(true);
    createShareUrl(project, { readOnly })
      .then((next) => alive && setUrl(next))
      .finally(() => alive && setBuilding(false));
    return () => {
      alive = false;
    };
  }, [open, project, readOnly]);

  const copy = () => {
    void navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Dialog open={open} onClose={onClose} title={t('share.title')} description={t('share.description')} className="sm:max-w-lg">
      <div className="space-y-4">
        <button
          type="button"
          role="switch"
          aria-checked={readOnly}
          onClick={() => setReadOnly((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left"
        >
          <span>
            <span className="block text-sm font-medium">{t('share.readOnly')}</span>
            <span className="block text-xs text-muted-foreground">{t('share.readOnlyHint')}</span>
          </span>
          <span className={cn('relative h-5 w-9 shrink-0 rounded-full transition-colors', readOnly ? 'bg-primary' : 'bg-muted')}>
            <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', readOnly ? 'left-0.5 translate-x-4' : 'left-0.5')} />
          </span>
        </button>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
          <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          {building ? (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              {t('share.building')}
            </span>
          ) : (
            <input
              readOnly
              value={url}
              onFocus={(e) => e.target.select()}
              className="min-w-0 flex-1 bg-transparent text-xs text-muted-foreground outline-none"
            />
          )}
          <Button type="button" size="sm" variant="outline" onClick={copy} disabled={building || !url}>
            {copied ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? t('share.copied') : t('share.copy')}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">{t('share.note')}</p>
      </div>
    </Dialog>
  );
}
