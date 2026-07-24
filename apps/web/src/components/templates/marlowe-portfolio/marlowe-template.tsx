'use client';

import { MARLOWE_LABELS } from '@/data/templates/marlowe-portfolio-content';
import {
  MarloweAbout,
  MarloweContact,
  MarloweFaq,
  MarloweFooter,
  MarloweHeader,
  MarloweHero,
  MarloweMarquee,
  MarlowePricing,
  MarloweResume,
  MarloweServices,
  MarloweSkills,
  MarloweTestimonials,
  MarloweWork,
} from './marlowe-sections';
import './marlowe.css';

/**
 * MARLOWE - the assembled site.
 *
 * A SINGLE-PAGE personal portfolio: unlike the multipage templates there is no
 * page switch, just one long composition navigated by in-page hash anchors. The
 * `page` prop is accepted for interface parity with the other renderers and
 * ignored.
 *
 * `data-template` scopes the palette, the display type and the hero orbs
 * (marlowe.css) so nothing leaks into or out of the surrounding app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props, and the work grid filters on client state.
 */
export function MarloweTemplate() {
  return (
    <div data-template="marlowe" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--mlw-coral)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--mlw-bg)]"
      >
        {MARLOWE_LABELS.skipToContent}
      </a>

      <MarloweHeader />

      <main id="top">
        <MarloweHero />
        <MarloweMarquee />
        <MarloweAbout />
        <MarloweResume />
        <MarloweServices />
        <MarloweSkills />
        <MarloweWork />
        <MarloweTestimonials />
        <MarlowePricing />
        <MarloweFaq />
        <MarloweContact />
      </main>

      <MarloweFooter />
    </div>
  );
}
