'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { MobileNav } from './mobile-nav';
import { ThemeSwitcher } from './theme-switcher';
import { CartMenu } from './cart-menu';
import { NotificationsMenu } from './notifications-menu';
import { PremiumButton } from './premium-button';
import { UserMenu } from './user-menu';

/** Sticky topbar with search, notifications, theme, cart and account. */
export function Topbar() {
  const t = useTranslations('topbar');

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-1 border-b border-border bg-background/80 px-4 backdrop-blur sm:gap-2 sm:px-6">
      <MobileNav />
      <button
        type="button"
        className="flex flex-1 items-center gap-2 text-sm text-muted-foreground"
        aria-label={t('commandPalette')}
      >
        <Search className="h-4 w-4 shrink-0" />
        {/* The label is noise on a phone - the icon carries it. */}
        <span className="hidden sm:inline">{t('searchPlaceholder')}</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-xs sm:inline">
          ⌘K
        </kbd>
      </button>

      <NotificationsMenu />
      <ThemeSwitcher />
      <CartMenu />
      <div className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden />
      <PremiumButton />
      <UserMenu />
    </header>
  );
}
