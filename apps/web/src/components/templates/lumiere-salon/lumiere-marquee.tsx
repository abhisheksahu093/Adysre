'use client';

import { useLumiereSettings } from './lumiere-settings';

/**
 * LUMIERE - the drifting testimonial strip.
 *
 * A salon's proof is what clients say rather than a row of client logos, so the
 * marquee carries five short quotes on a very slow drift. The duplicate pass is
 * `aria-hidden` so each quote is announced once, and the whole strip stands still
 * under reduced motion.
 *
 * Each quote is a real `<blockquote>` with its attribution in a `<cite>`: the
 * strip is content, not ornament, and should read as such with styles off.
 */
export function LumiereMarquee() {
  const { data } = useLumiereSettings();
  const { testimonials, common } = data.salon;

  return (
    <section aria-label={common.marqueeLabel} className="py-10">
      <div className="lumi-fade-x relative overflow-hidden">
        <div className="lumi-marquee flex w-max items-stretch gap-6 pr-6">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-stretch gap-6 pr-6" aria-hidden={pass === 1}>
              {testimonials.map((item) => (
                <figure
                  key={`${pass}-${item.author}`}
                  className="lumi-panel flex w-[22rem] flex-col justify-between gap-5 px-8 py-7"
                >
                  <blockquote className="text-[16px] leading-[1.7] text-pretty">
                    {item.quote}
                  </blockquote>
                  <figcaption className="lumi-label not-italic">
                    <cite className="not-italic">{item.author}</cite>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
