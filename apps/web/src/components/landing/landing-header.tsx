'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, PenTool, ChevronDown } from 'lucide-react';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { NotificationsMenu } from '@/components/notifications-menu';
import { CartMenu } from '@/components/cart-menu';
import { PremiumButton } from '@/components/premium-button';
import { LANDING_LINKS } from '@/data/landing';

interface NavItem {
  href: string;
  /** Key under the shared `nav` namespace. */
  navKey: string;
  soon?: boolean;
}

/**
 * Marketing nav grouped into two dropdowns. Link labels come from the shared
 * `nav` namespace (so wording never drifts from the in-app sidebar); the group
 * labels come from `landing.nav.menus.*`.
 */
const NAV_MENUS: { key: string; items: NavItem[] }[] = [
  {
    key: 'library',
    items: [
      { href: LANDING_LINKS.components, navKey: 'components' },
      { href: LANDING_LINKS.icons, navKey: 'icons' },
    ],
  },
  {
    key: 'styles',
    items: [
      { href: LANDING_LINKS.palettes, navKey: 'palettes' },
      { href: LANDING_LINKS.gradients, navKey: 'gradients' },
      { href: LANDING_LINKS.patterns, navKey: 'patterns' },
      { href: LANDING_LINKS.textures, navKey: 'textures' },
    ],
  },
  {
    key: 'tools',
    items: [
      { href: LANDING_LINKS.codes, navKey: 'codes' },
      { href: LANDING_LINKS.documents, navKey: 'documents' },
      { href: LANDING_LINKS.websiteIntelligence, navKey: 'websiteIntelligence' },
      { href: LANDING_LINKS.resume, navKey: 'resume' },
    ],
  },
];

/** Auth entry point - a visitor signs in rather than opening an account menu. */
const LOGIN_HREF = '/login';

/**
 * One header dropdown: a trigger that opens on hover or click, closes on
 * outside-click, blur-out and Escape. The panel is a real menu of locale-aware
 * links; choosing one navigates and closes.
 */
function NavMenu({
  label,
  items,
  soonLabel,
  navLabel,
}: {
  label: string;
  items: NavItem[];
  soonLabel: string;
  navLabel: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className={cn(
          'inline-flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          open ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 min-w-52 rounded-lg border border-border bg-card p-1.5 shadow-lg"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:bg-muted focus-visible:text-foreground"
            >
              {navLabel(item.navKey)}
              {item.soon && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {soonLabel}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const tCommon = useTranslations('common');
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
        scrolled ? 'border-b border-border bg-background/80 backdrop-blur' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="ADYSRE" className="shrink-0">
          <Logo height={28} priority />
        </Link>

        <nav aria-label={tNav('mainLabel')} className="ml-2 hidden items-center gap-1 lg:flex">
          {NAV_MENUS.map((menu) => (
            <NavMenu
              key={menu.key}
              label={t(`nav.menus.${menu.key}`)}
              items={menu.items}
              soonLabel={tCommon('comingSoon')}
              navLabel={tNav}
            />
          ))}

          {/* Templates is a destination, not a category: it earns a top-level
              slot rather than a row inside the Library dropdown. */}
          <Link
            href={LANDING_LINKS.templates}
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {tNav('templates')}
          </Link>
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
            <Link href={LOGIN_HREF} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              {tAuth('signIn.title')}
            </Link>
            <Link href={LANDING_LINKS.designPlayground} className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}>
              <PenTool className="h-3.5 w-3.5" aria-hidden />
              {tNav('designPlayground')}
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
          <nav aria-label={tNav('mainLabel')} className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {NAV_MENUS.map((menu) => (
              <div key={menu.key} className="pb-1">
                <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(`nav.menus.${menu.key}`)}
                </p>
                {menu.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {tNav(item.navKey)}
                    {item.soon && (
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {tCommon('comingSoon')}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}

            <div className="my-2 h-px bg-border" aria-hidden />

            {/* Top level here too, matching the desktop nav. */}
            <Link
              href={LANDING_LINKS.templates}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {tNav('templates')}
            </Link>
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
              href={LANDING_LINKS.designPlayground}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: 'sm' }), 'mt-2 w-full gap-1.5')}
            >
              <PenTool className="h-3.5 w-3.5" aria-hidden />
              {tNav('designPlayground')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
