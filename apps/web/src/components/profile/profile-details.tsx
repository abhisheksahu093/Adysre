'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'adysre';
import { fetchProfile, initials, ANONYMOUS_USER } from '@/lib/session';

/**
 * Identity only. The plan, its status and usage live in `SubscriptionCard`,
 * which reads them from the entitlement API rather than being handed an access
 * level: two components rendering the same fact from two sources is how they
 * end up disagreeing.
 */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function ProfileDetails() {
  const t = useTranslations('pages.profile');
  const { data: user = ANONYMOUS_USER, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 60_000,
  });

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

      </CardContent>
    </Card>
  );
}
