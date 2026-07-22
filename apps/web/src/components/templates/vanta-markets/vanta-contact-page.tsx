'use client';

import type { TemplateContent } from '@/data/templates/types';
import { VantaContact } from './vanta-contact';
import { VantaDesks } from './vanta-desks';
import { VantaMasthead } from './vanta-masthead';

/**
 * VANTA - the contact page: masthead, the four routed desks, then the form and
 * the two offices. Routing before writing, on purpose.
 */
export function VantaContactPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <VantaMasthead page="contact" />
      <VantaDesks />
      <VantaContact content={content} />
    </>
  );
}
