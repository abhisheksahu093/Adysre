'use client';

import {
  VERDANT_CONTENT,
  VERDANT_PAGES,
  type VerdantPageId,
} from '@/data/templates/verdant-realty-content';
import { VerdantAboutPage } from './verdant-about-page';
import { VerdantContactPage } from './verdant-contact-page';
import { VerdantFooter } from './verdant-footer';
import { VerdantHeader } from './verdant-header';
import { VerdantHomePage } from './verdant-home-page';
import { VerdantListingsPage } from './verdant-listings-page';
import './verdant.css';

/**
 * VERDANT - the assembled site.
 *
 * The first MULTIPAGE template. `page` is the id the host route read out of
 * `?page=`, and the header's links write that same query string back, so the
 * whole site navigates with plain anchors: no router, no link component, and
 * identical behaviour in the preview route and in a downloaded copy.
 *
 * `data-template` scopes the palette (verdant.css), so the template renders the
 * same wherever it is mounted.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 */
function resolvePage(page: string | undefined): VerdantPageId {
  // An unknown or missing id lands on the home page rather than 404ing: the
  // query string is user-editable and a template has no error route.
  const match = VERDANT_PAGES.find((id) => id === page);
  return match ?? 'home';
}

export function VerdantTemplate({ page }: { page?: string }) {
  const current = resolvePage(page);

  return (
    <div data-template="verdant" className="min-h-screen antialiased">
      <VerdantHeader content={VERDANT_CONTENT} page={current} />

      <main id="verdant-main">
        {current === 'listings' && <VerdantListingsPage content={VERDANT_CONTENT} />}
        {current === 'about' && <VerdantAboutPage content={VERDANT_CONTENT} />}
        {current === 'contact' && <VerdantContactPage content={VERDANT_CONTENT} />}
        {current === 'home' && <VerdantHomePage content={VERDANT_CONTENT} />}
      </main>

      <VerdantFooter content={VERDANT_CONTENT} />
    </div>
  );
}
