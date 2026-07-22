'use client';

import { ATELIER_CONTENT } from '@/data/templates/atelier-nord-content';
import { AtelierAbout } from './atelier-about';
import { AtelierContact } from './atelier-contact';
import { AtelierFaq } from './atelier-faq';
import { AtelierFooter } from './atelier-footer';
import { AtelierHeader } from './atelier-header';
import { AtelierHero } from './atelier-hero';
import { AtelierMarquee } from './atelier-marquee';
import { AtelierServices } from './atelier-services';
import { AtelierWhy } from './atelier-why';
import './atelier.css';

/**
 * ATELIER NORD - the assembled page.
 *
 * `data-template` scopes the whole palette and type scale (atelier.css), so the
 * template renders identically wherever it is mounted: the full-page preview
 * route, a card thumbnail, or the visitor's own project after download.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 *
 * `page` exists so multi-page hosts can mount every template through one call
 * signature. This studio is a single scrolling document with anchor navigation,
 * so there is no second page to route to and the prop is deliberately ignored.
 */
export function AtelierTemplate({ page: _page }: { page?: string } = {}) {
  return (
    <div data-template="atelier" className="min-h-screen antialiased">
      <AtelierHeader content={ATELIER_CONTENT} />
      <main>
        <AtelierHero content={ATELIER_CONTENT} />
        <AtelierMarquee content={ATELIER_CONTENT} />
        <AtelierAbout content={ATELIER_CONTENT} />
        <AtelierServices content={ATELIER_CONTENT} />
        <AtelierWhy content={ATELIER_CONTENT} />
        <AtelierFaq content={ATELIER_CONTENT} />
        <AtelierContact content={ATELIER_CONTENT} />
      </main>
      <AtelierFooter content={ATELIER_CONTENT} />
    </div>
  );
}
