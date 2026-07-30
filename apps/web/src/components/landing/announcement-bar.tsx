'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, X } from 'lucide-react';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { ANNOUNCEMENT } from '@/data/landing';

/** localStorage key holding the last dismissed announcement id. */
const STORAGE_KEY = 'adysre:announcement-dismissed';

/**
 * Launch banner pinned above the header.
 *
 * Dismissal persists in localStorage, keyed on the announcement id, so closing
 * it stays closed until a new announcement ships (the id changes in
 * `ANNOUNCEMENT`). Both server and first client render return nothing until
 * mount, so there is no hydration mismatch and no flash of a bar the visitor
 * already dismissed. Copy and destination are config-driven (`landing`
 * namespace + `ANNOUNCEMENT`), never hardcoded here.
 */
export function AnnouncementBar() {
  const t = useTranslations('landing');
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === ANNOUNCEMENT.id);
    } catch {
      // Private-mode or blocked storage: show the bar rather than hide it.
      setDismissed(false);
    }
  }, []);

  if (!mounted || dismissed) return null;

  const Icon = ANNOUNCEMENT.icon;
  const close = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, ANNOUNCEMENT.id);
    } catch {
      // Nothing to persist to; the bar just closes for this session.
    }
  };

  return (
    <div
      role="region"
      aria-label={t('announcement.region')}
      className="relative z-50 border-b border-line bg-panel"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-2 sm:px-6">
        <Link
          href={ANNOUNCEMENT.href}
          className="group flex min-w-0 items-center gap-x-2.5 gap-y-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="inline-flex shrink-0 items-center gap-1.5 font-hud text-[10.5px] uppercase tracking-[0.08em] text-signal">
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {t('announcement.badge')}
          </span>
          <span className="truncate text-[13px] font-medium text-foreground">
            {t('announcement.label')}
          </span>
          <span className="hidden shrink-0 items-center gap-1 text-[13px] text-muted-foreground group-hover:text-foreground sm:inline-flex">
            {t('announcement.cta')}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </Link>

        <button
          type="button"
          onClick={close}
          aria-label={t('announcement.dismiss')}
          title={t('announcement.dismiss')}
          className={cn(
            'ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors',
            'hover:bg-panel-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
