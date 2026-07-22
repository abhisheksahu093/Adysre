'use client';

import { PULSE_CONTENT } from '@/data/templates/pulse-clinic-content';
import { PulseAbout } from './pulse-about';
import { PulseContact } from './pulse-contact';
import { PulseFaq } from './pulse-faq';
import { PulseFooter } from './pulse-footer';
import { PulseHeader } from './pulse-header';
import { PulseHero } from './pulse-hero';
import { PulseMarquee } from './pulse-marquee';
import { PulseServices } from './pulse-services';
import { PulseWhy } from './pulse-why';
import './pulse.css';

/**
 * PULSE - the assembled page.
 *
 * `data-template` scopes the whole palette and the smooth-scroll behaviour
 * (pulse.css), so the template renders identically wherever it is mounted: the
 * full-page preview route, a card thumbnail, or the visitor's own project after
 * download.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 */
export function PulseTemplate({ page }: { page?: string } = {}) {
  // A clinic this size needs one page, not a site map. The prop exists only so
  // multi-page hosts can render this template through the same call signature.
  void page;

  return (
    <div data-template="pulse" className="min-h-screen antialiased">
      <PulseHeader content={PULSE_CONTENT} />
      <main>
        <PulseHero content={PULSE_CONTENT} />
        <PulseMarquee content={PULSE_CONTENT} />
        <PulseAbout content={PULSE_CONTENT} />
        <PulseServices content={PULSE_CONTENT} />
        <PulseWhy content={PULSE_CONTENT} />
        <PulseFaq content={PULSE_CONTENT} />
        <PulseContact content={PULSE_CONTENT} />
      </main>
      <PulseFooter content={PULSE_CONTENT} />
    </div>
  );
}
