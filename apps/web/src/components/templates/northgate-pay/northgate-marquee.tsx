'use client';

import type { TemplateContent } from '@/data/templates/types';
import { NORTHGATE_LABELS } from '@/data/templates/northgate-pay-content';

/**
 * NORTHGATE - merchant strip.
 *
 * Names set in mono, drifting slowly between two hairlines. The list renders
 * twice inside a track that translates -50%, so the loop is seamless without
 * cloning logic; the duplicate is aria-hidden because a screen reader should
 * hear each merchant once.
 */
export function NorthgateMarquee({ content }: { content: TemplateContent }) {
  return (
    <section
      aria-label={NORTHGATE_LABELS.marqueeLabel}
      className="border-y border-[var(--ngp-rule)] bg-[var(--ngp-bg)] py-7"
    >
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="ngp-marquee flex w-max items-center">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-center" aria-hidden={pass === 1}>
              {content.marquee.map((name) => (
                <span
                  key={`${pass}-${name}`}
                  className="ngp-mono whitespace-nowrap px-9 text-[13px] tracking-[-0.01em] text-[var(--ngp-ink-faint)]"
                >
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
