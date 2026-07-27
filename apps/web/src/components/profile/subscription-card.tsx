'use client';

import { useTranslations } from 'next-intl';
import { useFormatter } from 'next-intl';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  buttonVariants,
  cn,
} from 'adysre';
import { Link } from '@/i18n/navigation';
import { useUsage } from '@/hooks/use-entitlement';
import { UsageCounter } from '@/components/entitlements/usage-counter';
import { PlanSwitcher } from './plan-switcher';

/**
 * The workspace's plan, status, renewal date and what it has used.
 *
 * Everything comes from `GET /api/usage`, which is the same cached query the
 * badges and gates read, so the profile page cannot disagree with the control
 * a user is looking at on another screen.
 *
 * This replaces the development access switcher, which flipped a browser
 * cookie. That cookie was never an entitlement: anyone could set it from
 * devtools, and it is gone along with the component that wrote it.
 */

/** Statuses worth showing a colour for. Active is the boring, unremarkable case. */
const STATUS_TONE: Record<string, 'default' | 'warning' | 'success'> = {
  active: 'success',
  trialing: 'success',
  past_due: 'warning',
  canceled: 'warning',
  expired: 'warning',
};

export function SubscriptionCard() {
  const t = useTranslations('pages.profile');
  const format = useFormatter();
  const { data, isLoading } = useUsage();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('plan')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('loading')}</p>
        </CardContent>
      </Card>
    );
  }

  // A signed-out visitor or an unreachable server. Saying nothing beats
  // inventing a plan, which is what the old demo fallback did.
  if (!data) return null;

  const { subscription, features } = data;
  const tone = STATUS_TONE[subscription.status] ?? 'default';

  // Only metered features are worth listing. On a paid plan every limit is
  // null, so this collapses to nothing and the card stays short.
  const metered = features.filter((feature) => feature.limit !== null && !feature.locked);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{subscription.planName}</CardTitle>
            <CardDescription>
              {subscription.isPaid ? t('planPremiumHint') : t('planFreeHint')}
            </CardDescription>
          </div>
          {!subscription.isPaid && (
            <Link href="/pricing" className={cn(buttonVariants({ size: 'sm' }))}>
              {t('upgrade')}
            </Link>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('status')}
            </dt>
            <dd className="mt-1">
              <Badge variant={tone} size="md">
                {t(`status_${subscription.status}` as never)}
              </Badge>
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {subscription.cancelAtPeriodEnd ? t('endsOn') : t('renewsOn')}
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {/* Free and lifetime plans never renew, so there is no date to
                  show and inventing one would be a promise we cannot keep. */}
              {subscription.currentPeriodEnd
                ? format.dateTime(new Date(subscription.currentPeriodEnd), {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : t('noRenewal')}
            </dd>
          </div>
        </dl>

        {/* Renders only when the SERVER says this caller may switch plans. */}
        <PlanSwitcher />

        {metered.length > 0 && (
          <div className="space-y-1 border-t border-border pt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('usage')}
            </p>
            {metered.map((feature) => (
              <UsageCounter key={feature.key} feature={feature.key} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
