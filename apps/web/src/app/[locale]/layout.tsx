import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono, Inter_Tight } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
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

/** The instrument voice: measurements, coordinates, counts, status. */
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
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
    title: t('name'),
    description: t('tagline'),
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
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
