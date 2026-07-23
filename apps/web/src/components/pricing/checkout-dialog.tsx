'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, type CheckoutInput } from '@adysre/validators';
import { ApiClientError } from '@adysre/sdk';
import { Button, Dialog, Input, Label } from 'adysre';
import { FormAlert } from '@/components/auth/form-alert';
import { startCheckout } from '@/lib/checkout';
import type { PricingPlan } from '@/data/pricing';

interface CheckoutDialogProps {
  /** The plan being bought, or null when closed. */
  plan: PricingPlan | null;
  onClose: () => void;
}

export function CheckoutDialog({ plan, onClose }: CheckoutDialogProps) {
  const t = useTranslations('checkout');
  const tp = useTranslations('pricing');
  const format = useFormatter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({ resolver: zodResolver(checkoutSchema) });

  // Clear the previous plan's email and errors when a different plan opens.
  useEffect(() => {
    if (plan) reset({ email: '' });
  }, [plan, reset]);

  if (!plan) return null;

  const price = `$${format.number(plan.price)}`;
  const original = plan.originalPrice !== undefined ? `$${format.number(plan.originalPrice)}` : null;
  const showOriginal = plan.originalPrice !== undefined && plan.originalPrice > plan.price;

  async function onSubmit(data: CheckoutInput) {
    if (!plan) return;
    try {
      const { url } = await startCheckout({ planId: plan.id, email: data.email });
      // Full navigation, not the router: the destination is the provider's
      // hosted page, outside this app.
      window.location.href = url;
    } catch (err) {
      // Checkout is not wired up yet, so this is the path users actually hit.
      // Say so plainly rather than leaving a button that silently does nothing.
      setError('root', {
        message: err instanceof ApiClientError ? err.message : t('unavailable'),
      });
    }
  }

  const bold = (chunks: React.ReactNode) => (
    <strong className="font-semibold text-foreground">{chunks}</strong>
  );

  return (
    <Dialog open onClose={onClose} title={tp(`plans.${plan.id}.name`)} className="sm:max-w-md">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-border">
            <Image src="/promo/all-access.svg" alt="" fill sizes="112px" className="object-cover" />
          </div>
          {/* No plan name here - the dialog header already carries it, and
              repeating it reads twice to a screen reader. */}
          <div className="min-w-0 space-y-1">
            <p className="text-xs text-muted-foreground">{tp(`plans.${plan.id}.billing`)}</p>
            <p className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight">{price}</span>
              {showOriginal && (
                <span className="text-sm font-medium text-muted-foreground line-through">
                  {original}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Recurring vs one-time is a promise about money - driven by the plan's
            billingInterval, never by which card was clicked. */}
        <p className="text-center text-sm leading-relaxed text-muted-foreground">
          {plan.billingInterval === 'year'
            ? t.rich('recurring', { price, b: bold })
            : t.rich('oneTime', { price, b: bold })}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          {errors.root && <FormAlert>{errors.root.message}</FormAlert>}

          <div className="space-y-1.5">
            <Label htmlFor="checkout-email" className="sr-only">
              {t('emailLabel')}
            </Label>
            <Input
              id="checkout-email"
              type="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'checkout-email-error' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="checkout-email-error" className="text-sm text-danger">
                {errors.email.message}
              </p>
            )}
          </div>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            {t('disclaimer')}
          </p>

          <div className="flex justify-center">
            <Button type="submit" className="min-w-36" disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
