'use client';

import type { TemplateContent } from '@/data/templates/types';
import { LumenAccordion } from './lumen-accordion';
import { LumenSectionHeading } from './lumen-section-heading';

/**
 * LUMEN - support questions.
 *
 * A narrow measure, centred, because five long answers set across the full grid
 * would run past a comfortable line length. The accordion itself is shared with
 * the product specification so there is one accessible implementation.
 */
export function LumenFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28">
      <LumenSectionHeading eyebrow={faq.eyebrow} title={faq.title} />

      <div className="mt-12">
        <LumenAccordion
          idPrefix="lum-faq"
          items={faq.items.map((item) => ({ title: item.question, body: item.answer }))}
        />
      </div>
    </section>
  );
}
