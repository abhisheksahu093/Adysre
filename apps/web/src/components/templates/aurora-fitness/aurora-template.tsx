'use client';

import { AURORA_CONTENT } from '@/data/templates/aurora-fitness-content';
import { AuroraAbout } from './aurora-about';
import { AuroraContact } from './aurora-contact';
import { AuroraFaq } from './aurora-faq';
import { AuroraFooter } from './aurora-footer';
import { AuroraHeader } from './aurora-header';
import { AuroraHero } from './aurora-hero';
import { AuroraMarquee } from './aurora-marquee';
import { AuroraServices } from './aurora-services';
import { AuroraWhy } from './aurora-why';
import './aurora.css';

/**
 * AURORA - the assembled page.
 *
 * `data-template` scopes the palette, the condensed stack and the smooth-scroll
 * rule (aurora.css), so the template renders identically wherever it is
 * mounted: the preview route, a card thumbnail, or the visitor's own project
 * after download.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 *
 * `page` exists only so the renderer can address every template with one call
 * signature. AURORA is a single page whose nav is anchors, so it is ignored
 * rather than branched on.
 */
export function AuroraTemplate({ page }: { page?: string } = {}) {
  void page;

  return (
    <div data-template="aurora" className="min-h-screen antialiased">
      <AuroraHeader content={AURORA_CONTENT} />
      <main>
        <AuroraHero content={AURORA_CONTENT} />
        <AuroraMarquee content={AURORA_CONTENT} />
        <AuroraAbout content={AURORA_CONTENT} />
        <AuroraServices content={AURORA_CONTENT} />
        <AuroraWhy content={AURORA_CONTENT} />
        <AuroraFaq content={AURORA_CONTENT} />
        <AuroraContact content={AURORA_CONTENT} />
      </main>
      <AuroraFooter content={AURORA_CONTENT} />
    </div>
  );
}
