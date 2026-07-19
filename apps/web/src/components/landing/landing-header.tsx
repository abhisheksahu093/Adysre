'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, ArrowRight } from 'lucide-react';
import { buttonVariants, cn } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { NotificationsMenu } from '@/components/notifications-menu';
import { CartMenu } from '@/components/cart-menu';
import { PremiumButton } from '@/components/premium-button';
import { LANDING_LINKS } from '@/data/landing';

/** Marketing header links; labels come from the shared `nav` namespace so the
 *  wording can never drift from the in-app sidebar. */
const NAV_LINKS = [
  { href: LANDING_LINKS.components, navKey: 'components' },
  { href: LANDING_LINKS.icons, navKey: 'icons' },
  { href: LANDING_LINKS.palettes, navKey: 'palettes' },
  { href: LANDING_LINKS.gradients, navKey: 'gradients' },
  { href: LANDING_LINKS.promptLibrary, navKey: 'promptLibrary' },
] as const;

/** Auth entry point - a visitor signs in rather than opening an account menu. */
const LOGIN_HREF = '/login';

/**
 * Sticky marketing header for the landing page.
 *
 * Distinct from the in-app Topbar: this is the pre-login chrome. It reuses the
 * app's notifications, cart and premium controls (Rule 3 - never duplicate) and
 * adds a sign-in link, so an account action is always one click away. Client
 * Component because it tracks scroll for the backdrop and owns the mobile menu.
 */
export function LandingHeader() {
  const t = useTranslations('landing');
  const tNav = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const tPremium = useTranslations('premium');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // A hairline border and blur appear once the page moves, so the header reads
  // as flat over the hero and lifted over content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-colors',
        scrolled
          ? 'border-b border-border bg-background/80 backdrop-blur'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="ADYSRE" className="shrink-0">
          <Logo height={28} priority />
        </Link>

        <nav aria-label={tNav('mainLabel')} className="ml-2 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ href, navKey }) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {tNav(navKey)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          {/* Icon controls, reused from the app shell. Hidden on the narrowest
              screens, where they move into the mobile menu's reach. */}
          <div className="hidden items-center sm:flex">
            <NotificationsMenu />
            <CartMenu />
          </div>
          <ThemeSwitcher />

          <div className="mx-1 hidden h-5 w-px bg-border lg:block" aria-hidden />

          {/* Text actions collapse into the mobile menu below `lg`. */}
          <div className="hidden items-center gap-1 lg:flex">
            <PremiumButton />
            <Link
              href={LOGIN_HREF}
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
            >
              {tAuth('signIn.title')}
            </Link>
            <Link
              href={LANDING_LINKS.app}
              className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}
            >
              {t('nav.openApp')}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t('nav.closeMenu') : t('nav.menu')}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'lg:hidden')}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile disclosure - rendered in the flow so it pushes nothing and
          closes on any navigation. */}
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav
            aria-label={tNav('mainLabel')}
            className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6"
          >
            {NAV_LINKS.map(({ href, navKey }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {tNav(navKey)}
              </Link>
            ))}

            <div className="my-2 h-px bg-border" aria-hidden />

            <Link
              href={LANDING_LINKS.pricing}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {tPremium('cta')}
            </Link>
            <Link
              href={LOGIN_HREF}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-1 w-full')}
            >
              {tAuth('signIn.title')}
            </Link>
            <Link
              href={LANDING_LINKS.app}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: 'sm' }), 'mt-2 w-full gap-1.5')}
            >
              {t('nav.openApp')}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
