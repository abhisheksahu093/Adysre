import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProfileDetails } from '@/components/profile/profile-details';
import { SubscriptionCard } from '@/components/profile/subscription-card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.profile' });
  return { title: t('title') };
}

/**
 * Profile: who you are, and what your workspace is entitled to.
 *
 * The entitlement is no longer resolved here and handed down. It used to be,
 * because it came from a cookie this page could read; it now comes from the
 * subscription record through the entitlement API, so the client reads it from
 * the same cached query every gate and badge uses. One source, so this page
 * cannot disagree with the control a user is looking at elsewhere.
 */
export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'pages.profile' });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <ProfileDetails />
      <SubscriptionCard />
    </div>
  );
}
