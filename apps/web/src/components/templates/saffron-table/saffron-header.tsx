'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';

/**
 * SAFFRON - header. Starts transparent over the hero and settles into blurred
 * cream with a hairline rule once the page moves.
 */
export function SaffronHeader({ content }: { content: TemplateContent }) {
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
          ? 'border-b border-[var(--saf-rule)] bg-[var(--saf-paper)]/85 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-8 px-6 sm:px-10">
        <a href="#top" className="text-xl tracking-[0.24em] uppercase">
          {content.brand}
        </a>

        <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
          {content.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--saf-ink-soft)] transition-colors hover:text-[var(--saf-accent)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="hidden border border-[var(--saf-ink)] px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors hover:bg-[var(--saf-ink)] hover:text-[var(--saf-paper)] sm:inline-block"
          >
            Reserve
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center border border-[var(--saf-rule)] md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--saf-rule)] bg-[var(--saf-paper)] md:hidden">
          <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-col px-6 py-4 sm:px-10">
            {content.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-[var(--saf-ink-soft)] transition-colors hover:text-[var(--saf-accent)]"
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
