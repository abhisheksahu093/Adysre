import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProfileDetails } from '@/components/profile/profile-details';
import { getAccessLevel } from '@/lib/access-server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.profile' });
  return { title: t('title') };
}

/** Server Component: resolves the entitlement, then hands it to the client. */
export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, accessLevel] = await Promise.all([
    getTranslations({ locale, namespace: 'pages.profile' }),
    getAccessLevel(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>
      {/* The switcher is a dev affordance, never shipped to users. */}
      <ProfileDetails
        accessLevel={accessLevel}
        showDevTools={process.env.NODE_ENV !== 'production'}
      />
    </div>
  );
}
