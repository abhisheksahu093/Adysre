'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
import { CTA_ARROW, CTA_GLYPH, ctaClass } from './cta';

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

/** Shared shape for the text controls in the pill, so they sit on one rhythm. */
const TOOL_ITEM =
  'rounded-lg px-3 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/**
 * Grace period before a hover-opened menu closes.
 *
 * Pointing at a menu item is not a straight line: the cursor cuts the corner,
 * clips the edge of the panel, and comes back. Closing on the first frame
 * outside makes the menu unusable for exactly the movement people actually
 * make, so leaving is given a moment to be reconsidered. Long enough to cross a
 * corner, short enough that a menu never feels stuck open.
 */
const MENU_CLOSE_DELAY_MS = 220;

/** A hairline between groups of controls, the way a tool rail is divided. */
function Divider() {
  return <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-line" />;
}

/**
 * One dropdown in the tool rail: a trigger that opens on hover or click, closes
 * on outside-click, blur-out and Escape. The panel is a real menu of
 * locale-aware links; choosing one navigates and closes.
 *
 * Reaching an item has to be possible. The panel hangs below the trigger with a
 * gap, and that gap used to be dead space - the pointer crossing it was outside
 * the menu, which closed it before it could ever be reached. The offset is now
 * padding on the menu's own wrapper, so the path from trigger to first item is
 * continuous, and leaving is still given `MENU_CLOSE_DELAY_MS` to be undone.
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current === null) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const openNow = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const closeNow = useCallback(() => {
    cancelClose();
    setOpen(false);
  }, [cancelClose]);

  const closeSoon = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), MENU_CLOSE_DELAY_MS);
  }, [cancelClose]);

  // A pending close must not outlive the menu: it would fire against an
  // unmounted component after a route change.
  useEffect(() => cancelClose, [cancelClose]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) closeNow();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, closeNow]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeNow();
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => (open ? closeNow() : openNow())}
        onKeyDown={(e) => e.key === 'Escape' && closeNow()}
        className={cn(
          TOOL_ITEM,
          'inline-flex items-center gap-1 whitespace-nowrap',
          open ? 'bg-panel-raised text-foreground' : 'text-muted-foreground hover:bg-panel-raised hover:text-foreground',
        )}
      >
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      {open && (
        // The offset is padding on this wrapper rather than a margin on the
        // panel, so the strip between the trigger and the first item is part of
        // the menu and the pointer never has to leave to get there.
        <div className="absolute left-0 top-full z-50 pt-1.5">
          <div
            role="menu"
            className="min-w-56 rounded-xl border border-line bg-panel p-1.5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_20px_50px_-30px_rgb(0_0_0/0.7)]"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={closeNow}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-panel-raised hover:text-foreground focus-visible:outline-none focus-visible:bg-panel-raised focus-visible:text-foreground"
              >
                {navLabel(item.navKey)}
                {item.soon && (
                  <span className="font-hud text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                    {soonLabel}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * The tool rail that floats over the canvas, in place of a full-width bar.
 *
 * It carries exactly what the old header carried - both dropdowns, every
 * top-level destination, notifications, cart, theme, premium, the account menu
 * and the playground call to action - in the shape of a tool palette rather
 * than a web header, because the page beneath it is a work surface.
 *
 * Client Component: it owns two disclosure states (the dropdowns and the mobile
 * drawer) and resolves the session in the browser, so the statically rendered
 * marketing page does not go dynamic to decide the state of one button.
 */
export function LandingHeader() {
  const t = useTranslations('landing');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const tPremium = useTranslations('premium');
  const { signedIn, isLoading: sessionLoading } = useSessionUser();
  const [open, setOpen] = useState(false);
  // Which mobile group is expanded, or none. One at a time, so opening the
  // second group never buries the actions under a list of thirty.
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Neither affordance until the session is known: showing "Sign in" to someone
  // who is signed in, or an avatar to someone who is not, is worse than a
  // momentarily empty slot.
  const showSignIn = !sessionLoading && !signedIn;

  const closeMenu = () => {
    setOpen(false);
    setOpenGroup(null);
  };

  // While the drawer is open the page behind it must not move: the rail is
  // sticky, so a page scroll would slide content under a pinned panel rather
  // than moving the panel. The drawer scrolls itself.
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
    // The rail floats free: no band, no blur, nothing full-width behind it. The
    // pill is the only chrome, so the canvas and whatever is scrolling under it
    // stay visible from edge to edge. `pointer-events-none` on the strip and
    // back on the pill keeps that empty space from swallowing clicks meant for
    // the page beneath.
    <header className="pointer-events-none sticky top-0 z-40 px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto flex w-full max-w-[1440px] justify-center">
        <div className="pointer-events-auto flex w-full items-center gap-1 rounded-xl border border-line bg-panel p-1.5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_18px_50px_-30px_rgb(0_0_0/0.7)] lg:w-auto">
          <Link
            href="/"
            aria-label="ADYSRE"
            className="shrink-0 rounded-lg px-2.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo height={22} priority />
          </Link>

          <span className="hidden lg:flex lg:items-center">
            <Divider />
          </span>

          <nav aria-label={tNav('mainLabel')} className="hidden items-center gap-0.5 lg:flex">
            <Link
              href={LANDING_LINKS.components}
              className={cn(TOOL_ITEM, 'whitespace-nowrap text-muted-foreground hover:bg-panel-raised hover:text-foreground')}
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
                slot rather than a row inside a dropdown. */}
            <Link
              href={LANDING_LINKS.templates}
              className={cn(TOOL_ITEM, 'whitespace-nowrap text-muted-foreground hover:bg-panel-raised hover:text-foreground')}
            >
              {tNav('templates')}
            </Link>
          </nav>

          <span className="ml-auto flex items-center gap-0.5 lg:ml-0">
            <span className="hidden lg:flex lg:items-center">
              <Divider />
            </span>

            {/* Icon controls, reused from the app shell. */}
            <span className="hidden items-center sm:flex">
              <NotificationsMenu />
              <CartMenu />
            </span>
            <ThemeSwitcher />

            <span className="hidden lg:flex lg:items-center">
              <Divider />
            </span>

            {/* Text actions collapse into the drawer below `lg`. */}
            <span className="hidden items-center gap-1 lg:flex">
              <PremiumButton />
              {/* One slot, one state: the account menu takes the place the
                  sign-in link had, rather than sitting beside it. */}
              {showSignIn && (
                <Link href={LOGIN_HREF} className={ctaClass({ tone: 'bare', size: 'sm' })}>
                  {tAuth('signIn.title')}
                </Link>
              )}
              {signedIn && <UserMenu />}
              <Link
                href={LANDING_LINKS.designPlayground}
                className={ctaClass({ size: 'sm', className: 'gap-1.5' })}
              >
                <PenTool className={cn('h-3.5 w-3.5', CTA_GLYPH)} aria-hidden />
                {tNav('designPlayground')}
              </Link>
            </span>

            {/* Below `lg` the account menu stays in the rail instead of moving
                into the drawer: it is already a compact avatar, and signing out
                should not be two taps behind a hamburger. */}
            {signedIn && (
              <span className="lg:hidden">
                <UserMenu />
              </span>
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
          </span>
        </div>
      </div>

      {/* Mobile drawer: a panel dropped from the rail, not a full-width sheet,
          so the canvas stays visible around it. It scrolls itself - the rail
          above is sticky, so a menu taller than the screen would otherwise run
          past the bottom of the viewport with no way to reach the rest. */}
      {open && (
        <div className="pointer-events-auto mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-[1440px] overflow-y-auto overscroll-contain rounded-xl border border-line bg-panel p-2 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_60px_-30px_rgb(0_0_0/0.8)] lg:hidden">
          <nav aria-label={tNav('mainLabel')} className="space-y-1">
            <Link
              href={LANDING_LINKS.components}
              onClick={closeMenu}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-panel-raised hover:text-foreground"
            >
              {tNav('components')}
            </Link>

            {/* Same grouping as the rail's dropdowns, collapsed by default. */}
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

            <Link
              href={LANDING_LINKS.templates}
              onClick={closeMenu}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-panel-raised hover:text-foreground"
            >
              {tNav('templates')}
            </Link>

            <div className="my-2 h-px bg-line" aria-hidden />

            {showSignIn && (
              <Link
                href={LOGIN_HREF}
                onClick={closeMenu}
                className={ctaClass({ tone: 'quiet', size: 'sm', className: 'w-full' })}
              >
                {tAuth('signIn.title')}
              </Link>
            )}

            {/* The actions the rail carries beside the nav: premium and the
                workspace entry side by side, the playground filled below. */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href={LANDING_LINKS.pricing}
                onClick={closeMenu}
                className={ctaClass({ tone: 'quiet', size: 'sm', className: 'w-full gap-1.5' })}
              >
                <Sparkles className={cn('h-3.5 w-3.5 shrink-0', CTA_GLYPH)} aria-hidden />
                {tPremium('cta')}
              </Link>
              <Link
                href={LANDING_LINKS.codeStudio}
                onClick={closeMenu}
                className={ctaClass({ tone: 'quiet', size: 'sm', className: 'w-full gap-1.5' })}
              >
                {t('nav.openApp')}
                <ArrowRight className={cn('h-3.5 w-3.5 shrink-0', CTA_ARROW)} aria-hidden />
              </Link>
            </div>

            <Link
              href={LANDING_LINKS.designPlayground}
              onClick={closeMenu}
              className={ctaClass({ size: 'sm', className: 'mt-2 w-full gap-1.5' })}
            >
              <PenTool className={cn('h-3.5 w-3.5', CTA_GLYPH)} aria-hidden />
              {tNav('designPlayground')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

/**
 * The mobile counterpart of `NavMenu`: the same group, collapsed behind a
 * disclosure instead of a hover panel. Flat, the two groups run to fifteen rows
 * and push the account and workspace actions off the bottom of a phone; folded,
 * the whole menu fits on one screen and mirrors what the rail shows.
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
          'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          'hover:bg-panel-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          open ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      {open && (
        <div id={panelId} className="mt-1 space-y-1 border-l border-line pl-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-panel-raised hover:text-foreground"
            >
              {navLabel(item.navKey)}
              {item.soon && (
                <span className="font-hud text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
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
