'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { TRUSTED_USERS } from '@/config/audience';

/**
 * All-Access upsell pinned to the bottom of the sidebar.
 *
 * Client Component only because it reads translations with a formatted number;
 * it holds no state.
 */
export function PromoCard() {
  const t = useTranslations('promo');

  return (
    <div className="m-3 mt-0 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
      <div className="relative h-24 w-full">
        <Image
          src="/promo/all-access.svg"
          alt=""
          fill
          sizes="240px"
          className="object-cover"
        />
        {/* Fades the artwork into the card so the copy below reads cleanly. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-card to-transparent"
          aria-hidden
        />
      </div>

      <div className="space-y-2 p-3 pt-1">
        <p className="text-sm font-semibold text-foreground">{t('title')}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{t('description')}</p>
        <Link
          href="/pricing"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
        >
          {t('cta')}
        </Link>
        {/* `number` formatting, not a literal: Hindi groups as 1,20,000. */}
        <p className="pt-1 text-center text-[10px] text-muted-foreground">
          {t('trust', { count: TRUSTED_USERS })}
        </p>
      </div>
    </div>
  );
}
