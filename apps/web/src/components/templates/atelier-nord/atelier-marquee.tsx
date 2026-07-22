'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * ATELIER NORD - the materials strip.
 *
 * The list renders twice inside a track that translates -50%, so the loop is
 * seamless without cloning logic. The duplicate is aria-hidden: a screen reader
 * should hear each material once. The pace is deliberately near-still - see the
 * 74s duration in atelier.css.
 */
export function AtelierMarquee({ content }: { content: TemplateContent }) {
  return (
    <section className="border-y border-[var(--atelier-rule)] py-6">
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="atelier-drift flex w-max items-center">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-center" aria-hidden={pass === 1}>
              {content.marquee.map((name) => (
                <span key={`${pass}-${name}`} className="atelier-label whitespace-nowrap px-8 sm:px-12">
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
