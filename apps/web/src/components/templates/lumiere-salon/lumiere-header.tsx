'use client';

import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import {
  lumiereHref,
  type LumierePageId,
  type LumiereSalonCopy,
} from '@/data/templates/lumiere-salon-content';
import { LumierePicker } from './lumiere-picker';
import {
  LUMIERE_CURRENCIES,
  LUMIERE_LOCALES,
  useLumiereSettings,
} from './lumiere-settings';
import { LumiereTreatmentsMenu } from './lumiere-treatments-menu';
import type { TemplateContent } from '@/data/templates/types';

/**
 * LUMIERE - the shared header.
 *
 * Every page mounts this one component, so the basket count, the book button and
 * the wordmark cannot drift between them. It starts flush with the page and
 * settles onto blurred blush paper once scrolled, which keeps the serif wordmark
 * legible over the hero's drifting petal.
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

export function LumiereHeader({
  content,
  salon,
  page,
  cartCount,
}: {
  content: TemplateContent;
  salon: LumiereSalonCopy;
  page: LumierePageId;
  cartCount: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { currency, setCurrency, locale, setLocale } = useLumiereSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass =
    'text-[14px] text-[var(--lumi-ink-soft)] transition-colors hover:text-[var(--lumi-accent-deep)] aria-[current=page]:text-[var(--lumi-ink)]';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-700 ${
        scrolled
          ? 'bg-[var(--lumi-paper-veil)] shadow-[0_1px_0_var(--lumi-rule)] backdrop-blur-md'
          : ''
      }`}
    >
      <div className="mx-auto flex h-[78px] max-w-6xl items-center justify-between gap-8 px-6 sm:px-10">
        <a
          href={lumiereHref('home')}
          className="font-[family-name:var(--lumi-serif)] text-[26px] tracking-[0.08em]"
          {...(page === 'home' ? { 'aria-current': 'page' as const } : {})}
        >
          {content.brand}
        </a>

        <nav aria-label={salon.common.mainNav} className="hidden items-center gap-9 lg:flex">
          {content.nav.map((link) => {
            const target = pageOfHref(link.href);

            // The services link carries the whole treatment menu: a salon's
            // list of treatments is what a visitor came for, so it should not
            // cost a page load to read.
            if (target === 'services') {
              return (
                <LumiereTreatmentsMenu
                  key={link.href}
                  label={link.label}
                  active={page === 'services'}
                  linkClassName={navLinkClass}
                />
              );
            }

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

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Viewing preferences, before the actions: a visitor quoting a price
              to someone in Tokyo changes these first, then books. */}
          <div className="hidden items-center sm:flex">
            <LumierePicker
              label={salon.common.currencyLabel}
              value={currency}
              options={LUMIERE_CURRENCIES}
              onChange={setCurrency}
            />
            <LumierePicker
              label={salon.common.languageLabel}
              value={locale}
              options={LUMIERE_LOCALES}
              onChange={setLocale}
            />
          </div>

          {/*
            The count is written into the accessible name rather than left as a
            bare numeral in a badge, so the link announces "Basket, 3 items in
            basket" instead of "Basket 3".
          */}
          <a
            href={lumiereHref('cart')}
            aria-label={`${salon.common.cart}, ${cartCount} ${salon.common.cartCount}`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[var(--lumi-paper-2)]"
            {...(page === 'cart' ? { 'aria-current': 'page' as const } : {})}
          >
            <ShoppingBag className="h-[19px] w-[19px]" aria-hidden />
            <span
              aria-hidden
              className="lumi-num absolute right-0 top-1 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-[var(--lumi-ink)] px-1 text-[10px] font-medium text-[var(--lumi-paper-2)]"
            >
              {cartCount}
            </span>
          </a>

          <a
            href={lumiereHref('booking')}
            className="lumi-btn lumi-btn--solid hidden sm:inline-flex"
            {...(page === 'booking' ? { 'aria-current': 'page' as const } : {})}
          >
            {salon.common.book}
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="lumiere-mobile-nav"
            aria-label={open ? salon.common.closeMenu : salon.common.openMenu}
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--lumi-rule-strong)] lg:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="lumiere-mobile-nav"
          className="bg-[var(--lumi-paper)] shadow-[0_1px_0_var(--lumi-rule)] lg:hidden"
        >
          <nav
            aria-label={salon.common.mainNav}
            className="mx-auto flex max-w-6xl flex-col px-6 py-4 sm:px-10"
          >
            {content.nav.map((link) => {
              const target = pageOfHref(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 ${navLinkClass}`}
                  {...(target === page ? { 'aria-current': 'page' as const } : {})}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href={lumiereHref('booking')}
              onClick={() => setOpen(false)}
              className="lumi-btn lumi-btn--solid mt-3 self-start sm:hidden"
              {...(page === 'booking' ? { 'aria-current': 'page' as const } : {})}
            >
              {salon.common.book}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
