'use client';

import { ArrowRight } from 'lucide-react';
import { PINNACLE_INSIGHTS, PINNACLE_LABELS } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';
import { pinnacleHref } from './pinnacle-links';

/**
 * PINNACLE - the insights list.
 *
 * The first piece is set as a lead article across the full width and the rest
 * follow as a two-column list, which is how an editorial page tells a reader
 * where to start without adding a "featured" badge.
 *
 * Every entry carries date, author and read time, because those three are what
 * a reader scans before deciding to open anything.
 */
export function PinnacleInsights() {
  const [lead, ...rest] = PINNACLE_INSIGHTS;

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[80rem]">
        {lead && (
          <Reveal>
            {/* The lead piece links to the insights page itself: the template
                ships no article routes, so the owner points this at their own. */}
            <a
              href={pinnacleHref('insights')}
              className="pin-card group grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="pin-tag pin-tag-accent">{lead.category}</span>
                  <span className="pin-tag">{lead.readTime}</span>
                </div>

                <h2 className="pin-h2 mt-8 text-[clamp(1.75rem,3.2vw,2.5rem)]">{lead.title}</h2>

                <p className="pin-body mt-6 text-[var(--pin-text-muted)]">{lead.standfirst}</p>
              </div>

              <div className="lg:text-right">
                <p className="text-[0.9375rem] font-[550]">
                  {PINNACLE_LABELS.insightsBy} {lead.author}
                </p>
                <p className="mt-2 text-[0.8125rem] text-[var(--pin-text-faint)]">{lead.date}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-[550] text-[var(--pin-brand-ink)]">
                  {PINNACLE_LABELS.insightsReadMore}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </div>
            </a>
          </Reveal>
        )}

        <ul className="mt-6 grid gap-6 lg:grid-cols-2">
          {rest.map((article, index) => (
            <li key={article.title} className="h-full">
              <Reveal delay={(index % 2) * 0.07} className="h-full">
                <a
                  href={pinnacleHref('insights')}
                  className="pin-card group flex h-full flex-col p-8 sm:p-9"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="pin-tag pin-tag-accent">{article.category}</span>
                    <span className="pin-tag">{article.readTime}</span>
                  </div>

                  <h3 className="pin-h3 mt-7 text-[1.25rem]">{article.title}</h3>

                  <p className="pin-body mt-4 text-[0.9375rem] text-[var(--pin-text-muted)]">
                    {article.standfirst}
                  </p>

                  <div className="mt-auto flex flex-wrap items-baseline justify-between gap-3 border-t border-[var(--pin-line)] pt-6">
                    <p className="text-[0.875rem] font-[550]">
                      {PINNACLE_LABELS.insightsBy} {article.author}
                    </p>
                    <p className="text-[0.8125rem] text-[var(--pin-text-faint)]">{article.date}</p>
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
