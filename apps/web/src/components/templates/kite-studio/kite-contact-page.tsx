'use client';

import type { TemplateContent } from '@/data/templates/types';
import { KITE_CONTACT_PAGE } from '@/data/templates/kite-studio-content';
import { KiteContact } from './kite-contact';
import { KiteMasthead } from './kite-masthead';

/**
 * KITE - the contact page. The masthead carries the page's `<h1>`, so the
 * enquiry block below it opens at `<h2>` and the heading order stays legal.
 */
export function KiteContactPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <KiteMasthead
        eyebrow={content.contact.eyebrow}
        title={KITE_CONTACT_PAGE.title}
        outline={KITE_CONTACT_PAGE.titleOutline}
        subtitle={content.contact.subtitle}
      />
      <KiteContact content={content} />
    </>
  );
}
