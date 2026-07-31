import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono, Inter_Tight } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ROOT_CLIENT_NAMESPACES, ScopedMessages } from '@/i18n/client-messages';
import { metadataBaseUrl, ROBOTS_METADATA, SITE_NAME } from '@/lib/seo/metadata';
import { ExtensionErrorSilencer } from '@/components/system/extension-error-silencer';
import { Providers } from './providers';
import '../globals.css';

/**
 * The two faces the marketing canvas is set in, self-hosted by `next/font` so
 * no request ever leaves for a font CDN and there is no swap flash.
 *
 * They are exposed as CSS variables and bound to the `font-display` and
 * `font-hud` utilities in `globals.css`; the app shell keeps the `--font-sans`
 * token from `@adysre/theme` and is untouched by either.
 */
const displayFace = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
});

/**
 * The instrument voice: measurements, coordinates, counts, status.
 *
 * Preloaded, and it has to stay that way. Dropping the preload to free 22 KB
 * of bandwidth for the hero looks right on paper and measures worse: this face
 * sets the announcement bar and the header's labels, so it is on the first
 * screen, and discovering it during style rather than in the preload scan cost
 * ~300ms of First Contentful Paint for no Largest Contentful Paint in return.
 * Measured, twice, before being put back.
 */
const hudFace = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
});

/** Pre-render every locale at build time instead of on first request. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'app' });
  return {
    // Without this, `alternates` and Open Graph emit RELATIVE urls. Google
    // ignores relative hreflang outright, so a four-locale site would get no
    // cross-language signal at all. Set the real origin per environment.
    metadataBase: metadataBaseUrl(),
    title: {
      // Pages set only their own name; the brand is appended once, here, so no
      // page can forget it and none can say it twice.
      default: t('name'),
      template: `%s | ${SITE_NAME}`,
    },
    description: t('tagline'),
    applicationName: SITE_NAME,
    robots: ROBOTS_METADATA,
    /**
     * Defaults every page inherits, so a page that sets nothing still produces
     * a usable social card instead of a bare link. `title`, `description` and
     * `url` are deliberately absent: those are per-page, and a stale inherited
     * `og:url` is worse than none. Pages that matter call `pageMetadata`, which
     * fills them in.
     *
     * The image is NOT set here. It comes from the `opengraph-image` file
     * convention in this same segment, which Next hashes for cache busting and
     * applies to every nested route.
     */
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Required for the static rendering enabled by generateStaticParams.
  setRequestLocale(locale);

  return (
    // `lang` must track the locale - screen readers pick pronunciation from it.
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${displayFace.variable} ${hudFace.variable}`}
    >
      <head>
        <ExtensionErrorSilencer />
      </head>
      <body>
        {/* Only what the chrome below renders itself. Each route tree declares
            the rest; see `i18n/client-messages` for why the whole catalogue is
            not shipped from here. */}
        <ScopedMessages namespaces={ROOT_CLIENT_NAMESPACES}>
          <Providers>{children}</Providers>
        </ScopedMessages>
      </body>
    </html>
  );
}
