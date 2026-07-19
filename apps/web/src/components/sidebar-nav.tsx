'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@adysre/ui';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV_ITEMS } from '@/config/navigation';
import { Logo } from './logo';

/** Brand mark - shared by the desktop sidebar and the mobile drawer. */
export function SidebarBrand() {
  const t = useTranslations('nav');
  return (
    // h-14 must match the topbar's height - they sit side by side and their
    // bottom borders read as one continuous line. px-4 rather than px-5 buys
    // the wordmark room without crowding the 16rem rail.
    <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
      {/* The wordmark links home to the public landing page - the expected
          affordance for a logo. It already reads "ADYSRE", so an aria-label
          names the destination rather than repeating the brand. */}
      <Link
        href="/"
        aria-label={t('backToHome')}
        className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Logo height={34} priority />
      </Link>
    </div>
  );
}

/**
 * The navigation list itself, rendered from NAV_ITEMS. Extracted so the
 * desktop sidebar and the mobile drawer stay in sync from one definition
 * (Rule 3 - never duplicate components).
 */
export function SidebarNav({ onNavigate = () => {} }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <nav aria-label={t('mainLabel')} className="flex-1 space-y-1 overflow-y-auto p-3">
      {NAV_ITEMS.map(({ key, href, icon: Icon, comingSoon }) => {
        // usePathname from @/i18n/navigation is locale-stripped, so this
        // compares cleanly against the unprefixed hrefs in NAV_ITEMS.
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{t(key)}</span>
            {comingSoon && (
              <span className="ml-auto shrink-0 rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {tCommon('comingSoon')}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
