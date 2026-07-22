'use client';

import { NORTHGATE_ENDPOINTS, NORTHGATE_LABELS } from '@/data/templates/northgate-pay-content';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the endpoint reference.
 *
 * A real `<table>`, because this is tabular data and a screen reader should be
 * able to navigate it by column. It scrolls inside its own container so a long
 * path never makes the page scroll sideways, which is the failure mode every
 * API reference has on a phone.
 */
export function NorthgateEndpoints() {
  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg)]">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <p className="ngp-eyebrow">{NORTHGATE_LABELS.endpointsEyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{NORTHGATE_LABELS.endpointsTitle}</h2>
          <p className="mt-6 max-w-2xl text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-ink-soft)]">
            {NORTHGATE_LABELS.endpointsSubtitle}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-14">
          <div className="ngp-card ngp-card-lg overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--ngp-rule)]">
                  <th
                    scope="col"
                    className="ngp-mono px-7 py-5 text-[10.5px] uppercase tracking-[0.2em] font-normal text-[var(--ngp-ink-faint)]"
                  >
                    {NORTHGATE_LABELS.endpointsMethod}
                  </th>
                  <th
                    scope="col"
                    className="ngp-mono px-3 py-5 text-[10.5px] uppercase tracking-[0.2em] font-normal text-[var(--ngp-ink-faint)]"
                  >
                    {NORTHGATE_LABELS.endpointsPath}
                  </th>
                  <th
                    scope="col"
                    className="ngp-mono px-7 py-5 text-[10.5px] uppercase tracking-[0.2em] font-normal text-[var(--ngp-ink-faint)]"
                  >
                    {NORTHGATE_LABELS.endpointsSummary}
                  </th>
                </tr>
              </thead>
              <tbody>
                {NORTHGATE_ENDPOINTS.map((endpoint) => (
                  <tr
                    key={`${endpoint.method} ${endpoint.path}`}
                    className="border-b border-[var(--ngp-rule)] last:border-b-0"
                  >
                    <td className="px-7 py-5 align-top">
                      <span className="ngp-method inline-block px-2.5 py-1">{endpoint.method}</span>
                    </td>
                    <td className="ngp-mono px-3 py-5 align-top text-[13.5px] text-[var(--ngp-ink)]">
                      {endpoint.path}
                    </td>
                    <td className="px-7 py-5 align-top text-[14px] leading-[1.7] text-[var(--ngp-ink-soft)]">
                      {endpoint.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
