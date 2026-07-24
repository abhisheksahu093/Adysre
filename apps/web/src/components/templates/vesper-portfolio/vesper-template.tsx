'use client';

import {
  VESPER_LABELS,
  VESPER_PAGES,
  type VesperPageId,
} from '@/data/templates/vesper-portfolio-content';
import { VesperFooter, VesperHeader } from './vesper-sections';
import { ScrollProgress } from './vesper-motion';
import {
  VesperAboutPage,
  VesperContactPage,
  VesperHomePage,
  VesperStackPage,
  VesperWorkPage,
} from './vesper-pages';
import './vesper.css';

/**
 * VESPER - the assembled site.
 *
 * Five pages, routed by the template itself: the host passes `page` (from
 * `?page=` in the preview route, from a segment in a downloaded project), the
 * header links back with the same query, and this component picks the
 * composition. Doing the switch here rather than with a router is what lets the
 * template render in any host - a preview iframe, a card thumbnail, or the
 * visitor's own app - with no routing dependency.
 *
 * `data-template` scopes the palette, the glass treatments and the pointer
 * spotlight (vesper.css) so nothing leaks into or out of the surrounding app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props.
 */
export function VesperTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing.
  const current: VesperPageId = VESPER_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="vesper" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--ves-violet)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--ves-bg)]"
      >
        {VESPER_LABELS.skipToContent}
      </a>

      <ScrollProgress />
      <VesperHeader page={current} />

      <main key={current} id="top">
        {current === 'work' && <VesperWorkPage />}
        {current === 'about' && <VesperAboutPage />}
        {current === 'stack' && <VesperStackPage />}
        {current === 'contact' && <VesperContactPage />}
        {current === 'home' && <VesperHomePage />}
      </main>

      <VesperFooter />
    </div>
  );
}
