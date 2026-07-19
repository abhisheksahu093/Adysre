'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { Check, Plus } from 'lucide-react';
import { Button, buttonVariants, cn } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import { isPurchasable, type PricingPlan } from '@/data/pricing';
import { SUPPORT_MAILTO } from '@/config/site';

function Feature({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check
        className={cn('mt-0.5 h-4 w-4 shrink-0', accent ? 'text-primary' : 'text-muted-foreground')}
        aria-hidden
      />
      <span className="text-sm leading-snug">{children}</span>
    </li>
  );
}

interface PricingCardProps {
  plan: PricingPlan;
  /** Called for purchasable plans; browse-only plans navigate instead. */
  onCheckout: (plan: PricingPlan) => void;
}

export function PricingCard({ plan, onCheckout }: PricingCardProps) {
  const t = useTranslations('pricing');
  const format = useFormatter();

  // Digit grouping is locale-specific - never hand-format a price.
  const price = format.number(plan.price);
  const original = plan.originalPrice !== undefined ? format.number(plan.originalPrice) : null;
  const showOriginal = plan.originalPrice !== undefined && plan.originalPrice > plan.price;

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-xl border',
        plan.highlighted
          ? 'border-primary/40 bg-card shadow-lg ring-1 ring-primary/20'
          : 'border-border bg-card/60',
      )}
    >
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">{t(`plans.${plan.id}.name`)}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{t(`plans.${plan.id}.billing`)}</p>
          </div>
          {plan.highlighted && (
            <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
              {t('mostPopular')}
            </span>
          )}
        </div>

        <p className="flex items-baseline gap-2">
          {/* aria-label so screen readers hear "39 dollars", not "dollar 39". */}
          <span className="flex items-baseline" aria-label={t('priceAria', { price: plan.price })}>
            <span className="text-base font-medium text-muted-foreground" aria-hidden>
              $
            </span>
            <span className="text-4xl font-bold tracking-tight text-foreground" aria-hidden>
              {price}
            </span>
          </span>
          {showOriginal && (
            <span className="text-lg font-semibold text-muted-foreground line-through" aria-hidden>
              ${original}
            </span>
          )}
        </p>

        {/* A real Link when it navigates (middle-click, new tab), a Button when
            it opens checkout - never a button that fakes navigation. */}
        {isPurchasable(plan) ? (
          <Button
            type="button"
            variant={plan.highlighted ? 'primary' : 'outline'}
            className="w-full"
            onClick={() => onCheckout(plan)}
          >
            {t(`plans.${plan.id}.cta`)}
          </Button>
        ) : (
          <Link
            href={plan.href ?? '/prompt-library'}
            className={cn(
              buttonVariants({ variant: plan.highlighted ? 'primary' : 'outline' }),
              'w-full',
            )}
          >
            {t(`plans.${plan.id}.cta`)}
          </Link>
        )}
      </div>

      <div className="flex flex-1 flex-col border-t border-border p-6">
        <ul className="space-y-3">
          {plan.featureKeys.map((key) => (
            <Feature key={key}>{t(`features.${key}`)}</Feature>
          ))}
        </ul>

        {plan.inheritsKeys && plan.inheritsKeys.length > 0 && (
          <>
            <div className="my-5 flex items-center justify-center" aria-hidden>
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <ul className="space-y-3">
              {plan.inheritsKeys.map((key) => (
                <Feature key={key} accent>
                  {t(`features.${key}`)}
                </Feature>
              ))}
            </ul>
          </>
        )}

        {/* mt-auto pins this to the bottom so it lines up across cards of
            differing feature counts. */}
        <p className="mt-auto pt-6 text-xs text-muted-foreground">
          {t.rich('questions', {
            a: (chunks) => (
              <a href={SUPPORT_MAILTO} className="text-primary hover:underline">
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
