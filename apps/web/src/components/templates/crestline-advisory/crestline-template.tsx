'use client';

import { CRESTLINE_LABELS } from '@/data/templates/crestline-advisory-content';
import {
  CrestlineAbout,
  CrestlineContact,
  CrestlineFaq,
  CrestlineFooter,
  CrestlineHeader,
  CrestlineHero,
  CrestlineMarquee,
  CrestlineServices,
  CrestlineWhy,
} from './crestline-sections';
import './crestline.css';

/**
 * CRESTLINE - the assembled site.
 *
 * A SINGLE-PAGE corporate-services site: one long composition navigated by
 * in-page hash anchors, with no page switch. The `page` prop is accepted for
 * interface parity with the other renderers and ignored.
 *
 * `data-template` scopes the palette, the particle field, the orbit ring and
 * the marquee (crestline.css) so nothing leaks into or out of the surrounding
 * app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props.
 */
export function CrestlineTemplate() {
  return (
    <div data-template="crestline" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--crl-green)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-white"
      >
        {CRESTLINE_LABELS.skipToContent}
      </a>

      <CrestlineHeader />

      <main>
        <CrestlineHero />
        <CrestlineMarquee />
        <CrestlineAbout />
        <CrestlineServices />
        <CrestlineWhy />
        <CrestlineFaq />
        <CrestlineContact />
      </main>

      <CrestlineFooter />
    </div>
  );
}
