'use client';

import { NOVA_CONTENT } from '@/data/templates/nova-analytics-content';
import { NovaAbout } from './nova-about';
import { NovaContact } from './nova-contact';
import { NovaFaq } from './nova-faq';
import { NovaFooter } from './nova-footer';
import { NovaHeader } from './nova-header';
import { NovaHero } from './nova-hero';
import { NovaMarquee } from './nova-marquee';
import { NovaServices } from './nova-services';
import { NovaWhy } from './nova-why';
import './nova.css';

/**
 * NOVA - the assembled page.
 *
 * `data-template` scopes the whole palette (nova.css), so the template renders
 * identically wherever it is mounted: the full-page preview route, a card
 * thumbnail, or the visitor's own project after download.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 */
export function NovaTemplate() {
  return (
    <div data-template="nova" className="min-h-screen antialiased">
      <NovaHeader content={NOVA_CONTENT} />
      <main>
        <NovaHero content={NOVA_CONTENT} />
        <NovaMarquee content={NOVA_CONTENT} />
        <NovaAbout content={NOVA_CONTENT} />
        <NovaServices content={NOVA_CONTENT} />
        <NovaWhy content={NOVA_CONTENT} />
        <NovaFaq content={NOVA_CONTENT} />
        <NovaContact content={NOVA_CONTENT} />
      </main>
      <NovaFooter content={NOVA_CONTENT} />
    </div>
  );
}
