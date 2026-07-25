'use client';

import {
  NEBULA_LABELS,
  NEBULA_PAGES,
  type NebulaPageId,
} from '@/data/templates/ai-saas-content';
import { NebulaFooter, NebulaHeader } from './nebula-sections';
import { useSmoothScroll } from './nebula-motion';
import {
  NebulaAboutPage,
  NebulaBlogPage,
  NebulaContactPage,
  NebulaFeaturesPage,
  NebulaHomePage,
  NebulaIntegrationsPage,
  NebulaPricingPage,
  NebulaSolutionsPage,
} from './nebula-pages';
import './nebula.css';

/**
 * NEBULA - the assembled AI-SaaS site.
 *
 * Eight pages, routed by the template itself via `?page=`; the header links back
 * with the same query, so links work in the preview, the gallery iframe, the
 * standalone /websites route and a downloaded project with no router. Lenis
 * gives the whole document smooth inertial scroll (disabled under reduced
 * motion). `data-template` scopes the palette, the gradient mesh and the glass.
 *
 * A Client Component: the content module carries Lucide icon functions that
 * cannot cross a server/client boundary as props.
 */
export function NebulaTemplate({ page }: { page?: string }) {
  useSmoothScroll();
  const current: NebulaPageId = NEBULA_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="nebula" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--neb-neon)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[#06060f]"
      >
        {NEBULA_LABELS.skipToContent}
      </a>

      <NebulaHeader page={current} />

      {/* `key` remounts the sections so reveals and counters rebind per page. */}
      <main key={current}>
        {current === 'features' && <NebulaFeaturesPage />}
        {current === 'solutions' && <NebulaSolutionsPage />}
        {current === 'pricing' && <NebulaPricingPage />}
        {current === 'integrations' && <NebulaIntegrationsPage />}
        {current === 'about' && <NebulaAboutPage />}
        {current === 'blog' && <NebulaBlogPage />}
        {current === 'contact' && <NebulaContactPage />}
        {current === 'home' && <NebulaHomePage />}
      </main>

      <NebulaFooter />
    </div>
  );
}
