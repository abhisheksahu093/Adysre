import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/logo';
import { Link } from '@/i18n/navigation';

/** Centered, branded shell shared by every auth page. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('app');
  const tNav = useTranslations('nav');
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      {/* The wordmark links back to the public landing page - the expected
          affordance for a logo, and a way out of the auth flow. */}
      <Link
        href="/"
        aria-label={tNav('backToHome')}
        className="mb-7 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Logo height={46} priority />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <p className="mt-6 text-center text-xs text-muted-foreground">{t('tagline')}</p>
    </div>
  );
}
