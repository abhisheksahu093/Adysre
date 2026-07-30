'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, PenTool, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { NotificationsMenu } from '@/components/notifications-menu';
import { CartMenu } from '@/components/cart-menu';
import { PremiumButton } from '@/components/premium-button';
import { UserMenu } from '@/components/user-menu';
import { useSessionUser } from '@/hooks/use-session-user';
import { LANDING_LINKS } from '@/data/landing';

interface NavItem {
  href: string;
  /** Key under the shared `nav` namespace. */
  navKey: string;
  soon?: boolean;
}

/**
 * Marketing nav grouped into dropdowns. Link labels come from the shared `nav`
 * namespace (so wording never drifts from the in-app sidebar); the group labels
 * come from `landing.nav.menus.*`.
 *
 * Components has no dropdown of its own: once icons moved in with the colour
 * families, the old Library menu had a single child, and a menu you open to find
 * one link is worse than the link. It is a top-level destination now, like
 * Templates.
 */
const NAV_MENUS: { key: string; items: NavItem[] }[] = [
  {
    key: 'colorsSurfaces',
    items: [
      { href: '/colors-surfaces?tab=palettes', navKey: 'palettes' },
      { href: '/colors-surfaces?tab=gradients', navKey: 'gradients' },
      { href: '/colors-surfaces?tab=patterns', navKey: 'patterns' },
      { href: '/colors-surfaces?tab=textures', navKey: 'textures' },
      { href: '/colors-surfaces?tab=icons', navKey: 'icons' },
    ],
  },
  {
    key: 'tools',
    items: [
      { href: LANDING_LINKS.codeStudio, navKey: 'codeStudio' },
      { href: LANDING_LINKS.apiStudio, navKey: 'apiStudio' },
      { href: LANDING_LINKS.designPlayground, navKey: 'designPlayground' },
      { href: LANDING_LINKS.customize, navKey: 'customize' },
      { href: LANDING_LINKS.aiTools, navKey: 'aiTools' },
      { href: LANDING_LINKS.codes, navKey: 'codes' },
      { href: LANDING_LINKS.documents, navKey: 'documents' },
      { href: LANDING_LINKS.websiteIntelligence, navKey: 'websiteIntelligence' },
      { href: LANDING_LINKS.rules, navKey: 'rules' },
      { href: LANDING_LINKS.resume, navKey: 'resume' },
    ],
  },
];

/** Where a visitor with no session goes. Signed-in people get `UserMenu`. */
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
 * The mobile counterpart of `NavMenu`: the same group, collapsed behind a
 * disclosure instead of a hover panel. Flat, the two groups run to fifteen rows
 * and push the account and workspace actions off the bottom of a phone; folded,
 * the whole menu fits on one screen and mirrors what the desktop header shows.
 *
 * Controlled by the parent so only one group is open at a time and everything
 * resets when the drawer closes.
 */
function MobileNavGroup({
  id,
  label,
  items,
  open,
  onToggle,
  soonLabel,
  navLabel,
  onNavigate,
}: {
  id: string;
  label: string;
  items: NavItem[];
  open: boolean;
  onToggle: () => void;
  soonLabel: string;
  navLabel: (key: string) => string;
  onNavigate: () => void;
}) {
  const panelId = `mobile-nav-${id}`;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          open ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      {open && (
        <div id={panelId} className="mt-1 space-y-1 border-l border-border pl-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
 * Distinct from the in-app Topbar: this is the marketing chrome. It reuses the
 * app's notifications, cart, premium and account controls (Rule 3 - never
 * duplicate) and shows whichever account affordance fits: a sign-in link for a
 * visitor, the same `UserMenu` the app shell uses for someone already signed
 * in, so returning here does not look like having been logged out. Client
 * Component because it tracks scroll for the backdrop and owns the mobile menu.
 *
 * The session is resolved in the BROWSER rather than passed down from the page.
 * This header renders on the landing page, which `generateStaticParams`
 * pre-renders; reading the auth cookie on the server would make the whole
 * marketing page dynamic to decide the state of one button.
 */
export function LandingHeader() {
  const t = useTranslations('landing');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const tPremium = useTranslations('premium');
  const { signedIn, isLoading: sessionLoading } = useSessionUser();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Which mobile group is expanded, or none. One at a time, so opening the
  // second group never buries the actions under thirty rows again.
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const closeMenu = () => {
    setOpen(false);
    setOpenGroup(null);
  };

  // Neither affordance until the session is known: showing "Sign in" to someone
  // who is signed in, or an avatar to someone who is not, is worse than a
  // momentarily empty slot.
  const showSignIn = !sessionLoading && !signedIn;

  // A hairline border and blur appear once the page moves, so the header reads
  // as flat over the hero and lifted over content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // While the drawer is open the page behind it must not move: the header is
  // sticky, so a page scroll would slide the content under a pinned panel
  // rather than moving the panel. The panel scrolls itself instead.
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      setOpenGroup(null);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

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
          <Link
            href={LANDING_LINKS.components}
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {tNav('components')}
          </Link>

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
            {/* One slot, one state: the account menu takes the place the
                sign-in link had, rather than sitting beside it. */}
            {showSignIn && (
              <Link href={LOGIN_HREF} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                {tAuth('signIn.title')}
              </Link>
            )}
            {signedIn && (
              <div className="mx-1">
                <UserMenu />
              </div>
            )}
            <Link href={LANDING_LINKS.designPlayground} className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}>
              <PenTool className="h-3.5 w-3.5" aria-hidden />
              {tNav('designPlayground')}
            </Link>
          </div>

          {/* Below `lg` the account menu stays in the bar instead of moving into
              the drawer: it is already a compact avatar, and signing out should
              not be two taps behind a hamburger. */}
          {signedIn && (
            <div className="ml-1 lg:hidden">
              <UserMenu />
            </div>
          )}

          <button
            type="button"
            onClick={() => (open ? closeMenu() : setOpen(true))}
            aria-expanded={open}
            aria-label={open ? t('nav.closeMenu') : t('nav.menu')}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'lg:hidden')}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile disclosure - rendered in the flow so it pushes nothing and
          closes on any navigation. It scrolls itself: the header above is
          sticky, so a menu taller than the screen would otherwise run past the
          bottom of the viewport with no way to reach the rest of it. The cap is
          the viewport minus the `h-16` bar, in `dvh` so mobile browser chrome
          collapsing does not leave the last row under the address bar. */}
      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-border bg-background lg:hidden">
          <nav
            aria-label={tNav('mainLabel')}
            className="mx-auto max-w-7xl space-y-1 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:px-6"
          >
            {/* Top level here too, matching the desktop nav. */}
            <Link
              href={LANDING_LINKS.components}
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {tNav('components')}
            </Link>

            {/* Same grouping as the desktop dropdowns, collapsed by default. */}
            {NAV_MENUS.map((menu) => (
              <MobileNavGroup
                key={menu.key}
                id={menu.key}
                label={t(`nav.menus.${menu.key}`)}
                items={menu.items}
                open={openGroup === menu.key}
                onToggle={() => setOpenGroup((current) => (current === menu.key ? null : menu.key))}
                soonLabel={tCommon('comingSoon')}
                navLabel={tNav}
                onNavigate={closeMenu}
              />
            ))}

            {/* Top level here too, matching the desktop nav. */}
            <Link
              href={LANDING_LINKS.templates}
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {tNav('templates')}
            </Link>

            <div className="my-2 h-px bg-border" aria-hidden />
            {/* Absent once signed in - the avatar in the bar above owns the
                account from that point on. */}
            {showSignIn && (
              <Link
                href={LOGIN_HREF}
                onClick={closeMenu}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-1 w-full')}
              >
                {tAuth('signIn.title')}
              </Link>
            )}

            {/* The actions the desktop bar carries beside the nav, which the
                drawer previously left out or buried: premium and the workspace
                entry sit side by side, and the playground keeps the filled
                variant it has up there. */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href={LANDING_LINKS.pricing}
                onClick={closeMenu}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full gap-1.5')}
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {tPremium('cta')}
              </Link>
              {/* Code Studio, not `LANDING_LINKS.app`: that resolves to the
                  first sidebar item, which is the Components row three lines
                  up. The hero means the browser IDE by "workspace" and so does
                  this. */}
              <Link
                href={LANDING_LINKS.codeStudio}
                onClick={closeMenu}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full gap-1.5')}
              >
                {t('nav.openApp')}
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
              </Link>
            </div>

            <Link
              href={LANDING_LINKS.designPlayground}
              onClick={closeMenu}
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
