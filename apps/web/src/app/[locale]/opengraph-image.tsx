import { ImageResponse } from 'next/og';
import { brand, surface } from '@adysre/theme';
import { routing } from '@/i18n/routing';
import { SITE_NAME } from '@/lib/seo/metadata';
import { siteOrigin } from '@/lib/seo/site';
import messages from '../../../messages/en.json';

/**
 * The social card every page inherits.
 *
 * Lives in the `[locale]` segment so it applies to the whole app, and Next
 * emits both `og:image` and `twitter:image` from this one file, content-hashed
 * so a redesign busts every scraper's cache without a manual version bump.
 *
 * ─── Why it is drawn rather than shipped as a PNG ───────────────────────────
 * A checked-in image is a second copy of the brand that silently goes stale.
 * This one is rasterised from the design tokens and the same catalogue the hero
 * renders from, so the card cannot drift from the page it advertises.
 *
 * ─── Why the copy is English in every locale ────────────────────────────────
 * `next/og` only lays out glyphs from fonts it has been handed, and it ships one
 * Latin face. Japanese, Chinese and Hindi would rasterise as empty boxes: worse
 * than English on every share, and fixing it properly means loading three more
 * font binaries into an image route. The card is therefore drawn from the
 * default locale's catalogue, deliberately and in one place.
 */

const copy = messages.landing.hero;

export const alt = `${SITE_NAME}: ${copy.title} ${copy.titleAccent}`;

/** The size every scraper expects; anything else gets cropped or downgraded. */
export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

/**
 * Prerender one card per locale at build time.
 *
 * Without this the route stays dynamic and every scrape rasterises a PNG on a
 * cold serverless function, which is exactly the request that times out and
 * leaves the card blank on the platforms that never retry.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: surface.background,
          color: surface.foreground,
          // The workbench rule the landing page opens on, reduced to the one
          // line a 1200x630 raster can carry.
          borderTop: `10px solid ${brand.primary}`,
          padding: '68px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: brand.primary }} />
          <div
            style={{
              fontSize: 30,
              letterSpacing: 6,
              color: surface.mutedForeground,
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Two lines, because the accent half of the headline is styled
              differently in the hero and reads as its own line here too. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 68, lineHeight: 1.1, letterSpacing: -2 }}>{copy.title}</div>
            <div style={{ fontSize: 68, lineHeight: 1.1, letterSpacing: -2, color: brand.accent }}>
              {copy.titleAccent}
            </div>
          </div>
          <div style={{ fontSize: 29, lineHeight: 1.4, color: surface.mutedForeground }}>
            {copy.hint}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 26,
            color: surface.mutedForeground,
            borderTop: `1px solid ${surface.border}`,
            paddingTop: 24,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 5, background: brand.accent }} />
          <span>{new URL(siteOrigin()).host}</span>
        </div>
      </div>
    ),
    size,
  );
}
