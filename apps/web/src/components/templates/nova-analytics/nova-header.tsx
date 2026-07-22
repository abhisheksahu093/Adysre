'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';

/**
 * NOVA - sticky header. Transparent over the hero, blurred with a hairline
 * once the page moves, so it never competes with the headline on load.
 */
export function NovaHeader({ content }: { content: TemplateContent }) {
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
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? 'border-b border-[var(--nova-line)] bg-[var(--nova-bg)]/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-[var(--nova-accent)] to-[var(--nova-accent-2)] text-sm font-bold text-[var(--nova-bg)]">
            N
          </span>
          <span className="text-[15px] font-semibold tracking-tight">{content.brand}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {content.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] text-[var(--nova-muted)] transition-colors hover:text-[var(--nova-text)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-[var(--nova-text)] px-4 py-2 text-[13px] font-semibold text-[var(--nova-bg)] transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            Book a demo
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md border border-[var(--nova-line)] md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--nova-line)] bg-[var(--nova-bg)] md:hidden">
          <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8">
            {content.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-[var(--nova-muted)] transition-colors hover:text-[var(--nova-text)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
