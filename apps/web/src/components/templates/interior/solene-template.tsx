'use client';

import {
  SOLENE_LABELS,
  SOLENE_PAGES,
  type SolenePageId,
} from '@/data/templates/interior-content';
import { SoleneFooter, SoleneHeader } from './solene-sections';
import { useSmoothScroll } from './solene-motion';
import {
  SoleneAboutPage,
  SoleneContactPage,
  SoleneHomePage,
  SolenePortfolioPage,
  SoleneProjectsPage,
  SoleneServicesPage,
  SoleneTestimonialsPage,
} from './solene-pages';
import './solene.css';

/**
 * SOLÈNE - the assembled interior-design site.
 *
 * Seven editorial pages, routed by the template itself via `?page=`; the header
 * links back with the same query, so links work in the preview, the gallery
 * iframe, the standalone /websites route and a downloaded project with no router.
 * Lenis gives the document smooth inertial scroll (off under reduced motion).
 * `data-template` scopes the ivory palette, the serif and the duotone plates.
 *
 * A Client Component: the content module carries Lucide icon functions that
 * cannot cross a server/client boundary as props.
 */
export function SoleneTemplate({ page }: { page?: string }) {
  useSmoothScroll();
  const current: SolenePageId = SOLENE_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="solene" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--sol-ink)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--sol-paper)]"
      >
        {SOLENE_LABELS.skipToContent}
      </a>

      <SoleneHeader page={current} />

      <main key={current}>
        {current === 'projects' && <SoleneProjectsPage />}
        {current === 'services' && <SoleneServicesPage />}
        {current === 'portfolio' && <SolenePortfolioPage />}
        {current === 'about' && <SoleneAboutPage />}
        {current === 'testimonials' && <SoleneTestimonialsPage />}
        {current === 'contact' && <SoleneContactPage />}
        {current === 'home' && <SoleneHomePage />}
      </main>

      <SoleneFooter />
    </div>
  );
}
