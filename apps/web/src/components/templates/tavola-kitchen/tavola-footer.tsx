import { Facebook, Instagram, Twitter } from 'lucide-react';
import { tavolaHref } from '@/data/templates/tavola-kitchen-content';
import type { TemplateContent } from '@/data/templates/types';

/**
 * TAVOLA - the shared footer.
 *
 * The deep navy block that closes every page. Column links are plain labels in
 * the content model (`links: string[]`), so they all point at the pages the
 * restaurant actually has rather than inventing routes the template cannot
 * render.
 */
export function TavolaFooter({ content }: { content: TemplateContent }) {
  const year = 2026;

  return (
    <footer className="bg-[var(--tv-navy)] text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full bg-[var(--tv-accent)] text-[15px] font-bold"
              >
                T
              </span>
              <span className="text-[19px] font-bold tracking-tight">{content.brand}</span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/60">
              {content.footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Twitter, label: 'Twitter' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href={tavolaHref('contact')}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-[var(--tv-accent)]"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {content.footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[14px] font-semibold">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((label) => (
                  <li key={label}>
                    <a
                      href={tavolaHref('home')}
                      className="text-[14px] text-white/60 transition-colors hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-[13px] text-white/50">
        {year} {content.footer.legal}
      </div>
    </footer>
  );
}
