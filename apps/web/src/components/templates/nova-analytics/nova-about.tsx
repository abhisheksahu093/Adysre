'use client';

import { Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './nova-reveal';

/** Rows of the decorative monitor panel - structure, not copy. */
const PANEL_ROWS = [
  { table: 'fct_orders', state: 'healthy', delta: '+0.4%' },
  { table: 'dim_customer', state: 'healthy', delta: '+1.1%' },
  { table: 'stg_payments', state: 'drift', delta: '-18.2%' },
  { table: 'fct_sessions', state: 'healthy', delta: '+2.7%' },
];

/**
 * NOVA - about. A two-column story: the narrative on the left, and on the right
 * a glass panel standing in for the product, built from divs so the template
 * ships without a single image dependency.
 */
export function NovaAbout({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="nova-mono text-[10px] text-[var(--nova-accent-2)]">{about.eyebrow}</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              {about.title}
            </h2>
          </Reveal>

          {about.body.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={0.06 * (index + 1)}>
              <p className="mt-5 text-[15px] leading-relaxed text-[var(--nova-muted)]">{paragraph}</p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <ul className="mt-8 space-y-3">
              {about.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--nova-accent-soft)]">
                    <Check className="h-3 w-3 text-[var(--nova-accent-2)]" aria-hidden />
                  </span>
                  <span className="text-[var(--nova-muted)]">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="nova-card p-5" aria-hidden>
            <div className="flex items-center justify-between border-b border-[var(--nova-line)] pb-4">
              <span className="nova-mono text-[10px] text-[var(--nova-faint)]">Warehouse monitor</span>
              <span className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--nova-line-strong)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--nova-line-strong)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--nova-accent-2)]" />
              </span>
            </div>

            <ul className="mt-4 space-y-2.5">
              {PANEL_ROWS.map((row) => {
                const drifting = row.state === 'drift';
                return (
                  <li
                    key={row.table}
                    className="flex items-center justify-between rounded-[var(--nova-radius-sm)] border border-[var(--nova-line)] px-3.5 py-3"
                  >
                    <span className="nova-mono text-[11px] tracking-[0.08em] text-[var(--nova-muted)]">
                      {row.table}
                    </span>
                    <span
                      className={`nova-mono rounded-full px-2 py-1 text-[10px] ${
                        drifting
                          ? 'bg-[rgb(251_113_133/16%)] text-[#fb7185]'
                          : 'bg-[rgb(34_211_238/12%)] text-[var(--nova-accent-2)]'
                      }`}
                    >
                      {row.delta}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 h-24 rounded-[var(--nova-radius-sm)] bg-gradient-to-tr from-[var(--nova-accent-soft)] to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
