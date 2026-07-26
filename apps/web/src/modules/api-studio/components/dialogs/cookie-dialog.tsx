'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
import { Button, Dialog } from 'adysre';
import type { CookieRecord } from '../../types';

/**
 * The cookie jar editor.
 *
 * Values are NOT shown. The jar is encrypted at rest and the list endpoint
 * masks them unless the caller holds `api-studio:secret:read`, so this shows
 * what a person needs to manage cookies - which host set what, when it expires,
 * whether it is secure - and lets them delete. A row that displayed a live
 * session token would undo the encryption behind it.
 */
export function CookieDialog({
  open,
  onClose,
  cookies,
  loading,
  onDelete,
  onClearAll,
}: {
  open: boolean;
  onClose: () => void;
  cookies: CookieRecord[];
  loading: boolean;
  onDelete: (cookie: CookieRecord) => void;
  onClearAll: () => void;
}) {
  const t = useTranslations('apiStudio');
  const locale = useLocale();
  const [confirming, setConfirming] = useState(false);

  // Reopening must not land on a primed "are you sure".
  useEffect(() => {
    if (!open) setConfirming(false);
  }, [open]);

  const formatExpiry = (expires: number | null): string =>
    expires === null
      ? t('cookies.session')
      : new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(expires);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('cookies.title')}
      description={t('cookies.description')}
      className="max-w-3xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('codegen.close')}
          </Button>
          {cookies.length > 0 &&
            (confirming ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onClearAll();
                  setConfirming(false);
                }}
              >
                {t('cookies.confirmClear')}
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
                {t('cookies.clearAll')}
              </Button>
            ))}
        </>
      }
    >
      {loading ? (
        <p className="py-6 text-center text-xs text-muted-foreground">{t('cookies.loading')}</p>
      ) : cookies.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">{t('cookies.empty')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="py-2 pe-3 font-medium">{t('response.cookieName')}</th>
                <th scope="col" className="py-2 pe-3 font-medium">{t('response.cookieDomain')}</th>
                <th scope="col" className="py-2 pe-3 font-medium">{t('cookies.path')}</th>
                <th scope="col" className="py-2 pe-3 font-medium">{t('cookies.expires')}</th>
                <th scope="col" className="py-2 pe-3 font-medium">{t('response.cookieFlags')}</th>
                <th scope="col" className="w-9 py-2">
                  <span className="sr-only">{t('table.remove')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {cookies.map((cookie) => (
                <tr
                  key={`${cookie.domain}-${cookie.path}-${cookie.name}`}
                  className="border-t border-border"
                >
                  <td className="py-1.5 pe-3 font-mono">{cookie.name}</td>
                  <td className="py-1.5 pe-3 font-mono text-muted-foreground">{cookie.domain}</td>
                  <td className="py-1.5 pe-3 font-mono text-muted-foreground">{cookie.path}</td>
                  <td className="py-1.5 pe-3 text-muted-foreground">{formatExpiry(cookie.expires)}</td>
                  <td className="py-1.5 pe-3 text-muted-foreground">
                    {[
                      cookie.secure ? 'Secure' : null,
                      cookie.httpOnly ? 'HttpOnly' : null,
                      cookie.sameSite ? `SameSite=${cookie.sameSite}` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || '-'}
                  </td>
                  <td className="py-1.5">
                    <button
                      type="button"
                      onClick={() => onDelete(cookie)}
                      aria-label={t('cookies.delete', { name: cookie.name })}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-3 text-xs text-muted-foreground">{t('cookies.maskedHint')}</p>
        </div>
      )}
    </Dialog>
  );
}
