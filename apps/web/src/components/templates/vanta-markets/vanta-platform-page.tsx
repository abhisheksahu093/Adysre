'use client';

import type { TemplateContent } from '@/data/templates/types';
import { VantaAbout } from './vanta-about';
import { VantaMasthead } from './vanta-masthead';
import { VantaPlatformFeatures } from './vanta-platform-features';

/**
 * VANTA - the platform page.
 *
 * Capabilities, operations and coverage first, then the founding story, because
 * the routing argument is what makes the "we fixed other firms' routers" story
 * land rather than the other way round.
 */
export function VantaPlatformPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <VantaMasthead page="platform" />
      <VantaPlatformFeatures />
      <VantaAbout content={content} />
    </>
  );
}
