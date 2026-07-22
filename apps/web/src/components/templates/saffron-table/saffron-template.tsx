'use client';

import { SAFFRON_CONTENT } from '@/data/templates/saffron-table-content';
import { SaffronAbout } from './saffron-about';
import { SaffronContact } from './saffron-contact';
import { SaffronFaq } from './saffron-faq';
import { SaffronFooter } from './saffron-footer';
import { SaffronHeader } from './saffron-header';
import { SaffronHero } from './saffron-hero';
import { SaffronMarquee } from './saffron-marquee';
import { SaffronServices } from './saffron-services';
import { SaffronWhy } from './saffron-why';
import './saffron.css';

/**
 * SAFFRON - the assembled page.
 *
 * `data-template` scopes the palette and the serif stack (saffron.css), so the
 * template renders identically wherever it is mounted: the preview route, a
 * card thumbnail, or the visitor's own project after download.
 *
 * A Client Component for the same reason NOVA is: the content module carries
 * Lucide icon components, which cannot cross a server/client boundary as props.
 */
export function SaffronTemplate() {
  return (
    <div data-template="saffron" className="min-h-screen antialiased">
      <SaffronHeader content={SAFFRON_CONTENT} />
      <main>
        <SaffronHero content={SAFFRON_CONTENT} />
        <SaffronMarquee content={SAFFRON_CONTENT} />
        <SaffronAbout content={SAFFRON_CONTENT} />
        <SaffronServices content={SAFFRON_CONTENT} />
        <SaffronWhy content={SAFFRON_CONTENT} />
        <SaffronFaq content={SAFFRON_CONTENT} />
        <SaffronContact content={SAFFRON_CONTENT} />
      </main>
      <SaffronFooter content={SAFFRON_CONTENT} />
    </div>
  );
}
