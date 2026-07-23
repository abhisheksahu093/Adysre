'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from 'adysre';
import { ACCESS_COOKIE, ACCESS_LEVELS, type AccessLevel } from '@/lib/access';

/**
 * Development-only entitlement switch.
 *
 * There is no billing backend, so without this there is no way to see the
 * unlocked state at all. It flips the same cookie `getAccessLevel` reads, which
 * makes the whole redaction path exercisable end-to-end.
 *
 * It is NOT a feature. The caller renders it only outside production, and the
 * cookie stops being authoritative the moment real entitlements land.
 */
export function AccessSwitcher({ current }: { current: AccessLevel }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('pages.profile');

  function setLevel(level: AccessLevel) {
    document.cookie = `${ACCESS_COOKIE}=${level};path=/;max-age=86400;samesite=lax`;
    // refresh(), not reload(): the page is a Server Component, so the redaction
    // has to re-run on the server for the change to mean anything.
    startTransition(() => router.refresh());
  }

  return (
    <div className="rounded-md border border-dashed border-warning/40 bg-warning/5 p-3">
      <p className="text-xs font-medium text-warning">{t('devOnly')}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t('devOnlyHint')}</p>
      <div className="mt-3 flex gap-2">
        {ACCESS_LEVELS.map((level) => (
          <Button
            key={level}
            type="button"
            size="sm"
            variant={current === level ? 'primary' : 'outline'}
            disabled={isPending}
            onClick={() => setLevel(level)}
          >
            {t(level === 'premium' ? 'planPremium' : 'planFree')}
          </Button>
        ))}
      </div>
    </div>
  );
}
