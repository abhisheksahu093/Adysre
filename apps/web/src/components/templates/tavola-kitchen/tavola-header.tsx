'use client';

import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { tavolaHref, type TavolaCopy, type TavolaPageId } from '@/data/templates/tavola-kitchen-content';
import type { TemplateContent } from '@/data/templates/types';
import { TavolaPicker } from './tavola-picker';
import { TAVOLA_CURRENCIES, TAVOLA_LOCALES, useTavolaSettings } from './tavola-settings';

/**
 * TAVOLA - the shared header.
 *
 * Every page mounts this one component, so the basket count, the pickers and
 * the wordmark cannot drift between them. It starts flush with the page and
 * settles onto blurred paper once scrolled.
 *
 * The currency and language pickers live here rather than in the footer because
 * they change what every price and every sentence on the page says - a visitor
 * quoting a figure to someone in Tokyo sets these first, then orders.
 */

/** The page an internal href lands on, or null for a link that only scrolls. */
function pageOfHref(href: string): string | null {
  const match = /^\?page=([^#&]+)/.exec(href);
  return match?.[1] ?? null;
}

export function TavolaHeader({
  content,
  copy,
  page,
  cartCount,
}: {
  content: TemplateContent;
  copy: TavolaCopy;
  page: TavolaPageId;
  cartCount: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { currency, setCurrency, locale, setLocale } = useTavolaSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass =
    'text-[14px] font-medium text-[var(--tv-ink-soft)] transition-colors hover:text-[var(--tv-accent)] aria-[current=page]:text-[var(--tv-ink)]';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-500 ${
        scrolled ? 'bg-[rgb(255_255_255/85%)] shadow-[0_1px_0_var(--tv-rule)] backdrop-blur-md' : ''
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href={tavolaHref('home')} className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full bg-[var(--tv-accent)] text-[15px] font-bold text-white"
          >
            T
          </span>
          <span className="text-[19px] font-bold tracking-tight">{content.brand}</span>
        </a>

        <nav aria-label={copy.common.mainNav} className="hidden items-center gap-8 lg:flex">
          {content.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={navLinkClass}
              {...(pageOfHref(link.href) === page ? { 'aria-current': 'page' as const } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center sm:flex">
            <TavolaPicker
              label={copy.common.currencyLabel}
              value={currency}
              options={TAVOLA_CURRENCIES}
              onChange={setCurrency}
            />
            <TavolaPicker
              label={copy.common.languageLabel}
              value={locale}
              options={TAVOLA_LOCALES}
              onChange={setLocale}
            />
          </div>

          {/*
            The count is written into the accessible name rather than left as a
            bare numeral, so the link announces "Basket, 3 items in basket".
          */}
          <a
            href={tavolaHref('cart')}
            aria-label={`${copy.common.cart}, ${cartCount} ${copy.common.cartCount}`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--tv-paper-3)]"
            {...(page === 'cart' ? { 'aria-current': 'page' as const } : {})}
          >
            <ShoppingBag className="h-[18px] w-[18px]" aria-hidden />
            {cartCount > 0 && (
              <span
                aria-hidden
                className="tv-num absolute right-0.5 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--tv-accent)] px-1 text-[10px] font-bold text-white"
              >
                {cartCount}
              </span>
            )}
          </a>

          <a
            href={tavolaHref('contact')}
            className="hidden items-center gap-1.5 text-[14px] font-medium text-[var(--tv-ink-soft)] transition-colors hover:text-[var(--tv-ink)] md:inline-flex"
          >
            <UserRound className="h-4 w-4" aria-hidden />
            {copy.common.signUp}
          </a>

          <a href={tavolaHref('contact')} className="tv-btn tv-btn--solid hidden !px-5 !py-2 sm:inline-flex">
            {copy.common.signIn}
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="tavola-mobile-nav"
            aria-label={open ? copy.common.closeMenu : copy.common.openMenu}
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--tv-rule-strong)] lg:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="tavola-mobile-nav"
          className="bg-[var(--tv-paper)] shadow-[0_1px_0_var(--tv-rule)] lg:hidden"
        >
          <nav
            aria-label={copy.common.mainNav}
            className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8"
          >
            {content.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-3 ${navLinkClass}`}
                {...(pageOfHref(link.href) === page ? { 'aria-current': 'page' as const } : {})}
              >
                {link.label}
              </a>
            ))}
            {/* The pickers are hidden beside the nav on small screens, so they
                reappear here - a phone must still be able to change currency. */}
            <div className="flex items-center gap-2 border-t border-[var(--tv-rule)] pt-3 sm:hidden">
              <TavolaPicker
                label={copy.common.currencyLabel}
                value={currency}
                options={TAVOLA_CURRENCIES}
                onChange={setCurrency}
              />
              <TavolaPicker
                label={copy.common.languageLabel}
                value={locale}
                options={TAVOLA_LOCALES}
                onChange={setLocale}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
