'use client';

import { ASTRA_LABELS } from '@/data/templates/astra-portfolio-content';
import {
  AstraAbout,
  AstraContact,
  AstraFaq,
  AstraFooter,
  AstraHeader,
  AstraHero,
  AstraJournal,
  AstraMarquee,
  AstraServices,
  AstraStats,
  AstraWork,
} from './astra-sections';
import './astra.css';

/**
 * ASTRA - the assembled site.
 *
 * A SINGLE-PAGE portfolio: one long composition navigated by in-page hash
 * anchors, with no page switch. The `page` prop is accepted for interface
 * parity with the other renderers and ignored.
 *
 * `data-template` scopes the palette, the display type, the bento grid and the
 * rotating star (astra.css) so nothing leaks into or out of the surrounding
 * app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props.
 */
export function AstraTemplate() {
  return (
    <div data-template="astra" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--ast-blue)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--ast-panel)]"
      >
        {ASTRA_LABELS.skipToContent}
      </a>

      <AstraHeader />

      <main id="top">
        <AstraHero />
        <AstraMarquee />
        <AstraAbout />
        <AstraWork />
        <AstraJournal />
        <AstraServices />
        <AstraStats />
        <AstraFaq />
        <AstraContact />
      </main>

      <AstraFooter />
    </div>
  );
}
