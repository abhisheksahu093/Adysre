'use client';

import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, User, X } from 'lucide-react';
import {
  lumenHref,
  type LumenPageId,
  type LumenShopCopy,
} from '@/data/templates/lumen-store-content';
import type { TemplateContent } from '@/data/templates/types';

/**
 * LUMEN - the shared header.
 *
 * Every page mounts this one component, so the basket count, the sign-in link
 * and the wordmark cannot drift between them. It starts flush with the page and
 * settles onto a hairline rule with blurred paper behind it once scrolled.
 *
 * Navigation is by query string (`?page=shop`), which is what lets a template
 * with seven pages work inside a preview route, a card iframe and a downloaded
 * project without shipping a router.
 */

/**
 * The page an internal href lands on, or null for a link that only scrolls.
 *
 * Nav entries may carry a fragment (`?page=home#about`); the fragment is part of
 * where you land but not part of which page you are on, so it is stripped before
 * the comparison that sets `aria-current`.
 */
function pageOfHref(href: string): string | null {
  const match = /^\?page=([^#&]+)/.exec(href);
  return match?.[1] ?? null;
}

export function LumenHeader({
  content,
  shop,
  page,
  cartCount,
}: {
  content: TemplateContent;
  shop: LumenShopCopy;
  page: LumenPageId;
  cartCount: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass =
    'text-sm text-[var(--lum-ink-soft)] transition-colors hover:text-[var(--lum-accent-deep)] aria-[current=page]:text-[var(--lum-ink)]';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-500 ${
        scrolled
          ? 'border-b border-[var(--lum-rule)] bg-[var(--lum-paper)]/88 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-8 px-6 sm:px-10">
        <a
          href={lumenHref('home')}
          className="text-lg font-medium uppercase tracking-[0.34em]"
          {...(page === 'home' ? { 'aria-current': 'page' as const } : {})}
        >
          {content.brand}
        </a>

        <nav aria-label={shop.common.mainNav} className="hidden items-center gap-9 md:flex">
          {content.nav.map((link) => {
            const target = pageOfHref(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={navLinkClass}
                {...(target === page ? { 'aria-current': 'page' as const } : {})}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={lumenHref('login')}
            className="hidden items-center gap-2 px-2 py-2 text-sm text-[var(--lum-ink-soft)] transition-colors hover:text-[var(--lum-accent-deep)] sm:inline-flex"
            {...(page === 'login' || page === 'signup' ? { 'aria-current': 'page' as const } : {})}
          >
            <User className="h-4 w-4" aria-hidden />
            {shop.common.signIn}
          </a>

          {/*
            The count is written into the accessible name rather than left as a
            bare numeral in a badge, so the link announces "Basket, 3 items in
            basket" instead of "Basket 3".
          */}
          <a
            href={lumenHref('cart')}
            aria-label={`${shop.common.cart}, ${cartCount} ${shop.common.cartCount}`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--lum-paper-2)]"
            {...(page === 'cart' ? { 'aria-current': 'page' as const } : {})}
          >
            <ShoppingBag className="h-[18px] w-[18px]" aria-hidden />
            <span
              aria-hidden
              className="lum-price absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--lum-accent-deep)] px-1 text-[10px] font-medium text-[var(--lum-paper)]"
            >
              {cartCount}
            </span>
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="lum-mobile-nav"
            aria-label={open ? shop.common.closeMenu : shop.common.openMenu}
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--lum-rule)] md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="lum-mobile-nav"
          className="border-t border-[var(--lum-rule)] bg-[var(--lum-paper)] md:hidden"
        >
          <nav aria-label={shop.common.mainNav} className="mx-auto flex max-w-6xl flex-col px-6 py-3 sm:px-10">
            {content.nav.map((link) => {
              const target = pageOfHref(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`py-2.5 ${navLinkClass}`}
                  {...(target === page ? { 'aria-current': 'page' as const } : {})}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href={lumenHref('login')}
              onClick={() => setOpen(false)}
              className={`py-2.5 ${navLinkClass}`}
              {...(page === 'login' ? { 'aria-current': 'page' as const } : {})}
            >
              {shop.common.signIn}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
