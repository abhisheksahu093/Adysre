'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription, buttonVariants, cn } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import { fetchProfile, initials, DEMO_USER } from '@/lib/session';
import { isPremium, type AccessLevel } from '@/lib/access';
import { AccessSwitcher } from './access-switcher';

interface ProfileDetailsProps {
  /**
   * Resolved on the server - the same value the prompt paywall enforces with.
   * Passed in rather than read from the profile query so what's displayed here
   * can't disagree with what's actually granted.
   */
  accessLevel: AccessLevel;
  /** True outside production; gates the dev-only switcher. */
  showDevTools: boolean;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function ProfileDetails({ accessLevel, showDevTools }: ProfileDetailsProps) {
  const t = useTranslations('pages.profile');
  const { data: user = DEMO_USER, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 60_000,
  });

  const premium = isPremium(accessLevel);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {initials(user.name)}
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate">{user.name}</CardTitle>
            <CardDescription className="truncate">{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('fullName')}>{user.name}</Field>
          <Field label={t('email')}>{user.email}</Field>
          {/* Role and plan are different axes - see SessionUser. */}
          <Field label={t('role')}>{user.role}</Field>
          <Field label={t('status')}>{isLoading ? t('loading') : t('active')}</Field>
        </dl>

        <div className="space-y-3 border-t border-border pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t('plan')}
              </p>
              <Badge variant={premium ? 'warning' : 'outline'} size="md">
                {premium ? t('planPremium') : t('planFree')}
              </Badge>
            </div>
            {!premium && (
              <Link href="/pricing" className={cn(buttonVariants({ size: 'sm' }))}>
                {t('upgrade')}
              </Link>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {premium ? t('planPremiumHint') : t('planFreeHint')}
          </p>
        </div>

        {showDevTools && <AccessSwitcher current={accessLevel} />}
      </CardContent>
    </Card>
  );
}
