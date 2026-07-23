'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@adysre/validators';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from 'adysre';
import { Link } from '@/i18n/navigation';
import { FormField } from '@/components/auth/form-field';
import { FormAlert } from '@/components/auth/form-alert';
import { requestPasswordReset } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const t = useTranslations('auth.forgotPassword');
  const tf = useTranslations('auth.fields');
  const tc = useTranslations('common');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: ForgotPasswordInput) {
    // Do not reveal whether the account exists - always confirm.
    try {
      await requestPasswordReset(data);
    } catch {
      // Swallow errors to avoid account enumeration.
    } finally {
      setSent(true);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sent ? (
          <>
            <FormAlert variant="success">{t('sent')}</FormAlert>
            <Button className="w-full" variant="outline" onClick={() => setSent(false)}>
              {t('sendAgain')}
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              label={tf('email')}
              type="email"
              autoComplete="email"
              placeholder={tf('emailPlaceholder')}
              error={errors.email?.message}
              {...register('email')}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </form>
        )}
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            {tc('backToSignIn')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
