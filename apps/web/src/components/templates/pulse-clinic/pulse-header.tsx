'use client';

import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';

/**
 * PULSE - sticky header. Sits clear over the hero and settles into frosted
 * white once the page moves, so the headline is never framed by a hard bar.
 *
 * Nothing here is authored copy: the CTA reuses the hero's primary action and
 * the mark is the brand's initial, which keeps every string in the content
 * module even for a purely decorative logo.
 */
export function PulseHeader({ content }: { content: TemplateContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-500 ${
        scrolled
          ? 'border-b border-[var(--pulse-line)] bg-[var(--pulse-bg)]/85 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--pulse-accent)] text-base font-bold text-[var(--pulse-on-accent)]">
            {content.brand.charAt(0)}
          </span>
          <span className="text-lg font-semibold tracking-[-0.01em]">{content.brand}</span>
        </a>

        {/* The desktop nav lives inside its own pill, echoing the button shapes
            used everywhere else in this template. */}
        <nav
          aria-label={content.brand}
          className="hidden items-center gap-1 rounded-full bg-[var(--pulse-surface)] p-1.5 md:flex"
        >
          {content.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--pulse-ink-soft)] transition-colors hover:bg-[var(--pulse-bg)] hover:text-[var(--pulse-accent)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full bg-[var(--pulse-accent)] px-5 py-3 text-sm font-semibold text-[var(--pulse-on-accent)] shadow-[var(--pulse-shadow-lift)] transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {content.hero.ctaPrimary}
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="pulse-mobile-nav"
            // The toggle borrows the brand as its accessible name: components in
            // this template author no strings, so there is no "Open menu" to use.
            aria-label={content.brand}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--pulse-line)] text-[var(--pulse-ink-soft)] md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="pulse-mobile-nav"
          className="border-t border-[var(--pulse-line)] bg-[var(--pulse-bg)] md:hidden"
        >
          <nav aria-label={content.brand} className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8">
            {content.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-[15px] font-medium text-[var(--pulse-ink-soft)] transition-colors hover:bg-[var(--pulse-surface)] hover:text-[var(--pulse-accent)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-[var(--pulse-accent)] px-5 py-3 text-center text-sm font-semibold text-[var(--pulse-on-accent)]"
            >
              {content.hero.ctaPrimary}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
