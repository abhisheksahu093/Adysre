'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Bell, BellOff, Check, X, CheckCheck, Trash2 } from 'lucide-react';
import { Button, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { useDismissable } from '@/hooks/use-dismissable';
import { NOTIFICATIONS } from '@/data/notifications';
import { useNotificationsStore } from '@/stores/notifications-store';

/** Compact relative time, e.g. "today", "3 days ago", "2 months ago". */
function relativeTime(iso: string, locale: string): string {
  const then = new Date(iso).getTime();
  const days = Math.round((Date.now() - then) / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (days <= 0) return rtf.format(0, 'day');
  if (days < 7) return rtf.format(-days, 'day');
  if (days < 30) return rtf.format(-Math.round(days / 7), 'week');
  if (days < 365) return rtf.format(-Math.round(days / 30), 'month');
  return rtf.format(-Math.round(days / 365), 'year');
}

/**
 * Topbar notifications: a bell with an unread badge that opens a list of
 * product announcements. Each can be opened (marks it read) or dismissed;
 * the header offers mark-all-read and clear-all. Read/dismissed state persists.
 */
export function NotificationsMenu() {
  const t = useTranslations('notifications');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dismissedIds = useNotificationsStore((s) => s.dismissedIds);
  const readIds = useNotificationsStore((s) => s.readIds);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const dismiss = useNotificationsStore((s) => s.dismiss);
  const clearAll = useNotificationsStore((s) => s.clearAll);

  // The persisted store hydrates after mount; gate the badge so the server and
  // first client render agree (no hydration mismatch), then reveal it.
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismissable<HTMLDivElement>(open, close);

  const visible = useMemo(
    () => NOTIFICATIONS.filter((n) => !dismissedIds.includes(n.id)),
    [dismissedIds],
  );
  const unread = useMemo(
    () => (mounted ? visible.filter((n) => !readIds.includes(n.id)).length : 0),
    [visible, readIds, mounted],
  );

  const visibleIds = visible.map((n) => n.id);

  return (
    <div ref={ref} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          unread > 0 ? t('openWithCount', { count: unread }) : t('open')
        }
        onClick={() => setOpen((v) => !v)}
        className="relative text-muted-foreground hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold tabular-nums text-primary-foreground"
            aria-hidden
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label={t('label')}
          // Anchored to the viewport's right edge (not the bell, which sits well
          // left of it) so the panel never runs off a narrow screen.
          className="fixed right-2 top-[3.75rem] z-30 w-[min(23rem,calc(100vw-1rem))] overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:right-4"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold tracking-tight">{t('title')}</p>
              {unread > 0 && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-primary">
                  {t('unreadCount', { count: unread })}
                </span>
              )}
            </div>
            {visible.length > 0 && (
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t('markAllRead')}
                  title={t('markAllRead')}
                  disabled={unread === 0}
                  onClick={() => markAllRead(visibleIds)}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <CheckCheck className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t('clearAll')}
                  title={t('clearAll')}
                  onClick={() => clearAll(visibleIds)}
                  className="h-7 w-7 text-muted-foreground hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <BellOff className="h-7 w-7 text-muted-foreground" aria-hidden />
              <p className="text-sm text-muted-foreground">{t('empty')}</p>
            </div>
          ) : (
            <ul className="max-h-[min(26rem,60vh)] divide-y divide-border overflow-y-auto">
              {visible.map((n) => {
                const isRead = readIds.includes(n.id);
                const Icon = n.icon;
                return (
                  <li key={n.id} className="group/notif relative">
                    <Link
                      href={n.href}
                      onClick={() => {
                        markRead(n.id);
                        close();
                      }}
                      className={cn(
                        'flex items-start gap-3 px-4 py-3 pr-9 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:bg-muted',
                        !isRead && 'bg-primary/[0.04]',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          isRead ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
                        )}
                        aria-hidden
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          {!isRead && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                          )}
                          <span
                            className={cn(
                              'truncate text-sm',
                              isRead ? 'font-medium text-foreground' : 'font-semibold text-foreground',
                            )}
                          >
                            {t(`items.${n.key}.title`)}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {t(`items.${n.key}.body`)}
                        </span>
                        <span className="mt-1 block text-[11px] text-muted-foreground/80">
                          {relativeTime(n.date, locale)}
                        </span>
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => dismiss(n.id)}
                      aria-label={t('dismiss', { title: t(`items.${n.key}.title`) })}
                      title={t('dismiss', { title: t(`items.${n.key}.title`) })}
                      className="absolute right-2 top-2.5 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/notif:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {!isRead && (
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        aria-label={t('markRead', { title: t(`items.${n.key}.title`) })}
                        title={t('markRead', { title: t(`items.${n.key}.title`) })}
                        className="absolute bottom-2.5 right-2 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-primary focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/notif:opacity-100"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
