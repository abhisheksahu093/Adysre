'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { LogoIcon } from './logo';
import { MobileNav } from './mobile-nav';
import { SidebarToggle } from './sidebar-toggle';
import { ThemeSwitcher } from './theme-switcher';
import { CartMenu } from './cart-menu';
import { NotificationsMenu } from './notifications-menu';
import { PremiumButton } from './premium-button';
import { UserMenu } from './user-menu';
import { SearchCommand } from './search-command';

/** Sticky topbar with search, notifications, theme, cart and account. */
export function Topbar() {
  const t = useTranslations('topbar');
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd/Ctrl-K opens the command palette from anywhere in the app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-1 border-b border-border bg-background/80 px-4 backdrop-blur sm:gap-2 sm:px-6">
      <MobileNav />
      {/* Below `md` the sidebar is a drawer, so its rail mark is the only
          branding on screen and it is not on screen. The compact mark stands in
          here, and doubles as the way home: on a phone the wordmark in the
          drawer is two taps away. Hidden from `md` up, where the rail shows it. */}
      <Link href="/" aria-label="ADYSRE" className="mr-1 shrink-0 md:hidden">
        <LogoIcon height={20} priority />
      </Link>
      <SidebarToggle />
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="flex flex-1 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        aria-label={t('commandPalette')}
      >
        <Search className="h-4 w-4 shrink-0" />
        {/* The label is noise on a phone - the icon carries it. */}
        <span className="hidden sm:inline">{t('searchPlaceholder')}</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-xs sm:inline">
          ⌘K
        </kbd>
      </button>

      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />

      <NotificationsMenu />
      <ThemeSwitcher />
      <CartMenu />
      <div className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden />
      <PremiumButton />
      <UserMenu />
    </header>
  );
}
